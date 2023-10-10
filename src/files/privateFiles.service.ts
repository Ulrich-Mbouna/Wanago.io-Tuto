import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrivateFile } from '../privateFiles/privateFile.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import useUrl from './getFileUrl';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class PrivateFilesService {
  private s3Client: S3Client = new S3Client({
    region: this.configService.get('AWS_REGION'),
  });
  constructor(
    @InjectRepository(PrivateFile)
    private readonly privateFileRepository: Repository<PrivateFile>,
    private readonly configService: ConfigService,
  ) {}

  async uploadPrivateFile(
    dataBuffer: Buffer,
    ownerId: number,
    filename: string,
  ) {
    const params = {
      Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
      Key: `${uuid()}-${filename}`,
      Body: dataBuffer,
    };
    const putObjectCommand = new PutObjectCommand(params);
    const results = await this.s3Client.send(putObjectCommand);

    const newFile = this.privateFileRepository.create({
      key: useUrl(params, this.configService).url,
      owner: {
        id: ownerId,
      },
    });

    await this.privateFileRepository.save(newFile);

    return newFile;
  }

  async getPrivateFile(fileId: number) {
    try {
      const file = await this.privateFileRepository.findOne({
        where: { id: fileId },
      });

      if (file) {
        const params = {
          Key: file.key,
          Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
        };
        const getObjectCommand = new GetObjectCommand(params);
        const response = await this.s3Client.send(getObjectCommand);

        const stream = await response.Body.transformToByteArray();

        return {
          stream,
          info: file,
        };
      }

      throw new NotFoundException('File nor found');
    } catch (error) {
      console.log({ error });
    }
  }

  async generatePresignedUrl(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
      Key: key,
    });
    const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    console.log('Ici file presign', { url });

    return url;
  }
}
