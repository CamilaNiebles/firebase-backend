import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/models/user.model';
import { CreateUserDto } from 'src/user/dto/create';
import * as bcrypt from 'bcryptjs';

export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async signUp(createUserDto: CreateUserDto) {
    const { name, email, sub } = createUserDto;
    const newUser = new this.userModel({
      name,
      email,
    });
    newUser.salt = await bcrypt.genSalt();
    newUser.password = await this.hashPassword(sub, newUser.salt);
    try {
      return await newUser.save();
    } catch (e) {
      throw new HttpException(
        'User could not be created',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}
