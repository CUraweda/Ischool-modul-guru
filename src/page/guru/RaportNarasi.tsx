
import { FaPlus } from "react-icons/fa";
import { MdCloudUpload } from "react-icons/md";
import { Link } from "react-router-dom";

const RaportNarasi = () => {
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
                <button className="btn join-item bg-green-500 text-white">
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
                  <button className="btn btn-sm join-item bg-blue-500 text-white">
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
                            <label className="label cursor-pointer">
                              <span className="label-text">Jayyid</span>
                              <input
                                type="radio"
                                name="radio-10"
                                className="radio checked:bg-red-500"
                                checked
                              />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text">Jayyid Jiddan</span>
                              <input
                                type="radio"
                                name="radio-10"
                                className="radio checked:bg-blue-500"
                                checked
                              />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text">Mumtaz</span>
                              <input
                                type="radio"
                                name="radio-10"
                                className="radio checked:bg-green-500"
                                checked
                              />
                            </label>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>2</th>
                      <td className="max-w-96">
                        Mampu melafadzkan ta’awudz dan basmallah dengan 3M
                        (Mangap, meringis, monyong) dan mampu mengikuti intonasi
                        nada bacaan yang di contohkan pembimbing
                      </td>
                      <td className="flex justify-center items-center">
                        <div className="flex justify-between gap-1">
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text">Jayyid</span>
                              <input
                                type="radio"
                                name="radio-10"
                                className="radio checked:bg-red-500"
                                checked
                              />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text">Jayyid Jiddan</span>
                              <input
                                type="radio"
                                name="radio-10"
                                className="radio checked:bg-blue-500"
                                checked
                              />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text">Mumtaz</span>
                              <input
                                type="radio"
                                name="radio-10"
                                className="radio checked:bg-green-500"
                                checked
                              />
                            </label>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>3</th>
                      <td className="max-w-96">
                        Mampu melafadzkan ta’awudz dan basmallah dengan 3M
                        (Mangap, meringis, monyong) dan mampu mengikuti intonasi
                        nada bacaan yang di contohkan pembimbing
                      </td>
                      <td className="flex justify-center items-center">
                        <div className="flex justify-between gap-1">
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text">Jayyid</span>
                              <input
                                type="radio"
                                name="radio-10"
                                className="radio checked:bg-red-500"
                                checked
                              />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text">Jayyid Jiddan</span>
                              <input
                                type="radio"
                                name="radio-10"
                                className="radio checked:bg-blue-500"
                                checked
                              />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text">Mumtaz</span>
                              <input
                                type="radio"
                                name="radio-10"
                                className="radio checked:bg-green-500"
                                checked
                              />
                            </label>
                          </div>
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
                  <button className="btn btn-sm join-item bg-blue-500 text-white">
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
                            <label className="label cursor-pointer">
                              <span className="label-text">Jayyid</span>
                              <input
                                type="radio"
                                name="radio-10"
                                className="radio checked:bg-red-500"
                                checked
                              />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text">Jayyid Jiddan</span>
                              <input
                                type="radio"
                                name="radio-10"
                                className="radio checked:bg-blue-500"
                                checked
                              />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text">Mumtaz</span>
                              <input
                                type="radio"
                                name="radio-10"
                                className="radio checked:bg-green-500"
                                checked
                              />
                            </label>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>2</th>
                      <td className="max-w-96">
                        Mampu melafadzkan ta’awudz dan basmallah dengan 3M
                        (Mangap, meringis, monyong) dan mampu mengikuti intonasi
                        nada bacaan yang di contohkan pembimbing
                      </td>
                      <td className="flex justify-center items-center">
                        <div className="flex justify-between gap-1">
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text">Jayyid</span>
                              <input
                                type="radio"
                                name="radio-10"
                                className="radio checked:bg-red-500"
                                checked
                              />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text">Jayyid Jiddan</span>
                              <input
                                type="radio"
                                name="radio-10"
                                className="radio checked:bg-blue-500"
                                checked
                              />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text">Mumtaz</span>
                              <input
                                type="radio"
                                name="radio-10"
                                className="radio checked:bg-green-500"
                                checked
                              />
                            </label>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>3</th>
                      <td className="max-w-96">
                        Mampu melafadzkan ta’awudz dan basmallah dengan 3M
                        (Mangap, meringis, monyong) dan mampu mengikuti intonasi
                        nada bacaan yang di contohkan pembimbing
                      </td>
                      <td className="flex justify-center items-center">
                        <div className="flex justify-between gap-1">
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text">Jayyid</span>
                              <input
                                type="radio"
                                name="radio-10"
                                className="radio checked:bg-red-500"
                                checked
                              />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text">Jayyid Jiddan</span>
                              <input
                                type="radio"
                                name="radio-10"
                                className="radio checked:bg-blue-500"
                                checked
                              />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text">Mumtaz</span>
                              <input
                                type="radio"
                                name="radio-10"
                                className="radio checked:bg-green-500"
                                checked
                              />
                            </label>
                          </div>
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
                  <button className="btn btn-sm join-item bg-blue-500 text-white">
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
                            <label className="label cursor-pointer">
                              <span className="label-text">Jayyid</span>
                              <input
                                type="radio"
                                name="radio-10"
                                className="radio checked:bg-red-500"
                                checked
                              />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text">Jayyid Jiddan</span>
                              <input
                                type="radio"
                                name="radio-10"
                                className="radio checked:bg-blue-500"
                                checked
                              />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text">Mumtaz</span>
                              <input
                                type="radio"
                                name="radio-10"
                                className="radio checked:bg-green-500"
                                checked
                              />
                            </label>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>2</th>
                      <td className="max-w-96">
                        Mampu melafadzkan ta’awudz dan basmallah dengan 3M
                        (Mangap, meringis, monyong) dan mampu mengikuti intonasi
                        nada bacaan yang di contohkan pembimbing
                      </td>
                      <td className="flex justify-center items-center">
                        <div className="flex justify-between gap-1">
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text">Jayyid</span>
                              <input
                                type="radio"
                                name="radio-10"
                                className="radio checked:bg-red-500"
                                checked
                              />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text">Jayyid Jiddan</span>
                              <input
                                type="radio"
                                name="radio-10"
                                className="radio checked:bg-blue-500"
                                checked
                              />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text">Mumtaz</span>
                              <input
                                type="radio"
                                name="radio-10"
                                className="radio checked:bg-green-500"
                                checked
                              />
                            </label>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>3</th>
                      <td className="max-w-96">
                        Mampu melafadzkan ta’awudz dan basmallah dengan 3M
                        (Mangap, meringis, monyong) dan mampu mengikuti intonasi
                        nada bacaan yang di contohkan pembimbing
                      </td>
                      <td className="flex justify-center items-center">
                        <div className="flex justify-between gap-1">
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text">Jayyid</span>
                              <input
                                type="radio"
                                name="radio-10"
                                className="radio checked:bg-red-500"
                                checked
                              />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text">Jayyid Jiddan</span>
                              <input
                                type="radio"
                                name="radio-10"
                                className="radio checked:bg-blue-500"
                                checked
                              />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text">Mumtaz</span>
                              <input
                                type="radio"
                                name="radio-10"
                                className="radio checked:bg-green-500"
                                checked
                              />
                            </label>
                          </div>
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
                  <button className="btn btn-sm join-item bg-blue-500 text-white">
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
                            <label className="label cursor-pointer">
                              <span className="label-text">Jayyid</span>
                              <input
                                type="radio"
                                name="radio-10"
                                className="radio checked:bg-red-500"
                                checked
                              />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text">Jayyid Jiddan</span>
                              <input
                                type="radio"
                                name="radio-10"
                                className="radio checked:bg-blue-500"
                                checked
                              />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text">Mumtaz</span>
                              <input
                                type="radio"
                                name="radio-10"
                                className="radio checked:bg-green-500"
                                checked
                              />
                            </label>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>2</th>
                      <td className="max-w-96">
                        Mampu melafadzkan ta’awudz dan basmallah dengan 3M
                        (Mangap, meringis, monyong) dan mampu mengikuti intonasi
                        nada bacaan yang di contohkan pembimbing
                      </td>
                      <td className="flex justify-center items-center">
                        <div className="flex justify-between gap-1">
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text">Jayyid</span>
                              <input
                                type="radio"
                                name="radio-10"
                                className="radio checked:bg-red-500"
                                checked
                              />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text">Jayyid Jiddan</span>
                              <input
                                type="radio"
                                name="radio-10"
                                className="radio checked:bg-blue-500"
                                checked
                              />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text">Mumtaz</span>
                              <input
                                type="radio"
                                name="radio-10"
                                className="radio checked:bg-green-500"
                                checked
                              />
                            </label>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>3</th>
                      <td className="max-w-96">
                        Mampu melafadzkan ta’awudz dan basmallah dengan 3M
                        (Mangap, meringis, monyong) dan mampu mengikuti intonasi
                        nada bacaan yang di contohkan pembimbing
                      </td>
                      <td className="flex justify-center items-center">
                        <div className="flex justify-between gap-1">
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text">Jayyid</span>
                              <input
                                type="radio"
                                name="radio-10"
                                className="radio checked:bg-red-500"
                                checked
                              />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text">Jayyid Jiddan</span>
                              <input
                                type="radio"
                                name="radio-10"
                                className="radio checked:bg-blue-500"
                                checked
                              />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <span className="label-text">Mumtaz</span>
                              <input
                                type="radio"
                                name="radio-10"
                                className="radio checked:bg-green-500"
                                checked
                              />
                            </label>
                          </div>
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
    </>
  );
};

export default RaportNarasi;
