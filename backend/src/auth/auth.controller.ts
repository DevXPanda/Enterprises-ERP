// Auth routes — super admin login and password change.
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  login(@Body() body: { email?: string; password?: string }) {
    return this.service.login(body);
  }

  @Post('change-password')
  changePassword(
    @Body() body: { email?: string; currentPassword?: string; newPassword?: string },
  ) {
    return this.service.changePassword(body);
  }
}
