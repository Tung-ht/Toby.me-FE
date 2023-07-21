import { Option } from '@hqoss/monads';
import { getArticles, getFeed, getTags } from '../../../services/services';
import { store } from '../../../state/store';
import { useStoreWithInitializer } from '../../../state/storeHooks';
import { FeedFilters } from '../../../types/article';
import { ArticlesViewer } from '../../ArticlesViewer/ArticlesViewer';
import {
  changePage,
  loadArticles,
  startLoadingArticles,
} from '../../ArticlesViewer/ArticlesViewer.slice';
import { ContainerPage } from '../../ContainerPage/ContainerPage';
import { changeTab, loadTags, startLoadingTags } from './Home.slice';
import { styled } from 'styled-components';
import Skeleton from '@material-ui/lab/Skeleton';
import Chip from '@material-ui/core/Chip';
import { TypeAnimation } from 'react-type-animation';

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
        {/* <p>Cùng nhau chia sẻ kiến thức lập trình tới cộng đồng</p> */}

        <p>
          <TypeAnimation
            sequence={[
              'Cùng nhau chia sẻ kiến thức lập trình tới cộng đồng',
              1000,
              'Cùng nhau mở rộng kỹ năng, tư duy',
              1000,
              'Cùng nhau thảo luận, chia sẻ, và học cùng cộng đồng lập trình',
              1000,
              'Cùng nhau truyền đam mê, nâng cao kỹ năng lập trình',
              1000,
            ]}
            speed={40}
            wrapper='span'
            cursor={true}
            repeat={Infinity}
          />
        </p>
      </div>
    </div>
  );
}

function buildTabsNames(selectedTab: string) {
  const { user } = store.getState().app;

  return Array.from(
    new Set([...(user.isSome() ? ['Đang theo dõi'] : []), 'Tất cả bài viết', selectedTab])
  );
}

async function onPageChange(index: number) {
  console.log('🚀 -> onPageChange -> index:', index);
  store.dispatch(changePage(index));

  const multipleArticles = await getFeedOrGlobalArticles({ offset: index - 1 });
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
      <h5>Chủ đề phổ biến</h5>

      {tags.match({
        none: () => (
          <div>
            <Skeleton variant='text' height={40} />
            <Skeleton variant='text' height={40} />
            <Skeleton variant='text' height={40} />
          </div>
        ),
        some: (tags) => (
          <div className='tag-list'>
            {tags.map((tag) => {
              return (
                <Chip
                  icon={<i className='ion-pound' />}
                  className='px-2 me-1 mb-1'
                  size='small'
                  key={tag}
                  label={tag}
                  onClick={() => onTabChange(`# ${tag}`)}
                />
              );
              // return (
              //   <a
              //     key={tag}
              //     href='#'
              //     className='tag-pill tag-default'
              //     onClick={() => onTabChange(`# ${tag}`)}
              //   >
              //     {tag}
              //   </a>
              // );
            })}
          </div>
        ),
      })}
    </div>
  );
}

const HomePageStyled = styled.div`
  background-color: #f0f2f5;
  min-height: calc(100vh - 156px);
`;
