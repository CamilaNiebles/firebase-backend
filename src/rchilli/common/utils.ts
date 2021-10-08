import { HttpStatus, Injectable } from '@nestjs/common';
import * as AdmZip from 'adm-zip';
import axios from 'axios';
import _ from 'lodash';
import { GoogleStorage } from 'src/google/storage/storage.service';
import { ProcessedRecords } from '../dto/process.record';
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
      await Promise.all(promiseStorage);
      return {
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      console.log(error);
      throw error;
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
      const response = await axios.post(process.env.RCHILLI_URL, {
        url: publicUrl,
        userkey: process.env.RCHILLI_USERKEY,
        version: process.env.RCHILLI_VERSION,
        subuserid: process.env.RCHILLI_SUBUSERID,
      });
      const { data } = response;
      return data;
    } catch (error) {
      throw error;
    }
  }

  async createFilesAndProcessRecord(
    data: UploadZip,
  ): Promise<ProcessedRecords> {
    try {
      const { bucketName, company } = data;
      await this.getFilesFromZip(data);
      const files = await this.storage.getFilesFromBucket(bucketName);
      const arrayPromises = [];
      files.forEach((e) => {
        arrayPromises.push(this.getRecordFromRchilli(e));
      });
      const response = await (Promise as any).allSettled(arrayPromises);
      const successedValues = this.getArrayElements(
        response,
        'fulfilled',
        files,
        [company],
      );
      const failedValues = this.getArrayElements(response, 'rejected', files, [
        company,
      ]);
      return { successedValues, failedValues };
    } catch (error) {
      throw error;
    }
  }

  getArrayElements(array, status, urls, company) {
    const values = array.filter((value) => value.status === status);
    const response = [];
    values.forEach((e) => {
      const { value, reason } = e;
      const index = array.indexOf(e);
      response.push({
        fileUrl: urls[index],
        ...(value?.ResumeParserData && {
          resumeParserData: value?.ResumeParserData,
        }),
        ...(reason && { error: reason }),
        company,
      });
    });
    return response;
  }
}
