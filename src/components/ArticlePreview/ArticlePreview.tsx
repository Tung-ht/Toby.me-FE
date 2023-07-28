/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Article } from '../../types/article';
import { styled } from 'styled-components';
import { DEFAULT_AVATAR, TEXT_PIN_TAG } from '../../config/settings';
import { pinArticle, unpinArticle } from '../../services/services';
import { Button, CircularProgress } from '@material-ui/core';
import { useEffect, useState } from 'react';
import useToastCustom from '../../hooks/useToastCustom';
import useRole from '../../hooks/useRole';

export function ArticlePreview({
  article: {
    createdAt,
    favorited,
    favoritesCount,
    slug,
    title,
    description,
    tagList,
    author: { image, username },
  },
  isSubmitting,
  onFavoriteToggle,
}: {
  article: Article;
  isSubmitting: boolean;
  onFavoriteToggle?: () => void;
}) {
  const { notifySuccess, notifyError } = useToastCustom();
  const { isAdmin } = useRole();

  const [tagListRender, setTagListRender] = useState<any>([]);
  const [loadingPin, setLoadingPin] = useState(false);
  const [isArticlePinned, setIsArticlePinned] = useState(false);

  const handlePinArticle = async (slug: string) => {
    try {
      setLoadingPin(true);
      const rs = await pinArticle(slug);

      if (tagListRender.includes(TEXT_PIN_TAG) === false) {
        setTagListRender([...tagListRender, TEXT_PIN_TAG]);
      }

      notifySuccess('Ghim bài viết thành công');
    } catch (error) {
      console.log('🚀 error:', error);
      notifyError('Ghim bài viết không thành công');
    } finally {
      setLoadingPin(false);
    }
  };

  const handleUnpinArticle = async (slug: string) => {
    try {
      setLoadingPin(true);
      const rs = await unpinArticle(slug);

      if (tagListRender.includes(TEXT_PIN_TAG) === true) {
        const list = tagListRender.filter((t: any) => t !== TEXT_PIN_TAG);
        setTagListRender(list);
      }

      notifySuccess('Bỏ ghim bài viết thành công');
    } catch (error) {
      console.log('🚀 error:', error);
      notifyError('Bỏ ghim bài viết không thành công');
    } finally {
      setLoadingPin(false);
    }
  };

  useEffect(() => {
    setTagListRender(tagList);

    const rs = tagListRender.includes(TEXT_PIN_TAG);
    setIsArticlePinned(rs);
  }, [tagList]);

  useEffect(() => {
    const rs = tagListRender.includes(TEXT_PIN_TAG);
    setIsArticlePinned(rs);
  }, [tagListRender]);

  return (
    <ArticlePreviewStyled>
      <div className='d-flex justify-content-between mb-2'>
        <Link to={`/profile/${username}`} className='wrapper-author'>
          <img src={image || DEFAULT_AVATAR} className='author-avt' />
          <h5 className='author-name'>{username}</h5>
        </Link>

        {isAdmin() ? (
          <>
            {isArticlePinned ? (
              <>
                <Button
                  color='primary'
                  variant={'outlined'}
                  style={{ textTransform: 'none' }}
                  onClick={() => handleUnpinArticle(slug)}
                >
                  <i className='ion-pin me-2'></i> {'Đã ghim'}
                  {loadingPin && <CircularProgress className='ms-2' color='primary' size={20} />}
                </Button>
              </>
            ) : (
              <>
                <Button
                  color='primary'
                  variant={'text'}
                  style={{ textTransform: 'none' }}
                  onClick={() => handlePinArticle(slug)}
                >
                  <i className='ion-pin me-2'></i> {'Ghim'}
                  {loadingPin && <CircularProgress className='ms-2' color='primary' size={20} />}
                </Button>
              </>
            )}
          </>
        ) : (
          <></>
        )}
      </div>

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

        <div>
          <button
            className={`btn-like ${favorited ? 'btn-liked' : ''}`}
            disabled={isSubmitting}
            onClick={onFavoriteToggle}
          >
            <i className='ion-heart'></i> {favoritesCount}
          </button>
        </div>
      </div>

      <TagList tagList={tagListRender} />

      {/* <div className='article-meta'>
        <Link to={`/profile/${username}`} className='author'>
          <img src={image || undefined} />
        </Link>
        <div className='info'>
          <Link to={`/profile/${username}`} className='author'>
            {username}
          </Link>
          <span className='date'>{format(createdAt, 'PP')}</span>
        </div>
        <button
          className={`btn btn-sm pull-xs-right ${favorited ? 'btn-primary' : 'btn-outline-primary'}`}
          aria-label='Toggle Favorite'
          disabled={isSubmitting}
          onClick={onFavoriteToggle}
        >
          <i className='ion-heart'></i> {favoritesCount}
        </button>
      </div>
      <a href={`/#/article/${slug}`} className='preview-link'>
        <h1>{title}</h1>
        <p>{description}</p>
        <span>Đọc tiếp ...</span>
        <TagList tagList={tagList} />
      </a> */}
    </ArticlePreviewStyled>
  );
}

export function TagList({ tagList }: { tagList: string[] }) {
  return (
    <div>
      <div className='tag-label'>Tag: </div>
      <ul className='tag-list'>
        {tagList.map((tag) => (
          <li key={tag} className='tag-default tag-pill tag-outline'>
            {tag}
          </li>
        ))}
      </ul>
    </div>
  );
}

export const ArticlePreviewStyled = styled.div`
  background-color: #fff;
  padding: 24px;
  padding-bottom: 0px;
  margin-bottom: 20px;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;

  button:focus {
    outline: none;
    border: none;
  }

  .thumbs-article {
    height: auto;
    max-width: 100%;
    border: none;
    border-radius: 4px;
    margin-bottom: 12px;
  }

  .container-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
    border-top: 1px solid #c7c7c7;

    .info-list {
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .info-item {
        font-size: 16px;
        color: #a3a3a3;
        font-weight: 500;
        margin-right: 8px;
      }
    }

    .btn-like {
      border: none;
      background: transparent;
      padding: 4px 12px;
      font-size: 30px;
      color: #a3a3a3;
      transition: all 0.3s ease-in-out;

      &:focus {
        border: none;
        outline: none;
      }

      &:hover {
        color: #ff0000;
      }
    }

    .btn-liked {
      color: #ff0000;
    }
  }

  .wrapper-author {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 12px;
    width: fit-content;

    text-decoration: none;
    color: inherit;

    .author-avt {
      height: 32px;
      width: 32px;
      border-radius: 30px;
      margin-right: 8px;
    }

    .author-name {
      margin: 0px;
      transition: all 0.3s ease-in-out;
    }

    &:hover .author-name {
      color: #5cb85c;
    }
  }

  .post {
    .title-post {
      color: inherit;
      text-decoration: none;
      transition: all 0.3s ease-in-out;
    }

    &:hover .title-post {
      color: #5cb85c;
    }
  }
`;
