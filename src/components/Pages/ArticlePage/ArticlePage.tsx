/* eslint-disable @typescript-eslint/no-explicit-any */
import { Option } from '@hqoss/monads';
import { format } from 'date-fns';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  adminDeleteArticle,
  createComment,
  deleteArticle,
  deleteComment,
  favoriteArticle,
  followUser,
  getArticle,
  getArticleComments,
  unfavoriteArticle,
  unfollowUser,
} from '../../../services/services';
import { store } from '../../../state/store';
import { useStore } from '../../../state/storeHooks';
import { Article } from '../../../types/article';
import { Comment } from '../../../types/comment';
import { redirect } from '../../../types/location';
import { classObjectToClassName } from '../../../types/style';
import { User } from '../../../types/user';
import { TagList } from '../../ArticlePreview/ArticlePreview';
import {
  CommentSectionState,
  initializeArticlePage,
  loadArticle,
  loadComments,
  MetaSectionState,
  startDeletingArticle,
  startSubmittingComment,
  startSubmittingFavorite,
  startSubmittingFollow,
  updateAuthor,
  updateCommentBody,
} from './ArticlePage.slice';
import { ArticlePageBannerStyled, ArticlePageStyled } from './ArticlePageStyled';
import { Button, CircularProgress, Divider, IconButton, LinearProgress } from '@material-ui/core';
import useRole from '../../../hooks/useRole';
import useToastCustom from '../../../hooks/useToastCustom';
import { DEFAULT_AVATAR } from '../../../config/settings';
import { styled } from 'styled-components';
import { ButtonStyled } from '../../../styles/common';
import SkeletonArticleViewer from '../../Common/SkeletonArticleViewer';

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();

  const {
    articlePage: { article, commentSection, metaSection },
    app: { user },
  } = useStore(({ articlePage, app }) => ({
    articlePage,
    app,
  }));

  useEffect(() => {
    onLoad(slug);
  }, [slug]);

  return article.match({
    none: () => (
      <div className='container page'>
        <SkeletonArticleViewer></SkeletonArticleViewer>
      </div>
    ),
    some: (article: any) => {
      return (
        <ArticlePageStyled className='article-page'>
          <div className='container wrapper-content'>
            <div className='wrapper-content-left'>
              <ArticleMeta {...{ article, metaSection, user }} />

              <TagList tagList={article.tagList} />
            </div>

            <div className='wrapper-content-right'>
              {/* <ArticlePageBanner {...{ article, metaSection, user }} /> */}

              <h1 className='mb-0'>{article.title}</h1>
              <div className='article-date mb-5'>
                {format(article.createdAt, 'hh:mm - dd/MM/yyyy')}
              </div>

              <div className='article-description'>{article.description}</div>

              <div className='row article-content' id='article-content-styled'>
                <div className='col-md-12' dangerouslySetInnerHTML={{ __html: article.body }}></div>
              </div>
            </div>
          </div>

          <div className='container page'>
            <div className='article-actions'></div>

            <CommentSection
              {...{ user, commentSection, article, author: article?.author?.username }}
            />
          </div>
        </ArticlePageStyled>
      );
    },
  });
}

async function onLoad(slug: string) {
  store.dispatch(initializeArticlePage());

  try {
    const article = await getArticle(slug);
    store.dispatch(loadArticle(article));

    const comments = await getArticleComments(slug);
    store.dispatch(loadComments(comments));
  } catch {
    redirect('');
  }
}

function ArticlePageBanner(props: {
  article: Article;
  metaSection: MetaSectionState;
  user: Option<User>;
}) {
  return (
    <ArticlePageBannerStyled>
      <div className=''>
        <ArticleMeta {...props} />

        <h1>{props.article.title}</h1>
      </div>
    </ArticlePageBannerStyled>
  );
}

