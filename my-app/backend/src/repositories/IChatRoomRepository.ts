import { ChatRoomResponseDTO, CreateChatRoomRequestDTO } from "../models/ChatRoom";

export interface IChatRoomRepository {
    create(data: CreateChatRoomRequestDTO): Promise<ChatRoomResponseDTO>;
    findById(id: string): Promise<ChatRoomResponseDTO | null>;
    findByDirectKey(directKey: string): Promise<ChatRoomResponseDTO | null>;
}
