/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ContainerPage } from '../../ContainerPage/ContainerPage';
import { favoriteArticle, searchArticle, unfavoriteArticle } from '../../../services/services';
import { Article, SearchArticleParams } from '../../../types/article';
import SkeletonArticleViewer from '../../Common/SkeletonArticleViewer';
import EmptyArticle from '../../Common/EmptyArticle';
import { ArticlePreview } from '../../ArticlePreview/ArticlePreview';
import { store } from '../../../state/store';
import {
  endSubmittingFavorite,
  startSubmittingFavorite,
} from '../../ArticlesViewer/ArticlesViewer.slice';
import { Pagination } from '../../Pagination/Pagination';

function SearchArticle() {
  const { searchParams } = useParams<{ searchParams: string }>();

  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const [articles, setArticles] = useState([]);
  const [articlesCount, setArticlesCount] = useState(0);

  const handleGetSearchArticle = async () => {
    try {
      setLoading(true);
      const params: SearchArticleParams = {
        offset: page,
        limit: 10,
        contentSearchParam: searchParams,
      };
      const {
        data: { articles, articlesCount },
      } = await searchArticle(params);

      setArticles(articles);
      setArticlesCount(articlesCount);
    } catch (error) {
      console.log('🚀 -> handleGetSearchArticle -> error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onPageChange = (index: any) => {
    setPage(index - 1);
  };

  useEffect(() => {
    handleGetSearchArticle();
  }, [searchParams, page]);

  return (
    <ContainerPage>
      <div className='d-flex justify-content-center w-100 mt-2 mb-3'>
        <h2>{`Kết quả tìm kiếm cho "${decodeURIComponent(searchParams)}"`}</h2>
      </div>

      <div className='w-100'>
        {loading ? (
          <Fragment>
            <SkeletonArticleViewer></SkeletonArticleViewer>
          </Fragment>
        ) : (
          <Fragment>
            {articles.length === 0 && (
              <div className='article-preview' key={1}>
                <EmptyArticle />
              </div>
            )}

            {articles.map((article: any, index) => (
              <ArticlePreview
                key={article.slug}
                article={article}
                isSubmitting={false}
                isLike={false}
              />
            ))}
          </Fragment>
        )}
      </div>

      <div className='d-flex justify-content-center w-100'>
        <Pagination
          currentPage={page + 1}
          count={articlesCount}
          itemsPerPage={10}
          onPageChange={onPageChange}
        />
      </div>
    </ContainerPage>
  );
}

export default SearchArticle;

function onFavoriteToggle(index: number, { slug, favorited }: Article) {
  return async () => {
    if (store.getState().app.user.isNone()) {
      location.hash = '#/login';
      return;
    }
    store.dispatch(startSubmittingFavorite(index));

    const article = await (favorited ? unfavoriteArticle(slug) : favoriteArticle(slug));
    store.dispatch(endSubmittingFavorite({ index, article }));
  };
}
