import ChatComponent from "./ChatComponent";
import ChatFriends from "./ChatFriends";

export default function ChatBoxComponent() {
  return (
    <div className="relative w-full h-full flex">
      <div className="absolute top-20 left-0 flex justify-between w-full p-5! gap-5 h-200">
        <div className="flex w-full justify-start">
          <ChatFriends />
        </div>
        <div className="flex w-full justify-end">
          <ChatComponent />
        </div>
      </div>
    </div>
  );
}
