import ChatEditor from "./ChatEditor";
import ChatCanva from "./ChatCanva";
import ChatHeader from "./ChatHeader";
import { useEffect, useRef, useState } from "react";
import { useFetchMemberProfile } from "../../services/ChatRoomService";
import { useParams } from "react-router-dom";
import type { Message, RoomMember } from "../../utils/ChatInterface";

export default function ChatComponent() {
  const { loading, data, loadMemberProfile } = useFetchMemberProfile();
  const [roomMember, setRoomMember] = useState<RoomMember | null>(null);
  const roomId = useParams().id;

  const [messages, setMessages] = useState<Message[] | []>([]);

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
          <ChatEditor chatRoomId={roomId} setMessages={setMessages} />
        </div>
      )}
    </>
  );
}
