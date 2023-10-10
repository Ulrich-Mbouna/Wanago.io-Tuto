import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserNotFoundException } from './exception/userNotFound.exception';
import { FilesService } from '../files/files.service';
import { PrivateFilesService } from '../files/privateFiles.service';
import { ListObjectsCommand } from '@aws-sdk/client-s3';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly fileService: FilesService,
    private readonly privateFileService: PrivateFilesService,
  ) {}
  async getByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      return user;
    }
    throw new UserNotFoundException('email', email);
  }
  async getById(id: number): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user) {
      return user;
    }
    throw new UserNotFoundException('id', id);
  }
  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async addAvatar(userId: number, imageBuffer: Buffer, filename: string) {
    const user = await this.getById(userId);

    if (user.avatar) {
      await this.userRepository.update(userId, {
        ...user,
        avatar: null,
      });
      await this.fileService.deletePublicFile(user.avatar.id);
    }
    const avatar = await this.fileService.uploadingFiles(imageBuffer, filename);

    await this.userRepository.update(userId, {
      ...user,
      avatar,
    });

    return avatar;
  }

  async deleteAvatar(userId: number) {
    const user = await this.getById(userId);
    const fileId = user.avatar?.id;

    if (fileId) {
      await this.userRepository.update(userId, {
        ...user,
        avatar: null,
      });
      await this.fileService.deletePublicFile(fileId);
    }
  }

  async addPrivateFile(userId: number, imageBuffer: Buffer, filename: string) {
    return await this.privateFileService.uploadPrivateFile(
      imageBuffer,
      userId,
      filename,
    );
  }

  async getPrivateFile(userId: number, fileId: number) {
    const file = await this.privateFileService.getPrivateFile(fileId);

    if (file.info.owner.id === userId) {
      return file;
    }
    throw new UnauthorizedException();
  }

  async getAllPrivateFiles(userId: number) {
    console.log({ userId });
    const userWithFiles = this.userRepository.findOne({
      where: { id: userId },
      relations: {
        files: true,
      },
    });

    if (userWithFiles) {
      return Promise.all(
        (await userWithFiles).files.map(async (file) => {
          const url = await this.privateFileService.generatePresignedUrl(
            file.key,
          );

          return { ...file, url };
        }),
      );
    }

    throw new UserNotFoundException('id', userId);
  }
}
