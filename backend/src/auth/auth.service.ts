import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('البريد الإلكتروني مستخدم بالفعل');
    }

    const passwordHash = await argon2.hash(createUserDto.password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });

    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        fullName: createUserDto.fullName,
        phoneNumber: createUserDto.phoneNumber,
        passwordHash,
        role: 'ASSOCIATION',
      },
    });

    return {
      message: 'تم التسجيل بنجاح',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('بيانات الدخول غير صحيحة');
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, loginDto.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('بيانات الدخول غير صحيحة');
    }

    const accessToken = this.jwtService.sign(
      { sub: user.id, email: user.email, role: user.role },
      { expiresIn: '15m' },
    );

    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '7d', secret: process.env.JWT_REFRESH_SECRET },
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const newAccessToken = this.jwtService.sign(
        { sub: payload.sub },
        { expiresIn: '15m' },
      );

      return { accessToken: newAccessToken };
    } catch {
      throw new UnauthorizedException('التوكن غير صحيح');
    }
  }
}
