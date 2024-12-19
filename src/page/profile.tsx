import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import Modal, { closeModal, openModal } from "../component/modal";
import { Auth, Task } from "../middleware/api";
import { employeeStore } from "../store/Store";

const ProfilePage = () => {
  const {
    setEmployee,
    setHeadmaster,
    setFormTeachers,
    setFormSubjects,
    setFormXtras,
  } = employeeStore();
  const [fetch, setFetch] = useState<any[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [dataUser, setDataUser] = useState<any>(null);
  // const [idEmployee, setIdEmployee] = useState();
  const [nameSignature, setNameSignature] = useState("");
  const [levelHeadmaster, setLevelHeadmaster] = useState("");
  const [classTeacher, setClassTeacher] = useState<number | string>("");
  const [employeeId, setEmployeeId] = useState<number | string>();
  const [signaturePath, setSignaturePath] = useState("");
  const [indexId, setIndexId] = useState<number | string>();
  const [statusTeacher, setStatusTeacher] = useState<any>(true);
  const [statusHeadmaster, setStatusHeadmaster] = useState<any>(false);
  const [updatedName, setUpdatedName] = useState("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState<any>(null);
  const [Id, setId] = useState<any>(null);
  const getMe = async () => {
    try {
      const res = await Auth.MeData();

      setDataUser(res.data.data);
      setUpdatedName(res.data.data.full_name);
      setId(res.data.data.id);
      const {
        id,
        full_name,
        headmaster,
        formextras,
        formsubjects,
        formteachers,
        employeesignatures,
      } = res.data.data?.employee ?? {};

      previewProfile(res.data.data.avatar);
      if (id && full_name) setEmployee({ id, full_name });
      if (headmaster) setHeadmaster(headmaster);
      if (formteachers) setFormTeachers(formteachers);
      if (formsubjects) setFormSubjects(formsubjects);
      if (formextras) setFormXtras(formextras);
      if (employeesignatures) setFormXtras(employeesignatures);
    } catch (error) {
      console.error(error);
    }
  };

  const FetchData = async () => {
    try {
      const response = await Auth.DataClass();
      const originalData = response.data.data.result;

      const uniqueData = Array.from(
        new Map(originalData.map((item: any) => [item.level, item])).values()
      );

      setFetch(uniqueData);
      console.log("Filtered Unique Data:", uniqueData);
    } catch (error) {
      console.error(error);
    }
  };

  const previewProfile = async (path: any) => {
    try {
      const lowerCasePath = path.toLowerCase();
      const response = await Task.downloadTugas(path);
      let mimeType = "application/pdf";

      if (lowerCasePath.endsWith(".png")) {
        mimeType = "image/png";
      } else if (
        lowerCasePath.endsWith(".jpg") ||
        lowerCasePath.endsWith(".jpeg")
      ) {
        mimeType = "image/jpeg";
      } else {
        throw new Error("Unsupported file type");
      }

      const blob = new Blob([response.data], { type: mimeType });
      const blobUrl = window.URL.createObjectURL(blob);
      setImage(blobUrl);
    } catch (err) {
      console.error(err);
    }
  };
  const EditProfile = async () => {
    const data = {
      full_name: updatedName,
    };

    try {
      await Auth.EditProfile(Id, data);
      getMe();
      closeModal("editProfile");
    } catch (error) {
      console.error(error);
    }
  };
  const EditPassword = async () => {
    if (password !== confirmPassword) {
      alert("Password dan Confirm Password tidak cocok");
      return;
    }

    const data = {
      old_password: currentPassword,
      password: password,
      confirm_password: confirmPassword,
    };

    try {
      await Auth.EditPassword(data);
      getMe();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Password Berhasil perbaharui",
        showConfirmButton: false,
        timer: 1000,
      });
      closeModal("editPassword");
    } catch (error) {
      console.error(error);
    }
  };

  const EditFotoProfile = async (file: File) => {
    const formData = new FormData();

    formData.append("avatar", file);

    try {
      await Auth.EditPicture(Id, formData);
      getMe();
      closeModal("editProfile");
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      EditFotoProfile(file); // Memanggil fungsi untuk mengunggah gambar baru
    }
  };
  useEffect(() => {
    getMe();
    FetchData();
  }, []);

  const handleDialog = () => {
    openModal("editProfile");
  };
  const handleDialogPassword = () => {
    openModal("editPassword");
  };
  const handleDialogSignature = () => {
    openModal("addSignature");
    setNameSignature("");
    setLevelHeadmaster("");
    setClassTeacher("");
  };

  // const handleCrud = () => {
  //   if (dataUser?.employee?.employeesignatures > 1) {
  //     UpdateSignature();
  //   } else {
  //     AddSignature();
  //   }
  // };

  const AddSignature = async () => {
    const data = {
      signature_name: nameSignature,
      is_headmaster: statusHeadmaster,
      ...(statusHeadmaster == true && { headmaster_of: levelHeadmaster }),
      is_form_teacher: statusTeacher,
      ...(statusTeacher == true && { form_teacher_class_id: classTeacher }),
    };

    try {
      await Auth.AddSignature(data);
      Swal.fire({
        title: "Berhasil!",
        text: "Tanda tangan berhasil ditambahkan.",
        icon: "success",
        confirmButtonText: "OK",
      });
      closeModal("addSignature");
    } catch (error) {
      console.error(error);
      closeModal("addSignature");
      Swal.fire({
        title: "Gagal!",
        text: "Gagal menambahkan tanda tangan. Silakan coba lagi.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleUpdateSignatureDialog = async (item: any) => {
    openModal("addSignature");
    setEmployeeId(item.employeeId);
    setNameSignature(item.signature_name);
    setIndexId(item.id);
    setStatusHeadmaster(item.is_headmaster);
    setLevelHeadmaster(item.headmaster_of);
    setStatusTeacher(item.is_form_teacher);
    setClassTeacher(parseInt(item.form_teacher_class_id));
  };

  const UpdateSignature = async () => {
    const data = {
      employee_id: employeeId,
      signature_path: signaturePath,
      signature_name: nameSignature,
      is_headmaster: statusHeadmaster,
      ...(statusHeadmaster == true && { headmaster_of: levelHeadmaster }),
      is_form_teacher: statusTeacher,
      ...(statusTeacher == true && { form_teacher_class_id: classTeacher }),
    };

    try {
      await Auth.UpdateSignature(indexId, data);
      Swal.fire({
        title: "Berhasil!",
        text: "Tanda tangan berhasil ditambahkan.",
        icon: "success",
        confirmButtonText: "OK",
      });
      closeModal("addSignature");
    } catch (error) {
      console.error(error);
      closeModal("addSignature");
      Swal.fire({
        title: "Gagal!",
        text: "Gagal menambahkan tanda tangan. Silakan coba lagi.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="w-full flex justify-center flex-col items-center p-3">
      <span className="font-bold text-xl mb-6">Profil</span>

      <div className="w-full p-6 bg-white rounded-lg border">
        <div className="flex justify-between w-full">
          <h6 className="text-md font-bold mb-3">Akun</h6>

          <div className="gap-2 flex">
            <button
              className="btn btn-primary w-fit btn-sm"
              onClick={handleDialog}
            >
              Edit Profile
            </button>
            <button
              className="btn btn-primary w-fit btn-sm"
              onClick={handleDialogPassword}
            >
              Edit Password
            </button>
            <div className="flex flex-col gap-2 items-center">
              <button
                className="btn btn-primary w-fit btn-sm"
                onClick={() => {
                  dataUser?.employee?.employeesignatures?.length > 1
                    ? handleUpdateSignatureDialog(
                        dataUser?.employee?.employeesignatures[0]
                      )
                    : handleDialogSignature();
                }}
              >
                Tambah Tanda Tangan
              </button>
              <div className="mt-2 text-sm text-gray-700 flex items-center">
                {/* Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-500 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm2 10a1 1 0 112 0 1 1 0 01-2 0zm4-6H8v2h4V6zm-4 4h4v2H8v-2z"
                    clipRule="evenodd"
                  />
                </svg>

                <span className="font-medium">
                  {dataUser?.employee?.employeesignatures[0]?.signature_name ||
                    "No Signature"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto mb-6">
          <table className="table">
            <div className="flex justify-between w-full">
              <div
                className="avatar"
                onClick={() => {
                  const fileInput = document.getElementById("fileInput");
                  if (fileInput) {
                    fileInput.click();
                  }
                }}
              >
                <div className="w-24 rounded-full cursor-pointer relative group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold">
                    ganti foto
                  </div>
                  <img
                    className="opacity-100 group-hover:opacity-30  group-hover:bg-black transition-opacity duration-300"
                    src={`${dataUser?.avatar ? image : "https://korpri.padang.go.id/assets/img/dewan_pengurus/no-pict.jpg"}`}
                    alt="User Avatar"
                  />
                </div>
              </div>

              <input
                id="fileInput"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleImageChange(e)}
              />
            </div>

            <tbody>
              <tr>
                <th className="w-16 sm:w-24 md:w-32 lg:w-40 xl:w-48">Nama</th>
                <td>: {dataUser?.full_name ?? "-"}</td>
              </tr>
              <tr>
                <th className="w-16 sm:w-24 md:w-32 lg:w-40 xl:w-48">Email</th>
                <td>: {dataUser?.email ?? "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {dataUser?.employee && (
          <>
            <h6 className="text-md font-bold mb-3">Data Karyawan</h6>
            <div className="overflow-x-auto mb-6">
              <table className="table">
                <tbody>
                  <tr>
                    <th className="w-16 sm:w-24 md:w-32 lg:w-40 xl:w-48">
                      Nama
                    </th>
                    <td>: {dataUser.employee?.full_name ?? "-"}</td>
                  </tr>
                  <tr>
                    <th className="w-16 sm:w-24 md:w-32 lg:w-40 xl:w-48">
                      Status
                    </th>

                    <td>: {dataUser?.employee.employee_status ?? "-"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}

        {dataUser?.employee?.formteachers?.length > 0 && (
          <>
            <h6 className="text-md font-bold mb-3">Wali Kelas</h6>
            <div className="overflow-x-auto mb-6">
              <table className="table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Kelas</th>
                    <th>Tahun pelajaran</th>
                  </tr>
                </thead>
                <tbody>
                  {dataUser?.employee?.formteachers?.map(
                    (dat: any, i: number) => (
                      <tr key={i}>
                        <th>{i + 1}</th>
                        <td>
                          {dat.class?.level ?? ""}-{dat.class?.class_name ?? ""}
                        </td>
                        <td>{dat.academic_year ?? "-"}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {dataUser?.employee?.formsubjects?.length > 0 && (
          <>
            <h6 className="text-md font-bold mb-3">Mata Pelajaran</h6>
            <div className="overflow-x-auto mb-6">
              <table className="table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Kelas</th>
                    <th>Tahun pelajaran</th>
                  </tr>
                </thead>
                <tbody>
                  {dataUser?.employee?.formsubjects?.map(
                    (dat: any, i: number) => (
                      <tr key={i}>
                        <th>{i + 1}</th>
                        <td>
                          {dat.subject?.level ?? ""} - {dat.subject?.name ?? ""}
                        </td>
                        <td>{dat.academic_year ?? "-"}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {dataUser?.employee?.formextras?.length > 0 && (
          <>
            <h6 className="text-md font-bold mb-3">Mata Pelajaran Extra</h6>
            <div className="overflow-x-auto mb-6">
              <table className="table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Kelas</th>
                    {/* <th>Tahun pelajaran</th> */}
                  </tr>
                </thead>
                <tbody>
                  {dataUser?.employee?.formextras?.map(
                    (dat: any, i: number) => (
                      <tr key={i}>
                        <th>{i + 1}</th>
                        <td>{dat.subjectextra?.name ?? "-"}</td>
                        {/* <td>{dat.academic_year ?? "-"}</td> */}
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {dataUser?.employee?.employeesignatures?.length > 0 && (
          <>
            <h6 className="text-md font-bold mb-3">Tanda Tangan</h6>
            <div className="overflow-x-auto mb-6">
              <table className="table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama Tanda Tangan</th>
                    {/* <th>Tahun pelajaran</th> */}
                  </tr>
                </thead>
                <tbody>
                  {dataUser?.employee?.employeesignatures?.map(
                    (dat: any, i: number) => (
                      <tr key={i}>
                        <th>{i + 1}</th>
                        <td>{dat?.signature_name ?? "-"}</td>
                        {/* <td>{dat.academic_year ?? "-"}</td> */}
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {dataUser?.full_name && (
        <div className="relative w-full">
          <a href="/guru/train-face" className="mt-4 w-full btn btn-secondary">
            Train Face
          </a>
        </div>
      )}

      <Modal id="editProfile">
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">Edit Profile</h2>

          {/* Input Nama */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nama
            </label>
            <input
              id="name"
              type="text"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Tombol Update */}
          <button
            className="btn btn-primary w-full"
            onClick={() => EditProfile()}
          >
            Update
          </button>
        </div>
      </Modal>
      <Modal id="editPassword">
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">Edit Password</h2>

          {/* Input Nama */}
          <div className="mb-4 relative">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Password Saat ini
            </label>
            <input
              id="name"
              type={`${showPassword === true ? "text" : "password"}`}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <button
              className="absolute right-4 top-[2.8rem] transform -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {!showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Input Password */}
          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type={`${showOldPassword === true ? "text" : "password"}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <button
              className="absolute right-4 top-[2.8rem] transform -translate-y-1/2"
              onClick={() => setShowOldPassword(!showOldPassword)}
            >
              {!showOldPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Input Confirm Password */}
          <div className="mb-4 relative">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type={`${showCurrentPassword === true ? "text" : "password"}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <button
              className="absolute right-4 top-[2.8rem] transform -translate-y-1/2"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {!showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Tombol Update */}
          <button
            className="btn btn-primary w-full"
            onClick={() => EditPassword()}
          >
            Update
          </button>
        </div>
      </Modal>
      <Modal id="addSignature">
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">Tambah Tanda Tangan</h2>
          {/* Input Nama Tanda Tangan */}
          <div className="mb-6">
            <label
              htmlFor="signatureName"
              className="block text-sm font-medium text-gray-700"
            >
              Nama
            </label>
            <input
              id="signatureName"
              type="text"
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
              placeholder="Masukkan Nama"
              value={
                dataUser?.employee?.employeesignatures?.length > 0
                  ? dataUser.employee.employeesignatures[0]?.signature_name
                  : nameSignature
              }
              onChange={(e) => setNameSignature(e.target.value)}
            />
          </div>

          {dataUser?.employee?.headmaster != null && (
            <div className="mb-6">
              <label
                htmlFor="isFormTeacher"
                className="block text-sm font-medium text-gray-700"
              >
                Apakah Kepala Sekolah?
              </label>
              <select
                id="isFormTeacher"
                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
                value={statusHeadmaster.toString()}
                onChange={(e) => setStatusHeadmaster(e.target.value === "true")}
              >
                <option value="true">Ya</option>
                <option value="false">Tidak</option>
              </select>
            </div>
          )}

          {statusHeadmaster === true && (
            <div className="mb-6">
              <label
                htmlFor="isHeadmaster"
                className="block text-sm font-medium text-gray-700"
              >
                Kepala Sekolah
              </label>
              <select
                id="isHeadmaster"
                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => setLevelHeadmaster(e.target.value)}
                value={levelHeadmaster}
              >
                <option value="">Pilih Level</option>
                {fetch.map((item, index) => (
                  <option value={item?.level} key={index}>
                    {item?.level}
                  </option>
                ))}
              </select>
            </div>
          )}

          {dataUser?.employee?.formteachers?.length > 0 && (
            <div className="mb-6">
              <label
                htmlFor="isFormTeacher"
                className="block text-sm font-medium text-gray-700"
              >
                Apakah Wali Kelas?
              </label>
              <select
                id="isFormTeacher"
                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
                value={statusTeacher.toString()}
                onChange={(e) =>
                  setStatusTeacher(e.target.value == "true" ? true : false)
                }
              >
                <option value="true">Ya</option>
                <option value="false">Tidak</option>
              </select>
            </div>
          )}

          {/* Input ID Kelas Wali Kelas */}
          {statusTeacher == true && (
            <div className="mb-6">
              <label
                htmlFor="isFormTeacher"
                className="block text-sm font-medium text-gray-700"
              >
                Wali Kelas
              </label>
              <select
                id="isFormTeacher"
                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => setClassTeacher(parseInt(e.target.value))}
                value={classTeacher}
              >
                <option value="">Pilih Kelas</option>
                {dataUser?.employee?.formteachers?.map(
                  (item: any, index: any) => (
                    <option value={item?.class?.id} key={index}>
                      {item?.class?.class_name}
                    </option>
                  )
                )}
              </select>
            </div>
          )}

          {/* Tombol Simpan */}
          <button
            className="w-full btn btn-primary"
            onClick={() => AddSignature()}
          >
            Simpan
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePage;
