function CommentComponent() {
  const count = [1, 2, 3];
  return (
    <div className="w-full pt-5 flex self-center">
      <div className="flex flex-col gap-2 flex-1 justify-center">
        <div className="">Most recent</div>
        <div className="w-full bg-gray-700 h-0.5" />
        <div className="flex flex-col flex-1 gap-3">
          {count.map((item) => (
            <div
              key={item}
              className="w-full flex flex-col gap-2 pt-2 relative"
            >
              <div className="absolute h-15 w-6 border-gray-300 border-l-2 border-b-2 top-12 left-4 rounded-bl-2xl" />
              <div className="profile flex gap-5 items-center justify-between flex-1">
                <div className="flex flex-1 justify-center items-center gap-3">
                  <div className="w-9 h-9 overflow-hidden flex rounded-full">
                    <img
                      src="https://images.unsplash.com/photo-1774268184985-f1af67b38179?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt=""
                      className="w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <h4 className="flex text-sm font-semibold">
                      Kiriton Micky
                    </h4>
                    <span className="text-xs line-clamp-1 w-1/2 text-gray-500">
                      My name is ritik | self taught developer
                      adfjalsdfjlsadjflasdjflkasdjflkasdjfklajsdlfkjasdlkfjasdklfjlasdkjf
                      alsdjalsdjfowjefoiwjeoijweoijrioejasdofjasdoifjasdojfoasdjfio
                    </span>
                  </div>
                </div>
                <div className="flex gap-5 items-center justify-center">
                  <span className="text-xs ">2hr</span>

                  <span className="text-sm text-blue-600 font-bold">
                    Follow
                  </span>
                </div>
              </div>
              <div className="flex flex-1 pl-12 text-sm">
                Hello world my name is anomonly and I like to talk about shit.
                Lorem ipsum means nothing in modern English or coherent Latin.
                It is scrambled, altered placeholder text used in design and
                publishing to show how a page layout or font looks without real
                words distracting the reader.
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CommentComponent;
