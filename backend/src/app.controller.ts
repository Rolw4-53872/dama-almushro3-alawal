import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'فحص صحة النظام' })
  getHello(): any {
    return this.appService.getHello();
  }

  @Post('ping')
  @ApiOperation({ summary: 'Ping الخادم' })
  ping(): any {
    return { status: 'ok', message: 'Server is running' };
  }
}
