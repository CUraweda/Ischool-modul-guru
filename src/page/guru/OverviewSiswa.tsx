
const OverviewSiswa = () => {
  return (
    <>
      <div className="overflow-x-auto">
        <div className="w-full flex justify-end">
            <button id="tambah-pengumuman" className="btn btn-ghost bg-green-500 text-white">tambah</button>

        </div>
        <table className="table table-zebra mt-4">
          {/* head */}
          <thead className="bg-blue-300">
            <tr>
              <th>No</th>
              <th>Nama Siswa</th>
              <th>Kelas</th>
              <th>Pengumuman</th>
              <th>Tanggal</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr>
              <th>1</th>
              <td>9</td>
              <td>Quality Control Specialist</td>
              <td>9 Juni 2024</td>
              <td>sd</td>
            </tr>
            
          </tbody>
        </table>
      </div>
    </>
  )
}

export default OverviewSiswa