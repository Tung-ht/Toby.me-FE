/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useRole from '../../hooks/useRole';
import { Article, ArticlesFilters } from '../../types/article';
import { getArticlesUnapproved } from '../../services/services';
import { ApproveArticleStyled } from '../Pages/ApproveArticle';
import SingleArticleApprove from '../Pages/ApproveArticle/SingleArticleApprove';

const initQuery: ArticlesFilters = {
  limit: 10,
  offset: 0,
  author: '',
  // tag: '',
};

function PendingApproval() {
  const { username } = useParams<{ username: string }>();

  const [articles, setArticles] = useState<any[]>([]);

  const [query, setQuery] = useState<ArticlesFilters>({ ...initQuery, author: username });

  const handleGetArticle = async () => {
    const rs = await getArticlesUnapproved(query);
    console.log('🚀 -> handleGetArticle -> rs:', rs);

    setArticles(rs.articles);
  };

  const onPageChange = (page: any) => {
    console.log('🚀 -> onPageChange -> page:', page);
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
          {articles.map((ar: Article, index: number) => {
            return <SingleArticleApprove key={index} data={ar}></SingleArticleApprove>;
          })}

          {/* <Pagination currentPage={1} count={100} itemsPerPage={10} onPageChange={onPageChange} /> */}
        </div>
      </div>
    </ApproveArticleStyled>
  );
}

export default PendingApproval;
