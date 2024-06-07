import React, { FC } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import bg from "../assets/bg2.png";
interface Props {
  children?: React.ReactNode;
  name?: string;
}
const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      <div className="flex flex-col min-h-screen" data-theme="light">
        <div className="flex flex-grow ">
          <div className="z-50">
            <Sidebar />
          </div>
          <div
            className="w-full"
            style={{ backgroundImage: `url('${bg}')`, backgroundSize: "cover" }}
          >
            <div className="">
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
