/* eslint-disable @typescript-eslint/no-explicit-any */
import { dispatchOnCall, store } from '../../../state/store';
import { useStoreWithInitializer } from '../../../state/storeHooks';
import { buildGenericFormField } from '../../../types/genericFormField';
import { GenericForm } from '../../GenericForm/GenericForm';
import {
  initializeRegister,
  RegisterState,
  startSigningUp,
  updateErrors,
  updateField,
} from './Register.slice';
import { loadUserIntoApp, UserForRegistration } from '../../../types/user';
import { signUp } from '../../../services/services';
import { ContainerPage } from '../../ContainerPage/ContainerPage';
import logo from '../../../imgs/tobyme.png';
import { tryCatch } from 'ramda';
import useToastCustom from '../../../hooks/useToastCustom';
import { Link, useHistory } from 'react-router-dom';
import { AuthStyled } from '../../../styles/AuthStyled';
import { Button, LinearProgress, TextField } from '@material-ui/core';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

const schema = yup
  .object({
    username: yup.string().required('Tên hiển thị không được bỏ trống'),
    email: yup.string().required('Email không được bỏ trống').email('Email không đúng định dạng'),
    password: yup
      .string()
      .required('Mật khẩu không được bỏ trống')
      .min(8, 'Mật khẩu tối thiểu 8 ký tự')
      .max(32, 'Mật khẩu tối đa 32 ký tự'),
  })
  .required();

const schemaOTP = yup
  .object({
    otp: yup.string().required('Hãy nhập mã OTP'),
  })
  .required();

const STEP = {
  REGISTER: {
    value: 1,
    title: 'Đăng ký',
  },
  CONFIRM: {
    value: 2,
    title: 'Xác nhận đăng ký',
  },
};

export function Register() {
  const { errors, signingUp, user } = useStoreWithInitializer(
    ({ register }) => register,
    dispatchOnCall(initializeRegister())
  );
  const { notifyError } = useToastCustom();
  const history = useHistory();

  // confirm otp
  const [step, setStep] = useState(STEP.REGISTER);
  const [emailConfirm, setEmailConfirm] = useState('');

  // register
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors: errorsRegisterForm },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // confirm otp
  const {
    register: confirmRegister,
    handleSubmit: confirmHandleSubmit,
    trigger: confirmTrigger,
    reset: confirmReset,
    formState: { errors: errorsConfirmForm },
  } = useForm({
    resolver: yupResolver(schemaOTP),
  });

  async function onSignUp(user: UserForRegistration) {
    try {
      const result = await signUp(user);

      result.match({
        err: (e) => store.dispatch(updateErrors(e)),
        ok: (user) => {
          // history.push('/');
          // handle verify
        },
      });
    } catch (error) {
      notifyError('Đăng ký thất bại', 'Hãy thử lại');
      history.push('/register');
    }
  }

  const onSubmitRegister = async (data: any) => {
    const isValid = await trigger();

    if (isValid) {
      const user: UserForRegistration = {
        email: data.email,
        password: data.password,
        username: data.username,
      };
      setEmailConfirm(user.email);
      setStep(STEP.CONFIRM);
      confirmReset();
      console.log('🚀 -> onSubmit -> user:', user);
      onSignUp(user);
    }
  };

  const onSubmitConfirmOTP = async (data: any) => {
    console.log('🚀 -> onSubmitConfirmOTP -> data:', data);
  };

  return (
    <AuthStyled className='auth-page'>
      <ContainerPage>
        <div className='col-md-6 offset-md-3 col-xs-12'>
          <LinearProgress />
          <div className='text-xs-center'>
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
          </div>
          <br />
          <h1 className='text-xs-center'>{step.title}</h1>
          <p className='text-xs-center'>
            <Link to='/login'>Đã có tài khoản?</Link>
          </p>

          {step.value === STEP.REGISTER.value && (
            <>
              <form onSubmit={handleSubmit(onSubmitRegister)} id='register'>
                <TextField
                  fullWidth
                  variant='outlined'
                  label='Tên hiển thị'
                  placeholder='Tên hiển thị'
                  className='input-auth'
                  {...register('username')}
                />
                <p className='error-auth'>{errorsRegisterForm?.username?.message}</p>

                <TextField
                  fullWidth
                  variant='outlined'
                  label='Email'
                  placeholder='Email'
                  className='input-auth'
                  {...register('email')}
                />
                <p className='error-auth'>{errorsRegisterForm?.email?.message}</p>

                <TextField
                  fullWidth
                  type='password'
                  variant='outlined'
                  label='Mật khẩu'
                  placeholder='Mật khẩu'
                  className='input-auth'
                  {...register('password')}
                />
                <p className='error-auth'>{errorsRegisterForm?.password?.message}</p>

                <div className='wrapper-btn-auth'>
                  <Button
                    variant='contained'
                    size='large'
                    color='primary'
                    className='btn-auth'
                    type='submit'
                  >
                    Đăng ký
                  </Button>
                </div>
              </form>
            </>
          )}

          {/* step 2 */}

          {step.value === STEP.CONFIRM.value && (
            <>
              <Button color='primary' className='btn-auth' onClick={() => setStep(STEP.REGISTER)}>
                Nhập lại thông tin
              </Button>
              <TextField
                fullWidth
                label='Email'
                variant='outlined'
                className='input-auth'
                disabled
                value={emailConfirm}
              />

              <div className='auth-note'>
                Một mã OTP vào địa chỉ email của bạn. Để tiếp tục quá trình đăng ký, vui lòng truy
                cập vào hộp thư đến của bạn và lấy mã OTP. Sau khi nhận được mã, hãy quay lại trang
                đăng ký và nhập mã OTP vào phần cần thiết.
                <br />
                Nếu bạn không nhận được email chứa mã OTP trong vòng vài phút, xin vui lòng kiểm tra
                thư mục "Thư rác" hoặc "Spam" của bạn. Đôi khi, email có thể bị nhầm vào thư mục
                này.
              </div>

              <form onSubmit={confirmHandleSubmit(onSubmitConfirmOTP)} id='confirm-otp'>
                <TextField
                  fullWidth
                  variant='outlined'
                  className='input-auth'
                  type='number'
                  label='OTP code'
                  placeholder='OTP code'
                  {...confirmRegister('otp', {
                    onChange: (e) => {
                      const value = e.target.value.slice(0, 6);
                      e.target.value = value;
                    },
                  })}
                />
                <p className='error-auth'>{errorsConfirmForm?.otp?.message}</p>

                <div className='wrapper-btn-auth'>
                  <Button
                    variant='outlined'
                    size='large'
                    color='primary'
                    className='btn-auth btn-auth__outlined'
                  >
                    Gửi lại OTP
                  </Button>

                  <Button
                    variant='contained'
                    size='large'
                    color='primary'
                    className='btn-auth'
                    type='submit'
                  >
                    Xác nhận
                  </Button>
                </div>
              </form>
            </>
          )}

          {/* <hr />
          <GenericForm
            disabled={signingUp}
            formObject={user as unknown as Record<string, string>}
            submitButtonText='Đăng ký'
            errors={errors}
            onChange={onUpdateField}
            onSubmit={onSignUp(user)}
            fields={[
              buildGenericFormField({
                name: 'username',
                placeholder: 'Tên hiển thị',
              }),
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
//     updateField({ name: name as keyof RegisterState['user'], value })
//   );
// }
