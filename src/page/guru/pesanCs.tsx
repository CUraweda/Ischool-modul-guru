import { BsSend } from "react-icons/bs";
import { CustomerCare } from "../../midleware/api";
import { Store } from "../../store/Store";
import { useEffect, useState } from "react";
import Modal from "../../component/modal";

const PesanCs = () => {
  const { token, id, role } = Store();
  const [fetch, setFetch] = useState<any[]>([]);
  const [fetchKeuangan, setFetchKeuangan] = useState<any[]>([]);
  const [fetchGuru, setFetchGuru] = useState<any[]>([]);
  const [message, setMessage] = useState<any[]>([]);
  const [currentChatUser, setCurrentChatUser] = useState<string>("");
  const [currentWithId, setCurrentWithId] = useState<number | null>(null);
  const [chatMessage, setChatMessage] = useState("");

  const showModal = (props: string) => {
    let modalElement = document.getElementById(props) as HTMLDialogElement;
    if (modalElement) {
      modalElement.showModal();
    }
  };

  const closeModal = (props: string) => {
    let modalElement = document.getElementById(props) as HTMLDialogElement;
    if (modalElement) {
      modalElement.close();
    }
  };

  const FetchData = async () => {
    try {
      const response = await CustomerCare.GetAllUserChat(token, id);
      setFetch(response.data.data);
    } catch (error) {
      console.error("Error fetching user chats:", error);
    }
  };

  const FetchChatList = async () => {
    try {
      if (role === "2") {
        const response = await CustomerCare.GetUserToChat(token);
        setFetchKeuangan(response.data.data.result);
      } else {
        const response = await CustomerCare.GetUserToChatGuru(token);
        setFetchGuru(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching chat list:", error);
    }
  };

  const GetMessage = async (item: any) => {
    try {
      const withId = item.withUser.id;
      setCurrentChatUser(item.withUser.full_name);
      setCurrentWithId(withId);
      const response = await CustomerCare.GetMessage(token, id, withId);
      if (
        response.data &&
        response.data.data[0] &&
        response.data.data[0].messages
      ) {
        setMessage(response.data.data[0].messages);
      } else {
        console.error("No messages found");
        setMessage([]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessage([]);
    }
  };

  const PostMessage = async () => {
    if (chatMessage.trim() === "") return;
    if (currentWithId === null) {
      console.error("No user selected to chat with");
      return;
    }

    const data = {
      user_id: id,
      with_id: currentWithId,
      message: chatMessage,
    };

    try {
      await CustomerCare.PostMessage(token, data);
      setMessage((prevMessages) => [
        ...prevMessages,
        { message: chatMessage, sender_id: id },
      ]);
      setChatMessage("");
      FetchData();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    FetchData();
    FetchChatList();
  }, [id, role]);

  return (
    <>
      <div className="w-full flex flex-col items-center pb-10 min-h-screen relative">
        <div className="w-full text-center my-10">
          <span className="text-4xl font-bold">Customer Care</span>
        </div>
        <div className="w-5/6 shadow-lg max-h-[650px] min-h-[650px] relative">
          <div className="flex w-full">
            <div className="w-1/4 shadow-md min-h-[650px] z-10 glass">
              <div className="w-full p-5 text-3xl font-bold bg-white">
                Chats
              </div>
              <div className="overflow-y-auto h-[25rem]">
                {fetch.map((item) => (
                  <div
                    className="w-full p-3 bg-blue-300 flex gap-2 cursor-pointer"
                    onClick={() => GetMessage(item)}
                    key={item.id}
                  >
                    <div className="chat-image avatar">
                      <div className="w-10 rounded-full">
                        <img
                          alt="Avatar"
                          src="https://thinksport.com.au/wp-content/uploads/2020/01/avatar-.jpg"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col w-full">
                      <span className="font-bold">
                        {item.withUser.full_name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="toast">
                <div className="dropdown dropdown-top dropdown-end">
                  <label
                    className="btn btn-primary btn-circle"
                    onClick={() => showModal("daftar-chat")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  </label>
                </div>
              </div>
            </div>

            <div className="w-3/4 glass">
              <div className="w-full p-5 text-3xl font-bold bg-white shadow-md">
                {currentChatUser || "Namaku"}
              </div>
              <div className="p-3 w-full min-h-[500px] max-h-[500px] overflow-auto">
                {message.length > 0 ? (
                  message.map((msg, index) => (
                    <div
                      key={index}
                      className={
                        msg.sender_id != id
                          ? "chat chat-start"
                          : "chat chat-end"
                      }
                    >
                      <div
                        className={`chat-bubble ${
                          msg.sender_id != id
                            ? "chat-bubble-accent"
                            : "chat-bubble-primary"
                        }`}
                      >
                        {msg.message}
                        {/* <div>
                          {msg.createdAt.split("T")[0]},
                          {msg.createdAt.split("T")[1].split(".")[0]}
                        </div> */}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500">
                    Tidak ada pesan
                  </div>
                )}
              </div>
              <div className="w-full px-5 ">
                <label className="input input-bordered flex items-center gap-2">
                  <input
                    type="text"
                    className="grow"
                    placeholder="Type your message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                  />
                  <span
                    className="text-2xl cursor-pointer"
                    onClick={PostMessage}
                  >
                    <BsSend />
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <Modal id="daftar-chat">
          <div className="w-full max-w-lg mx-auto ">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h2 className="text-xl font-bold">Daftar Chat</h2>
            </div>
            <ul className="space-y-2 max-h-[400px] overflow-y-auto">
              {role === "2"
                ? fetchKeuangan
                    .filter((item) => [1, 2, 3, 5, 10].includes(item.role_id))
                    .map((item) => (
                      <li
                        key={item.id}
                        className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer flex justify-between items-center"
                        onClick={() => {
                          setCurrentWithId(item.user ? item.user.id : item.id);
                          setCurrentChatUser(
                            item.user ? item.user.full_name : item.full_name
                          );
                          closeModal("daftar-chat");
                          GetMessage(item);
                        }}
                      >
                        <span className="font-semibold">
                          {item.user ? item.user.full_name : item.full_name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {item.user ? item.user.email : item.email}
                        </span>
                      </li>
                    ))
                : fetchGuru.map((item) => (
                    <li
                      key={item.id}
                      className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer flex justify-between items-center"
                      onClick={() => {
                        setCurrentWithId(item.user ? item.user.id : item.id);
                        setCurrentChatUser(
                          item.user ? item.user.full_name : item.full_name
                        );
                        closeModal("daftar-chat");
                        GetMessage(item);
                      }}
                    >
                      <span className="font-semibold">
                        {item.user ? item.user.full_name : item.full_name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {item.user ? item.user.email : item.email}
                      </span>
                    </li>
                  ))}
            </ul>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default PesanCs;
