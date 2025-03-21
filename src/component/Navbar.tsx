import moment from "moment";
import { useEffect, useState } from "react";
import { BsList } from "react-icons/bs";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Auth, Task } from "../middleware/api";
import { employeeStore } from "../store/Store";
import { token } from "../utils/common";

const Navbar = () => {
  const navigate = useNavigate();
  const empStore = employeeStore();
  const [image, setImage] = useState<any>(null);
  moment.locale("id");
  // const date = moment().format('llll');

  const logout = () => {
    token.delete();
    sessionStorage.clear();
    empStore.clearStore();
    navigate("/");
  };
  const getMe = async () => {
    try {
      const res = await Auth.MeData();
      previewProfile(res.data.data.avatar);
    } catch (error) {
      console.error(error);
    }
  };
  const previewProfile = async (path: any) => {
    try {
      const lowerCasePath = path?.toLowerCase();
      const response = await Task.downloadTugas(path);
      let mimeType = "application/pdf";

      if (lowerCasePath.endsWith(".png")) {
        mimeType = "image/png";
      } else if (
        lowerCasePath.endsWith(".jpg") ||
        lowerCasePath.endsWith(".jpeg")
      ) {
        mimeType = "image/jpeg";
      } else {
        throw new Error("Unsupported file type");
      }

      const blob = new Blob([response.data], { type: mimeType });
      const blobUrl = window.URL.createObjectURL(blob);
      setImage(blobUrl);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMe();
  }, []);

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
                  src={
                    image ??
                    "https://korpri.padang.go.id/assets/img/dewan_pengurus/no-pict.jpg"
                  }
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <a href="/profile" className="justify-between">
                  Profile
                </a>
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
