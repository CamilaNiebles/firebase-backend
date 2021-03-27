import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthCredentials } from 'src/user/dto/credentials';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signUp')
  async signUp(@Body() idToken: any, @Res() res: any) {
    const createUserDto = createDataUser(idToken);
    const newUser = await this.authService.signUp(createUserDto);
    return res.status(HttpStatus.OK).send(newUser);
  }
  @Post('/signIn')
  async signIn(@Body() idToken: any, @Res() res: any) {
    const createUserDto = createDataUser(idToken);
    const response = await this.authService.signIn(createUserDto);
    return res.status(HttpStatus.OK).send(response);
  }
}

function createDataUser(idToken) {
  const createUserDto = new AuthCredentials();
  const { sub, email, given_name, family_name } = idToken.payload;
  createUserDto.email = email;
  createUserDto.sub = sub;
  createUserDto.name = `${given_name} ${family_name}`;
  return createUserDto;
}
