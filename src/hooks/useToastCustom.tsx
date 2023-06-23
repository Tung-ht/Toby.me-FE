import React from 'react';
import { useNotifications } from 'reapop';

function useToastCustom() {
  const { notify } = useNotifications();

  const notifySuccess = (title = '', message = '') => {
    notify(message, 'success', { title });
  };

  const notifyError = (title = '', message = '') => {
    notify(message, 'error', { title });
  };

  const notifyWarning = (title = '', message = '') => {
    notify(message, 'warning', { title });
  };

  const notifyInfo = (title = '', message = '') => {
    notify(message, 'info', { title });
  };

  return { notifySuccess, notifyError, notifyWarning, notifyInfo };
}

export default useToastCustom;
