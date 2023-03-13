import { dispatchOnCall, store } from '../../../state/store';
import { useStoreWithInitializer } from '../../../state/storeHooks';
import { buildGenericFormField } from '../../../types/genericFormField';
import { GenericForm } from '../../GenericForm/GenericForm';
import { initializeRegister, RegisterState, startSigningUp, updateErrors, updateField } from './Register.slice';
import { loadUserIntoApp, UserForRegistration } from '../../../types/user';
import { signUp } from '../../../services/services';
import { ContainerPage } from '../../ContainerPage/ContainerPage';
import logo from '../../../imgs/tobyme.png';

export function Register() {
  const { errors, signingUp, user } = useStoreWithInitializer(
    ({ register }) => register,
    dispatchOnCall(initializeRegister())
  );

  return (
    <div className='auth-page'>
      <ContainerPage>
        <div className='col-md-6 offset-md-3 col-xs-12'>
          <div className='text-xs-center'>
            <img src={logo} style={{ height: '150px', width: '150px' }} />
          </div>
          <div
            className='navbar-brand'
            style={{ float: 'none', marginTop: '-40px', marginRight: '0', textAlign: 'center' }}
          >
            Toby.me
          </div>
          <br />
          <h1 className='text-xs-center'>Đăng kí</h1>
          <p className='text-xs-center'>
            <a href='/#/login'>Đã có tài khoản?</a>
          </p>

          <GenericForm
            disabled={signingUp}
            formObject={user as unknown as Record<string, string>}
            submitButtonText='Đăng kí'
            errors={errors}
            onChange={onUpdateField}
            onSubmit={onSignUp(user)}
            fields={[
              buildGenericFormField({ name: 'username', placeholder: 'Tên hiển thị' }),
              buildGenericFormField({ name: 'email', placeholder: 'Email' }),
              buildGenericFormField({ name: 'password', placeholder: 'Mật khẩu', type: 'password' }),
            ]}
          />
        </div>
      </ContainerPage>
    </div>
  );
}

function onUpdateField(name: string, value: string) {
  store.dispatch(updateField({ name: name as keyof RegisterState['user'], value }));
}

function onSignUp(user: UserForRegistration) {
  return async (ev: React.FormEvent) => {
    ev.preventDefault();
    store.dispatch(startSigningUp());
    const result = await signUp(user);

    result.match({
      err: (e) => store.dispatch(updateErrors(e)),
      ok: (user) => {
        location.hash = '#/';
        loadUserIntoApp(user);
      },
    });
  };
}
