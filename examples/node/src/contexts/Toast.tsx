import { Toast } from '@shopify/polaris'
import { createContext, useCallback, useContext, useReducer } from 'react'
import { childrenProps, toastAction, toastState } from '../types/Types'

export const ToastContext = createContext<toastState>({} as toastState)
export const ToastDispatchContext =
  createContext<React.Dispatch<toastAction> | null>(null)

const defaultMessage: toastState = {
  type: 'success',
  active: false,
  message: 'Something happened!',
}

const emptyMessage: toastState = {
  type: '',
  active: false,
  message: '',
}

export function ToastProvider({ children }: childrenProps) {
  const [message, dispatch] = useReducer(toastReducer, defaultMessage)

  const toggleActive = useCallback(() => dispatch(emptyMessage), [])

  const toastMarkup =
    message.active && message.message ? (
      <Toast
        content={message.message}
        onDismiss={toggleActive}
        duration={4500}
      />
    ) : null

  return (
    <ToastContext.Provider value={message}>
      <ToastDispatchContext.Provider value={dispatch}>
        {children}
        {toastMarkup}
      </ToastDispatchContext.Provider>
    </ToastContext.Provider>
  )
}

function toastReducer<S>(_state: S, action: toastAction): toastState {
  switch (action?.type) {
    case 'success': {
      return {
        ...defaultMessage,
        message: action.message ?? defaultMessage.message,
        active: true,
      }
    }
    case 'error': {
      return {
        message: action.message ?? 'Something went wrong..',
        type: 'error',
        active: true,
      }
    }
    default: {
      return defaultMessage
    }
  }
}

export function useToast() {
  return useContext(ToastContext)
}

export function useToastDispatch() {
  return useContext(ToastDispatchContext)
}
