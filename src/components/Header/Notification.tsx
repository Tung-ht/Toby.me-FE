/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {
  getAllNotification,
  getCountUnreadNotification,
  getSlugArticleById,
  getUsernameById,
  readAllNotifications,
  readNotification,
} from '../../services/services';
import { Notifications, TypeNotifications } from './notiTypes';
import { styled } from 'styled-components';
import { format } from 'date-fns';
import { Skeleton } from '@material-ui/lab';
import useToastCustom from '../../hooks/useToastCustom';

// ==============
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    PopperClass: {
      background: '#ffffff',
      boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
      borderRadius: 4,
      zIndex: 2,
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

function Notification() {
  const anchorRefNoti = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const { notifyError, notifyInfo, notifySuccess, notifyWarning } = useToastCustom();

  const classes = useStyles();

  const { user } = useStore(({ app }) => app);

  // validate token
  if (!user || !user.unwrap().token) {
    return null;
  }

  const [notifications, setNotifications] = useState<Array<Notifications>>([]);
  const [loadingNoti, setLoadingNoti] = useState(false);
  const [countUnread, setCountUnread] = useState(0);

  // handle ws

  useEffect(() => {
    // Tạo kết nối WebSocket với headers
    const socket = new WebSocket(`${setting.wsBaseUrl}?access_token=${user.unwrap().token}`);

    // Xử lý các sự kiện kết nối WebSocket
    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      // console.log('Received message:', event.data);

      const dataLastMessage = event.data;

      if (!dataLastMessage) return;

      const data = JSON.parse(dataLastMessage);

      switch (data?.cmd) {
        case 10:
          notifyInfo('Bình luận', data?.params?.message);
          setCountUnread((prev) => prev + 1);
          break;

        case 11:
          notifyInfo('Người theo dõi', data?.params?.message);
          setCountUnread((prev) => prev + 1);
          break;

        case 12:
          notifyInfo('Bài viết', data?.params?.message);
          setCountUnread((prev) => prev + 1);
          break;

        default:
          console.log('default', data);
          break;
      }
    };

    socket.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
    };

    return () => {
      // Đóng kết nối WebSocket khi component unmounts
      socket.close();
    };
  }, [user]);

  // end handle ws

  const handleToggle = () => {
    if (open === false) {
      handleGetAllNotifications();
      handleCountUnread();
    }
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
    } catch (error: any) {
      console.log('🚀 -> handleCountUnread -> error:', error);
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

  const handleNotificationFollow = async (notification: Notifications) => {
    try {
      const { data: username } = await getUsernameById(notification.fromUserId);

      if (notification.isRead === false) {
        const rs = await readNotification(notification.id);

        if (rs.status === 200) {
          handleGetAllNotifications();
          handleCountUnread();
        }
      }

      location.hash = `#/profile/${username}`;
    } catch (error: any) {
      const errorList = error?.response?.data?.errors?.body;

      if (errorList) {
        notifyError('', errorList.join(', '));
      }
    }
  };

  const handleNotificationLikePost = async (notification: Notifications) => {
    try {
      const { data: slug } = await getSlugArticleById(notification.postId);

      if (notification.isRead === false) {
        const rs = await readNotification(notification.id);

        if (rs.status === 200) {
          handleGetAllNotifications();
          handleCountUnread();
        }
      }

      location.hash = `#/article/${encodeURIComponent(slug)}`;
    } catch (error: any) {
      const errorList = error?.response?.data?.errors?.body;

      if (errorList) {
        notifyError('', errorList.join(', '));
      }
    }
  };

  const handleNotificationComment = async (notification: Notifications) => {
    try {
      const { data: slug } = await getSlugArticleById(notification.postId);

      if (notification.isRead === false) {
        const rs = await readNotification(notification.id);

        if (rs.status === 200) {
          handleGetAllNotifications();
          handleCountUnread();
        }
      }

      location.hash = `#/article/${encodeURIComponent(slug)}/${notification.commentId}`;
    } catch (error: any) {
      const errorList = error?.response?.data?.errors?.body;

      if (errorList) {
        notifyError('', errorList.join(', '));
      }
    }
  };

  const handleReadAllNotification = async () => {
    if (notifications.length === 0) {
      return;
    }

    const userId = user.unwrap().id;
    if (!userId || userId === -1) {
      return;
    }

    try {
      const rs = await readAllNotifications(userId);

      if (rs.status === 200) {
        handleGetAllNotifications();
        handleCountUnread();
      }
    } catch (error) {
      console.log('🚀 -> handleReadAllNotification -> error:', error);
    }
  };

  useEffect(() => {
    handleGetAllNotifications();
    handleCountUnread();
  }, []);

  return (
    <div style={{ display: 'inline-block' }}>
      <IconButton
        ref={anchorRefNoti}
        aria-controls={open ? 'menu-list-notification' : undefined}
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
                id='menu-list-notification'
                onKeyDown={handleListKeyDown}
                style={{ width: 300 }}
              >
                {notifications.length === 0 && (
                  <div className='p-2' style={{ textAlign: 'center' }}>
                    Không có thông báo nào
                  </div>
                )}

                {notifications.map((item) => (
                  <MenuItemStyled
                    key={item.id}
                    onClick={(e) => {
                      handleClose(e);
                      handleClickNotification(item);
                    }}
                    className={item.isRead ? '' : 'unread'}
                  >
                    <div className='d-flex justify-content-start'>
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
                <Button
                  size='small'
                  color='primary'
                  style={{ textTransform: 'none' }}
                  onClick={handleReadAllNotification}
                >
                  Đánh giấu tất cả đã đọc
                </Button>
              </div>
            </>
          </ClickAwayListener>
        )}
      </Popper>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            zIndex: 1,
            opacity: 0,
          }}
          onClick={handleClose}
        ></div>
      )}
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
