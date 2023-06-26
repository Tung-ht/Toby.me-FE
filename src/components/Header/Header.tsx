import { Fragment } from 'react';
import { HashRouter, NavLink } from 'react-router-dom';
import { useStore } from '../../state/storeHooks';
import { User } from '../../types/user';
import logo from '../../imgs/tobyme.png';
import { HeaderStyled } from './HeaderStyled';

export function Header() {
  const { user } = useStore(({ app }) => app);

  return (
    <HeaderStyled className='navbar navbar-light'>
      <div className='container'>
        <a className='navbar-brand' style={{ marginRight: '0' }} href='/#/'>
          Toby.me
        </a>
        <img src={logo} style={{ height: '40px', width: '40px' }} />
        <ul className='nav navbar-nav pull-xs-right'>
          <HashRouter>
            <NavItem text='Trang chính' icon='ion-home' href='/' />

            {user.match({
              none: () => <GuestLinks />,
              some: (user) => <UserLinks user={user} />,
            })}
          </HashRouter>
        </ul>
      </div>
    </HeaderStyled>
  );
}

function NavItem({ text, href, icon }: { text: string; href: string; icon?: string }) {
  return (
    <li className='nav-item'>
      <NavLink exact to={href} activeClassName='active' className='nav-link'>
        {icon && <i className={icon}></i>}&nbsp;
        {text}
      </NavLink>
    </li>
  );
}

function GuestLinks() {
  return (
    <Fragment>
      <NavItem text='Đăng nhập' href='/login' icon='ion-log-in' />
      <NavItem text='Đăng ký' href='/register' icon='ion-wand' />
    </Fragment>
  );
}

function UserLinks({ user: { username } }: { user: User }) {
  return (
    <Fragment>
      <NavItem text='Viết bài' href='/editor' icon='ion-compose' />
      <NavItem text='Tài khoản' href='/settings' icon='ion-gear-a' />
      <NavItem text={`${username}`} href={`/profile/${username}`} />
    </Fragment>
  );
}
