import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function UsersChatList({ setChatUserId }) {
  const [chatUser, setChatUser] = useState([]);
  useEffect(() => {
    getFriendList();
  }, []);

  const baseUrl = "http://localhost:4000/graphql";

  const userId = "f3782525-c95f-435e-9517-3f21c25e4528";

  const getFriendList = () => {
    const getList = async () => {
      const res = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
          query($userId: String!) {
            friendChatList(userId: $userId) {
              id
              user1 {
                id
                name
              }

              user2 {
                id
                name
              }
            }
          }
        `,
          variables: { userId },
        }),
      });

      const result = await res.json();

      if (result.errors) {
        console.log("Client Error:", result.errors);
      } else {
        setChatUser(result.data.friendChatList);
        console.log("Data:", result.data.friendChatList);
      }
    };

    getList();
  };

  return (
    <div className="flex flex-col mx-20!">
      <h2 className="m-2! flex text-3xl font-bold justify-center items-center">
        Friends ChatList
      </h2>
      <div className="list-user">
        {chatUser.map((item, index) => (
          <div
            className="w-full flex flex-col border-2 text-blue-400 hover:text-blue-500 border-blue-500 hover:border-blue-300 rounded h-full hover:bg-blue-50 hover:transition"
            key={index}
          >
            <Link to={"/chat"} onClick={() => setChatUserId(item.user1.id)}>
              <div className="w-full h-20 flex items-center">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="User-1"
                  width={40}
                  className="ml-3! rounded-full flex justify-center items-center"
                />
                <span className="font-semibold text-xl ml-4!">
                  User {item.user1.name}
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UsersChatList;
