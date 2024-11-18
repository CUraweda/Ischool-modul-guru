import { search } from "./search";
import { edit } from "./edit";
import { board } from "./board";

export type IconName = "search" | "edit" | "board";

const list = {
  search,
  edit,
  board,
};

const Icon = ({ name }: { name: IconName }) => {
  const Component = list[name as keyof typeof list];
  return <Component />;
};
export default Icon;
