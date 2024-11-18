import React, { FC, useEffect } from "react";
import Navbar from "./NavbarTrainFace";
import bg from "../assets/bg2.png";
import { employeeStore, Store } from "../store/Store";
import { Auth } from "../middleware/api";

interface Props {
  children?: React.ReactNode;
  name?: string;
}
const Layout: FC<Props> = ({ children }) => {
  const { role } = Store();
  const {
    setEmployee,
    setHeadmaster,
    setFormTeachers,
    setFormSubjects,
    setFormXtras,
  } = employeeStore();
  const Role = role ? parseInt(role, 10) : 0;

  const getMe = async () => {
    try {
      const res = await Auth.MeData();

      const {
        id,
        full_name,
        headmaster,
        formextras,
        formsubjects,
        formteachers,
      } = res.data.data?.employee ?? {};

      if (id && full_name) setEmployee({ id, full_name });
      if (headmaster) setHeadmaster(headmaster);
      if (formteachers) setFormTeachers(formteachers);
      if (formsubjects) setFormSubjects(formsubjects);
      if (formextras) setFormXtras(formextras);
    } catch {}
  };

  useEffect(() => {
    getMe();
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen" data-theme="light">
        <div className="flex flex-grow ">
          <div
            className="w-full overflow-x-hidden"
            style={{
              ...(Role !== 5
                ? { backgroundImage: `url('${bg}')`, backgroundSize: "cover" }
                : { backgroundColor: "#BFDCFE" }),
            }}
          >
            <div className="z-40">
              <Navbar />
            </div>
            <div className="">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
