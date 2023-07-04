/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { getArticles } from '../../../services/services';
import { ArticlePreviewStyled, TagList } from '../../ArticlePreview/ArticlePreview';
import { Link } from 'react-router-dom';
import { Article } from '../../../types/article';
import { format } from 'date-fns';
import { Button, Grid } from '@material-ui/core';
import { styled } from 'styled-components';
import { ContainerPage } from '../../ContainerPage/ContainerPage';

function ApproveArticle() {
  const [articles, setArticles] = useState<any[]>([]);

  const handleGetArticle = async () => {
    const rs = await getArticles();

    setArticles(rs.articles);
    console.log('🚀 -> handleGetArticle -> rs:', rs);
  };

  useEffect(() => {
    handleGetArticle();
  }, []);

  return (
    <ApproveArticleStyled className=''>
      <div className='d-flex justify-content-center py-3'>
        <h2>Duyệt bài viết thành viên</h2>
      </div>

      <div className='wrapper-articles row justify-content-center'>
        {articles.map((ar: any, index: number) => {
          return (
            <div key={index} className='col-md-9'>
              <ArticlePreviewStyled>
                <img
                  src='https://i.pinimg.com/originals/19/db/31/19db31732931019b73bedcf17924f814.jpg'
                  alt=''
                  className='thumbs-article'
                />
                <Link to={`/profile/${ar?.author?.username}`} className='wrapper-author'>
                  <img src={ar?.author?.image || undefined} className='author-avt' />
                  <h5 className='author-name'>{ar?.author?.username}</h5>
                </Link>
                <div className='post'>
                  <Link to={`/article/${encodeURIComponent(ar?.slug)}`} className='title-post'>
                    <h2>{ar?.title}</h2>
                  </Link>
                  <p>{ar?.description}</p>
                </div>
                <div className='container-info'>
                  <div className='info-list'>
                    <div className='info-item'>{format(ar?.createdAt, 'PP')}</div>
                  </div>

                  <div className='py-2'>
                    <Button variant='contained' color='primary' className='me-2'>
                      Phê duyệt
                    </Button>

                    <Button variant='contained' color='secondary'>
                      Từ chối
                    </Button>
                  </div>
                </div>
                <TagList tagList={ar?.tagList} />
              </ArticlePreviewStyled>
            </div>
          );
        })}
      </div>
    </ApproveArticleStyled>
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
