/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { store } from '../../state/store';
import { useStore } from '../../state/storeHooks';
import { buildGenericFormField } from '../../types/genericFormField';
import { ContainerPage } from '../ContainerPage/ContainerPage';
import { GenericForm } from '../GenericForm/GenericForm';
import { addTag, EditorState, removeTag, updateField } from './ArticleEditor.slice';
import { styled } from 'styled-components';
import { Button, Container, TextField } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ReactQuill from 'react-quill';
import { modulesEditor } from '../../config/modulesEditor';
import { ArticleForEditor } from '../../types/article';
import { tryCatch } from 'ramda';
import { updateArticle } from '../../services/services';
import { ArticleEditorStyled } from '../../styles/ArticleEditorStyled';

const schema = yup
  .object({
    title: yup.string().required('Tiêu đề không được bỏ trống'),
    description: yup.string().required('Mô tả bài viết không được bỏ trống'),
  })
  .required();

interface ArticleEditorProps {
  loading: boolean;
  slug: string;
}

export function ArticleEditor({ loading, slug }: ArticleEditorProps) {
  const { article, submitting, tag, errors } = useStore(({ editor }) => editor);

  const [value, setValue] = useState('');

  const {
    register,
    handleSubmit,
    setValue: setValueForm,
    formState: { errors: errorsForm },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmitForm = async (data: any) => {
    console.log('🚀 -> onSubmit -> data:', data);
    const params: ArticleForEditor = {
      title: data.title,
      body: value,
      tagList: [],
      description: data.description,
    };

    try {
      const result = await updateArticle(slug, params);

      result.match({
        err: (errors) => {
          console.log('🚀 -> onSubmitForm -> errors:', errors);
        },
        ok: ({ slug }) => {
          location.hash = `#/article/${slug}`;
        },
      });
    } catch (error) {
      console.log('🚀 -> onSubmitForm -> error:', error);
    }
  };

  useEffect(() => {
    setValueForm('title', article.title);
    setValueForm('description', article.description);
    setValue(article.body);
  }, [article]);

  return (
    <Container>
      <ArticleEditorStyled>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <div className='input-label'>Tiêu đề: </div>
          <TextField
            className='input-editor'
            margin='dense'
            size='small'
            fullWidth
            {...register('title')}
            variant='outlined'
          />
          <p className='error-article-editor'>{errorsForm?.title?.message}</p>

          <div className='input-label'>Mô tả bài viết: </div>
          <TextField
            className='input-editor'
            margin='dense'
            size='small'
            fullWidth
            multiline
            minRows={3}
            {...register('description')}
            variant='outlined'
          />
          <p className='error-article-editor'>{errorsForm?.description?.message}</p>

          <div className='input-label'>Nội dung bài viết: </div>
          <ReactQuill
            modules={{ ...modulesEditor }}
            theme='snow'
            className='quill-editor'
            value={value}
            onChange={setValue}
          />

          <div className='container-button'>
            <Button className='editor-submit' variant='contained' color='primary' type='submit'>
              Lưu bài viết
            </Button>
          </div>
        </form>
      </ArticleEditorStyled>
    </Container>

    // <div className='editor-page'>
    //   <ContainerPage>
    //     <div className='col-md-10 offset-md-1 col-xs-12'>
    //       <GenericForm
    //         formObject={{ ...article, tag } as unknown as Record<string, string | null>}
    //         disabled={submitting}
    //         errors={errors}
    //         onChange={onUpdateField}
    //         onSubmit={onSubmit}
    //         submitButtonText='Publish Article'
    //         onAddItemToList={onAddTag}
    //         onRemoveListItem={onRemoveTag}
    //         fields={[
    //           buildGenericFormField({ name: 'title', placeholder: 'Tiêu đề' }),
    //           buildGenericFormField({ name: 'description', placeholder: 'Mô tả ngắn gọn nội dung chính', lg: false }),
    //           buildGenericFormField({
    //             name: 'body',
    //             placeholder: 'Nội dung bài viết (markdown language)',
    //             fieldType: 'textarea',
    //             rows: 8,
    //             lg: false,
    //           }),
    //           buildGenericFormField({
    //             name: 'tag',
    //             placeholder: 'Chọn tags',
    //             listName: 'tagList',
    //             fieldType: 'list',
    //             lg: false,
    //           }),
    //         ]}
    //       />
    //     </div>
    //   </ContainerPage>
    // </div>
  );
}

function onUpdateField(name: string, value: string) {
  store.dispatch(updateField({ name: name as keyof EditorState['article'], value }));
}

function onAddTag() {
  store.dispatch(addTag());
}

function onRemoveTag(_: string, index: number) {
  store.dispatch(removeTag(index));
}
