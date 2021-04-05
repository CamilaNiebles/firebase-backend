import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoTest: MongoMemoryServer;
export default (options: MongooseModuleOptions = {}) =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      mongoTest = new MongoMemoryServer();
      const mongoUri = await mongoTest.getUri();
      return {
        uri: mongoUri,
        ...options,
      };
    },
  });

export const closeInMongoConnection = async () => {
  if (mongoTest) await mongoTest.stop();
};
