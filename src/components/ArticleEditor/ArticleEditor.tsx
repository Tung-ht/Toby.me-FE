/* eslint-disable @typescript-eslint/no-explicit-any */
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  Input,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Checkbox,
  ListItemText,
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';
import { modulesEditor } from '../../config/modulesEditor';
import useToastCustom from '../../hooks/useToastCustom';
import { getTagsDropdown, updateArticle } from '../../services/services';
import { store } from '../../state/store';
import { useStore } from '../../state/storeHooks';
import { ArticleEditorStyled } from '../../styles/ArticleEditorStyled';
import { ArticleForEditor } from '../../types/article';
import SkeletonArticleEditor from '../Common/SkeletonArticleEditor';
import { EditorState, addTag, removeTag, updateField } from './ArticleEditor.slice';
import { MenuPropsUtils } from '../../config/menuPropsSelectMultiple';

const schema = yup
  .object({
    title: yup.string().required('Tiêu đề không được bỏ trống'),
    description: yup.string().required('Mô tả bài viết không được bỏ trống'),
    body: yup.string().required('Nội dung bài viết không được bỏ trống'),
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

  const [tags, setTags] = useState([]);
  const [tagsSelected, setTagsSelected] = useState<any>([]);

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
      tagList: tagsSelected,
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
          notifySuccess('Lưu bài viết thành công');
          history.push(`/article/${encodeURIComponent(slug)}`);
        },
      });
    } catch (error) {
      notifyError('Lưu bài viết thất bại');
    } finally {
      setLoadingUpdate(false);
    }
  };

  const onChangeTags = (event: any) => {
    setTagsSelected(event.target.value);
  };

  const handleGetTags = async () => {
    try {
      const {
        data: { tags },
      } = await getTagsDropdown();
      setTags(tags);
    } catch (error: any) {
      console.log('🚀 -> error:', error);
    }
  };

  useEffect(() => {
    handleGetTags();

    setValueForm('title', article.title);
    setValueForm('description', article.description);
    setValueForm('body', article.body);

    setValue(article.body);
    setTagsSelected(article.tagList);
  }, [article]);

  return (
    <Container>
      <ArticleEditorStyled>
        <div className='d-flex justify-content-center'>
          <h2>Chỉnh sửa bài viết</h2>
        </div>

        {loadingUpdate && <LinearProgress className='loading-article' />}

        {loading ? (
          <>
            <SkeletonArticleEditor />
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <div className='input-label'>
              Tiêu đề:<span className='input-label__required'>*</span>{' '}
            </div>
            <TextField
              className='input-editor'
              margin='dense'
              size='small'
              fullWidth
              {...register('title')}
              variant='outlined'
            />
            <p className='error-article-editor'>{errorsForm?.title?.message}</p>

            <div className='input-label'>
              Mô tả bài viết:<span className='input-label__required'>*</span>{' '}
            </div>
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

            <div className='input-label'>Tags:</div>
            <Select
              id='multiple-tags'
              multiple
              fullWidth
              variant='outlined'
              value={tagsSelected}
              onChange={onChangeTags}
              MenuProps={MenuPropsUtils}
              renderValue={(selected) => (
                <div className='d-flex flex-wrap'>
                  {(selected as string[]).map((value) => (
                    <Chip key={value} label={value} className='m-1' />
                  ))}
                </div>
              )}
            >
              {tags.map((name, index) => (
                <MenuItem key={index} value={name}>
                  <Checkbox checked={tagsSelected.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
            <p></p>

            <div className='input-label'>
              Nội dung bài viết:<span className='input-label__required'>*</span>{' '}
            </div>
            <ReactQuill
              modules={{ ...modulesEditor }}
              theme='snow'
              className='quill-editor'
              value={value}
              onChange={(value) => {
                setValueForm('body', value);
                setValue(value);
              }}
              readOnly={loading}
            />
            <p className='error-article-editor'>{errorsForm?.body?.message}</p>

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
