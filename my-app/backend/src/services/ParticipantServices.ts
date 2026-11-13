import { ParticipantResponseDTO } from "../models/Participants";
import { IParticipantRepository } from "../repositories/IParticipantRepository";

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
}
