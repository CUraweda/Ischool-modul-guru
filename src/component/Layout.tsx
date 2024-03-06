import React, { FC } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface Props {
  children?: React.ReactNode;
  name?: string;
}
const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      <div className="flex flex-col min-h-screen" data-theme="light">
        <main className="flex flex-grow">
          <div className="top-0 sticky z-10">
            <Sidebar />
          </div>
          <div className="w-full">
            <div className="top-0 sticky z-10">
              <Navbar />
            </div>
            <div>

            {children}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Layout;
