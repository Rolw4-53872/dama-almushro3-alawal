import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      message: 'مرحباً بك في نظام داما للمنح والتأهيل',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      status: 'running',
    };
  }
}
