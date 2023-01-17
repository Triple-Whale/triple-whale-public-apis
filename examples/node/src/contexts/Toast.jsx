import  {Toast, Button } from '@shopify/polaris';
import { createContext, useCallback, useContext, useState, useReducer } from 'react';

export const ToastContext = createContext({});
export const ToastDispatchContext = createContext(null);

const defaultMessage = {
  active: false,
  type: 'success',
  message: 'Something happened!'
}

export function ToastProvider({ children }) {
  const [message, dispatch] = useReducer(
    toastReducer,
    defaultMessage
  );

  const toggleActive = useCallback(() => dispatch());

  const toastMarkup = message.active ? (
    <Toast content={message.message} onDismiss={toggleActive} duration={4500} />
  ) : null;

  return (
    <ToastContext.Provider value={message}>
      <ToastDispatchContext.Provider value={dispatch}>
        {children}
        {toastMarkup}
      </ToastDispatchContext.Provider>
    </ToastContext.Provider>
  );
}

function toastReducer(info, action) {
  switch (action?.type) {
    case 'success': {
      return {
        ...defaultMessage,
        message: action.message ?? defaultMessage.message,
        active: true
      }
    }
    case 'error': {
      return {
        ...defaultMessage,
        message: action.message ?? 'Something went wrong..',
        type: 'error',
        active: true
      }
    }
    default: {
      return defaultMessage
    }
  }
}

export function useToast() {
  return useContext(ToastContext);
}

export function useToastDispatch() {
  return useContext(ToastDispatchContext);
}