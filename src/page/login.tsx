import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/sade.png";
import bg from "../assets/bg2.png";
import { Auth } from "../midleware/api";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Store } from "../store/Store";
import Swal from "sweetalert2";

const schema = Yup.object({
  email: Yup.string().required("email required"),
  password: Yup.string().required("Password required"),
});

const login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const { setToken } = Store();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const Login = async () => {
    const { email, password } = formik.values;
    if (!email || !password) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Please check your username or password again!",
      });
      return;
    }
    try {
      setLoading(true);
      const emailLower = email.toLowerCase();
      const response = await Auth.Login(emailLower, password);
      const role = response.data.data.role_id;

      if (role !== 6) {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "akun anda tidak memiliki akses!",
        });
      } else {
        setToken(response.data.tokens.access.token);
        navigate("/guru/dashboard");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Please make sure your username and password are correct!",
      });
    } finally {
      setLoading(false);
    }
  };

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
          <div className="w-full flex flex-col gap-3 ">
            <div className="w-full flex justify-center flex-col items-center">
              <label htmlFor="" className="w-5/6 font-bold text-black">
                Username
              </label>
              <input
                type="text"
                name="email"
                placeholder="Type here"
                onChange={formik.handleChange}
                value={formik.values.email}
                className="input input-bordered w-5/6 glass shadow-md text-black"
              />
            </div>
            <div className="w-full flex justify-center flex-col items-center">
              <label htmlFor="" className="w-5/6 font-bold text-black">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Type here"
                onChange={formik.handleChange}
                value={formik.values.password}
                className="input input-bordered w-5/6 glass shadow-md text-black"
              />
            </div>
            <div className="w-full flex justify-center mt-10">
              <button
                className="btn btn-ghost bg-green-500 text-white w-5/6"
                onClick={Login}
              >
                {loading ? (
                  <span className="loading loading-infinity loading-lg"></span>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default login;
