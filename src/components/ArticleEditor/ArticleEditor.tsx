/* eslint-disable @typescript-eslint/no-explicit-any */
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Container, LinearProgress, TextField } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';
import { modulesEditor } from '../../config/modulesEditor';
import useToastCustom from '../../hooks/useToastCustom';
import { updateArticle } from '../../services/services';
import { store } from '../../state/store';
import { useStore } from '../../state/storeHooks';
import { ArticleEditorStyled } from '../../styles/ArticleEditorStyled';
import { ArticleForEditor } from '../../types/article';
import SkeletonArticleEditor from '../Common/SkeletonArticleEditor';
import { EditorState, addTag, removeTag, updateField } from './ArticleEditor.slice';

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
  const { notifySuccess, notifyError } = useToastCustom();
  const [value, setValue] = useState('');
  const history = useHistory();
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const {
    register,
    handleSubmit,
    setValue: setValueForm,
    setError,
    formState: { errors: errorsForm },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmitForm = async (data: any) => {
    setLoadingUpdate(true);
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
          notifyError('Lưu bài viết thất bại');
          setError('title', { type: 'custom', message: errors.title.join(', ') });
        },
        ok: ({ slug }) => {
          history.push(`/article/${slug}`);
        },
      });
    } catch (error) {
      notifyError('Lưu bài viết thất bại');
    } finally {
      setLoadingUpdate(false);
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
        {loadingUpdate && <LinearProgress className='loading-article' />}

        {loading ? (
          <>
            <SkeletonArticleEditor />
          </>
        ) : (
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
        )}
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
