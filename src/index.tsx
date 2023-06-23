import ReactDOM from 'react-dom';
import './index.css';

import 'react-quill/dist/quill.snow.css';

import { App } from './components/App/App';
import { ThemeProvider, createTheme } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { NotificationsProvider, setUpNotifications } from 'reapop';

const theme = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: green[500],
    },
    secondary: {
      // This is green.A700 as hex.
      main: '#11cb5f',
    },
  },
});

setUpNotifications({
  defaultProps: {
    position: 'top-right',
    dismissible: true,
    dismissAfter: 10000,
  },
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <NotificationsProvider>
      <App />
    </NotificationsProvider>
  </ThemeProvider>,
  document.getElementById('root')
);
