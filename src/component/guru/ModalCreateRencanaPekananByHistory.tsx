import { useEffect, useState } from "react";
import Modal, { closeModal } from "../modal";
import * as Yup from "yup";
import { Class, Kalender } from "../../midleware/api";
import { globalStore, Store } from "../../store/Store";
import { Input, Select } from "../Input";
import { useFormik } from "formik";
import { formatTime } from "../../utils/date";
import Swal from "sweetalert2";

const schema = Yup.object().shape({
  timetable_id: Yup.string().required("Rencana kegiatan harus dipilih"),
  start_date: Yup.string().required("Tanggal mulai tidak boleh kosong"),
  end_date: Yup.string().required("Tanggal selesai tidak boleh kosong"),
});

const ModalCreateRencanaPekananByHistory = ({
  modalId,
  postCreate,
}: {
  modalId: string;
  postCreate: () => void;
}) => {
  const { academicYear } = globalStore();
  const { token } = Store();

  // filter data
  const [classes, setclasses] = useState([]);

  const getClasses = async () => {
    try {
      const response = await Class.showAll(token, 0, 20, "Y");
      setclasses(response.data.data.result);
    } catch {}
  };

  useEffect(() => {
    getClasses();
  }, []);

  // filter timetable
  const [classId, setClassId] = useState(""),
    [semester, setSemester] = useState("");

  // value data
  const [timetables, setTimetables] = useState([]);

  const getTimetables = async () => {
    setTimetables([]);
    formik.setFieldValue("timetable_id", "");
    if (!classId || !semester) return;

    try {
      const res = await Kalender.GetAllTimetableByClass(
        token,
        classId,
        semester,
        academicYear,
      );
      setTimetables(res.data.data);
    } catch {}
  };

  useEffect(() => {
    getTimetables();
  }, [classId, semester, academicYear]);

  // form
  const formik = useFormik({
    initialValues: {
      timetable_id: "",
      start_date: "",
      end_date: "",
    },
    validationSchema: schema,
    validateOnChange: false,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);

      try {
        await Kalender.duplicateTimetable(token, values);

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: `Berhasil menduplikasi rencana kegiatan`,
        });

        resetForm();
        postCreate();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Gagal menduplikasi pembayaran`,
        });
      } finally {
        setSubmitting(false);
        closeModal(modalId);
      }
    },
  });

  return (
    <Modal id={modalId}>
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col items-center"
      >
        <h4 className="text-xl font-bold">Duplikat Rencana Pekanan</h4>

        <Input label="Tahun pelajaran" value={academicYear} disabled />

        <Select
          label="Kelas"
          keyValue="id"
          displayBuilder={(opt) => `${opt.level}-${opt.class_name}`}
          options={classes}
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
        />

        <Select
          label="Semester"
          options={[1, 2]}
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
        />

        <div className="divider"></div>

        <Select
          name="timetable_id"
          label="Rencana kegiatan"
          keyValue="id"
          displayBuilder={(opt) =>
            `${opt.title?.substring(0, 20) + (opt.title?.length >= 20 ? "..." : "")} | ${opt.start_date ? formatTime(opt.start_date, "hh:mm") : ""} - ${opt.end_date ? formatTime(opt.end_date, "hh:mm") : ""} | ${opt.hide_student ? "Tidak tampil" : "Tampil"} di modul siswa`
          }
          options={timetables}
          value={formik.values.timetable_id}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          errorMessage={formik.errors.timetable_id}
        />

        <Input
          label="Tanggal mulai"
          type="date"
          name="start_date"
          value={formik.values.start_date}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          errorMessage={formik.errors.start_date}
        />

        <Input
          label="Tanggal selesai"
          type="date"
          name="end_date"
          value={formik.values.end_date}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          errorMessage={formik.errors.end_date}
        />

        <button
          className="btn w-full mt-10 btn-secondary font-bold"
          type="submit"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? (
            <span className="loading loading-dots loading-md mx-auto"></span>
          ) : (
            "Simpan"
          )}
        </button>
      </form>
    </Modal>
  );
};

export default ModalCreateRencanaPekananByHistory;
