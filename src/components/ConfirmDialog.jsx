import useUiStore from '../uiStore';

export default function ConfirmDialog() {
  const { confirmDialog, closeConfirm, confirmAction } = useUiStore();

  if (!confirmDialog.isOpen) return null;

  return (
    <div className="confirm-overlay" onClick={closeConfirm}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{confirmDialog.title}</h3>
        <p>{confirmDialog.message}</p>

        <div className="confirm-actions">
          <button className="btn btn-secondary" onClick={closeConfirm}>
            {confirmDialog.cancelText}
          </button>
          <button
            className={`btn ${confirmDialog.variant === 'danger' ? 'btn-danger' : 'btn-primary'}`}
            onClick={confirmAction}
          >
            {confirmDialog.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
