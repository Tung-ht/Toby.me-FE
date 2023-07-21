import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { followUser, getArticles, getProfile, unfollowUser } from '../../../services/services';
import { store } from '../../../state/store';
import { useStore } from '../../../state/storeHooks';
import { redirect } from '../../../types/location';
import { Profile } from '../../../types/profile';
import { ArticlesViewer } from '../../ArticlesViewer/ArticlesViewer';
import {
  changePage,
  loadArticles,
  startLoadingArticles,
} from '../../ArticlesViewer/ArticlesViewer.slice';
import { UserInfo } from '../../UserInfo/UserInfo';
import { initializeProfile, loadProfile, startSubmitting } from './ProfilePage.slice';

export function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const favorites = useLocation().pathname.endsWith('favorites');
  const pendingApproval = useLocation().pathname.endsWith('pending-approval');

  useEffect(() => {
    onLoad(username, favorites);
  }, [username]);

  const { profile, submitting } = useStore(({ profile }) => profile);

  const renderActiveTab = (isValid: boolean) => {
    if (favorites) {
      return 'Bài viết yêu thích';
    }

    if (pendingApproval) {
      return 'Bài viết đang chờ duyệt';
    }

    return 'Bài viết đã đăng';
  };

  return (
    <div className='profile-page bg-default'>
      {profile.match({
        none: () => (
          <div className='container article-preview' key={1}>
            Đang tải trang cá nhân ...
          </div>
        ),
        some: (profile) => (
          <UserInfo
            user={profile}
            disabled={submitting}
            onFollowToggle={onFollowToggle(profile)}
            onEditSettings={() => redirect('settings')}
          />
        ),
      })}

      <div className='container'>
        <div className='row'>
          <div className='col-xs-12 col-md-10 offset-md-1 mt-3'>
            <ArticlesViewer
              toggleClassName='articles-toggle'
              tabs={['Bài viết đã đăng', 'Bài viết yêu thích', 'Bài viết đang chờ duyệt']}
              selectedTab={renderActiveTab(favorites)}
              onTabChange={onTabChange(username)}
              onPageChange={onPageChange(username, favorites)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

async function onLoad(username: string, favorites: boolean) {
  store.dispatch(initializeProfile());
  store.dispatch(startLoadingArticles());

  try {
    const profile = await getProfile(username);
    store.dispatch(loadProfile(profile));

    const articles = await getArticlesByType(username, favorites);
    store.dispatch(loadArticles(articles));
  } catch {
    location.href = '#/';
  }
}

async function getArticlesByType(username: string, favorites: boolean) {
  const { currentPage } = store.getState().articleViewer;
  return await getArticles({
    [favorites ? 'favorited' : 'author']: username,
    offset: (currentPage - 1) * 10,
  });
}

function onFollowToggle(profile: Profile): () => void {
  return async () => {
    const { user } = store.getState().app;
    if (user.isNone()) {
      redirect('register');
      return;
    }

    store.dispatch(startSubmitting());

    const newProfile = await (profile.following ? unfollowUser : followUser)(profile.username);
    store.dispatch(loadProfile(newProfile));
  };
}

function onTabChange(username: string): (page: string) => void {
  return async (page) => {
    if (page === 'Bài viết đang chờ duyệt') {
      location.hash = `#/profile/${username}/pending-approval`;
      return;
    }

    const favorited = page === 'Bài viết yêu thích';
    location.hash = `#/profile/${username}${!favorited ? '' : '/favorites'}`;
    store.dispatch(startLoadingArticles());
    store.dispatch(loadArticles(await getArticlesByType(username, favorited)));
  };
}

function onPageChange(username: string, favorited: boolean): (index: number) => void {
  return async (index) => {
    store.dispatch(changePage(index));
    store.dispatch(loadArticles(await getArticlesByType(username, favorited)));
  };
}
