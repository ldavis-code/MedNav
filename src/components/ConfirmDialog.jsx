import { useState, useEffect, useRef, useCallback } from 'react';
import { AlertTriangle, X, CheckCircle, Info, AlertCircle } from 'lucide-react';

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircle,
  info: Info,
  error: AlertCircle,
  confirm: AlertTriangle
};

const colorMap = {
  warning: { bg: 'bg-amber-100', icon: 'text-amber-600', button: 'bg-amber-600 hover:bg-amber-700' },
  success: { bg: 'bg-emerald-100', icon: 'text-emerald-600', button: 'bg-emerald-600 hover:bg-emerald-700' },
  info: { bg: 'bg-blue-100', icon: 'text-blue-600', button: 'bg-blue-600 hover:bg-blue-700' },
  error: { bg: 'bg-red-100', icon: 'text-red-600', button: 'bg-red-600 hover:bg-red-700' },
  confirm: { bg: 'bg-amber-100', icon: 'text-amber-600', button: 'bg-red-600 hover:bg-red-700' }
};

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'confirm',
  showCancel = true
}) {
  const dialogRef = useRef(null);
  const confirmButtonRef = useRef(null);
  const cancelButtonRef = useRef(null);
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      document.body.style.overflow = 'hidden';

      setTimeout(() => {
        if (showCancel && cancelButtonRef.current) {
          cancelButtonRef.current.focus();
        } else if (confirmButtonRef.current) {
          confirmButtonRef.current.focus();
        }
      }, 50);
    } else {
      document.body.style.overflow = '';
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, showCancel]);

  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }

    if (e.key === 'Tab') {
      const focusableElements = dialogRef.current?.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  const Icon = iconMap[type] || AlertTriangle;
  const colors = colorMap[type] || colorMap.confirm;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        role="status"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {title}: {message}
      </div>

      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Close dialog"
        >
          <X size={20} aria-hidden="true" />
        </button>

        <div className="flex justify-center mb-4">
          <div className={`${colors.bg} p-3 rounded-full`}>
            <Icon size={28} className={colors.icon} aria-hidden="true" />
          </div>
        </div>

        <h2
          id="confirm-dialog-title"
          className="text-xl font-bold text-slate-900 text-center mb-3"
        >
          {title}
        </h2>

        <p
          id="confirm-dialog-description"
          className="text-slate-600 text-center mb-6 leading-relaxed"
        >
          {message}
        </p>

        <div className="flex gap-3 justify-center">
          {showCancel && (
            <button
              ref={cancelButtonRef}
              onClick={onClose}
              className="flex-1 py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors focus:outline-none focus:ring-4 focus:ring-slate-300 min-h-[44px]"
            >
              {cancelText}
            </button>
          )}
          <button
            ref={confirmButtonRef}
            onClick={handleConfirm}
            className={`flex-1 py-3 px-6 ${colors.button} text-white font-semibold rounded-xl transition-colors focus:outline-none focus:ring-4 focus:ring-opacity-50 min-h-[44px] ${
              type === 'confirm' ? 'focus:ring-red-300' :
              type === 'success' ? 'focus:ring-emerald-300' :
              type === 'warning' ? 'focus:ring-amber-300' :
              type === 'error' ? 'focus:ring-red-300' :
              'focus:ring-blue-300'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export function useConfirmDialog() {
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'confirm',
    showCancel: true,
    resolve: null
  });

  const showConfirm = useCallback(({
    title = 'Confirm',
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'confirm'
  }) => {
    return new Promise((resolve) => {
      setDialogState({
        isOpen: true,
        title,
        message,
        confirmText,
        cancelText,
        type,
        showCancel: true,
        resolve
      });
    });
  }, []);

  const showAlert = useCallback(({
    title = 'Notice',
    message,
    confirmText = 'OK',
    type = 'info'
  }) => {
    return new Promise((resolve) => {
      setDialogState({
        isOpen: true,
        title,
        message,
        confirmText,
        cancelText: '',
        type,
        showCancel: false,
        resolve
      });
    });
  }, []);

  const handleClose = useCallback(() => {
    if (dialogState.resolve) {
      dialogState.resolve(false);
    }
    setDialogState(prev => ({ ...prev, isOpen: false }));
  }, [dialogState.resolve]);

  const handleConfirm = useCallback(() => {
    if (dialogState.resolve) {
      dialogState.resolve(true);
    }
    setDialogState(prev => ({ ...prev, isOpen: false }));
  }, [dialogState.resolve]);

  const DialogComponent = (
    <ConfirmDialog
      isOpen={dialogState.isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title={dialogState.title}
      message={dialogState.message}
      confirmText={dialogState.confirmText}
      cancelText={dialogState.cancelText}
      type={dialogState.type}
      showCancel={dialogState.showCancel}
    />
  );

  return { showConfirm, showAlert, DialogComponent };
}
