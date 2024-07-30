import { useEffect, useState } from "react";
import { employeeStore, Store } from "../store/Store";
import { Auth } from "../midleware/api";

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

  const getMe = async () => {
    try {
      const res = await Auth.MeData(token);

      setDataUser(res.data.data);

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
    } catch {}
  };

  useEffect(() => {
    getMe();
  }, []);

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
    </div>
  );
};

export default ProfilePage;
