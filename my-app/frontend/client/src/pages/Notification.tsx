import { useEffect, useState } from "react";
import type { NotifyInterface } from "../utils/NotificationInterface";
import { useQuery } from "@apollo/client";
import { RETRIVE_NOTIFICATION } from "../services/NotificationService";

function Notification() {
  const [notification, setNotification] = useState<NotifyInterface[]>([]);

  const { data, loading, error } = useQuery(RETRIVE_NOTIFICATION);

  useEffect(() => {
    if (error) {
      console.error("Error fetching notifications:", error);
    }
    if (loading) {
      console.log("Loading notifications...");
    }

    if (data) {
      setNotification(data.getNotification);
    }
  }, [data, loading, error]);
  return (
    <div className="mt-30! w-full flex border h-screen p-5! rounded bg-white">
      <div className="w-full h-full flex flex-col gap-5">
        <div className="w-full flex justify-center items-center h-15 border rounded bg-[#F0FFFF]">
          <h1 className="flex font-normal">Notification</h1>
        </div>
        <div className="w-full border rounded h-full bg-[#F0FFFF] flex flex-col gap-3 p-5! overflow-y-scroll">
          {notification.length > 0 ? (
            notification.map((item) => (
              <div
                key={item.id}
                id="card"
                className="flex w-full gap-5 border items-center rounded p-2! justify-center bg-yellow-200 hover:cursor-pointer"
              >
                <div
                  className="flex gap-5 w-[20%] items-center justify-cen
                ter"
                >
                  <div className="w-11 h-11 rounded-full border-2 flex items-center justify-center">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/1827/1827301.png"
                      alt={item.fromUserId.id}
                      className="w-full h-full object-cover object-center rounded-full"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-gray-800">
                      <span className="font-bold text-black">
                        {item.fromUserId.name}
                      </span>{" "}
                      {item.type === "CHAT_ROOM_ACTIVATED"
                        ? "chat room activated."
                        : "Notification"}
                    </h3>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <h1 className="text-gray-500 text-lg">No notifications yet.</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notification;
