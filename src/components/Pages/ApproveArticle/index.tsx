/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Chip } from '@material-ui/core';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { styled } from 'styled-components';
import { approveArticle, getArticlesUnapproved, getTags } from '../../../services/services';
import { ArticlePreviewStyled, TagList } from '../../ArticlePreview/ArticlePreview';
import { Skeleton } from '@material-ui/lab';
import { Article, ArticlesFilters } from '../../../types/article';
import { Pagination } from '../../Pagination/Pagination';
import { id } from 'date-fns/locale';
import { ADMIN } from '../../../config/role';
import { User } from '../../../types/user';
import { useStore } from '../../../state/storeHooks';
import SingleArticleApprove from './SingleArticleApprove';

const initQuery: ArticlesFilters = {
  limit: 10,
  offset: 0,
  // tag: '',
};

function ApproveArticle() {
  const [articles, setArticles] = useState<any[]>([]);

  const [query, setQuery] = useState(initQuery);

  const { user } = useStore(({ app }) => app);

  const handleGetArticle = async () => {
    const rs = await getArticlesUnapproved(query);

    setArticles(rs.articles);
    console.log('🚀 -> handleGetArticle -> rs:', rs);
  };

  const handleChangeTabs = (tag: string) => {
    if (tag === 'ALL') {
      const queryTmp = { limit: query.limit, offset: query.offset };
      setQuery(queryTmp);
      return;
    }
    const queryTmp = { ...query, tag: tag };
    setQuery(queryTmp);
  };

  const onPageChange = (page: any) => {
    console.log('🚀 -> onPageChange -> page:', page);
  };

  useEffect(() => {
    handleGetArticle();
  }, [query]);

  useEffect(() => {
    const userRole = user && user.map((x: User) => x.roles).unwrap();

    if (userRole.includes(ADMIN) === false) {
      location.hash = '/';
    }
  }, []);

  return (
    <ApproveArticleStyled className=''>
      <div className='d-flex justify-content-center py-3'>
        <h2>Duyệt bài viết thành viên</h2>
      </div>

      <div className='wrapper-articles row justify-content-center'>
        <div className='col-md-9'>
          {articles.map((ar: Article, index: number) => {
            console.log('🚀 -> {articles.map -> ar:', ar);
            return <SingleArticleApprove key={index} data={ar}></SingleArticleApprove>;
          })}

          {/* <Pagination currentPage={1} count={100} itemsPerPage={10} onPageChange={onPageChange} /> */}
        </div>

        <div className='col-md-3'>
          <HomeSidebar handleChangeTabs={handleChangeTabs} />
        </div>
      </div>
    </ApproveArticleStyled>
  );
}

function HomeSidebar({ handleChangeTabs }: { handleChangeTabs: (tab: string) => void }) {
  const [loading, setLoading] = useState(false);

  const [tags, setTags] = useState([]);

  const [tagSelect, setTagSelect] = useState('ALL');

  const handleGetTags = async () => {
    try {
      setLoading(true);
      const rs: any = await getTags();
      const tagList: any = ['ALL', ...rs.tags];
      setTags(tagList);
    } catch (error) {
      console.log('🚀 error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetTags();
  }, []);

  return (
    <div className='sidebar'>
      <h5>Duyệt theo tags</h5>

      {loading ? (
        <div>
          <Skeleton variant='text' height={40} />
          <Skeleton variant='text' height={40} />
          <Skeleton variant='text' height={40} />
        </div>
      ) : (
        <div className='tag-list'>
          {tags.map((tag) => {
            return (
              <Chip
                icon={<i className='ion-pound' />}
                className='px-2 me-1 mb-1'
                size='small'
                key={tag}
                label={tag}
                color={tagSelect === tag ? 'primary' : 'default'}
                onClick={() => {
                  handleChangeTabs(tag);
                  setTagSelect(tag);
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ApproveArticle;

const ApproveArticleStyled = styled.div`
  background-color: #f0f2f5;

  .wrapper-articles {
    margin: auto;
  }

  @media (min-width: 544px) {
    .wrapper-articles {
      max-width: 576px;
    }
  }

  @media (min-width: 768px) {
    .wrapper-articles {
      max-width: 720px;
    }
  }

  @media (min-width: 992px) {
    .wrapper-articles {
      max-width: 940px;
    }
  }

  @media (min-width: 1200px) {
    .wrapper-articles {
      max-width: 1140px;
    }
  }
`;
