/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useRole from '../../hooks/useRole';
import { Article, ArticlesFilters } from '../../types/article';
import { getArticlesUnapproved } from '../../services/services';
import { ApproveArticleStyled } from '../Pages/ApproveArticle';
import SingleArticleApprove from '../Pages/ApproveArticle/SingleArticleApprove';
import { Pagination } from '../Pagination/Pagination';
import SkeletonArticleViewer from '../Common/SkeletonArticleViewer';

const initQuery: ArticlesFilters = {
  limit: 10,
  offset: 0,
  author: '',
  // tag: '',
};

function PendingApproval() {
  const { username } = useParams<{ username: string }>();

  const [articles, setArticles] = useState<any[]>([]);
  const [countArticles, setCountArticles] = useState(0);
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState<ArticlesFilters>({ ...initQuery, author: username });

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
    setQuery({ author: username });
  }, []);

  return (
    <ApproveArticleStyled>
      <div className='wrapper-articles justify-content-center'>
        <div className=''>
          {loading ? (
            <>
              <SkeletonArticleViewer />
            </>
          ) : (
            <>
              {articles.map((ar: Article, index: number) => {
                return <SingleArticleApprove key={index} data={ar}></SingleArticleApprove>;
              })}
            </>
          )}

          <Pagination
            currentPage={Number(query.offset) ? Number(query.offset) + 1 : 1}
            count={countArticles}
            itemsPerPage={Number(query.limit) ? Number(query.limit) : 10}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </ApproveArticleStyled>
  );
}

export default PendingApproval;
