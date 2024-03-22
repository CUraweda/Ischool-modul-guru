import { FaPencilAlt, FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { MdCloudUpload } from "react-icons/md";
import { Link } from "react-router-dom";
import Modal from "../../component/modal";

const RaportNarasi = () => {
  const showModal = (props: string) => {
    let modalElement = document.getElementById(`${props}`) as HTMLDialogElement;
    if (modalElement) {
      modalElement.showModal();
    }
  };
  return (
    <>
      <div className="p-5">
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <Link to={"/guru/rapor-siswa"}>
                <a>Siswa</a>
              </Link>
            </li>
            <li>
              <Link to={"/guru/rapor-siswa"}>
                <a>Raport Siswa</a>
              </Link>
            </li>
            <li>Narasi</li>
          </ul>
        </div>
        <div className="w-full mt-10 ">
          <div className="text-right">
            <div className="flex items-center w-full justify-end gap-3">
              <select className="select w-32 max-w-md select-bordered">
                <option disabled selected>
                  Sub Narasi
                </option>
                <option>Akhlak</option>
                <option>Tahsin</option>
                <option>Kepemimpinan</option>
              </select>

              <div className="join">
                <button
                  className="btn join-item bg-green-500 text-white"
                  onClick={() => showModal("upload-narasi")}
                >
                  <span className="text-2xl">
                    <MdCloudUpload />
                  </span>
                  Upload
                </button>
              </div>
            </div>
          </div>
          <div>
            <div className="flex gap-2 w-1/2">
              <div className="w-1/4">Nama</div>
              <div className="w-3/5">: Nama Siswa</div>
            </div>
            <div className="flex gap-2 w-1/2">
              <div className="w-1/4">Kelas</div>
              <div className="w-3/5">: VII</div>
            </div>
            <div className="flex gap-2 w-1/2">
              <div className="w-1/4">Sub Narasi</div>
              <div className="w-3/5">: TAHSIN</div>
            </div>
          </div>
          <div className="max-h-[600px] overflow-auto pb-10 ">
            <div className="w-full p-2 mt-5 rounded-md shadow-lg bg-white">
              <div className="sticky top-0 bg-white z-10 py-3">
                <div className="divider divider-success text-2xl font-bold">
                  Al-Qur'an
                </div>
                <div className="text-right">
                  <button
                    className="btn btn-sm join-item bg-blue-500 text-white"
                    onClick={() => showModal("tambah-narasi")}
                  >
                    <span className="text-xl">
                      <FaPlus />
                    </span>
                    Tambah
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto mt-5">
                <table className="table table-md">
                  <thead>
                    <tr className="bg-blue-300 ">
                      <th>No</th>
                      <th>Keterangan</th>
                      <th className="text-center">Nilai</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>1</th>
                      <td className="max-w-96">
                        Mampu melafadzkan ta’awudz dan basmallah dengan 3M
                        (Mangap, meringis, monyong) dan mampu mengikuti intonasi
                        nada bacaan yang di contohkan pembimbing
                      </td>
                      <td className="flex justify-center items-center">
                        <div className="flex justify-between gap-1">
                          <div className="form-control">
                            <label className="label flex gap-1">
                              <span className="label-text">Jayyid</span>
                              <div className="w-5 h-5 bg-blue-200 rounded-full" />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label flex gap-1">
                              <span className="label-text">Jayyid Jiddan</span>
                              <div className="w-5 h-5 bg-blue-800 rounded-full" />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label flex gap-1">
                              <span className="label-text">Mumtaz</span>
                              <div className="w-5 h-5 bg-blue-200 rounded-full" />
                            </label>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="join">
                          <button
                            className="btn btn-sm join-item bg-yellow-500 text-white tooltip"
                            data-tip="edit"
                          >
                            <span className="text-xl">
                              <FaPencilAlt />
                            </span>
                          </button>
                          <button
                            className="btn btn-sm join-item bg-red-500 text-white tooltip"
                            data-tip="hapus"
                          >
                            <span className="text-xl">
                              <FaRegTrashAlt />
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>1</th>
                      <td className="max-w-96">
                        Mampu melafadzkan ta’awudz dan basmallah dengan 3M
                        (Mangap, meringis, monyong) dan mampu mengikuti intonasi
                        nada bacaan yang di contohkan pembimbing
                      </td>
                      <td className="flex justify-center items-center">
                        <div className="flex justify-between gap-1">
                          <div className="form-control">
                            <label className="label flex gap-1">
                              <span className="label-text">Jayyid</span>
                              <div className="w-5 h-5 bg-blue-200 rounded-full" />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label flex gap-1">
                              <span className="label-text">Jayyid Jiddan</span>
                              <div className="w-5 h-5 bg-blue-800 rounded-full" />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label flex gap-1">
                              <span className="label-text">Mumtaz</span>
                              <div className="w-5 h-5 bg-blue-200 rounded-full" />
                            </label>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="join">
                          <button
                            className="btn btn-sm join-item bg-yellow-500 text-white tooltip"
                            data-tip="edit"
                          >
                            <span className="text-xl">
                              <FaPencilAlt />
                            </span>
                          </button>
                          <button
                            className="btn btn-sm join-item bg-red-500 text-white tooltip"
                            data-tip="hapus"
                          >
                            <span className="text-xl">
                              <FaRegTrashAlt />
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>1</th>
                      <td className="max-w-96">
                        Mampu melafadzkan ta’awudz dan basmallah dengan 3M
                        (Mangap, meringis, monyong) dan mampu mengikuti intonasi
                        nada bacaan yang di contohkan pembimbing
                      </td>
                      <td className="flex justify-center items-center">
                        <div className="flex justify-between gap-1">
                          <div className="form-control">
                            <label className="label flex gap-1">
                              <span className="label-text">Jayyid</span>
                              <div className="w-5 h-5 bg-blue-200 rounded-full" />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label flex gap-1">
                              <span className="label-text">Jayyid Jiddan</span>
                              <div className="w-5 h-5 bg-blue-800 rounded-full" />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label flex gap-1">
                              <span className="label-text">Mumtaz</span>
                              <div className="w-5 h-5 bg-blue-200 rounded-full" />
                            </label>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="join">
                          <button
                            className="btn btn-sm join-item bg-yellow-500 text-white tooltip"
                            data-tip="edit"
                          >
                            <span className="text-xl">
                              <FaPencilAlt />
                            </span>
                          </button>
                          <button
                            className="btn btn-sm join-item bg-red-500 text-white tooltip"
                            data-tip="hapus"
                          >
                            <span className="text-xl">
                              <FaRegTrashAlt />
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                   
                  </tbody>
                </table>
              </div>
            </div>
            <div className="w-full p-2 mt-5 rounded-md shadow-lg bg-white">
              <div className="sticky top-0 bg-white z-10 py-3">
                <div className="divider divider-success text-2xl font-bold">
                  Al-Qur'an
                </div>
                <div className="text-right">
                  <button
                    className="btn btn-sm join-item bg-blue-500 text-white"
                    onClick={() => showModal("tambah-narasi")}
                  >
                    <span className="text-xl">
                      <FaPlus />
                    </span>
                    Tambah
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto mt-5">
                <table className="table table-md">
                  <thead>
                    <tr className="bg-blue-300 ">
                      <th>No</th>
                      <th>Keterangan</th>
                      <th className="text-center">Nilai</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>1</th>
                      <td className="max-w-96">
                        Mampu melafadzkan ta’awudz dan basmallah dengan 3M
                        (Mangap, meringis, monyong) dan mampu mengikuti intonasi
                        nada bacaan yang di contohkan pembimbing
                      </td>
                      <td className="flex justify-center items-center">
                        <div className="flex justify-between gap-1">
                          <div className="form-control">
                            <label className="label flex gap-1">
                              <span className="label-text">Jayyid</span>
                              <div className="w-5 h-5 bg-blue-200 rounded-full" />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label flex gap-1">
                              <span className="label-text">Jayyid Jiddan</span>
                              <div className="w-5 h-5 bg-blue-800 rounded-full" />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label flex gap-1">
                              <span className="label-text">Mumtaz</span>
                              <div className="w-5 h-5 bg-blue-200 rounded-full" />
                            </label>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="join">
                          <button
                            className="btn btn-sm join-item bg-yellow-500 text-white tooltip"
                            data-tip="edit"
                          >
                            <span className="text-xl">
                              <FaPencilAlt />
                            </span>
                          </button>
                          <button
                            className="btn btn-sm join-item bg-red-500 text-white tooltip"
                            data-tip="hapus"
                          >
                            <span className="text-xl">
                              <FaRegTrashAlt />
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>1</th>
                      <td className="max-w-96">
                        Mampu melafadzkan ta’awudz dan basmallah dengan 3M
                        (Mangap, meringis, monyong) dan mampu mengikuti intonasi
                        nada bacaan yang di contohkan pembimbing
                      </td>
                      <td className="flex justify-center items-center">
                        <div className="flex justify-between gap-1">
                          <div className="form-control">
                            <label className="label flex gap-1">
                              <span className="label-text">Jayyid</span>
                              <div className="w-5 h-5 bg-blue-200 rounded-full" />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label flex gap-1">
                              <span className="label-text">Jayyid Jiddan</span>
                              <div className="w-5 h-5 bg-blue-800 rounded-full" />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label flex gap-1">
                              <span className="label-text">Mumtaz</span>
                              <div className="w-5 h-5 bg-blue-200 rounded-full" />
                            </label>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="join">
                          <button
                            className="btn btn-sm join-item bg-yellow-500 text-white tooltip"
                            data-tip="edit"
                          >
                            <span className="text-xl">
                              <FaPencilAlt />
                            </span>
                          </button>
                          <button
                            className="btn btn-sm join-item bg-red-500 text-white tooltip"
                            data-tip="hapus"
                          >
                            <span className="text-xl">
                              <FaRegTrashAlt />
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>1</th>
                      <td className="max-w-96">
                        Mampu melafadzkan ta’awudz dan basmallah dengan 3M
                        (Mangap, meringis, monyong) dan mampu mengikuti intonasi
                        nada bacaan yang di contohkan pembimbing
                      </td>
                      <td className="flex justify-center items-center">
                        <div className="flex justify-between gap-1">
                          <div className="form-control">
                            <label className="label flex gap-1">
                              <span className="label-text">Jayyid</span>
                              <div className="w-5 h-5 bg-blue-200 rounded-full" />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label flex gap-1">
                              <span className="label-text">Jayyid Jiddan</span>
                              <div className="w-5 h-5 bg-blue-800 rounded-full" />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label flex gap-1">
                              <span className="label-text">Mumtaz</span>
                              <div className="w-5 h-5 bg-blue-200 rounded-full" />
                            </label>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="join">
                          <button
                            className="btn btn-sm join-item bg-yellow-500 text-white tooltip"
                            data-tip="edit"
                          >
                            <span className="text-xl">
                              <FaPencilAlt />
                            </span>
                          </button>
                          <button
                            className="btn btn-sm join-item bg-red-500 text-white tooltip"
                            data-tip="hapus"
                          >
                            <span className="text-xl">
                              <FaRegTrashAlt />
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                   
                  </tbody>
                </table>
              </div>
            </div>
            <div className="w-full p-2 mt-5 rounded-md shadow-lg bg-white">
              <div className="sticky top-0 bg-white z-10 py-3">
                <div className="divider divider-success text-2xl font-bold">
                  Al-Qur'an
                </div>
                <div className="text-right">
                  <button
                    className="btn btn-sm join-item bg-blue-500 text-white"
                    onClick={() => showModal("tambah-narasi")}
                  >
                    <span className="text-xl">
                      <FaPlus />
                    </span>
                    Tambah
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto mt-5">
                <table className="table table-md">
                  <thead>
                    <tr className="bg-blue-300 ">
                      <th>No</th>
                      <th>Keterangan</th>
                      <th className="text-center">Nilai</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>1</th>
                      <td className="max-w-96">
                        Mampu melafadzkan ta’awudz dan basmallah dengan 3M
                        (Mangap, meringis, monyong) dan mampu mengikuti intonasi
                        nada bacaan yang di contohkan pembimbing
                      </td>
                      <td className="flex justify-center items-center">
                        <div className="flex justify-between gap-1">
                          <div className="form-control">
                            <label className="label flex gap-1">
                              <span className="label-text">Jayyid</span>
                              <div className="w-5 h-5 bg-blue-200 rounded-full" />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label flex gap-1">
                              <span className="label-text">Jayyid Jiddan</span>
                              <div className="w-5 h-5 bg-blue-800 rounded-full" />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label flex gap-1">
                              <span className="label-text">Mumtaz</span>
                              <div className="w-5 h-5 bg-blue-200 rounded-full" />
                            </label>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="join">
                          <button
                            className="btn btn-sm join-item bg-yellow-500 text-white tooltip"
                            data-tip="edit"
                          >
                            <span className="text-xl">
                              <FaPencilAlt />
                            </span>
                          </button>
                          <button
                            className="btn btn-sm join-item bg-red-500 text-white tooltip"
                            data-tip="hapus"
                          >
                            <span className="text-xl">
                              <FaRegTrashAlt />
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>1</th>
                      <td className="max-w-96">
                        Mampu melafadzkan ta’awudz dan basmallah dengan 3M
                        (Mangap, meringis, monyong) dan mampu mengikuti intonasi
                        nada bacaan yang di contohkan pembimbing
                      </td>
                      <td className="flex justify-center items-center">
                        <div className="flex justify-between gap-1">
                          <div className="form-control">
                            <label className="label flex gap-1">
                              <span className="label-text">Jayyid</span>
                              <div className="w-5 h-5 bg-blue-200 rounded-full" />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label flex gap-1">
                              <span className="label-text">Jayyid Jiddan</span>
                              <div className="w-5 h-5 bg-blue-800 rounded-full" />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label flex gap-1">
                              <span className="label-text">Mumtaz</span>
                              <div className="w-5 h-5 bg-blue-200 rounded-full" />
                            </label>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="join">
                          <button
                            className="btn btn-sm join-item bg-yellow-500 text-white tooltip"
                            data-tip="edit"
                          >
                            <span className="text-xl">
                              <FaPencilAlt />
                            </span>
                          </button>
                          <button
                            className="btn btn-sm join-item bg-red-500 text-white tooltip"
                            data-tip="hapus"
                          >
                            <span className="text-xl">
                              <FaRegTrashAlt />
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>1</th>
                      <td className="max-w-96">
                        Mampu melafadzkan ta’awudz dan basmallah dengan 3M
                        (Mangap, meringis, monyong) dan mampu mengikuti intonasi
                        nada bacaan yang di contohkan pembimbing
                      </td>
                      <td className="flex justify-center items-center">
                        <div className="flex justify-between gap-1">
                          <div className="form-control">
                            <label className="label flex gap-1">
                              <span className="label-text">Jayyid</span>
                              <div className="w-5 h-5 bg-blue-200 rounded-full" />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label flex gap-1">
                              <span className="label-text">Jayyid Jiddan</span>
                              <div className="w-5 h-5 bg-blue-800 rounded-full" />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label flex gap-1">
                              <span className="label-text">Mumtaz</span>
                              <div className="w-5 h-5 bg-blue-200 rounded-full" />
                            </label>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="join">
                          <button
                            className="btn btn-sm join-item bg-yellow-500 text-white tooltip"
                            data-tip="edit"
                          >
                            <span className="text-xl">
                              <FaPencilAlt />
                            </span>
                          </button>
                          <button
                            className="btn btn-sm join-item bg-red-500 text-white tooltip"
                            data-tip="hapus"
                          >
                            <span className="text-xl">
                              <FaRegTrashAlt />
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                   
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal id="upload-narasi">
        <div className="w-full flex flex-col items-center">
          <span className="text-xl font-bold">Upload Raport Narasi</span>
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
      <Modal id="tambah-narasi">
        <div className="w-full flex flex-col items-center">
          <span className="text-xl font-bold">Tambah Raport Narasi</span>
          <div className="w-full mt-5 gap-2 flex flex-col">
            <label className="mt-4 font-bold">Keterangan</label>
            <input
              type="text"
              placeholder="Keterangan"
              className="input input-bordered w-full"
            />
          </div>
          <div className="w-full gap-2 flex flex-col">
            <label className="mt-4 font-bold">Nilai</label>
            <select className="select join-item w-full select-bordered">
              <option disabled selected>
                Nilai
              </option>
              <option>Jayyid</option>
              <option>Jayyid Jiddan</option>
              <option>Mumtaz</option>
            </select>
          </div>

          <div className="w-full flex justify-center mt-10 gap-2">
            <button className="btn bg-green-500 text-white font-bold w-full">
              Submit
            </button>
            {/* <button className="btn bg-green-500 text-white font-bold">Submit</button> */}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RaportNarasi;
