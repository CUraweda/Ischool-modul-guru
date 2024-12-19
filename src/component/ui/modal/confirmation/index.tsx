type Props = {
  title: string;
  message: string;
  onConfirm: () => void;
};

function ConfirmModal({ title, message, onConfirm }: Props) {
  return (
    <dialog id="confirm_modal" className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-4">{message}</p>
        <div className="flex justify-end space-x-2">
          <button className="btn btn-sm btn-primary text-white" onClick={onConfirm}>
            Konfirmasi
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default ConfirmModal;
