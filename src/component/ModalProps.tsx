import React, { FC } from "react";

interface Props {
  id: string;
  children: React.ReactNode;
  width?: string;
  onClose?: () => void;
}

const openModal = (id: string) => {
  const modal = document.getElementById(id) as HTMLDialogElement;
  modal?.showModal();
};

const closeModal = (id: string) => {
  const modal = document.getElementById(id) as HTMLDialogElement;
  modal?.close();
};

const Modal: FC<Props> = ({ id, children, onClose = () => {} }) => {
  return (
    <div>
      <dialog id={id} onClose={onClose} className="modal modal-middle">
        <div className={`modal-box w-11/12 max-w-2xl bg-white`}>
          <form method="dialog" onSubmit={onClose}>
            <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
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
export default Modal;
