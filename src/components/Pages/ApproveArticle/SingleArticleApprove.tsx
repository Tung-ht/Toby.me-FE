import React, { useRef, useState } from 'react';
import { Article } from '../../../types/article';
import { ArticlePreviewStyled, TagList } from '../../ArticlePreview/ArticlePreview';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from '@material-ui/core';
import { approveArticle } from '../../../services/services';
import '../../../styles/animation.css';
import { CSSTransition } from 'react-transition-group';

interface SingleArticleApproveProps {
  data: Article;
}

function SingleArticleApprove({ data }: SingleArticleApproveProps) {
  const { author, slug, title, description, createdAt, tagList } = data;

  const [outArticle, setOutArticle] = useState(false);
  const nodeRef = useRef(null);

  const handleApproveArticle = async (slug: string) => {
    const rs = await approveArticle(slug);
    console.log('🚀 -> handleApproveArticle -> rs:', rs);
  };

  return (
    <ArticlePreviewStyled>
      <img
        src='https://i.pinimg.com/originals/19/db/31/19db31732931019b73bedcf17924f814.jpg'
        alt=''
        className='thumbs-article'
      />
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
          <div className='info-item'>{format(createdAt, 'PP')}</div>
        </div>
        <div className='py-2'>
          <Button
            variant='contained'
            color='primary'
            className='me-2'
            onClick={() => handleApproveArticle(encodeURIComponent(slug))}
          >
            Phê duyệt
          </Button>
          <Button variant='contained' color='secondary'>
            Từ chối
          </Button>
        </div>
      </div>

      <TagList tagList={tagList} />
    </ArticlePreviewStyled>
  );
}

export default SingleArticleApprove;
