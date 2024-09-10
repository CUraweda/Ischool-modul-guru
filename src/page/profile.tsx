import { useEffect, useState } from "react";
import { employeeStore, Store } from "../store/Store";
import { Auth } from "../midleware/api";
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
  const [updatedName, setUpdatedName] = useState<string>("");
  const [idEmployee, setIdEmployee] = useState();

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

      if (id && full_name) setEmployee({ id, full_name });
      if (headmaster) setHeadmaster(headmaster);
      if (formteachers) setFormTeachers(formteachers);
      if (formsubjects) setFormSubjects(formsubjects);
      if (formextras) setFormXtras(formextras);
    } catch (error) {
      console.error(error);
    }
  };

  const EditProfile = async () => {
    const data = {
      full_name: updatedName,
    };
    try {
      await Auth.EditProfile(token, idEmployee, data);
      getMe();
      closeModal("editProfile");
    } catch (error) {
      console.error(error);
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
        <h6 className="text-md font-bold mb-3">Akun</h6>
        <div className="overflow-x-auto mb-6">
          <table className="table">
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

        <button className="btn btn-primary w-full" onClick={handleDialog}>
          Edit Profile
        </button>
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
