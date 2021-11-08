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
    const { email, name, hd, picture } = authCredentials;
    const user = await this.userRepository.signUp(authCredentials);
    const payload = { email, ...(!!hd && { hd }) };
    const accessToken = this.jwtService.sign(payload);
    return { name, accessToken, picture };
  }

  async signIn(authCredentials: AuthCredentials) {
    const { name, hd, picture } = authCredentials;
    const email = await this.userRepository.signIn(authCredentials);
    if (!email) {
      throw new HttpException('Unauthorized user', HttpStatus.FORBIDDEN);
    }
    const payload = { email, ...(!!hd && { hd }) };
    const accessToken = this.jwtService.sign(payload);
    return { name, accessToken, picture };
  }
}
