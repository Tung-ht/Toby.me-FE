/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Chip } from '@material-ui/core';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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
import useRole from '../../../hooks/useRole';
import SkeletonArticleViewer from '../../Common/SkeletonArticleViewer';

const initQuery: ArticlesFilters = {
  limit: 10,
  offset: 0,
  // tag: '',
};

function ApproveArticle() {
  const [articles, setArticles] = useState<any[]>([]);
  const [countArticles, setCountArticles] = useState(0);

  const [query, setQuery] = useState(initQuery);

  const [loading, setLoading] = useState(false);

  const { isAdmin } = useRole();

  const handleGetArticle = async () => {
    try {
      setLoading(true);
      const rs = await getArticlesUnapproved(query);

      setCountArticles(rs.articlesCount);
      setArticles(rs.articles);
    } catch (error) {
      console.log('🚀 -> handleGetArticle -> error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeTabs = (tag: string) => {
    if (tag === 'ALL') {
      const queryTmp = { limit: 10, offset: 0 };
      setQuery(queryTmp);
      return;
    }
    const queryTmp = { limit: 10, offset: 0, tag: tag };
    setQuery(queryTmp);
  };

  const onPageChange = (page: any) => {
    if (query.tag) {
      const queryTmp = { limit: 10, offset: Number(page) - 1, tag: query.tag };
      setQuery(queryTmp);
      return;
    }

    const queryTmp = { limit: 10, offset: Number(page) - 1 };
    setQuery(queryTmp);
  };

  useEffect(() => {
    handleGetArticle();
  }, [query]);

  useEffect(() => {
    if (isAdmin() === false) {
      location.hash = '/';
    }
  }, []);

  return (
    <ApproveArticleStyled className=''>
      <div className='d-flex justify-content-center py-5'>
        <h2>Duyệt bài viết thành viên</h2>
      </div>

      <div className='wrapper-articles row justify-content-center'>
        {loading ? (
          <div className='col-md-9'>
            <SkeletonArticleViewer />
          </div>
        ) : (
          <div className='col-md-9'>
            {articles.map((ar: Article, index: number) => {
              return <SingleArticleApprove key={index} data={ar}></SingleArticleApprove>;
            })}
          </div>
        )}

        <div className='col-md-3'>
          <HomeSidebar handleChangeTabs={handleChangeTabs} />
        </div>
        <Pagination
          currentPage={Number(query.offset) ? Number(query.offset) + 1 : 1}
          count={countArticles}
          itemsPerPage={Number(query.limit) ? Number(query.limit) : 10}
          onPageChange={onPageChange}
        />
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
      const rs: any = await getTags(0);
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
                  handleChangeTabs(encodeURIComponent(tag));
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

export const ApproveArticleStyled = styled.div`
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
