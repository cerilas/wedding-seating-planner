import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

const useUiStore = create((set) => ({
  confirmDialog: {
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Onayla',
    cancelText: 'Vazgeç',
    variant: 'danger',
    onConfirm: null,
  },
  toasts: [],

  openConfirm: ({ title, message, confirmText = 'Onayla', cancelText = 'Vazgeç', variant = 'danger', onConfirm }) =>
    set({
      confirmDialog: {
        isOpen: true,
        title,
        message,
        confirmText,
        cancelText,
        variant,
        onConfirm,
      },
    }),

  closeConfirm: () =>
    set((state) => ({
      confirmDialog: {
        ...state.confirmDialog,
        isOpen: false,
        onConfirm: null,
      },
    })),

  confirmAction: () =>
    set((state) => {
      state.confirmDialog.onConfirm?.();
      return {
        confirmDialog: {
          ...state.confirmDialog,
          isOpen: false,
          onConfirm: null,
        },
      };
    }),

  pushToast: ({ message, type = 'info', duration = 3000 }) =>
    set((state) => ({
      toasts: [...state.toasts, { id: uuidv4(), message, type, duration }],
    })),

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));

export default useUiStore;
