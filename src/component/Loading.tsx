import gif from "../assets/loading.gif";

const Loading = () => {
  return (
    <>
      <div
        className="w-screen h-screen flex flex-col justify-center items-center"
        data-theme="light"
      >
        <img src={gif} alt="loading" />
        <span className="text-md animate-pulse">Loading...</span>
      </div>
    </>
  );
};

export default Loading;
