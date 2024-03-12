import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PublicFile } from './publicFile.entity';
import { QueryRunner, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FilesService {
  private readonly s3Client = new S3Client({
    region: this.configService.get('AWS_REGION'),
    credentials: {
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    },
  });
  public getUrl(params: { Bucket: any; Key: any; Body?: Buffer }) {
    return `https://${params.Bucket}.s3.${this.configService.get(
      'AWS_REGION',
    )}.amazonaws.com/${params.Key}`;
  }
  constructor(
    @InjectRepository(PublicFile)
    private readonly publicFileRepository: Repository<PublicFile>,
    private readonly configService: ConfigService,
  ) {}

  async uploadingFiles(dataBuffer: Buffer, filename: string) {
    // AWS configuration

    const params = {
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      Key: `${uuid()}-${filename}`,
      Body: dataBuffer,
      ACL: 'public-read',
    };

    try {
      // @ts-ignore
      const results = await this.s3Client.send(new PutObjectCommand(params));

      const newFile = this.publicFileRepository.create({
        key: params.Key,
        url: this.getUrl(params),
      });

      await this.publicFileRepository.save(newFile);

      return newFile;
    } catch (error) {
      console.log({ error });
    }
  }

  async deletePublicFile(fileId: number) {
    try {
      const file = await this.publicFileRepository.findOne({
        where: { id: fileId },
      });

      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Key: file.key,
      });

      const deleteResponse = await this.s3Client.send(deleteCommand);
      console.log('Delete Response', deleteResponse);
      await this.publicFileRepository.delete(file);
    } catch (error) {
      console.log({ error });
    }
  }

  async deleteAvatarWithQueryRunner(fileId: number, queryRunner: QueryRunner) {
    const file = await queryRunner.manager.findOne(PublicFile, {
      where: { id: fileId },
    });

    const deleteCommand = new DeleteObjectCommand({
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      Key: file.key,
    });

    const deleteResponse = await this.s3Client.send(deleteCommand);
    console.log('Delete Response', deleteResponse);
    await queryRunner.manager.delete(PublicFile, fileId);
  }
}
