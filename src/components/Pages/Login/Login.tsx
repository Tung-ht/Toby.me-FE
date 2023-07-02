/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { login } from '../../../services/services';
import { dispatchOnCall, store } from '../../../state/store';
import { useStoreWithInitializer } from '../../../state/storeHooks';
import { loadUserIntoApp } from '../../../types/user';
import { buildGenericFormField } from '../../../types/genericFormField';
import { GenericForm } from '../../GenericForm/GenericForm';
import {
  initializeLogin,
  LoginState,
  startLoginIn,
  updateErrors,
  updateField,
} from './Login.slice';
import { ContainerPage } from '../../ContainerPage/ContainerPage';
import logo from '../../../imgs/tobyme.png';
import useToastCustom from '../../../hooks/useToastCustom';
import { Link, useHistory } from 'react-router-dom';
import { Button, LinearProgress, TextField } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { styled } from 'styled-components';
import { AuthStyled } from '../../../styles/AuthStyled';
import LayoutAuth from '../../LayoutAuth';

const schema = yup
  .object({
    email: yup.string().required('Email không được bỏ trống'),
    password: yup.string().required('Password không được bỏ trống'),
  })
  .required();

export function Login() {
  const { errors, loginIn, user } = useStoreWithInitializer(
    ({ login }) => login,
    dispatchOnCall(initializeLogin())
  );
  const { notifyError } = useToastCustom();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    trigger,
    formState: { errors: errorsLoginForm },
  } = useForm({
    resolver: yupResolver(schema),
  });

  async function signIn(email: string, password: string) {
    setLoading(true);
    try {
      if (store.getState().login.loginIn) return;

      const result = await login(email, password);

      result.match({
        ok: (user) => {
          history.push('/');
          loadUserIntoApp(user);
        },
        err: (e) => {
          const errorList = e?.body;
          if (errorList) {
            notifyError('Đăng nhập thất bại', errorList.join(', '));
          } else {
            notifyError('Đăng nhập thất bại', 'Hãy thử lại');
          }
        },
      });
    } catch (error) {
      notifyError('Đăng nhập thất bại', 'Hãy thử lại');
      history.push('/login');
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (data: any) => {
    const isValid = await trigger();

    if (isValid) {
      signIn(data.email, data.password);
    }
  };

  return (
    <AuthStyled className='auth-page'>
      <ContainerPage>
        <div className='col-md-6 offset-md-3 col-xs-12'>
          {loading && <LinearProgress />}

          {/* <div className='text-xs-center'>
            <img src={logo} style={{ height: '150px', width: '150px' }} />
          </div>
          <div
            className='navbar-brand'
            style={{
              float: 'none',
              marginTop: '-40px',
              marginRight: '0',
              textAlign: 'center',
            }}
          >
            Toby.me
          </div> */}
          <br />
          <h1 className='text-xs-center'>Đăng nhập</h1>
          <p className='text-xs-center'>
            <Link to='/register'>Chưa có tài khoản?</Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              variant='outlined'
              placeholder='Email'
              label='Email'
              {...register('email')}
              className='input-auth'
            />
            <p className='error-auth'>{errorsLoginForm?.email?.message}</p>

            <TextField
              fullWidth
              variant='outlined'
              label='Mật khẩu'
              placeholder='Mật khẩu'
              {...register('password')}
              type='password'
              className='input-auth'
            />
            <p className='error-auth'>{errorsLoginForm?.password?.message}</p>

            <div className='wrapper-btn-auth'>
              <Button
                variant='contained'
                size='large'
                color='primary'
                className='btn-auth'
                type='submit'
                disabled={loading}
              >
                Đăng nhập
              </Button>
            </div>
          </form>

          {/* <GenericForm
            disabled={loginIn}
            formObject={user}
            submitButtonText='Đăng nhập'
            errors={errors}
            onChange={onUpdateField}
            onSubmit={signIn}
            fields={[
              buildGenericFormField({ name: 'email', placeholder: 'Email' }),
              buildGenericFormField({
                name: 'password',
                placeholder: 'Mật khẩu',
                type: 'password',
              }),
            ]}
          /> */}
        </div>
      </ContainerPage>
    </AuthStyled>
  );
}

// function onUpdateField(name: string, value: string) {
//   store.dispatch(
//     updateField({ name: name as keyof LoginState['user'], value })
//   );
// }
