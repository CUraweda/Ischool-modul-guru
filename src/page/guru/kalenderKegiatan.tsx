import { useState } from "react";
import Demo from "../../component/CalendarEdit";
import Modal from "../../component/modal";
import { useStore } from "../../store/Store";
import { Kalender } from "../../controller/api";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaPlus } from "react-icons/fa";

const schema = Yup.object({
  edu_id: Yup.string().required("required"),
  agenda: Yup.string().required("required"),
  start_date: Yup.string().required("required"),
  end_date: Yup.string().required("required"),
  tahun: Yup.string().required("required"),
  level: Yup.string().required("required"),
  smt: Yup.string().required("required"),
});

interface propsColor {
  color: string;
  value: string;
}
const KalenderKegiatan = () => {
  const { token } = useStore();
  const [topik, setTopik] = useState<any[]>([]);
  const [Color, setColor] = useState<propsColor>({
    color: "bg-red-500",
    value: "#dc2626_red",
  });

  const getTopik = async () => {
    const response = await Kalender.GetAllTopik(token, 0, 10);
    setTopik(response.data.data.result);
  };

  const formik = useFormik({
    initialValues: {
      edu_id: "",
      agenda: "",
      start_date: "",
      end_date: "",
      tahun: "",
      level: "",
      smt: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const dataColor = [
    {
      color: "bg-red-500",
      value: "#dc2626_red",
    },
    {
      color: "bg-orange-500",
      value: "#f97316_orange",
    },
    {
      color: "bg-yellow-500",
      value: "#eab308_amber",
    },
    {
      color: "bg-lime-500",
      value: "#84cc16_lime",
    },
    {
      color: "bg-green-500",
      value: "#22c55e_green",
    },
    {
      color: "bg-teal-500",
      value: "#14b8a6_teal",
    },
    {
      color: "bg-cyan-500",
      value: "#06b6d4_cyan",
    },
    {
      color: "bg-blue-500",
      value: "#3b82f6_blue",
    },
    {
      color: "bg-violet-500",
      value: "#8b5cf6_deep-purple",
    },
    {
      color: "bg-purple-500",
      value: "#a855f7_purple",
    },

    {
      color: "bg-rose-500",
      value: "#f43f5e_pink",
    },
  ];

  const showModal = (props: string) => {
    let modalElement = document.getElementById(`${props}`) as HTMLDialogElement;
    if (modalElement) {
      modalElement.showModal();
    }
    if (props === "add-kalender") {
      getTopik();
    }
  };

  const createAgenda = async () => {
    const { edu_id, start_date, end_date, agenda } = formik.values;
    const color = Color.value
    const dataRest = {
      edu_id: parseInt(edu_id),
      start_date,
      end_date,
      agenda,
      color
    };

   const response = await Kalender.createDetail(token, dataRest);
    console.log(response);
    
    window.location.reload();
  };

  const createTopikEdu = async () => {
    const { tahun, level, smt } = formik.values;
    const data = {
      academic_year: tahun,
      level,
      semester: smt,
    };
    await Kalender.createTopik(token, data);

    formik.resetForm();
    getTopik();
  };

  return (
    <div className="my-10 w-full flex flex-col items-center">
      <div className=" flex flex-col items-center w-full text-3xl font-bold">
        <span>KALENDER KEGIATAN TAHUN 2023 / 2024</span>
      </div>
      <div className="w-full p-6">
        <div className="w-full flex justify-end mb-5">
          <button
            className="btn bg-green-500 btn-ghost text-white"
            onClick={() => showModal("add-kalender")}
          >
            <span className="text-xl">
              <FaPlus />
            </span>
            Tambah
          </button>
        </div>
        <Demo />
      </div>

      <Modal id="add-kalender">
        <div className="w-full flex flex-col items-center">
          <span className="text-xl font-bold">Tambah Kalender Pendidikan</span>
          <div className="flex w-full mt-5 flex-col">
            <div className="w-full flex flex-col gap-2">
              <div className="flex gap-1 items-center justify-between w-full">
                <label className="mt-4 font-bold">Topik</label>
                <button
                  className="btn btn-sm btn-ghost bg-blue-500 text-white"
                  onClick={() => showModal("add-topik-edu")}
                >
                  tambah topik
                </button>
              </div>
              <select
                className="select select-bordered bg-white shadow-md"
                onChange={(e) => formik.setFieldValue("edu_id", e.target.value)}
              >
                <option disabled selected>
                  Pick one
                </option>
                {topik?.map((item: any, index: number) => (
                  <option
                    value={item.id}
                    key={index}
                  >{`${item.level}-${item.academic_year}-SMT${item.semester}`}</option>
                ))}
              </select>
            </div>
            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 w-full font-bold">Detail Topik</label>
              <textarea
                className="textarea textarea-bordered bg-white shadow-md scrollbar-hide"
                placeholder="Agenda"
                onChange={(e) => formik.setFieldValue("agenda", e.target.value)}
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
          <div className="w-full mt-5">
            <label className="mt-4 font-bold">Warna Background</label>
            <div className="w-full flex gap-2 mt-3">
              {dataColor.map((item: propsColor, index: number) => (
                <span
                  key={index}
                  className={`w-8 h-8 rounded-md ${
                    item.color
                  } cursor-pointer  ${
                    Color?.value === item.value
                      ? "ring ring-primary ring-offset-base-100 ring-offset-2"
                      : ""
                  }`}
                  onClick={() => setColor(item)}
                />
              ))}
            </div>
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
     
      <Modal id="add-topik-edu">
        <div className="w-full flex flex-col items-center">
          <span className="text-xl font-bold">Tambah Topik Kalender</span>
          <div className="flex w-full mt-5 flex-col">
            <div className="w-full flex flex-col gap-2">
              <div className="flex gap-1 items-center justify-between w-full"></div>
              <label className="mt-4 font-bold">Tahun Pelajaran</label>
              <input
                type="text"
                placeholder="2023/2024"
                className="input input-bordered bg-white shadow-md"
                onChange={(e) => formik.setFieldValue("tahun", e.target.value)}
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 w-full font-bold">Level</label>
              <select
                className="select select-bordered bg-white shadow-md"
                onChange={(e) => formik.setFieldValue("level", e.target.value)}
              >
                <option disabled selected>
                  Pick one
                </option>
                <option value="PG">PG</option>
                <option value="TK">TK</option>
                <option value="SD">SD</option>
                <option value="SM">SM</option>
              </select>
            </div>
          </div>
          <div className="w-full">
            <div className="w-full flex flex-col gap-2">
              <label className="mt-4 font-bold">Semester</label>
              <select
                className="select select-bordered bg-white shadow-md"
                onChange={(e) => formik.setFieldValue("smt", e.target.value)}
              >
                <option disabled selected>
                  Pick one
                </option>
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </div>
          </div>

          <div className="w-full flex justify-center mt-10 gap-2">
            <button
              className="btn bg-green-500 text-white font-bold w-full"
              onClick={createTopikEdu}
            >
              Simpan
            </button>
            {/* <button className="btn bg-green-500 text-white font-bold">Submit</button> */}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default KalenderKegiatan;