function ArticleMeta({
  article,
  metaSection: { submittingFavorite, submittingFollow, deletingArticle },
  user,
}: {
  article: Article;
  metaSection: MetaSectionState;
  user: Option<User>;
}) {
  return (
    <div className='article-meta'>
      <ArticleAuthorInfo article={article} />

      {user.isSome() && user.unwrap().username === article.author.username ? (
        <OwnerArticleMetaActions article={article} deletingArticle={deletingArticle} />
      ) : (
        <NonOwnerArticleMetaActions
          article={article}
          submittingFavorite={submittingFavorite}
          submittingFollow={submittingFollow}
        />
      )}
    </div>
  );
}

function ArticleAuthorInfo({
  article: {
    author: { username, image },
    createdAt,
  },
}: {
  article: Article;
}) {
  return (
    <ArticleAuthorInfoStyled>
      <Link to={`/profile/${username}`}>
        <img src={image || DEFAULT_AVATAR} />
      </Link>
      <div className='author-info'>
        <Link to={`/profile/${username}`}>{username}</Link>
      </div>
    </ArticleAuthorInfoStyled>
  );
}

const ArticleAuthorInfoStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 12px;

  img {
    height: 70px;
    width: 70px;
    border-radius: 50%;
  }

  .author-info {
    font-weight: 500;
    font-size: 20px;
  }
