import  { Toast } from '@shopify/polaris';
import { createContext, useCallback, useContext, useReducer } from 'react';
import { childrenProps, reducerAction } from '../Types'

export const ToastContext = createContext({});
export const ToastDispatchContext = createContext({});

const defaultMessage = {
  active: false,
  type: 'success',
  message: 'Something happened!'
}

const emptyMessage = {
  active: false,
  type: '',
  message: ''
}

export function ToastProvider({ children }: childrenProps) {
  const [message, dispatch] = useReducer(
    toastReducer,
    defaultMessage
  );

  const toggleActive = useCallback(() => dispatch(emptyMessage), []);

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

function toastReducer(_info: any, action: reducerAction) {
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