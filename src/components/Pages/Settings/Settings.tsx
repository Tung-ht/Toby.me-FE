/* eslint-disable @typescript-eslint/no-explicit-any */
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, LinearProgress, TextField } from '@material-ui/core';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { updateSettings } from '../../../services/services';
import { store } from '../../../state/store';
import { useStore } from '../../../state/storeHooks';
import { AuthStyled } from '../../../styles/AuthStyled';
import { UserSettings } from '../../../types/user';
import { loadUser, logout } from '../../App/App.slice';
import { ContainerPage } from '../../ContainerPage/ContainerPage';
import useToastCustom from '../../../hooks/useToastCustom';

export interface SettingsField {
  name: keyof UserSettings;
  type?: string;
  isTextArea?: true;
  placeholder: string;
}

const schema = yup
  .object({
    image: yup.string().nullable(),
    username: yup.string().nullable(),
    bio: yup.string().nullable(),
    email: yup.string().nullable(),
    password: yup
      .string()
      .nullable()
      .test('min', 'Mật khẩu tối thiểu 8 ký tự', (value) => {
        if (value === null || value?.trim() === '') {
          return true;
        }

        if (value && value.length <= 8) {
          return false;
        }

        return true;
      })
      .test('max', 'Mật khẩu tối đa 32 ký tự', (value) => {
        if (value === null || value?.trim() === '') {
          return true;
        }

        if (value && value.length > 32) {
          return false;
        }

        return true;
      }),
  })
  .required();

export function Settings() {
  const { user, errors, updating } = useStore(({ settings }) => settings);

  const [loading, setLoading] = useState(false);

  const { notifySuccess, notifyError } = useToastCustom();

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
    try {
      setLoading(true);
      const paramUpdate = {
        image: data.image,
        username: data.username,
        bio: data.bio,
        email: data.email,
      };

      const result = await updateSettings(paramUpdate);
      store.dispatch(loadUser(result.user));

      notifySuccess('Cập nhật thông tin thành công');

      // location.hash = '/';
    } catch (error: any) {
      console.log('🚀 -> onSubmitForm -> error:', error);
      const errorList = error?.response?.data?.errors?.body;
      console.log('🚀 -> onSubmitForm -> errorList:', errorList);
      if (errorList) {
        notifyError('Cập nhật thông tin thất bại', errorList.join(', '));
      } else {
        notifyError('Cập nhật thông tin thất bại', 'Hãy thử lại');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setValueForm('image', user.image);
    setValueForm('username', user.username);
    setValueForm('bio', user.bio);
    setValueForm('email', user.email);
  }, [user]);

  return (
    <AuthStyled className=''>
      <ContainerPage>
        <div className='col-md-6 offset-md-3 col-xs-12 pb-4 wrapper-auth'>
          {loading && <LinearProgress />}

          <h1 className='text-xs-center my-3'>Thông tin tài khoản</h1>

          <form onSubmit={handleSubmit(onSubmitForm)}>
            <TextField
              fullWidth
              variant='outlined'
              label='URL ảnh đại diện'
              placeholder='URL ảnh đại diện'
              className='input-auth'
              {...register('image')}
            />
            <p></p>

            <TextField
              fullWidth
              variant='outlined'
              label='Tên hiển thị'
              placeholder='Tên hiển thị'
              className='input-auth'
              {...register('username')}
            />
            <p></p>

            <TextField
              fullWidth
              multiline
              minRows={6}
              variant='outlined'
              label='Mô tả bản thân'
              placeholder='Mô tả bản thân'
              className='input-auth'
              {...register('bio')}
            />
            <p></p>

            <TextField
              fullWidth
              variant='outlined'
              label='Email'
              disabled
              className='input-auth'
              {...register('email')}
            />
            <p></p>

            <div className='wrapper-btn-auth'>
              <Button
                variant='contained'
                size='large'
                color='primary'
                className='btn-auth'
                type='submit'
              >
                Cập nhật
              </Button>
            </div>
          </form>

          {/* <hr />

          <button className='btn btn-outline-danger' onClick={_logout}>
            Đăng xuất
          </button> */}
        </div>
      </ContainerPage>
    </AuthStyled>
  );
}

function _logout() {
  delete axios.defaults.headers.Authorization;
  localStorage.removeItem('token');
  store.dispatch(logout());
  location.hash = '/';
}
