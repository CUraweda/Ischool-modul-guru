import React, { useEffect, useState } from "react";
import { BsListNested } from "react-icons/bs";
import { Link } from "react-router-dom";
import logo from "../assets/sade.png";
import { iconMapping } from "../component/icon/icon";
import menuHRD from "../data/hrd.json";
import menuKeuangan from "../data/keuangan.json";
import menu from "../data/menu.json";
import { Year } from "../middleware/api";
import { employeeStore, globalStore, Store } from "../store/Store";
import { getAcademicYears, getCurrentAcademicYear } from "../utils/common";
// import karywan from "../data/karyawan.json"

interface Menu {
  title: string;
  url: string;
  icon: string;
  roles?: number[];
  hide?: boolean;
  badge?: string;
  submenu: boolean;
  subtitle?: subtitle[];
}

type subtitle = {
  name: string;
  badge?: string;
  hide?: boolean;
  url: string;
};

const Sidebar = () => {
  const { academicYear, setAcademicYear } = globalStore();
  const Side = sessionStorage.getItem("side") || "/";
  const [data, setData] = useState<Menu[]>([]);
  const [activeMenuItem, setActiveMenuItem] = useState<string>(Side);
  const { role } = Store();
  const [years, setYears] = useState<any[]>([]);
  const { isAsessor } = employeeStore();

  const handleMenuItemClick = (name: string) => {
    setActiveMenuItem(name);
    sessionStorage.setItem("side", name);
  };

  const Role = role ? parseInt(role, 10) : 0;

  const getYears = async () => {
    let years = [];
    try {
      const res = await Year.getYear("", 10000, 0);
      const { result } = res.data.data;
      years = result;
    } catch (error) {
      console.log("ERR: get academic years from server", error);
      const fallBackYears = getAcademicYears().map((dat) => ({
        name: dat,
        status: dat == getCurrentAcademicYear() ? "Aktif" : "Tidak aktif",
      }));
      years = fallBackYears;
    }

    setYears(years);
    years.forEach((y: any) => {
      if (y.status == "Aktif") setAcademicYear(y.name);
    });
  };

  useEffect(() => {
    getYears();
  }, []);

  useEffect(() => {
    if (Role === 6) {
      setData(menu);
    } else if (Role === 2) {
      setData(menuKeuangan);
    } else if (Role === 5) {
      setData(menuHRD);
    } else {
      setData(menu);
    }
  }, [Role]);

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        />
        <ul className="menu p-4 w-80 bg-base-100 min-h-screen">
          <div className="w-full flex justify-between mb-3 items-center  pb-6">
            <div className="flex justify-center items-center gap-1">
              <img src={logo} alt="logo" className="w-20" />
              <p className="sm:text-xl text-xl font-bold">Sekolah Alam Depok</p>
            </div>
            <label
              htmlFor="my-drawer-2"
              className="btn btn-ghost text-3xl font-bold lg:hidden"
            >
              <BsListNested />
            </label>
          </div>
          <select
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="text-small select select-bordered w-full mb-6"
          >
            {years.map((year, i) => (
              <option
                key={i}
                className="text-small"
                value={year.name}
                selected={year.status == "Aktif"}
              >
                {year.name}
              </option>
            ))}
          </select>
          <ul className="menu font-bold rounded-lg max-w-xs w-full text-gray-500">
            {data
              .filter((item) => !item.hide)
              .filter((item) => !(item.title === "Penilaian" && !isAsessor))
              .filter((item) =>
                item.roles && role
                  ? item.roles.map((r) => r.toString()).includes(role)
                  : true
              )
              .map((item: Menu, index: number) => (
                <React.Fragment key={`menu-` + index}>
                  {item.submenu ? (
                    <li className="my-2">
                      <details>
                        <summary>
                          <span className="text-2xl">
                            {iconMapping[item.icon]}
                          </span>
                          <a>{item.title}</a>
                          {item.badge && (
                            <span className="badge badge-warning badge-sm">
                              {item.badge}
                            </span>
                          )}
                        </summary>
                        <ul>
                          {item.subtitle
                            ?.filter((s) => !s.hide)
                            .map((Item: subtitle, Index: number) => (
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
                                  <p>
                                    {Item.name}
                                    {Item.badge && (
                                      <span className="badge badge-warning badge-sm">
                                        {Item.badge}
                                      </span>
                                    )}
                                  </p>
                                </li>
                              </Link>
                            ))}
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
                          {item.badge && (
                            <span className="badge badge-warning badge-sm">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </li>
                    </Link>
                  )}
                </React.Fragment>
              ))}
          </ul>
          <div className="mt-auto"></div>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
