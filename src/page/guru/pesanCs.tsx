import {  BsSend } from "react-icons/bs";

const PesanCs = () => {
  return (
    <>
      <div className="w-full flex flex-col items-center pb-10 min-h-screen relative">
       
        <div className="w-full text-center my-10">
          <span className="text-4xl font-bold">Customer Care</span>
        </div>
        <div className=" w-5/6 shadow-lg max-h-[650px] min-h-[650px] relative">
        <div className="w-[300px] h-[300px] bg-red-500 absolute bottom-20 right-0 rounded-full blur-md"/>
        <div className="w-[500px] h-[500px] bg-yellow-500 absolute top-20 rounded-full blur-md"/>
          <div className="flex w-full">
            <div className="w-1/4 shadow-md min-h-[650px] z-10 glass">
              <div className="w-full p-5 text-3xl font-bold bg-white">Chats</div>
              <div className="w-full p-3 bg-blue-300 flex gap-2">
                <div className="avatar">
                  <div className="w-12 rounded-full">
                    <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                  </div>
                </div>
                <div className="flex flex-col w-full">
                  <span className="font-bold ">namas</span>
                  <div className="flex justify-between w-full">
                    <div className="line-clamp-1">
                      namasasdasdlasdasdf sdfmamsldaaskjdasdfjn
                    </div>
                    <div>09.00</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-3/4 glass">
              <div className="w-full p-5 text-3xl font-bold bg-white shadow-md">
                Namaku
              </div>
              <div className="p-3 w-full  min-h-[500px] max-h-[500px] overflow-auto">
                <div className="chat chat-start ">
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img
                        alt="Tailwind CSS chat bubble component"
                        src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                      />
                    </div>
                  </div>

                  <div className="chat-bubble chat-bubble-primary">
                    You were the Chosen One!
                  </div>
                </div>
                
                <div className="chat chat-end">
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img
                        alt="Tailwind CSS chat bubble component"
                        src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                      />
                    </div>
                  </div>

                  <div className="chat-bubble chat-bubble-accent">
                    I love you!
                  </div>
                </div>
                
              </div>

              <div className="w-full px-5 ">
                <label className="input input-bordered flex items-center gap-2">
                  <input type="text" className="grow" placeholder="Search" />
                  <span className="text-2xl cursor-pointer">
                    <BsSend />
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PesanCs;
