export type ToastType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'

export interface ToastItem {
  id: string
  type: ToastType
  title?: string
  message: string
  duration: number
}

export function useToast() {
  const toasts = useState<ToastItem[]>(
    'toast',
    () => [],
  )

  function show(
    message: string,
    type: ToastType = 'info',
    options?: {
      title?: string
      duration?: number
    },
  ) {
    const toast: ToastItem = {
      id: crypto.randomUUID(),
      type,
      title: options?.title,
      message,
      duration: options?.duration ?? 4000,
    }

    toasts.value.push(toast)

    if (toast.duration > 0) {
      setTimeout(() => {
        remove(toast.id)
      }, toast.duration)
    }

    return toast.id
  }

  function success(
    message: string,
    options?: {
      title?: string
      duration?: number
    },
  ) {
    return show(message, 'success', {
      title: options?.title ?? 'Success',
      duration: options?.duration,
    })
  }

  function error(
    message: string,
    options?: {
      title?: string
      duration?: number
    },
  ) {
    return show(message, 'error', {
      title: options?.title ?? 'Error',
      duration: options?.duration ?? 5000,
    })
  }

  function warning(
    message: string,
    options?: {
      title?: string
      duration?: number
    },
  ) {
    return show(message, 'warning', {
      title: options?.title ?? 'Warning',
      duration: options?.duration,
    })
  }

  function info(
    message: string,
    options?: {
      title?: string
      duration?: number
    },
  ) {
    return show(message, 'info', {
      title: options?.title ?? 'Information',
      duration: options?.duration,
    })
  }

  function remove(id: string) {
    toasts.value = toasts.value.filter(
      toast => toast.id !== id,
    )
  }

  function clear() {
    toasts.value = []
  }

  return {
    toasts,
    show,
    success,
    error,
    warning,
    info,
    remove,
    clear,
  }
}