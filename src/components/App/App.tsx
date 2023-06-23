import axios from 'axios';
import { Fragment } from 'react';
import { HashRouter, Redirect, Route, RouteProps, Switch } from 'react-router-dom';
import NotificationsSystem, { atalhoTheme, useNotifications } from 'reapop';
import { getUser } from '../../services/services';
import { store } from '../../state/store';
import { useStoreWithInitializer } from '../../state/storeHooks';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import { ArticlePage } from '../Pages/ArticlePage/ArticlePage';
import { EditArticle } from '../Pages/EditArticle/EditArticle';
import { Home } from '../Pages/Home/Home';
import { Login } from '../Pages/Login/Login';
import { NewArticle } from '../Pages/NewArticle/NewArticle';
import { ProfilePage } from '../Pages/ProfilePage/ProfilePage';
import { Register } from '../Pages/Register/Register';
import { Settings } from '../Pages/Settings/Settings';
import { endLoad, loadUser } from './App.slice';

export function App() {
  const { loading, user } = useStoreWithInitializer(({ app }) => app, load);
  const { notifications, dismissNotification } = useNotifications();

  const userIsLogged = user.isSome();

  return (
    <HashRouter>
      <NotificationsSystem
        notifications={notifications}
        dismissNotification={(id) => dismissNotification(id)}
        theme={atalhoTheme}
      />
      {!loading && (
        <Fragment>
          <Header />
          <Switch>
            <GuestOnlyRoute exact path='/login' userIsLogged={userIsLogged}>
              <Login />
            </GuestOnlyRoute>
            <GuestOnlyRoute exact path='/register' userIsLogged={userIsLogged}>
              <Register />
            </GuestOnlyRoute>
            <UserOnlyRoute exact path='/settings' userIsLogged={userIsLogged}>
              <Settings />
            </UserOnlyRoute>
            <UserOnlyRoute exact path='/editor' userIsLogged={userIsLogged}>
              <NewArticle />
            </UserOnlyRoute>
            <UserOnlyRoute exact path='/editor/:slug' userIsLogged={userIsLogged}>
              <EditArticle />
            </UserOnlyRoute>
            <Route path='/profile/:username'>
              <ProfilePage />
            </Route>
            <Route path='/article/:slug'>
              <ArticlePage />
            </Route>
            <Route exact path='/'>
              <Home />
            </Route>
            <Route path='*'>
              <Redirect to='/' />
            </Route>
          </Switch>
          <Footer />
        </Fragment>
      )}
    </HashRouter>
  );
}

async function load() {
  const token = localStorage.getItem('token');
  if (!store.getState().app.loading || !token) {
    store.dispatch(endLoad());
    return;
  }
  axios.defaults.headers.Authorization = `Token ${token}`;

  try {
    store.dispatch(loadUser(await getUser()));
  } catch {
    store.dispatch(endLoad());
  }
}

function GuestOnlyRoute({
  children,
  userIsLogged,
  ...rest
}: { children: JSX.Element | JSX.Element[]; userIsLogged: boolean } & RouteProps) {
  return (
    <Route {...rest}>
      {children}
      {userIsLogged && <Redirect to='/' />}
    </Route>
  );
}

function UserOnlyRoute({
  children,
  userIsLogged,
  ...rest
}: { children: JSX.Element | JSX.Element[]; userIsLogged: boolean } & RouteProps) {
  return (
    <Route {...rest}>
      {children}
      {!userIsLogged && <Redirect to='/' />}
    </Route>
  );
}
