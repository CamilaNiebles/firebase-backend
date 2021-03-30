import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/models/user.model';
import { AuthCredentials } from 'src/user/dto/credentials';
import * as bcrypt from 'bcryptjs';

export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}
  async signUp(authCredentials: AuthCredentials) {
    const { name, email, sub } = authCredentials;
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

  async signIn(authCredentials: AuthCredentials) {
    const { email, name, sub } = authCredentials;
    const user = await this.userModel.findOne({ email });
    if (user && (await this.validatePassword(sub, user))) {
      return email;
    } else {
      return null;
    }
  }

  async getUserByEmail(email: string) {
    try {
      const user = await this.userModel
        .find({ email }, 'name email img role')
        .exec();
      return user;
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  async validatePassword(password: string, user): Promise<boolean> {
    const hash = await bcrypt.hash(password, user.salt);
    return user.password === hash;
  }
}
