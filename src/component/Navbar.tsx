import { BsList } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import moment from "moment";


const Navbar = () => {

  moment.locale('id');
  const date = moment().format('llll');
  
  return (
    <div>
      <div className="navbar shadow-md">
        <div className="flex-1">
          <label className="text-3xl lg:hidden" htmlFor="my-drawer-2">
          
            <BsList />
          </label>
          <label className="btn btn-ghost text-xl" htmlFor="my-drawer-2">
           {date}
          </label>
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
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
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
