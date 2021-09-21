import { Injectable } from '@nestjs/common';
import * as AdmZip from 'adm-zip';
import axios from 'axios';
import { GoogleStorage } from 'src/google/storage/storage.service';
import { UploadZip } from '../dto/upload.zip';

@Injectable()
export class Utils {
  constructor(private storage: GoogleStorage) {}

  async getFilesFromZip(data: UploadZip) {
    const { bucketName, zip: zipFiles } = data;
    try {
      const zip = new AdmZip(zipFiles.buffer);
      const zipEntries = zip.getEntries();
      const promiseStorage = [];
      zipEntries.forEach(async (zipEntry) => {
        if (
          zipEntry.entryName.includes('.pdf') &&
          zipEntry.entryName.split('/').length <= 2
        ) {
          const name = zipEntry.entryName.split('/')[1];
          promiseStorage.push(this.sendToStorage(zipEntry, name, bucketName));
        }
      });
      await Promise.all(promiseStorage).catch((error) => {
        throw error;
      });
      return {
        status: 201,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async sendToStorage(zipEntry, name: string, bucketName: string) {
    const response = await this.storage.uploadFile({
      bucketName,
      file: zipEntry.getData(),
      fileName: name,
    });
  }

  async getRecordFromRchilli(publicUrl: string) {
    try {
      // console.log({
      //   url: publicUrl,
      //   userkey: process.env.RCHILLI_USERKEY,
      //   version: process.env.RCHILLI_VERSION,
      //   subuserid: process.env.RCHILLI_SUBUSERID,
      // });
      const response = await axios.post(process.env.RCHILLI_URL, {
        url: publicUrl,
        userkey: process.env.RCHILLI_USERKEY,
        version: process.env.RCHILLI_VERSION,
        subuserid: process.env.RCHILLI_SUBUSERID,
      });
      const { data } = response;
      return data;
    } catch (error) {
      console.log(error);
    }
  }
}
