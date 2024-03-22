import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import imagemin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';
import AdmZip from 'adm-zip';

@Processor('image')
export class ImageProcessor {
  @Process('optimize')
  async handleOptimization(job: Job) {
    const files: Express.Multer.File[] = job.data.files;

    const optimizationPromises: Promise<Buffer>[] = files.map((file) => {
      const fileBuffer = Buffer.from(file.buffer);
      return imagemin.buffer(fileBuffer, {
        plugins: [
          imageminPngquant({
            quality: [0.6, 0.8],
          }),
        ],
      });
    });

    const optimizedImages = await Promise.all(optimizationPromises);

    const zip = new AdmZip();

    optimizedImages.forEach((image, index) => {
      const fileData = files[index];
      zip.addFile(fileData.originalname, image);
    });
    return zip.toBuffer();
  }
}
