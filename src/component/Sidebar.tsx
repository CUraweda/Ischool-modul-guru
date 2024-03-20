import React from "react";
import { BsListNested } from "react-icons/bs";
import { useState } from "react";
import { iconMapping } from "../component/icon/icon";
import logo from "../assets/sade.png";
import { Link } from "react-router-dom";
import menu from "../data/menu.json";
import karyawan from "../data/karyawan.json"

interface Menu {
  title: string;
  url: string;
  icon: string;
  submenu: boolean;
  subtitle?: subtitle[];
}

type subtitle = {
  name: string;
  url: string;
};

const Sidebar = () => {
  const role = sessionStorage.getItem("role")
  const Side = sessionStorage.getItem("side");
  const [activeMenuItem, setActiveMenuItem] = useState<string>(
    Side ? Side : "/"
  );
  const handleMenuItemClick = (name: string) => {
    setActiveMenuItem(name);
    sessionStorage.setItem("side", name);
  };
  let data = []
  data = role === 'guru' ? menu : karyawan

  return (
    <div>
      <div className="drawer lg:drawer-open top-0 sticky z-10">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-side shadow-lg">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          />
          <ul className="menu p-4 w-80 min-h-full bg-base-100 ">
            <div className="w-full flex justify-between mb-10 items-center  bg-white pb-6">
              <div className="flex justify-center items-center gap-1">
                <img src={logo} alt="logo" className="w-20" />
                <p className="sm:text-xl text-xl font-bold">
                  Sekolah Alam Depok
                </p>
              </div>
              <label
                htmlFor="my-drawer-2"
                className="btn btn-ghost text-3xl font-bold lg:hidden"
              >
                <BsListNested />
              </label>
            </div>
            <ul className="menu font-bold rounded-lg max-w-xs w-full text-gray-500">
              {data.map((item: Menu, index: number) => (
                <React.Fragment key={`menu-` + index}>
                  {item.submenu ? (
                    <li className="my-2">
                      <details>
                        <summary>
                          <span className="text-2xl">
                            {iconMapping[item.icon]}
                          </span>
                          <a>{item.title}</a>
                        </summary>
                        <ul>
                          {item.subtitle?.map(
                            (Item: subtitle, Index: number) => (
                              <Link to={Item.url} key={`link-` + Index}>
                                <li
                                  key={`subtitle-` + Index}
                                  className={`my-2 transition duration-200 rounded-md ${
                                    activeMenuItem === Item.url
                                      ? "bg-blue-100 text-blue-600"
                                      : ""
                                  }`}
                                  onClick={() => handleMenuItemClick(Item.url)}
                                >
                                  <p>{Item.name}</p>
                                </li>
                              </Link>
                            )
                          )}
                        </ul>
                      </details>
                    </li>
                  ) : (
                    <Link to={item.url} key={`link-` + index}>
                      <li
                        className={`my-2 transition duration-200 rounded-md ${
                          activeMenuItem === item.url
                            ? "bg-blue-100 text-blue-600"
                            : ""
                        }`}
                        onClick={() => handleMenuItemClick(item.url)}
                      >
                        <div>
                          <span className="text-2xl">
                            {iconMapping[item.icon]}
                          </span>
                          <p>{item.title}</p>
                        </div>
                      </li>
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </ul>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
