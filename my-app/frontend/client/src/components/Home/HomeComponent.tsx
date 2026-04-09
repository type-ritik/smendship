import EditorComponent from "../Editor/EditorComponent";

function HomeComponent() {
  return (
    <div className="w-full h-screen">
      <div className="w-full flex justify-evenly relative">
        <div className="w-1/5 h-200 fixed left-50 border rounded flex justify-center pt-5!">
          {" "}
          HEllo world
        </div>
        <div className="w-1/3 flex flex-col right-150">
          <EditorComponent />
          <hr className="mt-5! text-gray-400" />
          <div className="w-full my-5!">
            {/* <h1 className="font-bold text-2xl">Posts</h1> */}
            <div className="w-full border rounded-xl ">
              <div className="w-full h-20 flex items-center px-5! gap-5">
                <div className="w-[10%]">
                  <div className="w-12 h-12 border rounded-full overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1774268184985-f1af67b38179?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="Profile-photo"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </div>
                <div className="flex w-[70%] flex-col">
                  <p className="font-bold text-base w-full overflow-x-hidden">
                    XYZ
                  </p>
                  <p className="font-medium text-[12px] text-gray-700 h-5 w-full overflow-y-hidden">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Aperiam, nam.
                  </p>
                </div>
                <div className="flex w-[20%]">
                  <button className="border py-2! px-0!  rounded justify-center flex flex-1 text-sm font-medium">
                    Follow
                  </button>
                </div>
              </div>
              <hr className="text-gray-400" />
              <div className="w-full flex justify-center items-center h-full p-5!">
                <div className="w-full flex flex-col">
                  <div className="w-full">
                    <p className="text-[15px] text-gray-900">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Incidunt fugiat beatae necessitatibus, sapiente rerum
                      libero pariatur voluptatem quisquam porro reprehenderit
                      numquam eligendi deserunt doloribus, deleniti molestiae
                      officiis eaque id! Odio? Lorem, ipsum dolor sit amet
                      consectetur adipisicing elit. Provident asperiores
                      doloribus quae, quaerat quis maxime iste fuga? Hic,
                      laborum atque. Lorem ipsum dolor sit amet consectetur
                      adipisicing elit. Iste dolore nihil, voluptate, eveniet
                      sequi corporis dolorum reiciendis, necessitatibus nisi ut
                      hic consequuntur mollitia obcaecati quos quibusdam id.
                      Soluta nostrum non aliquam amet vel recusandae esse totam
                      eum, blanditiis quis facilis!
                    </p>
                    <div className="flex gap-2">
                      <span className="text-blue-600">#Hello</span>
                      <span className="text-blue-600">#gameOver</span>
                      <span className="text-blue-600">#MyNewPost</span>
                      <span className="text-blue-600">#TopTrends</span>
                    </div>
                  </div>
                  <div className="w-full h-full overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1774268184985-f1af67b38179?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt=""
                      className="w-full h-full object-cover object-center rounded"
                    />
                  </div>
                  <hr className="text-gray-400 my-5!" />
                  <div className="flex w-full justify-between">
                    <div className="w-1/4 flex justify-start">
                      <button className="px-4! justify-center flex flex-1 py-2! border rounded text-sm font-medium">
                        Like
                      </button>
                    </div>
                    <div className="w-1/4 flex justify-center">
                      <button className="px-4! justify-center flex flex-1 py-2! border rounded text-sm font-medium">
                        Comment
                      </button>
                    </div>
                    <div className="w-1/4 flex justify-end-safe">
                      <button className="px-4! justify-center flex flex-1 py-2! border rounded text-sm font-medium">
                        Impression
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeComponent;
