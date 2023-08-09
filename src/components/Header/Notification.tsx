import {
  Badge,
  Button,
  ClickAwayListener,
  IconButton,
  MenuItem,
  MenuList,
  Popper,
  createStyles,
  makeStyles,
  withStyles,
} from '@material-ui/core';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Theme } from 'reapop';

import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useStore } from '../../state/storeHooks';
import setting from '../../config/settings';
import { getAllNotification, getCountUnreadNotification } from '../../services/services';
import { Notifications, TypeNotifications } from './notiTypes';
import { styled } from 'styled-components';
import { format } from 'date-fns';
import { Skeleton } from '@material-ui/lab';

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

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: 0,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}))(Badge);

// eslint-disable-next-line no-var
declare var WebSocket: {
  prototype: WebSocket;
  new (
    uri: string,
    protocols?: string | string[] | null,
    options?: {
      headers: { [headerName: string]: string };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [optionName: string]: any;
    } | null
  ): WebSocket;
  readonly CLOSED: number;
  readonly CLOSING: number;
  readonly CONNECTING: number;
  readonly OPEN: number;
};

function Notification() {
  const anchorRefNoti = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const classes = useStyles();

  const { user } = useStore(({ app }) => app);

  // validate token
  if (!user || !user.unwrap().token) {
    return null;
  }

  const [notifications, setNotifications] = useState<Array<Notifications>>([]);
  const [loadingNoti, setLoadingNoti] = useState(false);
  const [countUnread, setCountUnread] = useState(0);

  // useWebSocket(`${setting.wsBaseUrl}?access_token=${user.unwrap().token}`, {
  //   onOpen: () => {
  //     console.log('WebSocket connection established.');
  //   },
  // });

  // try {
  //   const socket = new WebSocket(`${setting.wsBaseUrl}?access_token=${user.unwrap().token}`, []);
  //   console.log('🚀 -> Notification -> socket:', socket);
  // } catch (error) {
  //   console.log('🚀 -> Notification -> error:', error);
  // }
  // const { sendMessage, lastMessage, readyState } = useWebSocket(`${setting.wsBaseUrl}`, {
  //   queryParams: {
  //     access_token: user.unwrap().token,
  //   },
  //   protocols: ['0'],
  //   onOpen: () => console.log('Connected ws!'),
  //   onError(event) {
  //     console.log('Connect ws failed:', event);
  //   },
  // });

  // const connectionStatus = {
  //   [ReadyState.CONNECTING]: 'Connecting',
  //   [ReadyState.OPEN]: 'Open',
  //   [ReadyState.CLOSING]: 'Closing',
  //   [ReadyState.CLOSED]: 'Closed',
  //   [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  // }[readyState];

  // console.log('🚀 -> Notification -> connectionStatus:', connectionStatus);

  // const ws = new WebSocket(`${setting.wsBaseUrl}?access_token=${user.unwrap().token}`, null, {
  //   headers: {
  //     ['ngrok-skip-browser-warning']: 'any value',
  //     Origin: 'cookie',
  //   },
  // });
  // console.log('🚀 -> ws -> ws:', ws);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (anchorRefNoti.current && anchorRefNoti.current.contains(event.target as HTMLElement)) {
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

  const handleGetAllNotifications = async () => {
    const userId = user.unwrap().id;
    if (!userId || userId === -1) {
      return;
    }

    try {
      setLoadingNoti(true);
      const { data } = await getAllNotification(userId);

      setNotifications(data as Array<Notifications>);
    } catch (error) {
      console.log('🚀 - handleGetAllNotifications - error: ', error);
    } finally {
      setLoadingNoti(false);
    }
  };

  const handleCountUnread = async () => {
    const userId = user.unwrap().id;
    if (!userId || userId === -1) {
      return;
    }

    try {
      const { data } = await getCountUnreadNotification(userId);

      setCountUnread(data);
    } catch (error) {
      console.log('🚀 - handleCountUnread - error: ', error);
    }
  };

  const handleClickNotification = (notification: Notifications) => {
    if (notification.type === TypeNotifications.COMMENT) {
      return handleNotificationComment(notification);
    }

    if (notification.type === TypeNotifications.FOLLOW) {
      return handleNotificationFollow(notification);
    }

    if (notification.type === TypeNotifications.LIKE_POST) {
      return handleNotificationLikePost(notification);
    }
  };

  const handleNotificationFollow = (notification: Notifications) => {
    console.log('🚀 - handleNotificationFollow - notification: ', notification);
  };

  const handleNotificationLikePost = (notification: Notifications) => {
    console.log('🚀 - handleNotificationLikePost - notification: ', notification);
  };

  const handleNotificationComment = (notification: Notifications) => {
    console.log('🚀 - handleNotificationComment - notification: ', notification);
  };

  useEffect(() => {
    handleGetAllNotifications();
    handleCountUnread();
  }, [user]);

  return (
    <div style={{ display: 'inline-block' }}>
      <IconButton
        ref={anchorRefNoti}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup='true'
        onClick={handleToggle}
        color='primary'
        component='span'
        className='py-0 px-2 ms-2'
      >
        <StyledBadge
          badgeContent={countUnread}
          color='secondary'
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          overlap='rectangular'
        >
          {/* <div className='d-flex align-items-center'>hhihi</div> */}
          <i className={'ion-ios-bell'} style={{ fontSize: 30, height: 40 }}></i>
        </StyledBadge>
      </IconButton>

      <Popper
        color='primary'
        open={open}
        anchorEl={anchorRefNoti.current}
        role={undefined}
        transition
        disablePortal
        className={classes.PopperClass}
      >
        <div
          className='px-2 py-1'
          style={{
            borderBottom: '1px solid #cdcdcd',
            fontWeight: 600,
          }}
        >
          <i className={'ion-ios-bell'} style={{ fontSize: 20, color: '#4caf50' }}></i> Thông báo
        </div>

        {loadingNoti ? (
          <div style={{ width: 300 }}>
            <Skeleton variant='text' height={80} />
            <Skeleton variant='text' height={80} />
            <Skeleton variant='text' height={80} />
          </div>
        ) : (
          <ClickAwayListener onClickAway={handleClose}>
            <>
              <MenuListStyled
                autoFocusItem={open}
                id='menu-list-grow'
                onKeyDown={handleListKeyDown}
              >
                {notifications.map((item) => (
                  <MenuItemStyled
                    key={item.id}
                    onClick={(e) => {
                      handleClose(e);
                      handleClickNotification(item);
                    }}
                    className='unread'
                  >
                    <div className='d-flex justify-content-center'>
                      <div className='me-2'>
                        {item.type === TypeNotifications.FOLLOW && (
                          <i
                            className='ion-plus-round'
                            style={{ fontSize: '20px', color: '#4caf50' }}
                          ></i>
                        )}
                        {item.type === TypeNotifications.COMMENT && (
                          <i
                            className='ion-ios-chatbubble'
                            style={{ fontSize: '20px', color: '#727272' }}
                          ></i>
                        )}
                        {item.type === TypeNotifications.LIKE_POST && (
                          <i
                            className='ion-heart'
                            style={{ fontSize: '20px', color: '#f50057' }}
                          ></i>
                        )}
                      </div>
                      <div className='message'>{item.message}</div>
                    </div>
                    <div className='time-noti'>
                      {format(new Date(item.createdAt), 'hh:mm - dd/MM/yyyy')}
                    </div>
                  </MenuItemStyled>
                ))}
              </MenuListStyled>

              <div
                className='d-flex justify-content-center'
                style={{ borderTop: '1px solid #cdcdcd' }}
              >
                <Button size='small' color='primary' style={{ textTransform: 'none' }}>
                  Đánh giấu tất cả đã đọc
                </Button>
              </div>
            </>
          </ClickAwayListener>
        )}
      </Popper>
    </div>
  );
}

export default Notification;

const MenuListStyled = styled(MenuList)`
  background-color: #f0f2f5;
  max-height: 300px;
  overflow-y: auto;
  padding: 4px 8px !important;

  /* width */
  &::-webkit-scrollbar {
    width: 4px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: #ffffff;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: #b1b1b1;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #858484;
  }
`;

const MenuItemStyled = styled(MenuItem)`
  width: 300px;
  max-width: 300px;
  background-color: #ffffff !important;
  margin-bottom: 8px !important;
  border-radius: 4px !important;
  max-height: 90px;

  flex-direction: column;
  justify-content: space-between !important;
  align-items: start !important;

  transition: all 0.5s ease-in-out;

  .message {
    white-space: normal;
    font-size: 14px;
  }

  .time-noti {
    width: 100%;
    font-size: 12px;
    text-align: right;
    color: #5c5c5c;
  }

  &:hover {
    /* opacity: 0.7; */
    background-color: #e6ffe6 !important;
  }

  &.unread {
    font-weight: 600;
  }
`;
