export default function CreatePost() {
  return (
    <div className="absolute w-[40vw] h-[80vh] bg-blue-300 flex self-center rounded-md p-5">
      <div className="flex flex-col w-full h-full">
        <div className="w-full h-full">
          <textarea
            name="post"
            id="post"
            placeholder="Write whats on your mind."
            className="w-full h-full resize-none outline-none"
          ></textarea>
        </div>
        <div className="w-full flex justify-start">
          <span className="cursor-pointer bg-blue-400 px-3 py-1 rounded-sm">images</span>
        </div>
      </div>
    </div>
  );
}
