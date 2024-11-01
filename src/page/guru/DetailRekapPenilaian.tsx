import { ApexOptions } from "apexcharts";
import { Field, Formik } from "formik";
import { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { FaCheckCircle } from "react-icons/fa";
import { FaCircleMinus } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DownloadFile,
  EmployeeJobdesk,
  Karyawan,
} from "../../midleware/api-hrd";
import { calculateRemainingProbation, formattedDate } from "../../utils/common";

const DetailRekapPenilaianPage: React.FC = () => {
  const location = useLocation();
  const employee = location.state?.employee;
  const [Performance, setPerformance] = useState<any>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [jobdeskList, setJobdeskList] = useState<any[]>([]);
  const [doneJobdesk, setDoneJobdesk] = useState<any[]>([]);
  const [avatar, setAvatar] = useState("");
  const [profile, setProfile] = useState("");
  // const [ListEmployee, setListEmployee] = useState<any>(null);

  console.log(employee);
  console.log(jobdeskList);

  const navigate = useNavigate();

  const DownloadAvatar = async () => {
    try {
      const res = await DownloadFile.DownloadSade(avatar);
      const blob = new Blob([res.data], { type: "image/jpeg" });

      const blobUrl = window.URL.createObjectURL(blob);
      setProfile(blobUrl);
    } catch (error) {
      console.error;
    }
  };

  const createJobdesk = async (values: any) => {
    try {
      const res = await EmployeeJobdesk.createJobdesk(values);
      console.log(JSON.stringify(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  const getDifference = async () => {
    try {
      const res = await EmployeeJobdesk.getDifference(employee.employee_id);
      setPerformance(res.data.data);
      console.log(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getEmployee = async () => {
    try {
      const jobdesk = await Karyawan.JobdeskList(
        employee.user_id,
        employee.raw_grade
      );

      setJobdeskList(jobdesk.data.data.result);
      setAvatar(jobdesk.data.data.result[0].employee.user.avatar);

      const done = await Karyawan.JobdeskList(employee.employee_id, 1);
      setDoneJobdesk(done.data.data.result);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getEmployee();
    getDifference();
    DownloadAvatar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const performanceData = {
    series: [
      Performance?.todayPerformance ?? 0,
      Performance?.yesterdayPerformance ?? 0,
    ],
    options: {
      chart: {
        type: "donut" as const,
        width: "100%",
      },
      title: {
        text: "Kinerja",
        align: "left",
        style: {
          fontSize: "16px",
        },
      },
      labels: ["Kinerja Hari Ini", "Kinerja Kemarin"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: "100%",
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    } as ApexOptions,
  };

  const profileInfo = [
    {
      label: "Name",
      value: employee?.full_name ?? "-",
    },
    {
      label: "Posisi",
      value: employee?.occupation ?? "-",
    },
    {
      label: "Email",
      value: employee?.email ?? "-",
    },
    {
      label: "Tgl mulai bekerja",
      value: formattedDate(employee.work_start_date) ?? "-",
    },
    {
      label: "Status",
      value: employee?.employee_status ?? "-",
    },
    {
      label: "Sisa waktu",
      value: !employee.still_in_probation
        ? "-"
        : calculateRemainingProbation(
            employee.probation_start_date,
            employee.probation_end_date
          ),
    },
  ];

  const handleSubmit = (values: any) => {
    createJobdesk(values);
    setShowModal(false);
  };

  return (
    <div className="p-5">
      <div className="breadcrumbs items-center text-center text-xl md:w-2/3">
        <ul className="my-auto h-full">
          <li
            className="font-bold cursor-pointer hover:underline"
            onClick={() => navigate(-1)}
          >
            Rekap Penilaian
          </li>
          <li>Detail</li>
        </ul>
      </div>

      <div className="my-5 flex-grow border-t border-gray-400 drop-shadow-sm" />

      <div>
        <div className="flex justify-end">
          <button
            className="text-md mb-1 badge btn badge-md py-1 px-4 btn-xs h-fit rounded-badge bg-[#ffffffc2] drop-shadow-sm"
            onClick={() => setShowModal(!showModal)}
          >
            Tambah Jobdesk
          </button>
        </div>

        <div className="w-full flex-wrap gap-3 md:flex md:flex-nowrap items-start">
          {/* Employee Details */}
          <div className="my-2 w-full md:w-[70%]">
            {employee && (
              <div className="flex gap-7 p-5 bg-white rounded-xl shadow-lg">
                <div className="h-40 w-40 rounded-lg overflow-hidden">
                  <img
                    src={
                      profile ||
                      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAANlBMVEX///+/v7+8vLzKysr8/Pzg4ODFxcXb29vT09Pj4+P4+PjBwcH6+vry8vLY2NjIyMjs7Ozo6Oia8u11AAAEdUlEQVR4nO2d65bqIAxGp/Smrb34/i971KqlEC7FGuJZ3/7dKewJBgK4/PsDAAAAAAAAAAAAAAAA4KUam5+i3m94UsUPoVoYwlA6MIShfGAIQ/nAEIbyOcBQSeNww9NZGOXBhuq8+w1fxugfDG1gmB0YBoFhdmAYBIbZgWEQGGYHhkFgmB0YBoFhdmAYBIbZyWB4qVI6mgyv4WUeH7u007lL7vFeWA3n8rUFrZqWK5KchnWvPapOTGFkNDQPOJrhk45Hw2d4Ns+oVPlRz2NhMxyawkTtv2OWAJvhSBwzfjBO2+g/5TLs7BDeSF4eDP0Y+yiX4UydFKtT4pRxa3SKTcVchtQgLYrobhq0Kj7+XIb0aX+fZtipHfH/ScPlZZG5Jq9hk2RYP96lTnFPcxnWpGF52d2eNrPGPc5lOJC5NDrl65Sv1fs16nEuw8v20sdCP+9uTh8NZVSuYVvTnKlBmjAdaqu/uH8Qm2FVWuNUJYSwOu3tLV9tcelNw5SF9yZjRaVixvpwbrZRTKnyuyKysRXOGn/QBqpK25QzptVm9598eyfqXDaPnah+GlNmwr/aGOcqYl3DvJtYzXU7jvU1bbVmVdExE+pP7Qjb6TiiOBFmOPuyD7XyC+djWYadGt2KxE5PzMpWluHtXc6KQZ/rNYK5RpThfWXnrGzp6iRcQ0ky7KbHK+iBup3rtQZD6wZJhq+9HDIsri89BBsUZPguIal0Y871K6ECRY6hXkFaimQeXQjVUHIMNwWkuVax5/q1xcC6Rozh0G+7vYmidaqzCaJ/whBjaEZJr608Y7QIHvBIMbR3/dfB55jr3/hrKCGGxMHN+vmi53rtSW+uEWLYUj1/dsY1169tetc1MgwHaw9HU3TN9Svec0huw4os6CZHcO7dcc/163O+XMNteC0JRfdk0Aby6BNfDcW9i1EquzedI4R36vAYLfy5htnwtnBRvaHo/SZxjN8Nz7UO5ltf97WnMgbqHCfhRbmHKa/hdXl2qxjzQQsaunMNr+FzUlD62W8bORD9TM4gshpe3xVg+Z7BonJlmN55mMhpWGkV4GughtacsbgvLnAa6hXga6B666I9OGsoRsPtMbCa7l2q6OVaAs6uMxpejXDdd+SPSTMP+vyGdri6+bAQui8u8BmaIbwxUdcXkg0dNRTjOf6BNiSOGirrXYxjcXQ+632ag6EPE7kMiU/h4dA1FJfhgUnTzZTRkCOEt8apYcpj+P1E6u4+j+H3E+kCdUmKxZAjkS4QrbMY8nwKC7qGYjFkSaQL9rqGw5AthORhIoMhUyJ9ksPwsDI+Brv97xtWY8mJNUwZYtixYu0qyjhd+yYwDALD7MAwCAyzA8MgMMwODIPAMDtHGxZ1JYvjDRvWajCC7SYRfhsBhvKBIQzlA0MYygeGMJQPDGEoHxjCUD4whKF8YAhD+cAQhvKBIQzlA0MYygeGMJQPDGEoHxjCUD4whKF8YAhD+cAQhvJJM/wpEgyv9U+R8iNaAAAAAAAAAAAAAAAAAP4r/gEYCYE2Xwz6DQAAAABJRU5ErkJggg=="
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-y-6 gap-x-11">
                  {profileInfo.map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs font-medium text-gray-400">
                        {label}
                      </p>
                      <p>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Jobdesk List */}
          <div className="my-2 w-full md:w-[30%]">
            <div className="card max-h-[207px] h-[250px] w-full  bg-base-100 p-4 shadow-xl">
              <h3 className="mb-4 text-md font-semibold">Jobdesk List</h3>
              <div className="mb-4 flex w-full flex-col justify-between gap-2 px-5 overflow-x-auto overflow-y-auto">
                {jobdeskList.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center gap-1">
                      <p className="flex items-center gap-2 font-semibold">
                        {item.name ?? "-"}
                      </p>
                      {employee.is_finish == true ? (
                        <FaCheckCircle
                          className={`mx-auto w-fit text-xl text-green-500 ${item.is_finish ? "visible" : "hidden"}`}
                        />
                      ) : (
                        <FaCircleMinus
                          className={`w-fit text-xl text-red-500 ${!item.is_finish ? "visible" : "hidden"}`}
                        />
                      )}
                    </div>
                    <p className="my-1 text-sm text-gray-600">
                      {item.description ?? "-"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="w-full flex-wrap gap-3 md:flex md:flex-nowrap">
          <div className="my-2 w-full md:w-[30%]">
            <div className="card h-[300px] w-full overflow-x-auto overflow-y-auto bg-base-100 p-4 shadow-xl">
              {Performance?.differences !== 0 ? (
                <ApexCharts
                  options={performanceData.options}
                  series={performanceData.series}
                  type="donut"
                  height={350}
                />
              ) : (
                <div className="w-full font-semibold">Kinerja</div>
              )}
              <p
                className={`font-semibold mt-auto text-center ${Performance?.status === "turun" ? "text-red-500" : Performance?.status === "naik" ? "text-green-500" : "text-yellow-500"} text-green-500`}
              >
                {Performance?.differences
                  ? Performance?.status +
                    Performance?.differences +
                    `dari sebelumnya`
                  : "Tidak ada data kinerja hari ini"}
              </p>
            </div>
          </div>

          <div className="my-2 w-full md:w-[70%]">
            <div className="card h-[300px] w-full overflow-x-auto bg-base-100 p-4 shadow-xl">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr>
                    {["No", "Tanggal", "Posisi", "Email", "Hasil"].map(
                      (item) => (
                        <th
                          className="border-b px-4 py-2 text-left text-sm font-medium"
                          key={item}
                        >
                          {item}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {doneJobdesk.map((item: any, index: any) => (
                    <tr key={index}>
                      <td className="border-b px-4 py-2 text-sm">
                        {index + 1}
                      </td>
                      <td className="border-b px-4 py-2 text-sm">
                        {item?.employee?.work_start_date}
                      </td>
                      <td className="border-b px-4 py-2 text-sm">
                        {item?.employee?.occupation}
                      </td>
                      <td className="border-b px-4 py-2 text-sm">
                        {item?.employee?.email}
                      </td>
                      <td className="border-b px-4 py-2 text-sm">
                        {item?.employee?.grade}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <dialog
          className="modal modal-open"
          onClick={() => setShowModal(false)}
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <h3 className="text-lg font-bold">Tambah Jobdesk</h3>
            <Formik
              initialValues={{
                employee_id: employee.employee_id,
                name: "",
                description: "",
                due_date: "",
                priority: 1,
                priority_label: "High",
              }}
              onSubmit={handleSubmit}
            >
              {({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <div className="my-2 w-full">
                    <label className="label">
                      <span className="label-text">Nama Jobdesk</span>
                    </label>
                    <Field
                      name="name"
                      className="input input-bordered w-full"
                    />
                  </div>
                  <div className="my-2 w-full">
                    <label className="label">
                      <span className="label-text">Deskripsi Jobdesk</span>
                    </label>
                    <Field
                      name="description"
                      as="textarea"
                      className="textarea textarea-bordered w-full"
                    />
                  </div>
                  <div className="my-2 w-full">
                    <label className="label">
                      <span className="label-text">Tanggal Tenggat</span>
                    </label>
                    <Field
                      type="datetime-local"
                      name="due_date"
                      className="input input-bordered w-full"
                    />
                  </div>
                  <div className="my-2 w-full">
                    <label className="label">
                      <span className="label-text">Prioritas</span>
                    </label>
                    <Field
                      as="select"
                      name="priority"
                      className="select select-bordered w-full"
                    >
                      <option value="1">High</option>
                      <option value="2">Medium</option>
                      <option value="3">Low</option>
                    </Field>
                  </div>
                  {/* <div className="my-2 w-full">
										<label className="label">
											<span className="label-text">Nama Peserta</span>
										</label>
										<Field as="select" name="employee_id" className="select select-bordered w-full">
											<option value="" disabled>
												Pilih Peserta
											</option>
											{ListEmployee?.map((employee: any) => (
												<option key={employee.id} value={employee.id}>
													{employee?.full_name}
												</option>
											))}
										</Field>
									</div> */}
                  <div className="modal-action">
                    <button className="btn btn-primary" type="submit">
                      Submit
                    </button>
                    <button
                      type="button"
                      className="btn"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default DetailRekapPenilaianPage;
