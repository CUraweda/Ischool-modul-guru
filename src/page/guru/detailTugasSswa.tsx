import React from "react";
import { Link } from "react-router-dom";

const DetailTugasSswa = () => {
  return (
    <>
      <div className="text-sm breadcrumbs">
        <ul>
          <li>
            <Link to={"/guru/adm-siswa"}>
              <a>Siswa</a>
            </Link>
          </li>
          <li>
            <Link to={"/guru/adm-siswa"}>
              <a>Administrasi</a>
            </Link>
          </li>
          <li>Tugas</li>
        </ul>
      </div>
    </>
  );
};

export default DetailTugasSswa;
