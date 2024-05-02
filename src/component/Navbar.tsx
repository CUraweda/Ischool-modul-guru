import { BsList } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { FaBell } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();

  moment.locale("id");
  // const date = moment().format('llll');

  const logout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div>
      <div className="navbar shadow-md bg-base-100">
        <div className="flex-1">
          <label
            className="btn btn-ghost text-3xl lg:hidden"
            htmlFor="my-drawer-2"
          >
            <BsList />
          </label>
        </div>
        <div className="mr-3 ">
          <button className="btn btn-ghost btn-circle text-xl">
            <FaBell />
          </button>
        </div>
        <div className="flex-none gap-5">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <a className="justify-between">Profile</a>
              </li>

              <li onClick={logout} className="text-red-500">
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
