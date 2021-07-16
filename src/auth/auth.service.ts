import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/repositories/user.repository';
import { AuthCredentials } from 'src/user/dto/credentials';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentials: AuthCredentials) {
    const { email, name } = authCredentials;
    const user = await this.userRepository.signUp(authCredentials);
    const payload = { email };
    const accessToken = this.jwtService.sign(payload);
    return { name, accessToken };
  }

  async signIn(authCredentials: AuthCredentials) {
    const { name } = authCredentials;
    const email = await this.userRepository.signIn(authCredentials);
    if (!email) {
      throw new HttpException('Unauthorized user', HttpStatus.FORBIDDEN);
    }
    const payload = { email };
    const accessToken = this.jwtService.sign(payload);
    return { name, accessToken };
  }
}
