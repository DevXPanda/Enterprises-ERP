// Wages module wiring.
import { Module } from '@nestjs/common';
import { WagesController } from './wages.controller';
import { WagesService } from './wages.service';

@Module({
  controllers: [WagesController],
  providers: [WagesService],
})
export class WagesModule {}
