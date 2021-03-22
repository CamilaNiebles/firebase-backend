import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { GoogleAuthentication } from './google.auth';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    const { idToken } = req.body;
    const googleAuthentication = new GoogleAuthentication();
    try {
      const credentials = await googleAuthentication.verify(idToken);
      req.body = credentials;
      next();
    } catch (error) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }
}
