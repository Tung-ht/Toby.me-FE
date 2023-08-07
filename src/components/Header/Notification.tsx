import {
  ClickAwayListener,
  IconButton,
  MenuItem,
  MenuList,
  Popper,
  createStyles,
  makeStyles,
} from '@material-ui/core';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Theme } from 'reapop';

import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useStore } from '../../state/storeHooks';
import setting from '../../config/settings';

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

function Notification() {
  const anchorRefNoti = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const classes = useStyles();

  const { user } = useStore(({ app }) => app);

  // validate token
  if (!user || !user.unwrap().token) {
    return null;
  }

  // useWebSocket(`${setting.wsBaseUrl}?access_token=${user.unwrap().token}`, {
  //   onOpen: () => {
  //     console.log('WebSocket connection established.');
  //   },
  // });

  const { sendMessage, lastMessage, readyState } = useWebSocket(`${setting.wsBaseUrl}`, {
    share: true,
    queryParams: {
      access_token: user.unwrap().token,
    },
    onOpen: () => console.log('Connected ws!'),
    onError(event) {
      console.log('Connect ws failed:', event);
    },
  });

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  console.log('🚀 -> Notification -> connectionStatus:', connectionStatus);

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

  return (
    <div style={{ display: 'inline-block' }}>
      <IconButton
        ref={anchorRefNoti}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup='true'
        onClick={handleToggle}
        color='primary'
        component='span'
        className='py-1 px-3 ms-2'
      >
        {/* <div className='d-flex align-items-center'>hhihi</div> */}
        <i className={'ion-ios-bell'} style={{ fontSize: 20 }}></i>
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
        <ClickAwayListener onClickAway={handleClose}>
          <MenuList autoFocusItem={open} id='menu-list-grow' onKeyDown={handleListKeyDown}>
            <MenuItem onClick={handleClose}>
              <div>noti noti</div>
            </MenuItem>
          </MenuList>
        </ClickAwayListener>
      </Popper>
    </div>
  );
}

export default Notification;
