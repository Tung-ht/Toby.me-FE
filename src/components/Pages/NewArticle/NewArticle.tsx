/* eslint-disable @typescript-eslint/no-explicit-any */
import { yupResolver } from '@hookform/resolvers/yup';
import { Container, TextField } from '@material-ui/core';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import { styled } from 'styled-components';
import * as yup from 'yup';
import { createArticle } from '../../../services/services';
import { ArticleForEditor } from '../../../types/article';
const schema = yup
  .object({
    title: yup.string().required('Tiêu đề không được bỏ trống'),
    description: yup.string().required('Mô tả bài viết không được bỏ trống'),
  })
  .required();

export function NewArticle() {
  const [value, setValue] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    const params: ArticleForEditor = {
      title: data.title,
      body: value,
      tagList: [],
      description: data.description,
    };

    try {
      const result = await createArticle(params);

      result.match({
        err: (errors) => {
          console.log('🚀 -> onSubmit -> errors:', errors);
        },
        ok: ({ slug }) => {
          location.hash = `#/article/${slug}`;
        },
      });
    } catch (error) {
      console.log('🚀 -> onSubmit -> error:', error);
    }
  };

  return (
    <Container>
      <NewArticleStyled>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>Tiêu đề: </div>
          <TextField margin='dense' size='small' fullWidth {...register('title')} variant='outlined' />
          <p>{errors?.title?.message}</p>

          <div>Mô tả bài viết: </div>
          <TextField
            margin='dense'
            size='small'
            fullWidth
            multiline
            minRows={3}
            {...register('description')}
            variant='outlined'
          />
          <p>{errors?.description?.message}</p>

          <div>Nội dung bài viết: </div>
          <ReactQuill theme='snow' className='quill-editor' value={value} onChange={setValue} />

          <div className='container-button'>
            <input type='submit' />
          </div>
        </form>
      </NewArticleStyled>
    </Container>
  );
}

const NewArticleStyled = styled.div`
  width: 100%;

  .quill-editor {
    .ql-container {
      min-height: 500px;
    }
  }

  .container-button {
    margin-top: 12px;
  }
`;

// import { FormEvent, useEffect } from 'react';
// import { createArticle } from '../../../services/services';
// import { store } from '../../../state/store';
// import { ArticleEditor } from '../../ArticleEditor/ArticleEditor';
// import { initializeEditor, startSubmitting, updateErrors } from '../../ArticleEditor/ArticleEditor.slice';

// export function NewArticle() {
//   useEffect(() => {
//     store.dispatch(initializeEditor());
//   }, [null]);

//   return <ArticleEditor onSubmit={onSubmit} />;
// }

// async function onSubmit(ev: FormEvent) {
//   ev.preventDefault();
//   store.dispatch(startSubmitting());
//   const result = await createArticle(store.getState().editor.article);

//   result.match({
//     err: (errors) => store.dispatch(updateErrors(errors)),
//     ok: ({ slug }) => {
//       location.hash = `#/article/${slug}`;
//     },
//   });
// }
