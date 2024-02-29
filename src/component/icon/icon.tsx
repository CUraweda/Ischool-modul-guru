import { BsFillHouseFill, BsTable } from "react-icons/bs";
import { FaMoneyBillWave, FaRegStar } from "react-icons/fa";
import { IoCard, IoPersonOutline, IoPersonSharp } from "react-icons/io5";
import { FaChartSimple, FaGear, FaMoneyBillTransfer, FaPersonCircleCheck } from "react-icons/fa6";
import { VscServerProcess } from "react-icons/vsc";
import { MdOutlineMessage, MdOutlineTableChart } from "react-icons/md";
import { GrGroup } from "react-icons/gr";
// tambahkan import untuk ikon lainnya di sini

export const iconMapping: { [key: string]: JSX.Element } = {
  "<BsFillHouseFill />": <BsFillHouseFill />,
  "<FaMoneyBillWave />": <FaMoneyBillWave />,
  "<IoPersonSharp />": <IoPersonSharp />,
  "<FaMoneyBillTransfer />": <FaMoneyBillTransfer />,
  "<FaChartSimple />": <FaChartSimple />,
  "<IoCard />": <IoCard />,
  "<VscServerProcess />": <VscServerProcess />,
  "<FaGear />": <FaGear />,
  "<MdOutlineTableChart />" : <MdOutlineTableChart />,
  "<BsTable />" : <BsTable />,
  "<FaPersonCircleCheck />" : <FaPersonCircleCheck />,
  "<GrGroup />" : <GrGroup />,
  "<IoPersonOutline />" : <IoPersonOutline />,
  "<FaRegStar />" : <FaRegStar />,
  "<MdOutlineMessage />" : <MdOutlineMessage />,
  // tambahkan pemetaan untuk ikon lainnya di sini
};
