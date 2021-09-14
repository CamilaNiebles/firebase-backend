import { Injectable } from '@nestjs/common';
import AdmZip from 'adm-zip';
const stream = require('stream');

@Injectable()
export class Utils {
  static async getFilesFromZip(zipFiles: any) {
    try {
      const fileStream = new stream.PassThrough();
      const fileBuffer = Buffer.from(zipFiles.buffer);
      fileStream.end(fileBuffer);
      const zip = new AdmZip(zipFiles.buffer);
      const zipEntries = zip.getEntries(); // an array of ZipEntry records
      zipEntries.forEach(function (zipEntry) {
        console.log(zipEntry.toString()); // outputs zip entries information
      });
    } catch (error) {
      console.log(error);
    }
  }
}
