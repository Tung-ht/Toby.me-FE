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
import * as yup from 'yup';
import { createArticle } from '../../../services/services';
import { ArticleForEditor } from '../../../types/article';
import { modulesEditor } from '../../../config/modulesEditor';
import { ArticleEditorStyled } from '../../../styles/ArticleEditorStyled';
import useToastCustom from '../../../hooks/useToastCustom';
import { useHistory } from 'react-router-dom';

const schema = yup
  .object({
    title: yup.string().required('Tiêu đề không được bỏ trống'),
    description: yup.string().required('Mô tả bài viết không được bỏ trống'),
    body: yup.string().required('Nội dung bài viết không được bỏ trống'),
  })
  .required();

export const initErrorBody = { status: false, content: '' };

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 250,
      width: 250,
    },
  },
};

export function NewArticle() {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const [tagsSelected, setTagsSelected] = useState<any>([]);

  const { notifySuccess, notifyError } = useToastCustom();
  const history = useHistory();

  const {
    register,
    handleSubmit,
    setValue: setValueForm,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);

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
          console.log('errors', errors);

          if (errors?.title) {
            notifyError('Tạo bài viết thất bại');

            setError('title', { type: 'custom', message: errors.title.join(', ') });
          }
        },
        ok: ({ slug }) => {
          notifySuccess('Thành công', 'Tạo bài viết thành công');
          history.push(`/article/${slug}`);
        },
      });
    } catch (error) {
      notifyError('Tạo bài viết thất bại');
    } finally {
      setLoading(false);
    }
  };

  const onChangeTags = (event: any) => {
    setTagsSelected(event.target.value);
    console.log('🚀 -> onChangeTags -> event.target.value:', event.target.value);
  };

  return (
    <Container>
      <ArticleEditorStyled>
        {loading && <LinearProgress className='loading-article' />}
        <form onSubmit={handleSubmit(onSubmit)}>
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
            disabled={loading}
          />
          <p className='error-article-editor'>{errors?.title?.message}</p>

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
            disabled={loading}
          />
          <p className='error-article-editor'>{errors?.description?.message}</p>

          <div className='input-label'>
            Tags:<span className='input-label__required'>*</span>{' '}
          </div>
          <Select
            fullWidth
            multiple
            variant='outlined'
            value={tagsSelected}
            onChange={onChangeTags}
            // MenuProps={MenuProps}
            renderValue={(selected) => (
              <div className='d-flex flex-wrap'>
                {(selected as string[]).map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </div>
            )}
          >
            {names.map((name) => (
              <MenuItem key={name} value={name}>
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
          <p className='error-article-editor'>{errors?.body?.message}</p>

          <div className='container-button'>
            <Button
              className='editor-submit'
              variant='contained'
              disabled={loading}
              color='primary'
              type='submit'
            >
              Tạo bài viết
            </Button>
          </div>
        </form>
      </ArticleEditorStyled>
    </Container>
  );
}

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
