import { Fragment, useRef, useState } from 'react';
import { HashRouter, NavLink } from 'react-router-dom';
import { useStore } from '../../state/storeHooks';
import { User } from '../../types/user';
import logo from '../../imgs/tobyme.png';
import { HeaderStyled } from './HeaderStyled';
import {
  Button,
  Popper,
  MenuItem,
  MenuList,
  IconButton,
  ClickAwayListener,
  makeStyles,
  createStyles,
  Divider,
} from '@material-ui/core';
import { styled } from 'styled-components';
import { Theme } from 'reapop';
import axios from 'axios';
import { store } from '../../state/store';
import { logout } from '../App/App.slice';
import { ADMIN } from '../../config/role';

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
        {icon && <i className={icon} style={{ fontSize: 20 }}></i>}&nbsp;
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

// ==============
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    PopperClass: {
      background: '#ffffff',
      boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
      borderRadius: 4,
      zIndex: 1,
    },
  })
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function UserLinks({ user: { username, image } }: { user: any }) {
  const { user } = useStore(({ app }) => app);
  const userRole = user.isSome() && user.map((x) => x.roles).unwrap();

  const anchorRef = useRef<HTMLButtonElement>(null);
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  function _logout() {
    delete axios.defaults.headers.Authorization;
    localStorage.removeItem('token');
    store.dispatch(logout());
    location.hash = '/';
  }

  return (
    <Fragment>
      <NavItem text='Viết bài' href='/editor' icon='ion-compose' />

      <IconButton
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup='true'
        onClick={handleToggle}
        color='primary'
        component='span'
        className='py-1 px-3 ms-2'
      >
        <div className='d-flex align-items-center'>
          <div className='me-2' style={{ fontSize: '18px', fontWeight: 600 }}>
            {username}
          </div>
          <img
            src={image}
            alt={username}
            style={{ width: '34px', height: '34px', borderRadius: '50%' }}
          />
        </div>
      </IconButton>

      <Popper
        color='primary'
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        className={classes.PopperClass}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <MenuList autoFocusItem={open} id='menu-list-grow' onKeyDown={handleListKeyDown}>
            <MenuItem onClick={handleClose}>
              <div className='nav-item'>
                <NavLink
                  exact
                  to={`/profile/${username}`}
                  activeClassName='active'
                  className='nav-link'
                >
                  <i className={'ion-ios-person'} style={{ fontSize: 20 }}></i>&nbsp; Trang cá nhân
                </NavLink>
              </div>
            </MenuItem>

            <MenuItem onClick={handleClose}>
              <div className='nav-item'>
                <NavLink exact to={`/settings`} activeClassName='active' className='nav-link'>
                  <i className={'ion-gear-a'} style={{ fontSize: 20 }}></i>&nbsp; Tài khoản
                </NavLink>
              </div>
            </MenuItem>

            {userRole && userRole.includes(ADMIN) && (
              <MenuItem onClick={handleClose}>
                <div className='nav-item'>
                  <NavLink
                    exact
                    to={`/${username}/approve-article`}
                    activeClassName='active'
                    className='nav-link'
                  >
                    <i className={'ion-android-done-all'} style={{ fontSize: 20 }}></i>&nbsp; Duyệt
                    bài
                  </NavLink>
                </div>
              </MenuItem>
            )}

            <Divider />

            <MenuItem
              onClick={(e) => {
                handleClose(e);
                _logout();
              }}
            >
              <div className='nav-link'>
                <i className='ion-reply-all' style={{ fontSize: 20 }}></i>&nbsp;Đăng xuất
              </div>
            </MenuItem>
          </MenuList>
        </ClickAwayListener>
      </Popper>
    </Fragment>
  );
}
