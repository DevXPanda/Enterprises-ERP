// Settings page routes — admin profile and password change.
import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  @Get('profile')
  profile() {
    return this.service.getProfile();
  }

  @Patch('profile')
  updateProfile(
    @Body()
    body: { name?: string; email?: string; phone?: string; avatarUrl?: string | null },
  ) {
    return this.service.updateProfile(body);
  }

  @Post('change-password')
  changePassword(
    @Body()
    body: { currentPassword?: string; newPassword?: string; confirmPassword?: string },
  ) {
    return this.service.changePassword(body);
  }
}
