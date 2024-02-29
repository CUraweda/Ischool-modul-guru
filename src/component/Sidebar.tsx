import { BsListNested } from "react-icons/bs";
import { useState } from "react";
import { iconMapping } from "../component/icon/icon";
import logo from "../assets/sade.png";
import { Link } from "react-router-dom";
import menu from "../data/menu.json";

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
  const Side = sessionStorage.getItem("side");
  const [activeMenuItem, setActiveMenuItem] = useState<string>(
    Side ? Side : "/"
  );
  const handleMenuItemClick = (name: string) => {
    setActiveMenuItem(name);
    sessionStorage.setItem("side", name);
  };

  return (
    <div>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-side shadow-lg">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          />
          <ul className="menu p-4 w-80 min-h-full bg-base-100">
            <div className="w-full flex justify-between mb-10 items-center">
              <div className="flex justify-center items-center gap-1">
                <img src={logo} alt="logo" className="w-20"/>
                <p className="sm:text-xl text-xl font-bold">
                  Sekolah Alam Depok
                </p>
              </div>
              <label
                htmlFor="my-drawer-2"
                className=" text-3xl font-bold lg:hidden"
              >
                <BsListNested />
              </label>
            </div>
            <ul className="menu font-bold rounded-lg max-w-xs w-full text-gray-500">
              {menu.map((item: Menu, index: number) => (
                <>
                  {item.submenu ? (
                    <li className="my-2" key={`submenu-` + index}>
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
                              <Link to={Item.url}>
                                <li
                                  key={`subtitle-` + Index}
                                  className={`my-2 transition duration-200 rounded-md ${
                                    activeMenuItem === Item.url
                                      ? "bg-blue-100 text-blue-600"
                                      : ""
                                  }`}
                                  onClick={() => handleMenuItemClick(Item.url)}
                                >
                                  <a>{Item.name}</a>
                                </li>
                              </Link>
                            )
                          )}
                        </ul>
                      </details>
                    </li>
                  ) : (
                    <Link to={item.url}>
                      <li
                        className={`my-2 transition duration-200 rounded-md ${
                          activeMenuItem === item.url
                            ? "bg-blue-100 text-blue-600"
                            : ""
                        }`}
                        key={`menu-` + index}
                        onClick={() => handleMenuItemClick(item.url)}
                      >
                        <p>
                          <span className="text-2xl">
                            {iconMapping[item.icon]}
                          </span>
                          <a>{item.title}</a>
                        </p>
                      </li>
                    </Link>
                  )}
                </>
              ))}
            </ul>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
