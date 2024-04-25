import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import KalenderPekanan from "../../component/CalendarPekanan";
import Modal from "../../component/modal";
import { Kalender, Task } from "../../controller/api";
import { useStore } from "../../store/Store";
import { useFormik } from "formik";
import * as Yup from "yup";

const schema = Yup.object({
  tahun: Yup.string().required("required"),
  kelas: Yup.string().required("required"),
  semester: Yup.string().required("required"),
  title: Yup.string().required("required"),
  start_date: Yup.string().required("required"),
  end_date: Yup.string().required("required"),
});

const jadwalMengajar = () => {
  const { token } = useStore();
  const [kelas, setKelas] = useState<any[]>([]);

  const formik = useFormik({
    initialValues: {
      tahun: "",
      kelas: "",
      semester: "",
      title: "",
      start_date: "",
      end_date: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  useEffect(() => {
    getClass();
  }, []);

  const showModal = (props: string) => {
    let modalElement = document.getElementById(`${props}`) as HTMLDialogElement;
    if (modalElement) {
      modalElement.showModal();
    }
    getClass();
  };

  const getClass = async () => {
    const response = await Task.GetAllClass(token, 0, 20);
    setKelas(response.data.data.result);
  };

  const createAgenda = async () => {
    const { tahun, title, kelas, semester, start_date, end_date } =
      formik.values;

    const data = {
      academic_year: tahun,
      class_id: kelas,
      semester,
      title,
      start_date,
      end_date,
    };

    const response = await Kalender.createTimeTable(token, data);
    console.log(response);
  };

  return (
    <div className="my-10 w-full flex flex-col items-center">
      <div className=" flex flex-col items-center w-full text-3xl font-bold text-center">
        <span>RENCANA PEKANAN</span>
        <span className="text-xl">Bulan Februari</span>
      </div>
      <div className="w-full p-6">
        <div className="text-right">
          <div className="join">
            <select
              className="select select-bordered w-36 join-item"
              onChange={(e) => formik.setFieldValue("kelas", e.target.value)}
            >
              <option disabled selected>
                Kelas
              </option>
              {kelas?.map((item: any, index: number) => (
                <option
                  value={item.id}
                  key={index}
                >{`${item.level}-${item.class_name}`}</option>
              ))}
            </select>
            <button
              className="btn bg-green-500 btn-ghost text-white join-item"
              onClick={() => showModal("add-rencana")}
            >
              <span className="text-xl">
                <FaPlus />
              </span>
              Tambah
            </button>
          </div>
        </div>

        <div className={`w-full bg-white mt-5`}>
          <KalenderPekanan />
        </div>
      </div>

      <Modal id="add-rencana">
        <div className="w-full flex flex-col items-center">
          <span className="text-xl font-bold">Tambah Rencana Pekanan</span>
          <div className="flex w-full mt-5 flex-col">
            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 w-full font-bold">Tahun Pelajaran</label>
              <select
                className="select select-bordered w-full"
                onChange={(e) => formik.setFieldValue("tahun", e.target.value)}
              >
                <option disabled selected>
                  Pilih Kelas
                </option>
                <option value={"2023/2024"}>2023 / 2024</option>
                <option value={"2024/2025"}>2024 / 2025</option>
              </select>
            </div>
            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 w-full font-bold">Semester</label>
              <select
                className="select select-bordered w-full"
                onChange={(e) =>
                  formik.setFieldValue("semester", e.target.value)
                }
              >
                <option disabled selected>
                  Pilih Semester
                </option>
                <option value={"1"}>1</option>
                <option value={2}>2</option>
              </select>
            </div>
            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 w-full font-bold">Kelas</label>
              <select
                className="select select-bordered join-item"
                onChange={(e) => formik.setFieldValue("kelas", e.target.value)}
              >
                <option disabled selected>
                  Kelas
                </option>
                {kelas?.map((item: any, index: number) => (
                  <option
                    value={item.id}
                    key={index}
                  >{`${item.level}-${item.class_name}`}</option>
                ))}
              </select>
            </div>
            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 w-full font-bold">
                Detail Rencana Pekanan
              </label>
              <textarea
                className="textarea textarea-bordered bg-white shadow-md scrollbar-hide"
                placeholder="Agenda"
                onChange={(e) => formik.setFieldValue("title", e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="w-full">
            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 font-bold">Tanggal</label>
              <div className="flex gap-2 justify-center items-center">
                <input
                  type="datetime-local"
                  className="input input-bordered bg-white shadow-md"
                  onChange={(e) =>
                    formik.setFieldValue("start_date", e.target.value)
                  }
                />
                <span>-</span>
                <input
                  type="datetime-local"
                  className="input input-bordered bg-white shadow-md"
                  onChange={(e) =>
                    formik.setFieldValue("end_date", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
          <div className="w-full mt-3 justify-start items-center flex gap-3">
            <input type="checkbox" className="checkbox" />
            <label className="font-bold">Tampilkan di modul siswa ?</label>
          </div>

          <div className="w-full flex justify-center mt-10 gap-2">
            <button
              className={`btn btn-ghost bg-green-500 text-white font-bold w-full `}
              onClick={createAgenda}
            >
              Simpan
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default jadwalMengajar;
