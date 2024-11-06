import { useFormik } from "formik";
import moment from "moment";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaPlus, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { PosJenisPembayaran, PosPembayaran } from "../../middleware/api";
import { getAcademicYears } from "../../utils/common";
import { Input, Select } from "../Input";
import Modal, { closeModal } from "../modal";

const schema = Yup.object().shape({
  payment_post_id: Yup.number().required("Pos pembayaran harus dipilih satu"),
  total: Yup.number().required("Total bayar harus ditentukan"),
  academic_year: Yup.string().required("Tahun pembelajaran harus dipilih"),
  data_list: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Keterangan harus diisi"),
      due_date: Yup.date().required("Tanggal jatuh tempo harus diisi"),
    })
  ),
});

const ModalBulkCreateJenisPembayaran = ({
  modalId,
  postCreate,
}: {
  modalId: string;
  postCreate: () => void;
}) => {
  const form = useFormik<{
    payment_post_id: number;
    academic_year: string;
    total: string;
    data_list: any[];
  }>({
    initialValues: {
      payment_post_id: 0,
      academic_year: "",
      total: "",
      data_list: [],
    },
    validateOnChange: false,
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);

      try {
        const res = await PosJenisPembayaran.bulkCreate(values);

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: `Berhasil menambahkan ${res.data.data?.length ?? ""} data jenis pembayaran`,
        });

        form.resetForm();
        setPreName("");
        setStep(0);
        postCreate();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Gagal menambahkan banyak data jenis pembayaran`,
        });
      } finally {
        setSubmitting(false);
        closeModal(modalId);
      }
    },
  });

  const parseHandleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    form.setFieldValue(name, value == "" ? undefined : parseInt(value));
  };

  const [step, setStep] = useState(0);
  const [postPayments, setPostPayments] = useState<any[]>([]);

  const getPostPayments = async () => {
    try {
      const res = await PosPembayaran.showAll("", 0, 1000);
      if (res.data?.data?.result) setPostPayments(res.data.data.result);
    } catch {}
  };

  useEffect(() => {
    getPostPayments();
  }, []);

  const [paymentType, setPaymentType] = useState("");

  const [preName, setPreName] = useState("");
  const [commonDate, setCommonDate] = useState(moment().date());
  const [commonMonth, setCommonMonth] = useState(moment().month() + 1);

  const applyPreName = () => {
    form.setFieldValue("data_list", [
      ...form.values.data_list.map((d, i) => ({
        ...d,
        name: `${preName} ${paymentType == "bulanan" ? form.values.academic_year : ""} ${i + 1}`,
      })),
    ]);
  };

  useEffect(() => {
    applyPreName();
  }, [preName, form.values.academic_year]);

  const applyDueDate = () => {
    const currYear = moment().year(),
      currMonth = commonMonth - 1;

    form.setFieldValue("data_list", [
      ...form.values.data_list.map((d, i) => ({
        ...d,
        due_date: moment()
          .set({
            date: commonDate,
            month: paymentType == "bulanan" ? currMonth + i : currMonth,
            year: paymentType == "tahunan" ? currYear + i : currYear,
          })
          .format("YYYY-MM-DD"),
      })),
    ]);
  };

  useEffect(() => {
    applyDueDate();
  }, [commonDate, commonMonth]);

  const generateBills = () => {
    form.setFieldValue("data_list", []);
    setCommonDate(moment().date());
    setCommonMonth(moment().month() + 1);

    if (!form.values.payment_post_id) return;

    let count = 0;
    const post = postPayments.find((p) => p.id == form.values.payment_post_id);

    if (post.billing_cycle?.toLowerCase() == "bulanan") {
      setPaymentType("bulanan");
      count = 12;
    } else if (post.billing_cycle?.toLowerCase() == "tahunan") {
      setPaymentType("tahunan");
      count = 3;
    }

    form.setFieldValue(
      "data_list",
      Array.from({ length: count }).map((_, i) => ({
        name: `${preName} ${paymentType == "bulanan" ? form.values.academic_year : ""} ${i + 1}`,
        due_date: moment().format("YYYY-MM-DD"),
      }))
    );
  };

  useEffect(() => {
    generateBills();
  }, [form.values.payment_post_id]);

  const handleAddBill = () => {
    form.setFieldValue("data_list", [...form.values.data_list, {}]);
  };

  const handleDeleteBill = (i: number) => {
    const arr = [...form.values.data_list].filter((_, id) => id != i);
    form.setFieldValue("data_list", arr);
  };

  return (
    <Modal id={modalId}>
      <form onSubmit={form.handleSubmit}>
        <h3 className="text-xl font-bold mb-6">
          Tambah Banyak Jenis Pembayaran
        </h3>

        {step == 0 && (
          <>
            <Select
              label="Pos pembayaran"
              name="payment_post_id"
              type="number"
              options={postPayments}
              keyValue="id"
              keyDisplay="name"
              value={form.values.payment_post_id}
              onChange={parseHandleChange}
              errorMessage={form.errors.payment_post_id}
            />

            <Select
              label="Tahun pembelajaran"
              name="academic_year"
              options={getAcademicYears()}
              value={form.values.academic_year}
              onChange={form.handleChange}
              errorMessage={form.errors.academic_year}
            />

            <Input
              type="number"
              label="Total"
              name="total"
              value={form.values.total}
              onChange={form.handleChange}
              errorMessage={form.errors.total}
            />
          </>
        )}

        {step == 1 && (
          <>
            <Input
              label="Keterangan"
              value={preName}
              onChange={(e) => setPreName(e.target.value)}
            />

            <div className="flex gap-3">
              {paymentType == "bulanan" || paymentType == "tahunan" ? (
                <Input
                  label="Setiap tanggal"
                  type="number"
                  min={1}
                  max={31}
                  value={commonDate}
                  onChange={(e) => setCommonDate(parseInt(e.target.value))}
                />
              ) : (
                ""
              )}

              {paymentType == "tahunan" ? (
                <Input
                  label="Setiap bulan"
                  type="number"
                  min={1}
                  max={12}
                  value={commonMonth}
                  onChange={(e) => setCommonMonth(parseInt(e.target.value))}
                />
              ) : (
                ""
              )}
            </div>

            <div className="divider"></div>

            <div className="overflow-x-auto">
              <table className="table table-xs">
                <thead>
                  <tr>
                    <th>Keterangan</th>
                    <th>Jatuh Tempo</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {form.values.data_list.map((dat, i) => (
                    <tr key={i}>
                      <td>
                        <Input
                          name={`data_list[${i}].name`}
                          value={dat.name ?? ""}
                          onChange={form.handleChange}
                          errorMessage={
                            (
                              form.errors.data_list?.[i] as {
                                name?: any;
                              }
                            )?.name ?? ""
                          }
                        />
                      </td>
                      <td className="inline-flex items-start">
                        <Input
                          name={`data_list[${i}].due_date`}
                          type="date"
                          value={dat.due_date ?? ""}
                          onChange={form.handleChange}
                          errorMessage={
                            (
                              form.errors.data_list?.[i] as {
                                due_date?: any;
                              }
                            )?.due_date ?? ""
                          }
                        />
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteBill(i)}
                          type="button"
                          className="btn btn-ghost text-error"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={handleAddBill}
              type="button"
              className="btn btn-link"
            >
              <FaPlus /> Tambah
            </button>
          </>
        )}

        <div className="modal-action">
          {step == 0 && (
            <button
              onClick={() => setStep(1)}
              className="btn btn-primary"
              type="button"
            >
              Atur tanggal <FaChevronRight />
            </button>
          )}
          {step == 1 && (
            <>
              <button
                onClick={() => setStep(0)}
                className="btn me-auto"
                type="button"
              >
                <FaChevronLeft />
                Isi data
                {form.errors.payment_post_id ||
                form.errors.academic_year ||
                form.errors.total ? (
                  <div className="badge badge-error text-white">!</div>
                ) : (
                  ""
                )}
              </button>
              <button
                disabled={form.isSubmitting}
                className="btn btn-primary"
                type="submit"
              >
                {form.isSubmitting ? (
                  <span className="loading loading-dots loading-md mx-auto"></span>
                ) : (
                  "Simpan"
                )}
              </button>
            </>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default ModalBulkCreateJenisPembayaran;
