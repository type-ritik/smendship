import { MdCancel } from "react-icons/md";

function RecommendCardComponent() {
  return (
    <>
      <div className="w-50 flex h-full border rounded-2xl overflow-hidden">
        <div className="w-full h-full flex flex-col gap-10!">
          <div className="w-full">
            <div className="relative w-full h-16">
              <img
                src="https://images.unsplash.com/photo-1774268184985-f1af67b38179?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Profile background"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute bottom-0 left-16 transform translate-y-1/2">
                <div className="w-15 h-15  border-2 rounded-full overflow-hidden border-white">
                  <img
                    src="https://images.unsplash.com/photo-1774268184985-f1af67b38179?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Profile photo"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
                <div className="absolute top-3 right-3 ">
                  <MdCancel size={'20px'} color="white" className="hover:text-gray-900 cursor-pointer" />
                </div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-5!">
            <div className="w-full flex flex-col justify-center items-center">
              <h1 className="font-bold text-2xl">John Doe</h1>
              <p className="text-gray-800 text-sm">Software Engineer</p>
            </div>
            <div className="w-full justify-center items-center flex mb-5!">
              <button
                className="py-3! px-9! bg-gray-700! text-blue-300! justify-center flex text-sm font-medium uppercase hover:bg-blue-300! hover:text-gray-700!
              transition-colors
              shadow-sm hover:shadow-black shadow-green-700
              "
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RecommendCardComponent;
