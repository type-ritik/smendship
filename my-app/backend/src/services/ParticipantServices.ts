import {
  ParticipantResponseDTO,
  ParticipantUserResponseDTO,
} from "../models/Participants";
import { IParticipantRepository } from "../repositories/IParticipantRepository";
import { presenceService } from "./presenceService";

export class ParticipantService {
  constructor(private participantRepository: IParticipantRepository) {}

  public async fetchParticipantsRoomOfUser(
    userId: string,
  ): Promise<ParticipantResponseDTO[]> {
    const participantRooms =
      await this.participantRepository.findAllParticipantRoomByUserId(userId);

    return participantRooms;
  }

  public async searchParticipant(
    name: string,
  ): Promise<ParticipantResponseDTO[]> {
    const participant =
      await this.participantRepository.findParticipantByName(name);

    return participant;
  }

  public async fetchParticipantData(
    chatRoomId: string,
    userId: string,
  ): Promise<ParticipantUserResponseDTO> {
    const participant =
      await this.participantRepository.getParticipantDataByChatRoomId(
        chatRoomId,
        userId,
      );

    await presenceService.setWatcher(participant.userId, userId);
    await presenceService.setWatcher(userId, participant.userId);

    return participant;
  }
}