`;

function NonOwnerArticleMetaActions({
  article: {
    slug,
    favoritesCount,
    favorited,
    author: { username, following },
  },
  submittingFavorite,
  submittingFollow,
}: {
  article: Article;
  submittingFavorite: boolean;
  submittingFollow: boolean;
}) {
  const { isAdmin } = useRole();
  const [loading, setLoading] = useState(false);
  const { notifySuccess, notifyError } = useToastCustom();

  const handleDeleteArticle = async () => {
    try {
      setLoading(true);
      const rs = await adminDeleteArticle(encodeURIComponent(slug));

      if (rs.status === 200) {
        notifySuccess('Bài viết đã bị xóa');
        location.hash = '/';
      } else {
        notifyError('Xóa bài viết thất bại');
      }
    } catch (error) {
      notifyError('Xóa bài viết thất bại');
      console.log('🚀 -> handleApproveArticle -> error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <ButtonStyled
        size='small'
        variant={following ? 'contained' : 'outlined'}
        color='primary'
        onClick={() => onFollow(username, following)}
        disabled={submittingFollow}
        className='w-100'
      >
        {following ? <i className='ion-ios-flame'></i> : <i className='ion-plus-round'></i>}
        &nbsp; {following ? 'Đang theo dõi' : 'Theo dõi '}
      </ButtonStyled>

      <ButtonStyled
        size='small'
        color='secondary'
        variant={favorited ? 'contained' : 'outlined'}
        disabled={submittingFavorite}
        onClick={() => onFavorite(slug, favorited)}
        className='w-100 mt-2'
      >
        <i className='ion-heart'></i>
        &nbsp; {favorited ? 'Bỏ yêu thích ' : 'Yêu thích '}
        <span className='counter'>({favoritesCount})</span>
      </ButtonStyled>

      {isAdmin() && (
        <>
          <Divider className='mt-2' />
          {loading && <LinearProgress />}
          <ButtonStyled
            size='small'
            color='secondary'
            onClick={() => handleDeleteArticle()}
            className='w-100 mt-2'
          >
            <i className='ion-trash-a'></i>
            &nbsp; Xóa bài viết
          </ButtonStyled>
        </>
      )}

      {/* {isAdmin() && (
        <>
          <Divider className='mt-2' />
          {loading && <LinearProgress />}
          <button className='btn btn-sm btn btn-danger mt-2' onClick={() => handleDeleteArticle()}>
            <i className='ion-trash-a'></i>
            &nbsp; Xóa bài viết
          </button>
        </>
      )} */}
      {/*  */}
      {/* <button
        className={classObjectToClassName({
          btn: true,
          'btn-sm': true,
          'btn-outline-secondary': !following,
          'btn-secondary': following,
          'my-1': true,
        })}
        disabled={submittingFollow}
        onClick={() => onFollow(username, following)}
      >
        <i className='ion-plus-round'></i>
        &nbsp; {following ? 'Hủy theo dõi ' : 'Theo dõi '}
      </button> */}
      {/* &nbsp; */}
      {/* <button
        className={classObjectToClassName({
          btn: true,
          'btn-sm': true,
          'btn-outline-primary': !favorited,
          'btn-primary': favorited,
          'my-1': true,
        })}
        disabled={submittingFavorite}
        onClick={() => onFavorite(slug, favorited)}
      >
        <i className='ion-heart'></i>
        &nbsp; {favorited ? 'Hủy yêu thích ' : 'Yêu thích '}
        <span className='counter'>({favoritesCount})</span>
      </button> */}
    </Fragment>
  );
}

async function onFollow(username: string, following: boolean) {
  if (store.getState().app.user.isNone()) {
    redirect('register');
    return;
  }

  store.dispatch(startSubmittingFollow());

  const author = await (following ? unfollowUser : followUser)(username);
  store.dispatch(updateAuthor(author));
}

async function onFavorite(slug: string, favorited: boolean) {
  if (store.getState().app.user.isNone()) {
    redirect('register');
    return;
  }

  store.dispatch(startSubmittingFavorite());

  const article = await (favorited ? unfavoriteArticle : favoriteArticle)(slug);
  store.dispatch(loadArticle(article));
}

function OwnerArticleMetaActions({
  article: { slug },
  deletingArticle,
}: {
  article: Article;
  deletingArticle: boolean;
}) {
  return (
    <Fragment>
      <ButtonStyled
        size='small'
        color='primary'
        variant={'outlined'}
        onClick={() => redirect(`editor/${encodeURIComponent(slug)}`)}
        className='w-100 mt-2'
      >
        <i className='ion-plus-round'></i>
        &nbsp; Chỉnh sửa bài viết
      </ButtonStyled>

      <ButtonStyled
        size='small'
        color='secondary'
        disabled={deletingArticle}
        onClick={() => onDeleteArticle(encodeURIComponent(slug))}
        className='w-100 mt-2'
      >
        <i className='ion-trash-a'></i>
        &nbsp; Xóa bài viết
      </ButtonStyled>
      {/*  */}
      {/* <button
        className='btn btn-outline-secondary btn-sm my-1'
        onClick={() => redirect(`editor/${slug}`)}
      >
        <i className='ion-plus-round'></i>
        &nbsp; Chỉnh sửa bài viết
      </button>
      &nbsp; */}
      {/* <button
        className='btn btn-outline-danger btn-sm my-1'
        disabled={deletingArticle}
        onClick={() => onDeleteArticle(slug)}
      >
        &#10005; Xóa bài viết
      </button> */}
    </Fragment>
  );
}

async function onDeleteArticle(slug: string) {
  store.dispatch(startDeletingArticle());
  await deleteArticle(slug);
  redirect('');
}

function CommentSection({
  user,
  article,
  commentSection: { submittingComment, commentBody, comments },
  author,
}: {
  user: Option<User>;
  article: Article;
  commentSection: CommentSectionState;
  author: string;
}) {
  const { commentId } = useParams<{ commentId: string }>();
  return (
    <div className='row'>
      <div className='col-xs-12 col-md-8 offset-md-2'>
        {user.match({
          none: () => (
            <p style={{ display: 'inherit' }}>
              <Link to='/login'>Đăng nhập</Link> hoặc <Link to='/register'>Đăng ký</Link> để bình
              luận bài viết này.
            </p>
          ),
          some: (user) => (
            <CommentForm
              user={user}
              slug={article.slug}
              submittingComment={submittingComment}
              commentBody={commentBody}
            />
          ),
        })}

        {comments.match({
          none: () => <div>Đang tải bình luận...</div>,
          some: (comments) => (
            <Fragment>
              {comments.map((comment, index) => (
                <ArticleComment
                  key={comment.id}
                  comment={comment}
                  slug={article.slug}
                  user={user}
                  index={index}
                  author={author}
                  commentId={commentId}
                />
              ))}
            </Fragment>
          ),
        })}
      </div>
    </div>
  );
}

function CommentForm({
  user: { image },
  commentBody,
  slug,
  submittingComment,
}: {
  user: User;
  commentBody: string;
  slug: string;
  submittingComment: boolean;
}) {
  return (
    <form
      className='card comment-form'
      onSubmit={onPostComment(encodeURIComponent(slug), commentBody)}
    >
      <div className='card-block'>
        <textarea
          className='form-control'
          placeholder='Viết bình luận...'
          rows={3}
          onChange={onCommentChange}
          value={commentBody}
        ></textarea>
      </div>
      <div className='card-footer'>
        <img src={image || DEFAULT_AVATAR} className='comment-author-img' />
        <button className='btn btn-sm btn-primary' disabled={submittingComment}>
          Đăng bình luận
        </button>
      </div>
    </form>
  );
}

function onCommentChange(ev: React.ChangeEvent<HTMLTextAreaElement>) {
  store.dispatch(updateCommentBody(ev.target.value));
}

function onPostComment(slug: string, body: string): (ev: React.FormEvent) => void {
  return async (ev) => {
    ev.preventDefault();

    store.dispatch(startSubmittingComment());
    await createComment(slug, body);

    store.dispatch(loadComments(await getArticleComments(slug)));
  };
}

function ArticleComment({
  comment: {
    id,
    body,
    createdAt,
    author: { username, image },
  },
  slug,
  index,
  user,
  author,
  commentId,
}: {
  comment: Comment;
  slug: string;
  index: number;
  user: Option<User>;
  author: string;
  commentId: string | undefined;
}) {
  const { isAdmin } = useRole();

  const myRef = useRef<any>(null);

  useEffect(() => {
    if (commentId && commentId.toString() === id.toString()) {
      if (myRef) {
        myRef?.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [commentId, id, myRef]);

  return (
    <div
      className={
        commentId && commentId.toString() === id.toString() ? 'card comment-focus' : 'card'
      }
      id={`${id}`}
      ref={myRef}
    >
      <div className='card-block py-2 px-3'>
        <div className='d-flex justify-content-between'>
          <div className='d-flex align-items-center mb-2' style={{ fontWeight: 500 }}>
            <div>
              <Link className='comment-author' to={`/profile/${username}`}>
                <img src={image ? image : DEFAULT_AVATAR} className='comment-author-img' />
              </Link>
            </div>

            <div className='d-flex flex-column ms-2'>
              <Link className='comment-author' to={`/profile/${username}`}>
                {username}
              </Link>
              <div className='date-posted m-0' style={{ fontSize: '12px' }}>
                {format(createdAt, 'hh:mm - dd/MM/yyyy')}
              </div>
            </div>
          </div>

          {user.isSome() &&
            (user.unwrap().username === username ||
              user.unwrap().username === author ||
              isAdmin()) && (
              <div>
                <IconButton
                  color='secondary'
                  onClick={() => onDeleteComment(encodeURIComponent(slug), id)}
                  style={{ width: '30px', height: '30px' }}
                >
                  <i
                    className='ion-trash-a'
                    aria-label={`Delete comment ${index + 1}`}
                    style={{ fontSize: '20px' }}
                  ></i>
                </IconButton>
              </div>
            )}
        </div>

        <p className='card-text'>{body}</p>
      </div>
      {/*  */}
      {/* <div className='card-footer'>
        <Link className='comment-author' to={`/profile/${username}`}>
          <img src={image ? image : DEFAULT_AVATAR} className='comment-author-img' />
        </Link>
        &nbsp;
        <Link className='comment-author' to={`/profile/${username}`}>
          {username}
        </Link>
        <span className='date-posted'>{format(createdAt, 'hh:mm - dd/MM/yyyy')}</span>
        {user.isSome() &&
          (user.unwrap().username === username ||
            user.unwrap().username === author ||
            isAdmin()) && (
            <span className='mod-options'>
              <i
                className='ion-trash-a'
                aria-label={`Delete comment ${index + 1}`}
                onClick={() => onDeleteComment(encodeURIComponent(slug), id)}
              ></i>
            </span>
          )}
      </div> */}
    </div>
  );
}

async function onDeleteComment(slug: string, id: number) {
  await deleteComment(slug, id);
  store.dispatch(loadComments(await getArticleComments(slug)));
}
