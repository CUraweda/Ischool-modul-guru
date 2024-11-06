import { FiInbox } from "react-icons/fi";

function NoData() {
  return (
    <div className="w-full h-48 flex justify-center items-center text-slate-400">
      <div>
        <FiInbox size={50} className="mx-auto" />
        <h2 className="font-medium">No Data</h2>
      </div>
    </div>
  );
}

export default NoData;
