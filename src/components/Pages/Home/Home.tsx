import { Option } from '@hqoss/monads';
import { getArticles, getFeed, getTags } from '../../../services/services';
import { store } from '../../../state/store';
import { useStoreWithInitializer } from '../../../state/storeHooks';
import { FeedFilters } from '../../../types/article';
import { ArticlesViewer } from '../../ArticlesViewer/ArticlesViewer';
import { changePage, loadArticles, startLoadingArticles } from '../../ArticlesViewer/ArticlesViewer.slice';
import { ContainerPage } from '../../ContainerPage/ContainerPage';
import { changeTab, loadTags, startLoadingTags } from './Home.slice';
import { styled } from 'styled-components';

export function Home() {
  const { tags, selectedTab } = useStoreWithInitializer(({ home }) => home, load);

  return (
    <HomePageStyled className='home-page'>
      {renderBanner()}
      <ContainerPage>
        <div className='col-md-9'>
          <ArticlesViewer
            toggleClassName='feed-toggle'
            selectedTab={selectedTab}
            tabs={buildTabsNames(selectedTab)}
            onPageChange={onPageChange}
            onTabChange={onTabChange}
          />
        </div>

        <div className='col-md-3'>
          <HomeSidebar tags={tags} />
        </div>
      </ContainerPage>
    </HomePageStyled>
  );
}

async function load() {
  store.dispatch(startLoadingArticles());
  store.dispatch(startLoadingTags());

  if (store.getState().app.user.isSome()) {
    store.dispatch(changeTab('Đang theo dõi'));
  }

  const multipleArticles = await getFeedOrGlobalArticles();
  store.dispatch(loadArticles(multipleArticles));

  const tagsResult = await getTags();
  store.dispatch(loadTags(tagsResult.tags));
}

function renderBanner() {
  return (
    <div className='banner'>
      <div className='container'>
        <h1 className='logo-font'>Toby.me</h1>
        <p>Cùng nhau chia sẻ kiến thức lập trình tới cộng đồng</p>
      </div>
    </div>
  );
}

function buildTabsNames(selectedTab: string) {
  const { user } = store.getState().app;

  return Array.from(new Set([...(user.isSome() ? ['Đang theo dõi'] : []), 'Tất cả bài viết', selectedTab]));
}

async function onPageChange(index: number) {
  store.dispatch(changePage(index));

  const multipleArticles = await getFeedOrGlobalArticles({ offset: (index - 1) * 10 });
  store.dispatch(loadArticles(multipleArticles));
}

async function onTabChange(tab: string) {
  store.dispatch(changeTab(tab));
  store.dispatch(startLoadingArticles());

  const multipleArticles = await getFeedOrGlobalArticles();
  store.dispatch(loadArticles(multipleArticles));
}

async function getFeedOrGlobalArticles(filters: FeedFilters = {}) {
  const { selectedTab } = store.getState().home;
  const finalFilters = {
    ...filters,
    tag: selectedTab.slice(2),
  };

  return await (selectedTab === 'Đang theo dõi' ? getFeed : getArticles)(
    !selectedTab.startsWith('#') ? filters : finalFilters
  );
}

function HomeSidebar({ tags }: { tags: Option<string[]> }) {
  return (
    <div className='sidebar'>
      <p>Chủ đề phổ biến</p>

      {tags.match({
        none: () => <span>Đang tải chủ đề ...</span>,
        some: (tags) => (
          <div className='tag-list'>
            {' '}
            {tags.map((tag) => (
              <a key={tag} href='#' className='tag-pill tag-default' onClick={() => onTabChange(`# ${tag}`)}>
                {tag}
              </a>
            ))}{' '}
          </div>
        ),
      })}
    </div>
  );
}

const HomePageStyled = styled.div`
  background-color: #f0f2f5;
`;
