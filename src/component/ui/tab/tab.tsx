import React, { useState } from "react";

type Props = {
  tabs: Record<string, React.ReactNode>;
};

function Tab({ tabs }: Props) {
  const [selectedTab, setSelectedTab] = useState(0);
  const listOfTabs = Object.entries(tabs);

  return (
    <div>
      <div className="w-full flex gap-3 my-3">
        {listOfTabs
          .filter((item) => item[1])
          .map((item, index) => (
            <button
              key={index}
              onClick={() => setSelectedTab(index)}
              className={`p-3 ${selectedTab == index ? "border-b-2 font-semibold border-b-blue-600 text-md" : ""}`}
            >
              {item?.[0]}
            </button>
          ))}
      </div>
      <div className="p-3">{listOfTabs[selectedTab][1]}</div>
    </div>
  );
}

export default Tab;
