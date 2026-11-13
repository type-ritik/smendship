import {
  CreateParticipantDTO,
  ParticipantResponseDTO,
} from "../models/Participants";

export interface IParticipantRepository {
  create(data: CreateParticipantDTO): Promise<ParticipantResponseDTO>;
  findAllParticipantRoomByUserId(
    userId: string,
  ): Promise<ParticipantResponseDTO[]>;
  findParticipantByName(name: string): Promise<ParticipantResponseDTO[]>;
}
