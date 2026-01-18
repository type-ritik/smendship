import ChatEditor from "./ChatEditor";

export default function ChatComponent({chatUserId}) {
  console.log("Userid",chatUserId)

  const baseUrl = "http://localhost:4000/graphql";

  const chatRoomExist = () => {
    const chkChatRoomExitence = async () => {
      const res = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: `
          mutation ($userId: String!) {

          }
          `
          ,variables: {userId: chatUserId}
        })
      })
    }
  }

  return (
    <div className="w-full h-[80vh] bg-blue-950 border-2 p-2! border-blue-950 rounded-sm text-white relative">
      <h1 className="py-2! w-full h-14  flex justify-center text-2xl text-blue-500 font-semibold border-b-2 border-blue-950 bg-blue-50 left-0 top-0 absolute z-10">
        User Mechanzi
      </h1>
      <div
        id="chat-inbox"
        className="border-t-2 border-blue-950 h-full absolute top-0 left-0 w-full rounded-sm bg-blue-300"
      >
        <div className=" w-full inline-block gap-2 p-5! ">
          <div className="w-full flex justify-start">
            <div className=" bg-blue-700 rounded-tr-full px-5! py-1! rounded-tl-full rounded-br-full font-semibold text-center">
              <p className="receive">Hello Bro!</p>
            </div>
          </div>
          <div className="w-full flex justify-end">
            <div className=" bg-fuchsia-700 px-5! py-1! rounded-tr-full rounded-tl-full font-semibold rounded-bl-full text-center flex justify-center">
              <p className="send">Hello</p>
            </div>
          </div>
        </div>
      </div>
      <div
        id="chat-editor"
        className="border-t-2 w-full text-blue-950 font-semibold border-blue-950 bg-blue-200 py-2! px-5! absolute bottom-0 left-0 z-10"
      >
        <ChatEditor chatRoomId={""} />
      </div>
    </div>
  );
}
