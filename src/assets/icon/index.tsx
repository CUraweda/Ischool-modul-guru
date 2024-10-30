import { search } from "./search";

type IconName = "search";

const list = {
  search,
};

const Icon = ({ name }: { name: IconName }) => {
  const Component = list[name as keyof typeof list];
  return <Component />;
};
export default Icon;
