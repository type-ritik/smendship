import { ImageResponseDTO } from "../models/Images";
import { IImageRepository } from "../repositories/IImageRepository";
import { cloudinary } from "../config/couldinary";

export class ImageServices {
  constructor(private imageRepository: IImageRepository) {}

  public async uploadImage(
    userId: string,
    image: string,
  ): Promise<ImageResponseDTO> {
    const imagePayload = await cloudinary.uploader.upload(image, {
      folder: "images",
    });

    console.log(imagePayload.secure_url);

    const payload = await this.imageRepository.create(
      imagePayload.secure_url,
      userId,
    );

    return payload;
  }

  public async fetchImageById(id: string): Promise<ImageResponseDTO> {
    const payload = await this.imageRepository.getById(id);

    return payload;
  }

  public async fetchImagesOfUser(userId: string): Promise<ImageResponseDTO[]> {
    const payload = await this.imageRepository.getAllByUserId(userId);

    return payload;
  }
}
