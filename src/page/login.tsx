import { useNavigate } from "react-router-dom";
import logo from "../assets/sade.png";
import bg from "../assets/bg2.png";
import { Auth } from "../midleware/api";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Store } from "../store/Store";
import Swal from "sweetalert2";
import { Input } from "../component/Input";
// import { Input } from "../component/Input";

const schema = Yup.object({
  email: Yup.string().email("Email tidak valid").required("Email harus diisi"),
  password: Yup.string().required("Password harus diisi"),
});

const login = () => {
  const navigate = useNavigate();
  const { setToken, setRole } = Store();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,
    validateOnChange: false,
    onSubmit: async (values, { setSubmitting }) => {
      const { email, password } = values;
      try {
        setSubmitting(true);
        const emailLower = email.toLowerCase();
        const response = await Auth.Login(emailLower, password);
        const role = response.data.data.role_id;
        setRole(role.toString());

        if (role === 6) {
          setToken(response.data.tokens.access.token);
          navigate("/guru/dashboard");
        } else if (role === 2) {
          setToken(response.data.tokens.access.token);
          navigate("/keuangan/");
        } else if (role === 5) {
          setToken(response.data.tokens.access.token);
          navigate("/hrd/rekap-presensi");
        } else {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: "akun anda tidak memiliki akses!",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Cek kembali email dan password anda!",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <div
        className="w-full flex flex-col justify-center items-center min-h-screen"
        style={{ backgroundImage: `url('${bg}')`, backgroundSize: "cover" }}
      >
        <div className="w-full sm:w-1/3 glass shadow-2xl flex justify-center items-center p-4 rounded-md flex-col">
          <div className="w-32">
            <img src={logo} alt="" />
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
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              errorMessage={formik.errors.password}
            />
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
    </>
  );
};

export default login;
