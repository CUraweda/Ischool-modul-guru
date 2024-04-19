import { useState, useEffect } from "react";
import { BiDownload } from "react-icons/bi";
import { VscTasklist } from "react-icons/vsc";
import { Link } from "react-router-dom";
import { useStore } from "../../store/Store";
import { Task } from "../../controller/api";

const DetailTugasSswa = () => {
  const { token } = useStore();
  const [taskList, setTaskList] = useState<any>([]);

  useEffect(() => {
    getTaskDetail();
  }, []);
  const getTaskDetail = async () => {
    try {
      const id: string | null = sessionStorage.getItem("idTask");
      let idTask: number | null = null;

      if (id !== null) {
        idTask = parseInt(id);
      }
      const response = await Task.getDetailTask(token, idTask);
      console.log(response.data.data);
      setTaskList(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (date: string) => {
    let Newdate = new Date(date);
    let formattedDate = Newdate.toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    });
    return formattedDate;
  };
  

  return (
    <>
      <div className="p-3">
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <Link to={"/guru/adm-siswa"}>
                <a>Siswa</a>
              </Link>
            </li>
            <li>
              <Link to={"/guru/adm-siswa"}>
                <a>Administrasi</a>
              </Link>
            </li>
            <li>Tugas</li>
          </ul>

          <div className="mt-5 w-full bg-white p-3 rounded-md">
            <p className="text-xl font-bold">Detail Tugas</p>
            <div className="overflow-x-auto mt-10">
              <table className="table table-zebra shadow-md mt-5">
                {/* head */}
                <thead className="bg-blue-200">
                  <tr>
                    <th>No</th>
                    <th>Nama Siswa</th>
                    <th>Kelas</th>
                    <th>Jenis</th>
                    <th>Tanggal Upload</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {taskList?.map((item: any, index: number) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item?.student?.full_name}</td>
                      <td>{item?.student?.class}</td>
                      <td>
                        {item?.task?.task_category_id === 1
                          ? "WWP"
                          : item?.task?.task_category_id === 2
                          ? "Project Kelompok"
                          : "Mandiri"}
                      </td>
                      <td>{formatDate(item?.createdAt)}</td>
                      <td className="join text-white">
                        <button className="btn btn-sm btn-ghost bg-blue-600 text-xl join-item">
                          <BiDownload />
                        </button>
                        <button className="btn btn-sm btn-ghost bg-green-600 text-xl join-item">
                          <VscTasklist />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailTugasSswa;
