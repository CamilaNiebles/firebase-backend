import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Stream } from 'stream';
import * as constant from '../../utils/constant';
import { UploadFile } from '../dto/upload.file';

@Injectable()
export class GoogleStorage {
  async createConnection() {
    const storage = new Storage({
      credentials: {
        type: process.env.GOOGLE_TYPE,
        client_id: process.env.GOOGLE_CLIENT_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
      },
      projectId: process.env.GOOGLE_PROJECT_ID,
    });
    return storage;
  }

  async createBucket(bucketName: string) {
    try {
      const storage = await this.createConnection();
      await storage.createBucket(bucketName);
      return { body: { bucketName } };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        constant.ERROR_ELEMENT_NOT_CREATED,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async uploadFile(uploadFile: UploadFile) {
    const { bucketName, file: bufferFile, fileName } = uploadFile;
    const storage = await this.createConnection();
    const bucket = storage.bucket(bucketName);
    const gcsFileName = `${Date.now()}-${fileName}`;
    const file = bucket.file(gcsFileName);
    const fileStream = this.createStream(bufferFile);
    await fileStream
      .pipe(
        file.createWriteStream({
          resumable: false,
          validation: false,
          metadata: {
            contentType: 'application/pdf',
          },
        }),
      )
      .on('error', (error: Error) => {
        console.log(error);
      })
      .on('finish', () => {
        console.log(true);
      });
  }

  createStream(bufferFile) {
    const fileStream = new Stream.PassThrough();
    const fileBuffer = Buffer.from(bufferFile);
    fileStream.end(fileBuffer);
    return fileStream;
  }
}
