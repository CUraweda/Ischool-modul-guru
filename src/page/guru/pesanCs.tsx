import { BsSend } from "react-icons/bs";
import { CustomerCare } from "../../middleware/api";
import { Store } from "../../store/Store";
import { useEffect, useState } from "react";
import socketService from "../../utils/socket";
import Modal from "../../component/modal";

const PesanCs = () => {
  const { id, role } = Store();
  const [userChats, setUserChats] = useState<any[]>([]);
  const [financialChats, setFinancialChats] = useState<any[]>([]);
  const [teacherChats, setTeacherChats] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentChatUser, setCurrentChatUser] = useState<string>(
    () => sessionStorage.getItem("currentChatUser") || ""
  );
  const [currentChatUserId, setCurrentChatUserId] = useState<number | null>(
    () => Number(sessionStorage.getItem("currentChatUserId")) || null
  );
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    initializeSocket();
    fetchUserChats();
    fetchChatList();
  }, [id, role]);

  useEffect(() => {
    if (currentChatUserId !== null) {
      fetchMessages();
    }
  }, [currentChatUserId]);

  const initializeSocket = async () => {
    await socketService.connect();
    socketService.on("cc_refresh", () => {
      console.log(currentChatUserId);
      fetchUserChats();
      // fetchChatList();
      fetchMessages();
    });
  };

  const fetchUserChats = async () => {
    try {
      const response = await CustomerCare.GetAllUserChat(id);
      setUserChats(response.data.data);
    } catch (error) {
      console.error("Error fetching user chats:", error);
    }
  };

  const fetchChatList = async () => {
    try {
      if (role === "2") {
        const response = await CustomerCare.GetUserToChat();
        setFinancialChats(response.data.data.result);
      } else {
        const response = await CustomerCare.GetUserToChatGuru();
        setTeacherChats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching chat list:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      console.log(currentChatUserId);
      if (currentChatUserId === null) return;
      const response = await CustomerCare.GetMessage(id, currentChatUserId);
      if (response.data?.data[0]?.messages) {
        setMessages(response.data.data[0].messages);
      } else {
        console.error("No messages found");
        setMessages([]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    if (currentChatUserId === null) {
      console.error("No user selected to chat with");
      return;
    }

    const messageData = {
      user_id: id,
      with_id: currentChatUserId,
      message: chatInput,
    };

    try {
      await CustomerCare.PostMessage(messageData);
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: chatInput, sender_id: id },
      ]);
      setChatInput("");
      fetchUserChats();
      socketService.emit("cc", {});
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleUserClick = (userId: number, fullName: string) => {
    setCurrentChatUserId(userId);
    setCurrentChatUser(fullName);
    sessionStorage.setItem("currentChatUserId", userId.toString());
    sessionStorage.setItem("currentChatUser", fullName);
  };

  const showModal = (modalId: string) => {
    const modalElement = document.getElementById(modalId) as HTMLDialogElement;
    if (modalElement) {
      modalElement.showModal();
    }
  };

  const closeModal = (modalId: string) => {
    const modalElement = document.getElementById(modalId) as HTMLDialogElement;
    if (modalElement) {
      modalElement.close();
    }
  };

  return (
    <div className="w-full flex flex-col items-center pb-10 min-h-screen relative">
      <div className="w-full text-center my-10">
        <span className="text-4xl font-bold">Customer Care</span>
      </div>
      <div className="w-5/6 shadow-lg max-h-[650px] min-h-[650px] relative">
        <div className="flex w-full">
          <div className="w-1/4 shadow-md min-h-[650px] z-10 glass">
            <div className="w-full p-5 text-3xl font-bold bg-white">Chats</div>

            <div className="relative overflow-y-auto max-h-[36rem]">
              <div className="sticky top-0 bg-white z-10">
                <input
                  type="search"
                  placeholder="Cari"
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 outline-none focus:outline-none py-2"
                />
              </div>
              {userChats
                .filter((item) =>
                  !search
                    ? true
                    : item.withUser.full_name
                        .toLowerCase()
                        .includes(search.toLowerCase())
                )
                .map((item) => (
                  <div
                    key={item.id}
                    className={`w-full p-3 ${currentChatUser === item.withUser.full_name ? "bg-blue-300" : "bg-blue-50"} flex items-center gap-2 cursor-pointer`}
                    onClick={() =>
                      handleUserClick(item.withUser.id, item.withUser.full_name)
                    }
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
              {currentChatUser || "Select a User"}
            </div>
            <div className="p-3 w-full min-h-[500px] max-h-[500px] overflow-auto">
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={
                      msg.sender_id != id ? "chat chat-start" : "chat chat-end"
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
                <div className="text-center text-gray-500">No messages</div>
              )}
            </div>
            <div className="w-full px-5">
              <form onSubmit={handleSendMessage}>
                <label className="input input-bordered flex items-center gap-2">
                  <input
                    type="text"
                    className="grow"
                    placeholder="Type your message..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                  <button type="submit" className="text-2xl cursor-pointer">
                    <BsSend />
                  </button>
                </label>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Modal id="daftar-chat">
        <div className="w-full max-w-lg mx-auto">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h2 className="text-xl font-bold">Daftar Chat</h2>
          </div>
          <ul className="space-y-2 max-h-[400px] overflow-y-auto">
            {role === "2"
              ? financialChats
                  .filter((item) => [1, 2, 3, 5, 10].includes(item.role_id))
                  .map((item) => (
                    <li
                      key={item.id}
                      className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer flex justify-between items-center"
                      onClick={() => {
                        handleUserClick(item.id, item.full_name);
                        closeModal("daftar-chat");
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
              : teacherChats.map((item) => (
                  <li
                    key={item.id}
                    className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer flex justify-between items-center"
                    onClick={() => {
                      handleUserClick(
                        item.user ? item.user.id : item.id,
                        item.user ? item.user.full_name : item.full_name
                      );
                      closeModal("daftar-chat");
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
  );
};

export default PesanCs;
