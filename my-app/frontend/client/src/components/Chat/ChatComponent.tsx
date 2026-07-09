import ChatEditor from "./ChatEditor";
import ChatCanva from "./ChatCanva";
import ChatHeader from "./ChatHeader";
import { useEffect, useRef, useState } from "react";
import { useFetchMemberProfile } from "../../services/ChatRoomService";
import { useParams } from "react-router-dom";
import type { RoomMember } from "../../utils/ChatInterface";

interface Message {
  id: string;
  text: string;
  sender: "me" | "them";
  time: string;
}

export default function ChatComponent() {
  const { loading, data, loadMemberProfile } = useFetchMemberProfile();
  const [roomMember, setRoomMember] = useState<RoomMember | null>(null);
  const roomId = useParams().id;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hey there! How is the project going?",
      sender: "them",
      time: "4:00 PM",
    },
    {
      id: "2",
      text: "Going great! Just implementing the auto-growing input bar right now.",
      sender: "me",
      time: "4:01 PM",
    },
    {
      id: "3",
      text: "Awesome, make sure it grows upwards like WhatsApp!",
      sender: "them",
      time: "4:01 PM",
    },
  ]);

  useEffect(() => {
    if (!roomId) {
      setRoomMember(null);
      return;
    }

    if (loading) {
      console.log("Profile loading...");
    }

    loadMemberProfile({
      variables: {
        chatRoomId: roomId,
      },
    });

    if (data?.getRoomMemberProfile) {
      setRoomMember(data.getRoomMemberProfile);
    }
  }, [loading, data, roomId, loadMemberProfile]);

  const messagesEndRef = useRef<HTMLDivElement>(null!);

  return (
    <>
      {roomMember && (
        <div className="flex flex-col h-full gap-2 max-w-2xl mx-auto border border-gray-200 w-full rounded-2xl shadow-lg bg-[#efeae2] overflow-hidden">
          <ChatHeader roomData={roomMember} />
          <ChatCanva messagesEndRef={messagesEndRef} messages={messages} />
          <ChatEditor chatRoomId={roomMember?.id} setMessages={setMessages} />
        </div>
      )}
    </>
  );
}
