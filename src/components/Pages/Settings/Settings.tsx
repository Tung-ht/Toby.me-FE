/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, LinearProgress, TextField } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect } from 'react';
import * as yup from 'yup';
import { updateSettings } from '../../../services/services';
import { store } from '../../../state/store';
import { useStore } from '../../../state/storeHooks';
import { AuthStyled } from '../../../styles/AuthStyled';
import { UserSettings } from '../../../types/user';
import { loadUser, logout } from '../../App/App.slice';
import { ContainerPage } from '../../ContainerPage/ContainerPage';
import { SettingsState, startUpdate, updateErrors, updateField } from './Settings.slice';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { GenericForm } from '../../GenericForm/GenericForm';
import { buildGenericFormField } from '../../../types/genericFormField';

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
    console.log('🚀 -> onSubmitForm -> data:', data);

    try {
      let password = null;
      if (data.password !== '') {
        password = data.password;
      }

      const paramUpdate = {
        image: data.image,
        username: data.username,
        bio: data.bio,
        email: data.email,
        password: password,
      };

      const result = await updateSettings(paramUpdate);

      result.match({
        err: (e) => {
          console.log('🚀 -> onSubmitForm -> e:', e);
        },
        ok: (user) => {
          store.dispatch(loadUser(user));
          location.hash = '/';
        },
      });
    } catch (error) {
      console.log('🚀 -> onSubmitForm -> error:', error);
    }
  };

  useEffect(() => {
    setValueForm('image', user.image);
    setValueForm('username', user.username);
    setValueForm('bio', user.bio);
    setValueForm('email', user.email);
    setValueForm('password', user.password);
  }, [user]);

  return (
    <AuthStyled className='settings-page'>
      <ContainerPage>
        <div className='col-md-6 offset-md-3 col-xs-12'>
          {/* <LinearProgress /> */}

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

            <TextField
              fullWidth
              variant='outlined'
              label='Mật khẩu'
              placeholder='Mật khẩu'
              className='input-auth'
              type='password'
              {...register('password')}
            />
            <p className='error-auth'>{errorsForm?.password?.message}</p>
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

          <hr />

          {/* <GenericForm
            disabled={updating}
            formObject={{ ...user }}
            submitButtonText='Cập nhật'
            errors={errors}
            onChange={onUpdateField}
            onSubmit={onUpdateSettings(user)}
            fields={[
              buildGenericFormField({ name: 'image', placeholder: 'URL ảnh đại diện' }),
              buildGenericFormField({ name: 'username', placeholder: 'Tên hiển thị' }),
              buildGenericFormField({
                name: 'bio',
                placeholder: 'Mô tả về bản thân',
                rows: 8,
                fieldType: 'textarea',
              }),
              buildGenericFormField({ name: 'email', placeholder: 'Email' }),
              buildGenericFormField({
                name: 'password',
                placeholder: 'Mật khẩu',
                type: 'password',
              }),
            ]}
          />

          <hr /> */}
          <button className='btn btn-outline-danger' onClick={_logout}>
            Đăng xuất
          </button>
        </div>
      </ContainerPage>
    </AuthStyled>
  );
}

function onUpdateField(name: string, value: string) {
  store.dispatch(updateField({ name: name as keyof SettingsState['user'], value }));
}

function onUpdateSettings(user: UserSettings) {
  return async (ev: React.FormEvent) => {
    ev.preventDefault();
    store.dispatch(startUpdate());
    const result = await updateSettings(user);

    result.match({
      err: (e) => store.dispatch(updateErrors(e)),
      ok: (user) => {
        store.dispatch(loadUser(user));
        location.hash = '/';
      },
    });
  };
}

function _logout() {
  delete axios.defaults.headers.Authorization;
  localStorage.removeItem('token');
  store.dispatch(logout());
  location.hash = '/';
}
