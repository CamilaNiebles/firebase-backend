import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/repositories/user.repository';
import { CreateUserDto } from 'src/user/dto/create';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(createUserDto: CreateUserDto) {
    return await this.userRepository.signUp(createUserDto);
  }
}
