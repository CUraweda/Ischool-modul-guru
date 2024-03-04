import React, { FC } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface Props {
  children?: React.ReactNode;
  name?: string;
}
const Layout: FC<Props> = ({ children, name }) => {
  return (
    <>
      <div className="flex flex-col min-h-screen" data-theme="light">
        <main className="flex flex-grow">
          <Sidebar />
          <div className="w-full">
            <Navbar />
            {children}
          </div>
        </main>
      </div>
    </>
  );
};

export default Layout;
