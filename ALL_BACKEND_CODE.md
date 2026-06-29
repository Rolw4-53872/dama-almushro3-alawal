# 🔌 جميع أكواد Backend الجاهزة - نظام داما

## هذا الملف يحتوي على جميع الأكواد الجاهزة التي تحتاجها

---

## 📁 المسارات وأسماء الملفات

انسخ الأكواد أدناه إلى الملفات المناسبة:

---

## 1️⃣ backend/src/app.controller.ts

```typescript
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
```

---

## 2️⃣ backend/src/app.service.ts

```typescript
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
```

---

## 3️⃣ backend/src/prisma/prisma.module.ts

```typescript
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

---

## 4️⃣ backend/src/prisma/prisma.service.ts

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('PrismaService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('❌ تم قطع الاتصال بقاعدة البيانات');
  }
}
```

---

## 5️⃣ backend/src/auth/auth.module.ts

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

---

## 6️⃣ backend/src/auth/auth.controller.ts

```typescript
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('المصادقة')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'تسجيل مستخدم جديد' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'تسجيل الدخول' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'تحديث التوكن' })
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }
}
```

---

## 7️⃣ backend/src/auth/auth.service.ts

```typescript
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
```

---

## 8️⃣ backend/src/auth/dto/create-user.dto.ts

```typescript
import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'أحمد محمد' })
  @IsString()
  @MinLength(3)
  fullName: string;

  @ApiProperty({ example: '0501234567' })
  @IsString()
  @Matches(/^(\+966|0)[0-9]{9}$/)
  phoneNumber: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;
}
```

---

## 9️⃣ backend/src/auth/dto/login.dto.ts

```typescript
import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  password: string;
}
```

---

## 🔟 backend/src/auth/strategies/jwt.strategy.ts

```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
```

---

## 1️⃣1️⃣ backend/src/auth/guards/jwt.guard.ts

```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

---

## 1️⃣2️⃣ backend/src/users/users.module.ts

```typescript
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

---

## 1️⃣3️⃣ backend/src/users/users.controller.ts

```typescript
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('المستخدمون')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'الملف الشخصي' })
  async getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.userId);
  }
}
```

---

## 1️⃣4️⃣ backend/src/users/users.service.ts

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('المستخدم غير موجود');
    }

    return user;
  }
}
```

---

## 1️⃣5️⃣ backend/nest-cli.json

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  }
}
```

---

## 🎯 خطوات التنفيذ

### 1. انسخ الملفات أعلاه إلى المسارات المحددة
### 2. أنشئ المجلدات المطلوبة:
```bash
mkdir -p backend/src/auth/dto
mkdir -p backend/src/auth/guards
mkdir -p backend/src/auth/strategies
mkdir -p backend/src/users
mkdir -p backend/src/prisma
mkdir -p backend/src/common/decorators
mkdir -p backend/src/common/filters
mkdir -p backend/src/common/interceptors
mkdir -p backend/prisma
```

### 3. ثبّت الحزم:
```bash
cd backend
npm install
```

### 4. شغّل البيانات:
```bash
docker-compose up -d
npx prisma migrate dev --name init
```

### 5. ابدأ الخادم:
```bash
npm run start:dev
```

---

## ✅ اختبر الـ APIs

### التسجيل:
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "fullName": "أحمد محمد",
    "phoneNumber": "0501234567",
    "password": "SecurePass123!"
  }'
```

### تسجيل الدخول:
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

### الملف الشخصي:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/users/profile
```

---

## 🎉 تم! 

النظام جاهز للاستخدام الكامل 🚀
