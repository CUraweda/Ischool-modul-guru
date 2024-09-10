import { useEffect, useState } from "react";
import { employeeStore, Store } from "../store/Store";
import { Auth, Task } from "../midleware/api";
import Modal, { openModal, closeModal } from "../component/modal";

const ProfilePage = () => {
  const { token } = Store();
  const {
    setEmployee,
    setHeadmaster,
    setFormTeachers,
    setFormSubjects,
    setFormXtras,
  } = employeeStore();

  const [dataUser, setDataUser] = useState<any>(null);
  const [idEmployee, setIdEmployee] = useState();
  const [updatedName, setUpdatedName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState<any>(null);
  const getMe = async () => {
    try {
      const res = await Auth.MeData(token);

      setDataUser(res.data.data);
      setUpdatedName(res.data.data.full_name);
      setIdEmployee(res.data.data.employee.id);
      const {
        id,
        full_name,
        headmaster,
        formextras,
        formsubjects,
        formteachers,
      } = res.data.data?.employee ?? {};

      previewProfile(res.data.data.avatar);
      if (id && full_name) setEmployee({ id, full_name });
      if (headmaster) setHeadmaster(headmaster);
      if (formteachers) setFormTeachers(formteachers);
      if (formsubjects) setFormSubjects(formsubjects);
      if (formextras) setFormXtras(formextras);
    } catch (error) {
      console.error(error);
    }
  };
  const previewProfile = async (path: any) => {
    try {
      const lowerCasePath = path.toLowerCase();
      const response = await Task.downloadTugas(token, path);
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
    // Validasi kecocokan password
    if (password !== confirmPassword) {
      alert("Password dan Confirm Password tidak cocok");
      return;
    }

    const data = {
      full_name: updatedName,
      password: password,
    };

    try {
      await Auth.EditProfile(token, idEmployee, data);
      getMe();
      closeModal("editProfile");
    } catch (error) {
      console.error(error);
    }
  };

  const EditFotoProfile = async (file: File) => {
    const formData = new FormData();

    formData.append("profile_image", file);

    try {
      await Auth.EditPicture(token, idEmployee, formData);
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
  }, []);

  const handleDialog = () => {
    openModal("editProfile");
  };

  return (
    <div className="w-full flex justify-center flex-col items-center p-3">
      <span className="font-bold text-xl mb-6">Profil</span>

      <div className="w-full p-6 bg-white rounded-lg border">
        <div className="flex justify-between w-full">
          <h6 className="text-md font-bold mb-3">Akun</h6>
          <button
            className="btn btn-primary w-fit btn-sm"
            onClick={handleDialog}
          >
            Edit Profile
          </button>
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
      </div>

      {dataUser?.full_name && (
        <div className="relative w-full">
          <a
            href="/guru/train-face"
            className="absolute left-6 top-3 btn btn-secondary"
          >
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

          {/* Input Password */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Input Confirm Password */}
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
    </div>
  );
};

export default ProfilePage;
