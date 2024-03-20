import { useState} from "react";
import { useNavigate} from 'react-router-dom';
import logo from "../assets/sade.png";

const login = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const Login = () => {
        if(username === 'guru'){
            sessionStorage.setItem('role' , 'guru')
            navigate("/guru/dashboard")
        } else if (username === 'karyawan'){
            sessionStorage.setItem('role' , 'karyawan')
            navigate("/karyawan/dashboard")
        } else{
            navigate("/")
        }
    }


  return (
    <>
      <div className="w-full flex flex-col justify-center items-center min-h-screen" style={{backgroundImage: "url('https://imansulaiman.com/wp-content/uploads/2019/04/25db546b-4135-4c2e-9be2-2409dbfa4b36.jpg')", backgroundSize: 'cover'}}>
       
        <div className="w-full sm:w-1/3 glass shadow-xl flex justify-center items-center p-4 rounded-md flex-col">
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
                placeholder="Type here"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input input-bordered w-5/6 glass shadow-md text-black"
              />
            </div>
            <div className="w-full flex justify-center flex-col items-center">
              <label htmlFor="" className="w-5/6 font-bold text-black">
                Password
              </label>
              <input
                type="password"
                placeholder="Type here"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-5/6 glass shadow-md text-black"
              />
            </div>
            <div className="w-full flex justify-center mt-10">
                <button className="btn btn-ghost bg-green-500 text-white w-5/6" onClick={Login}>Login</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default login;
