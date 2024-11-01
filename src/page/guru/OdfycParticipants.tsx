import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { IoChevronBack } from "react-icons/io5";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { Input } from "../../component/Input";
import Modal, { closeModal, openModal } from "../../component/modal";
import {
  IpageMeta,
  PaginationControl,
} from "../../component/PaginationControl";
import { ForCountry, User } from "../../midleware/api";
import { globalStore } from "../../store/Store";
const schema = Yup.object().shape({
  id: Yup.string().optional(),
  user_id: Yup.array().of(Yup.string()).required("User harus dipilih"),
  academic_year: Yup.string().required("Tahun pelajaran harus diisi"),
  target: Yup.number()
    .min(8, "Minimal 8 jam")
    .required("Target jam harus diisi"),
});

const OdfycParticipants = () => {
  const { academicYear } = globalStore(),
    modalFormId = "form-for-country";

  // filter
  const [search, setSearch] = useState("");
  const [pageMeta, setPageMeta] = useState<IpageMeta>({ page: 0, limit: 10 });
  const [filter, setFilter] = useState({
    search: "",
    page: 0,
    limit: 10,
  });

  const handleFilter = (key: string, value: any) => {
    const obj = {
      ...filter,
      [key]: value,
    };
    if (key !== "page") obj["page"] = 0;
    setFilter(obj);
  };

  // get data
  const [dataList, setDataList] = useState<any[]>([]);
  const getDataList = async () => {
    try {
      const res = await ForCountry.showAll(
        filter.search,
        academicYear,
        filter.page,
        filter.limit
      );

      const { result, ...meta } = res.data.data;
      setDataList(result);
      setPageMeta(meta);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal Mengambil data partisipan, silakan coba lain kali",
      });
    }
  };

  useEffect(() => {
    getDataList();
  }, [filter, academicYear]);

  // create update
  const [searchUser, setSearchUser] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleUserSelection = (userId: string) => {
    setSelectedUsers((prevSelected) => {
      if (prevSelected.includes(userId)) {
        return prevSelected.filter((id) => id !== userId);
      } else {
        return [...prevSelected, userId];
      }
    });
  };

  const handleSearchUser = async () => {
    form.setFieldValue("user_id", []);
    try {
      const res = await User.showAll(searchUser);

      const filteredUsers = (res.data?.data?.result ?? [])
        .filter((user: { id: any; role_id: any }) => {
          return (
            user.role_id === 8 &&
            !dataList.some(
              (data) =>
                data.user_id === user.id && data.academic_year === academicYear
            )
          );
        })
        .map((user: any) => ({
          ...user,
          displayName: `${user.full_name} - (${user.email})`, // Gabungkan full_name dan email
        }));
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Gagal mencari user", error);
    }
  };

  const form = useFormik({
    initialValues: {
      id: "",
      user_id: [] as string[], // Memastikan tipe array string
      academic_year: "",
      target: 0,
    },
    validationSchema: schema,
    validateOnChange: false,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      form.setFieldValue("academic_year", academicYear);
      const { id, academic_year, target } = values;
      setSubmitting(false);

      try {
        const payload: any = { academic_year, target };

        if (!id) {
          payload.user_ids = selectedUsers;
          await ForCountry.create(payload);
        } else {
          await ForCountry.update(id, payload);
        }

        resetForm();
        closeModal(modalFormId);
        getDataList();

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: `Berhasil ${id ? "mengedit" : "menambahkan"} partisipan`,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Gagal ${id ? "mengedit" : "menambahkan"} partisipan`,
        });
      } finally {
        setSubmitting(true);
      }
    },
  });

  useEffect(() => {
    form.setFieldValue("academic_year", academicYear);
  }, [academicYear]);

  const handleReset = () => {
    const savedAcademicYear = form.values.academic_year;
    form.resetForm({
      values: {
        ...form.initialValues,
        academic_year: savedAcademicYear,
      },
    });
    setSearchUser("");
  };

  // handle get one
  const [isGetLoading, setIsGetLoading] = useState(false);
  const getData = async (id: string) => {
    setIsGetLoading(true);

    try {
      const res = await ForCountry.showOne(id);

      form.setValues({
        id: res.data.data?.id ?? "",
        user_id: res.data.data?.user_id ? [res.data.data.user_id] : [],
        academic_year: res.data.data?.academic_year ?? "",
        target: res.data.data?.target ?? 0,
      });
      setSearchUser(res.data.data?.user?.full_name ?? "");

      openModal(modalFormId);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Gagal mendapatkan data partisipan`,
      });
    } finally {
      setIsGetLoading(false);
    }
  };

  // delete
  const [isDelLoading, setIsDelLoading] = useState(false);
  const deleteData = async (id: string, xtra: string) => {
    Swal.fire({
      icon: "question",
      title: "Anda Yakin?",
      text: `Aksi ini tidak dapat dibatalkan. Apakah Anda yakin ingin melanjutkan hapus ${xtra}?`,
      showCancelButton: true,
      confirmButtonText: "Yakin",
      cancelButtonText: "Batalkan",
    }).then(async (result) => {
      try {
        setIsDelLoading(true);
        if (result.isConfirmed) {
          await ForCountry.delete(id);

          Swal.fire({
            icon: "success",
            title: "Aksi Berhasil",
            text: "Berhasil menghapus data partisipan",
          });

          getDataList();
        }
      } catch {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Gagal menghapus data partisipan",
        });
      } finally {
        setIsDelLoading(false);
      }
    });
  };
  useEffect(() => {
    setIsButtonDisabled(searchUser.trim() === "");
  }, [searchUser]);
  return (
    <>
      <Modal id={modalFormId} onClose={() => handleReset()}>
        <form onSubmit={form.handleSubmit}>
          <h3 className="text-xl font-bold mb-6">
            {form.values.id ? "Edit" : "Tambah"} Partisipan
          </h3>

          {form.values.id ? (
            <Input label="User" value={searchUser} disabled />
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Input
                  label="Cari user"
                  placeholder="Cari berdasarkan username"
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                />
                <div className="pt-5">
                  <button
                    onClick={handleSearchUser}
                    disabled={isButtonDisabled}
                    className="btn btn-primary"
                  >
                    <FaSearch />
                  </button>
                </div>
              </div>

              {users.length > 0 && (
                <div className="overflow-y-auto max-h-60">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={`user-${user.id}`}
                        name="user_id"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleUserSelection(user.id)}
                      />
                      <label
                        htmlFor={`user-${user.id}`}
                        className="ml-2 cursor-pointer"
                      >
                        {user.displayName}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          {/* {form.values.id ? (
            <Input label="User" value={searchUser} disabled />
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Input
                  label="Cari user"
                  placeholder="Cari berdasarkan username"
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                />
                <div className="pt-5">
                  <button
                    onClick={handleSearchUser}
                    type="button"
                    className="btn btn-primary"
                  >
                    <FaSearch />
                  </button>
                </div>
              </div>

              <div className="divider"></div>

              <Select
                label="User"
                name="user_id"
                keyValue="id"
                keyDisplay="displayName"
                hint={`Terdapat ${users.length} user`}
                options={users}
                value={form.values.user_id}
                onChange={form.handleChange}
                errorMessage={form.errors.user_id}
              />
            </>
          )} */}

          <Input
            label="Tahun pelajaran"
            name="academic_year"
            value={form.values.academic_year}
            onChange={form.handleChange}
            errorMessage={form.errors.academic_year}
            disabled
          />

          <Input
            type="number"
            label="Target satu tahun (Jam)"
            name="target"
            value={form.values.target}
            onChange={form.handleChange}
            errorMessage={form.errors.target}
          />

          <button
            type="submit"
            className="btn btn-secondary w-full mt-10"
            disabled={form.isSubmitting}
          >
            {form.isSubmitting ? "Menyimpan..." : "Simpan"}
          </button>
        </form>
      </Modal>

      <div className="w-full flex justify-center flex-col items-center p-3">
        <span className="font-bold text-xl my-5">
          ONE DAY FOR YOUR COUNTRY PARTISIPAN
        </span>
        <div className="w-full p-3 bg-white rounded-lg ">
          <div className="w-full flex gap-3 justify-between">
            <Link
              to={"/guru/one-day"}
              className="btn btn-ghost bg-blue-500 text-white btn-md"
            >
              <IoChevronBack />
              Kembali
            </Link>
            <div className="flex gap-5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleFilter("search", search);
                }}
                className="join"
              >
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari"
                  slotRight={<FaSearch />}
                />
              </form>
              <button
                onClick={() => openModal(modalFormId)}
                className="btn btn-ghost bg-blue-500 text-white"
              >
                <FaPlus />
                Tambah
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              {/* head */}
              <thead className="bg-blue-400">
                <tr>
                  <th>No</th>
                  <th>User</th>
                  <th>Tahun Ajar</th>
                  <th>Target</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dataList.map((dat, i) => (
                  <tr key={i}>
                    <th>
                      {i + 1 + (pageMeta?.page ?? 0) * (pageMeta?.limit ?? 0)}
                    </th>
                    <td>{dat.user?.full_name ?? "-"}</td>
                    <td>{dat.academic_year ?? "-"}</td>
                    <td>{dat.target ?? "-"} jam</td>

                    <td>
                      <div className="join">
                        <button
                          className="btn btn-secondary btn-sm join-item  tooltip"
                          data-tip="Edit"
                          disabled={isGetLoading}
                          onClick={() => getData(dat.id)}
                        >
                          <FaPencil />
                        </button>
                        <button
                          className="btn btn-error btn-sm join-item text-white tooltip"
                          data-tip="Hapus"
                          disabled={isDelLoading}
                          onClick={() =>
                            deleteData(
                              dat.id,
                              `partisipan "${dat.user?.full_name ?? ""}"`
                            )
                          }
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* control  */}
          <PaginationControl
            meta={pageMeta}
            onPrevClick={() => handleFilter("page", pageMeta.page - 1)}
            onNextClick={() => handleFilter("page", pageMeta.page + 1)}
            onJumpPageClick={(val) => handleFilter("page", val)}
            onLimitChange={(val) => handleFilter("limit", val)}
          />
        </div>
      </div>
    </>
  );
};

export default OdfycParticipants;
