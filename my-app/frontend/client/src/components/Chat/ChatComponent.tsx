import ChatEditor from "./ChatEditor";
import ChatCanva from "./ChatCanva";
import ChatHeader from "./ChatHeader";
import { useEffect, useRef } from "react";
import { useFetchParticipantProfile } from "../../services/ChatRoomService";
import { useParams } from "react-router-dom";
import type { RoomMember } from "../../utils/ChatInterface";
import { useChat } from "../../hooks/useChat";

export default function ChatComponent() {
  const { data, loadParticipantProfile } = useFetchParticipantProfile();
  const { id } = useParams();
  const roomId = id && id !== "list" ? id : undefined;

  const { messages, setMessages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    if (roomId) loadParticipantProfile({ variables: { chatRoomId: roomId } });
  }, [roomId, loadParticipantProfile]);

  // Derived from the query result instead of mirrored into state.
  const roomMember: RoomMember | null =
    roomId && data?.retriveUserProfileOfRoom
      ? data.retriveUserProfileOfRoom
      : null;

  if (!roomId) return null;

  return (
    <section className="anim-pop flex h-full w-full flex-col overflow-hidden border-teal-100 bg-[#eef6f5] shadow-sm sm:rounded-2xl sm:border">
      {roomMember ? (
        <>
          <ChatHeader roomData={roomMember} />
          <ChatCanva
            messagesEndRef={messagesEndRef}
            messages={messages}
            setMessages={setMessages}
          />
          <ChatEditor chatRoomId={roomId} setMessages={setMessages} />
        </>
      ) : (
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="skeleton h-14 rounded-xl" />
          <div className="skeleton h-10 w-2/3 rounded-xl" />
          <div className="skeleton ml-auto h-10 w-1/2 rounded-xl" />
        </div>
      )}
    </section>
  );
}
