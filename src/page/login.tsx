import { useFormik } from "formik";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import bg from "../assets/bg2.png";
import logo from "../assets/sade.png";
import { Input } from "../component/Input";
import { useLogin } from "../hooks/useLogin";
import { employeeStore, Store } from "../store/Store";
import { token } from "../utils/common";

const schema = Yup.object({
  email: Yup.string().email("Email tidak valid").required("Email harus diisi"),
  password: Yup.string().required("Password harus diisi"),
});

const Login = () => {
  const navigate = useNavigate();
  const { setRole, setId } = Store();
  const {
    setEmployee,
    setFormTeachers,
    setFormSubjects,
    setFormXtras,
    setHeadmaster,
    setIsAsessor,
  } = employeeStore();

  const [showPassword, setShowPassword] = useState(false);

  const { mutate: login } = useLogin({
    onSuccess: (res) => {
      const { data, tokens } = res;

      const role = data.role_id;
      const id = data.id;
      setRole(role.toString());
      setId(id.toString());

      const {
        id: employeeId,
        full_name,
        headmaster,
        formextras,
        formsubjects,
        formteachers,
        is_asessor,
      } = data?.employee ?? {};

      if (employeeId && full_name) setEmployee({ id: employeeId, full_name });
      if (headmaster) setHeadmaster(headmaster);
      if (formteachers) setFormTeachers(formteachers);
      if (formsubjects) setFormSubjects(formsubjects);
      if (formextras) setFormXtras(formextras);
      if (is_asessor) setIsAsessor(is_asessor);

      if (tokens.access.token) {
        token.set(tokens.access.token);
      }

      if ([6, 4, 11].includes(role)) {
        navigate("/guru/dashboard");
      } else if (role === 2) {
        navigate("/keuangan/");
      } else if (role === 5) {
        navigate("/hrd/rekap-presensi");
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Akun anda tidak memiliki akses!",
        });
      }
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Cek kembali email dan password anda!",
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,
    validateOnChange: false,
    onSubmit: async (values) => {
      const { email, password } = values;
      login({ email: email.toLowerCase(), password });
    },
  });

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div
      className="w-full flex flex-col justify-center items-center min-h-screen"
      style={{ backgroundImage: `url('${bg}')`, backgroundSize: "cover" }}
    >
      <div className="w-full sm:w-1/3 glass shadow-2xl flex justify-center items-center p-4 rounded-md flex-col">
        <div className="w-32">
          <img src={logo} alt="Logo" />
        </div>
        <span className="my-10 text-3xl text-black font-bold">Login</span>
        <form
          onSubmit={formik.handleSubmit}
          className="w-full flex flex-col px-6 pb-8"
        >
          <Input
            label="Email"
            name="email"
            placeholder="email@example.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            errorMessage={formik.errors.email}
          />
          <div className="relative w-full">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              errorMessage={formik.errors.password}
              className="pr-10" // Add padding-right to prevent text overlap
            />
            <button
              type="button"
              className="absolute right-3 top-[3.7rem] transform -translate-y-1/2"
              onClick={toggleShowPassword}
            >
              {showPassword ? (
                <FaEyeSlash size="1.5rem" />
              ) : (
                <FaEye size="1.5rem" />
              )}
            </button>
          </div>
          <button
            disabled={formik.isSubmitting}
            className="btn btn-ghost bg-green-500 text-white w-full mt-10"
            type="submit"
          >
            {formik.isSubmitting ? (
              <span className="loading loading-infinity loading-lg"></span>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
