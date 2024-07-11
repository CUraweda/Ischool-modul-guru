import React, { useRef, useState } from "react";

import { FaFileUpload } from "react-icons/fa";
import Modal from "../../component/modal";
import { IoDocumentTextOutline } from "react-icons/io5";

const ODFYC = () => {
  const [fileUrl, setFileUrl] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showModal = (props: string) => {
    let modalElement = document.getElementById(props) as HTMLDialogElement;
    if (modalElement) {
      modalElement.showModal();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Generate a URL for the file
      const newFileUrl = URL.createObjectURL(file);
      setFileUrl(newFileUrl);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full p-3">
      <div className="flex w-full flex-col justify-center items-center p-3">
        <span className="font-bold text-xl">ONE DAY FOR YOUR COUNTRY</span>
      </div>
      <div className="flex w-full justify-center items-center bg-white p-3 rounded-md">
        <div className="overflow-x-auto w-full">
          <table className="table table-zebra">
            {/* head */}
            <thead className="bg-blue-400">
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Aktivitas</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr>
                <th>1</th>
                <td>Cy Ganderton</td>
                <td>Quality Control Specialist</td>
                <td>Done</td>
                <td>
                  <div className="w-full flex gap-3">
                    <button
                      className="btn btn-ghost bg-red-500 text-white btn-sm text-md"
                      onClick={() => showModal("upload-sertifikat")}
                    >
                      <FaFileUpload />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Modal id={"upload-sertifikat"}>
        <div className="w-full flex justify-center flex-col items-center gap-3">
          <span className="text-xl font-bold">Upload Sertifikat</span>
          {!fileUrl && (
            <div
              className="w-full h-96 rounded-md flex flex-col justify-center items-center border-dashed border-2 border-sky-500 cursor-not-allowed"
              onClick={triggerFileInput}
            >
              <span className="text-5xl">
                <IoDocumentTextOutline />
              </span>
              <span>No preview Document</span>
            </div>
          )}

          {fileUrl && (
            <>
              <iframe
                src={fileUrl}
                frameBorder="0"
                width="100%"
                height="450px"
                className="mt-4"
                
              />
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="file-input file-input-bordered w-full"
            onChange={handleFileChange}
            accept=".pdf"
          />

          <button className="btn btn-ghost bg-green-500 text-white w-full">
            Simpan
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ODFYC;
