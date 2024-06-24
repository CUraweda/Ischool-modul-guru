import React from "react";

const ODFYC = () => {
  return (
    <div className="w-full p-3">
      <div className="flex w-full flex-col justify-center items-center p-3">
        <span className="font-bold text-xl">ONE DAY FOR YOUR COUNTRY</span>
      </div>
      <div className="flex w-full justify-center items-center bg-white p-3 rounded-md">
        <div className="overflow-x-auto w-full">
          <table className="table table-zebra">
            {/* head */}
            <thead className="bg-blue-400">
              <tr>
                <th></th>
                <th>Name</th>
                <th>Job</th>
                <th>Favorite Color</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr>
                <th>1</th>
                <td>Cy Ganderton</td>
                <td>Quality Control Specialist</td>
                <td>Blue</td>
              </tr>
              {/* row 2 */}
              <tr>
                <th>2</th>
                <td>Hart Hagerty</td>
                <td>Desktop Support Technician</td>
                <td>Purple</td>
              </tr>
              {/* row 3 */}
              <tr>
                <th>3</th>
                <td>Brice Swyre</td>
                <td>Tax Accountant</td>
                <td>Red</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ODFYC;
