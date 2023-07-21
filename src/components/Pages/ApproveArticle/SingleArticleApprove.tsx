import React, { Fragment, useRef, useState } from 'react';
import { Article } from '../../../types/article';
import { ArticlePreviewStyled, TagList } from '../../ArticlePreview/ArticlePreview';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Button, LinearProgress } from '@material-ui/core';
import { adminDeleteArticle, approveArticle, deleteArticle } from '../../../services/services';
import '../../../styles/animation.css';
import { CSSTransition } from 'react-transition-group';
import useToastCustom from '../../../hooks/useToastCustom';
import useRole from '../../../hooks/useRole';

interface SingleArticleApproveProps {
  data: Article;
}

function SingleArticleApprove({ data }: SingleArticleApproveProps) {
  const { author, slug, title, description, createdAt, tagList } = data;

  const { isAdmin } = useRole();

  const { notifySuccess, notifyError } = useToastCustom();

  const [loading, setLoading] = useState(false);

  const [outArticle, setOutArticle] = useState(true);
  const nodeRef = useRef(null);

  const handleApproveArticle = async (slug: string) => {
    try {
      setLoading(true);
      const rs = await approveArticle(slug);

      if (rs.status === 200) {
        setOutArticle(false);
        notifySuccess('Bài viết đã được phê duyệt');
      } else {
        notifyError('Phê duyệt bài viết thất bại');
      }
    } catch (error) {
      notifyError('Phê duyệt bài viết thất bại');
      console.log('🚀 -> handleApproveArticle -> error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (slug: string) => {
    try {
      setLoading(true);
      const rs = await adminDeleteArticle(slug);

      if (rs.status === 200) {
        setOutArticle(false);
        notifySuccess('Bài viết đã bị từ chối');
      } else {
        notifyError('Từ chối bài viết thất bại');
      }
    } catch (error) {
      notifyError('Từ chối bài viết thất bại');
      console.log('🚀 -> handleApproveArticle -> error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CSSTransition in={outArticle} nodeRef={nodeRef} timeout={500} classNames='alert' unmountOnExit>
      <ArticlePreviewStyled ref={nodeRef}>
        {loading && <LinearProgress className='my-2' />}
        <Link to={`/profile/${author?.username}`} className='wrapper-author'>
          <img src={author?.image || undefined} className='author-avt' />
          <h5 className='author-name'>{author?.username}</h5>
        </Link>
        <div className='post'>
          <Link to={`/article/${encodeURIComponent(slug)}`} className='title-post'>
            <h2>{title}</h2>
          </Link>
          <p>{description}</p>
        </div>
        <div className='container-info'>
          <div className='info-list'>
            <div className='info-item'>{format(createdAt, 'hh:mm - dd/MM/yyyy')}</div>
          </div>

          {isAdmin() && (
            <div className='py-2'>
              <Button
                variant='contained'
                color='primary'
                className='me-2'
                onClick={() => handleApproveArticle(encodeURIComponent(slug))}
              >
                Phê duyệt
              </Button>
              <Button
                variant='contained'
                color='secondary'
                onClick={() => handleDeleteArticle(encodeURIComponent(slug))}
              >
                Từ chối
              </Button>
            </div>
          )}
        </div>
        <TagList tagList={tagList} />
      </ArticlePreviewStyled>
    </CSSTransition>
  );
}

export default SingleArticleApprove;
