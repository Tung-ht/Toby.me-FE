/* eslint-disable @typescript-eslint/no-explicit-any */
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, LinearProgress, TextField } from '@material-ui/core';
import jwt_decode from 'jwt-decode';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import * as yup from 'yup';
import useToastCustom from '../../../hooks/useToastCustom';
import { getUserLogin, login } from '../../../services/services';
import { dispatchOnCall, store } from '../../../state/store';
import { useStoreWithInitializer } from '../../../state/storeHooks';
import { AuthStyled } from '../../../styles/AuthStyled';
import { loadUserIntoApp } from '../../../types/user';
import { loadUser } from '../../App/App.slice';
import { ContainerPage } from '../../ContainerPage/ContainerPage';
import { initializeLogin } from './Login.slice';

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

      const token = await login(email, password);

      const resultDecoded: any = await jwt_decode(token);

      const user = {
        token: token,
        email: resultDecoded.sub,
        username: '',
        bio: '',
        image: '',
        roles: [],
      };

      loadUserIntoApp(user);

      store.dispatch(loadUser(await getUserLogin(token)));

      history.push('/');

      // const rs = Ok(user);
      // console.log('🚀 -> signIn -> rs:', rs);

      // rs.match({
      //   ok: (user) => {
      //   },
      //   err: (e: any) => {
      //     const errorList = e?.body;
      //     if (errorList) {
      //       notifyError('Đăng nhập thất bại', errorList.join(', '));
      //     } else {
      //       notifyError('Đăng nhập thất bại', 'Hãy thử lại');
      //     }
      //   },
      // });
    } catch (error: any) {
      console.log('🚀 -> signIn -> error:', error);
      const errorList = error?.response?.data?.errors?.body;
      if (errorList) {
        notifyError('Đăng nhập thất bại', errorList.join(', '));
      } else {
        notifyError('Đăng nhập thất bại', 'Hãy thử lại');
      }
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
        <div className='col-md-6 offset-md-3 col-xs-12 pb-4  wrapper-auth'>
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
