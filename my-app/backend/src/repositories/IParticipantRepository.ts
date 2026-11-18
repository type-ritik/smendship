import {
  CreateParticipantDTO,
  ParticipantResponseDTO,
  ParticipantUserResponseDTO,
} from "../models/Participants";

export interface IParticipantRepository {
  create(data: CreateParticipantDTO): Promise<ParticipantResponseDTO>;
  findAllParticipantRoomByUserId(
    userId: string,
  ): Promise<ParticipantResponseDTO[]>;
  findParticipantByName(name: string): Promise<ParticipantResponseDTO[]>;
  findAllParticipantByChatRoomId(
    chatRoomId: string,
  ): Promise<ParticipantResponseDTO[]>;
  getParticipantDataByChatRoomId(
    chatRoomId: string,
    userId: string,
  ): Promise<ParticipantUserResponseDTO>;
}
