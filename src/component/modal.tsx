import React, { FC } from "react";

interface Props {
  id: string;
  children: React.ReactNode;
  width?: string;
  onClose?: () => void;
}

const openModal = (id: string, fun?: () => void) => {
  const modal = document.getElementById(id) as HTMLDialogElement;
  if (modal) {
    modal.showModal();
    fun?.();
  }
};

const closeModal = (id: string, fun?: () => void) => {
  const modal = document.getElementById(id) as HTMLDialogElement;
  if (modal) {
    modal.close();
    fun?.();
  }
};

const modal: FC<Props> = ({ id, children, width, onClose = () => {} }) => {
  return (
    <div>
      <dialog id={id} onClose={onClose} className="modal modal-middle">
        <div className={`modal-box bg-white ${width} `}>
          <form method="dialog" onSubmit={onClose}>
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="text-black">{children}</div>
        </div>
      </dialog>
    </div>
  );
};

export { closeModal, openModal };
export default modal;
