import { Controller, Post, Body , Get, UseGuards, Request} from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto } from './dto/login.dto/login.dto';
import { ReguserDto } from './dto/reguser.dto/reguser.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
@Controller('/api/auth')
export class AuthController {
constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() body: loginDto) {
      return this.authService.login(body.email,body.password);
  }
  @Post('/register')
  async register(@Body() body: ReguserDto) {
      return this.authService.register(body.email, body.password, body.displayName);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getMe(@Request() req: any) {
      return req.user;
  }

  @Get('/callback')
  async callback() {

  }
}
