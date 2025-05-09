import Modal from "../../component/modal";
import { MdCloudUpload, MdLibraryBooks } from "react-icons/md";
import { TiPlus } from "react-icons/ti";

const NilaiSiswa = () => {
  const showModal = () => {
    const modalElement = document.getElementById(
      "upload-nilai"
    ) as HTMLDialogElement;
    if (modalElement) {
      modalElement.showModal();
    }
  };
  
  return (
    <div>
      <div className="flex justify-center w-full mt-5 flex-col items-center">
        <span className="text-3xl font-bold">Daftar Nilai Siswa </span>
        <span className="text-xl">kelas II</span>
        <div className="w-full justify-between flex px-5 mt-10">
          <select className="select select-primary w-32 max-w-xs">
            <option disabled selected>
              Mapel
            </option>
            <option>IPA</option>
            <option>IPS</option>
            <option>MTK</option>
            <option>PKN</option>
          </select>
          <div className="flex gap-2 ">
            <button
              className="btn bg-green-500 text-white text-2xl"
              onClick={showModal}
            >
              <MdCloudUpload />
            </button>
            <button
              className="btn bg-blue-500 text-white text-2xl"
              onClick={showModal}
            >
              <TiPlus />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto my-5 w-full p-5 bg-white">
          <table className="table shadow-lg">
            {/* head */}
            <thead className="bg-blue-400 text-white">
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Mapel</th>
                <th>Nilai</th>
                <th>Keterangan</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr>
                <th>1</th>
                <td>Cy Ganderton</td>
                <td>MTK</td>
                <td>98</td>
                <td>-</td>
                <td>
                  <button className="btn text-2xl text-blue-700 btn-ghost">
                    <MdLibraryBooks />
                  </button>
                </td>
              </tr>
              <tr>
                <th>2</th>
                <td>Nama 2</td>
                <td>MTK</td>
                <td>98</td>
                <td>-</td>
                <td>
                  <button className="btn text-2xl text-blue-700 btn-ghost">
                    <MdLibraryBooks />
                  </button>
                </td>
              </tr>
              <tr>
                <th>3</th>
                <td>nama 3</td>
                <td>MTK</td>
                <td>98</td>
                <td>-</td>
                <td>
                  <button className="btn text-2xl text-blue-700 btn-ghost">
                    <MdLibraryBooks />
                  </button>
                </td>
              </tr>
              <tr>
                <th>4</th>
                <td>nama 4</td>
                <td>MTK</td>
                <td>98</td>
                <td>-</td>
                <td>
                  <button className="btn text-2xl text-blue-700 btn-ghost">
                    <MdLibraryBooks />
                  </button>
                </td>
              </tr>
              <tr>
                <th>5</th>
                <td>nama 5</td>
                <td>MTK</td>
                <td>98</td>
                <td>-</td>
                <td>
                  <button className="btn text-2xl text-blue-700 btn-ghost">
                    <MdLibraryBooks />
                  </button>
                </td>
              </tr>
              <tr>
                <th>6</th>
                <td>nama 6</td>
                <td>MTK</td>
                <td>98</td>
                <td>-</td>
                <td>
                  <button className="btn text-2xl text-blue-700 btn-ghost">
                    <MdLibraryBooks />
                  </button>
                </td>
              </tr>
              <tr>
                <th>7</th>
                <td>nama7</td>
                <td>MTK</td>
                <td>98</td>
                <td>-</td>
                <td>
                  <button className="btn text-2xl text-blue-700 btn-ghost">
                    <MdLibraryBooks />
                  </button>
                </td>
              </tr>
              <tr>
                <th>8</th>
                <td>nama 8</td>
                <td>MTK</td>
                <td>98</td>
                <td>-</td>
                <td>
                  <button className="btn text-2xl text-blue-700 btn-ghost">
                    <MdLibraryBooks />
                  </button>
                </td>
              </tr>
              <tr>
                <th>9</th>
                <td>nama 9</td>
                <td>MTK</td>
                <td>98</td>
                <td>-</td>
                <td>
                  <button className="btn text-2xl text-blue-700 btn-ghost">
                    <MdLibraryBooks />
                  </button>
                </td>
              </tr>
              <tr>
                <th>10</th>
                <td>nama 10</td>
                <td>MTK</td>
                <td>98</td>
                <td>-</td>
                <td>
                  <button className="btn text-2xl text-blue-700 btn-ghost">
                    <MdLibraryBooks />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Modal id="upload-nilai">
        <div className="w-full flex flex-col items-center">
          <span className="text-xl font-bold">Upload Nilai</span>
          <div className="w-full mt-5 gap-2 flex flex-col">
            <button className="btn btn-sm w-1/3 bg-green-300">
              dowload template
            </button>
            <label className="mt-4 font-bold">Upload File</label>
            <input
              type="file"
              className="file-input file-input-bordered w-full"
            />
          </div>

          <div className="w-full flex justify-center mt-10 gap-2">
            <button className="btn bg-green-500 text-white font-bold w-full">
              Submit
            </button>
            {/* <button className="btn bg-green-500 text-white font-bold">Submit</button> */}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NilaiSiswa;
