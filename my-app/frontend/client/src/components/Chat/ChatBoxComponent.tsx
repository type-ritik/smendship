import HeaderComponenet from "../Header/HeaderComponenet";
import ChatComponent from "./ChatComponent";

export default function ChatBoxComponent({chatUserId}) {
  return (
    <div className="">
      <div>
        <HeaderComponenet />
      </div>
      <div className="flex justify-around w-fullitems-center">
        <div className=" w-2/5">
          <h2 className="text-2xl font-bold">Made with ❤️ by Ritik Sharma</h2>
          <p>Working!</p>
        </div>
        <div className="flex w-[800px]  h-full justify-center items-center">
          <div className="flex w-full h-full justify-end">
            <ChatComponent chatUserId={chatUserId} />
          </div>
        </div>
      </div>
    </div>
  );
}
