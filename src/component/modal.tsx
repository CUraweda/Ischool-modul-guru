import React, { FC } from "react";

interface Props {
  id: string;
  children: React.ReactNode;
  width?: string
}

const modal: FC<Props> = ({ id, children, width }) => {
  return (
    <div>
      <dialog id={id} className="modal modal-middle">
        <div className={`modal-box bg-white ${width} scrollbar-hide`}>
          <form method="dialog">
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

export default modal;
