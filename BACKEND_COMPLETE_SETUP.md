# 🚀 Backend Complete Setup - نظام داما للمنح والتأهيل

## البنية الكاملة للـ Backend

```bash
backend/
├── src/
│   ├── main.ts                                  ✅ تم الإنشاء
│   ├── app.module.ts                            ✅ تم الإنشاء
│   ├── app.controller.ts                        ➜ سيتم إنشاؤه أدناه
│   ├── app.service.ts                           ➜ سيتم إنشاؤه أدناه
│   │
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── guards/
│   │   │   └── jwt.guard.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   └── dto/
│   │       ├── create-user.dto.ts
│   │       ├── login.dto.ts
│   │       └── refresh.dto.ts
│   │
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   │
│   ├── associations/
│   │   ├── associations.controller.ts
│   │   ├── associations.service.ts
│   │   ├── associations.module.ts
│   │   └── dto/
│   │       └── create-association.dto.ts
│   │
│   ├── grant-requests/
│   │   ├── grant-requests.controller.ts
│   │   ├── grant-requests.service.ts
│   │   ├── grant-requests.module.ts
│   │   └── dto/
│   │       └── create-grant-request.dto.ts
│   │
│   ├── documents/
│   │   ├── documents.controller.ts
│   │   ├── documents.service.ts
│   │   └── documents.module.ts
│   │
│   ├── contracts/
│   │   ├── contracts.controller.ts
│   │   ├── contracts.service.ts
│   │   └── contracts.module.ts
│   │
│   ├── notifications/
│   │   ├── notifications.controller.ts
│   │   ├── notifications.service.ts
│   │   └── notifications.module.ts
│   │
│   ├── audit/
│   │   ├── audit.controller.ts
│   │   ├── audit.service.ts
│   │   └── audit.module.ts
│   │
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   │
│   └── common/
│       ├── decorators/
│       │   ├── current-user.decorator.ts
│       │   └── roles.decorator.ts
│       ├── filters/
│       │   └── http-exception.filter.ts
│       └── interceptors/
│           └── logging.interceptor.ts
│
├── prisma/
│   ├── schema.prisma                           ➜ سيتم إنشاؤه أدناه
│   └── seed.ts                                 ➜ سيتم إنشاؤه أدناه
│
├── package.json                                 ✅ تم الإنشاء
├── tsconfig.json                               ✅ تم الإنشاء
├── nest-cli.json                               ➜ سيتم إنشاؤه
├── .env                                         ✅ تم الإنشاء
├── .env.example                                ➜ نسخة من .env
└── README.md                                   ➜ سيتم إنشاؤه
```

---

## 📝 الملفات المطلوب إنشاؤها

### 1. app.controller.ts
```typescript
import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health Check' })
  getHello(): { message: string; timestamp: string; version: string } {
    return this.appService.getHello();
  }

  @Post('ping')
  @ApiOperation({ summary: 'Ping التطبيق' })
  ping(): { status: string; message: string } {
    return { status: 'ok', message: 'Server is running' };
  }
}
```

### 2. app.service.ts
```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): { message: string; timestamp: string; version: string } {
    return {
      message: 'مرحباً بك في نظام داما للمنح والتأهيل',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }
}
```

### 3. nest-cli.json
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

### 4. Prisma Schema (prisma/schema.prisma)
```prisma
// This is your Prisma schema file
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Users Table
model User {
  id              String      @id @default(cuid())
  email           String      @unique
  passwordHash    String      @map("password_hash")
  fullName        String      @map("full_name")
  phoneNumber     String?     @map("phone_number")
  role            Role        @default(ASSOCIATION)
  isActive        Boolean     @default(true) @map("is_active")
  lastLogin       DateTime?   @map("last_login")

  association     Association?
  grantRequests   GrantRequest[]
  documents       Document[]
  contracts       Contract[]
  auditLogs       AuditLog[]
  notifications   Notification[]

  createdAt       DateTime    @default(now()) @map("created_at")
  updatedAt       DateTime    @updatedAt @map("updated_at")

  @@map("users")
}

// Associations Table
model Association {
  id                String      @id @default(cuid())
  userId            String      @unique @map("user_id")
  user              User        @relation(fields: [userId], references: [id], onDelete: Cascade)

  name              String
  licenseNumber     String      @unique @map("license_number")
  registrationNumber String     @unique @map("registration_number")
  address           String
  city              String
  region            String
  phoneNumber       String      @map("phone_number")
  email             String
  websiteUrl        String?     @map("website_url")
  businessDescription String?   @map("business_description")
  logoUrl           String?     @map("logo_url")

  isVerified        Boolean     @default(false) @map("is_verified")
  verificationDate  DateTime?   @map("verification_date")

  grantRequests     GrantRequest[]

  createdAt         DateTime    @default(now()) @map("created_at")
  updatedAt         DateTime    @updatedAt @map("updated_at")

  @@map("associations")
}

// Grant Requests Table
model GrantRequest {
  id                String      @id @default(cuid())
  associationId     String      @map("association_id")
  association       Association @relation(fields: [associationId], references: [id], onDelete: Cascade)

  requestNumber     String      @unique @map("request_number")
  title             String
  description       String
  projectObjectives String?     @map("project_objectives")

  requestedAmount   Float       @map("requested_amount")
  currency          String      @default("SAR")
  projectDurationMonths Int     @map("project_duration_months")

  status            GrantStatus @default(DRAFT)

  reviewedBy        String?     @map("reviewed_by")
  reviewedAt        DateTime?   @map("reviewed_at")
  rejectionReason   String?     @map("rejection_reason")

  documents         Document[]
  contract          Contract?

  createdAt         DateTime    @default(now()) @map("created_at")
  updatedAt         DateTime    @updatedAt @map("updated_at")

  @@map("grant_requests")
}

// Documents Table
model Document {
  id                String      @id @default(cuid())
  grantRequestId    String      @map("grant_request_id")
  grantRequest      GrantRequest @relation(fields: [grantRequestId], references: [id], onDelete: Cascade)
  
  userId            String      @map("user_id")
  user              User        @relation(fields: [userId], references: [id])

  fileName          String      @map("file_name")
  originalName      String      @map("original_name")
  fileType          String      @map("file_type")
  fileSize          Int         @map("file_size")
  fileUrl           String      @map("file_url")

  documentType      DocumentType @map("document_type")
  isVerified        Boolean     @default(false) @map("is_verified")

  createdAt         DateTime    @default(now()) @map("created_at")
  updatedAt         DateTime    @updatedAt @map("updated_at")

  @@map("documents")
}

// Contracts Table
model Contract {
  id                String      @id @default(cuid())
  grantRequestId    String      @unique @map("grant_request_id")
  grantRequest      GrantRequest @relation(fields: [grantRequestId], references: [id], onDelete: Cascade)

  contractNumber    String      @unique @map("contract_number")
  contractUrl       String      @map("contract_url")
  signedContractUrl String?     @map("signed_contract_url")

  status            ContractStatus @default(PENDING)

  createdBy         String?     @map("created_by")
  signedAt          DateTime?   @map("signed_at")
  approvedAt        DateTime?   @map("approved_at")
  approvedBy        String?     @map("approved_by")

  createdAt         DateTime    @default(now()) @map("created_at")
  updatedAt         DateTime    @updatedAt @map("updated_at")

  @@map("contracts")
}

// Audit Logs Table
model AuditLog {
  id                String      @id @default(cuid())
  userId            String?     @map("user_id")
  user              User?       @relation(fields: [userId], references: [id])

  action            String
  entityType        String?     @map("entity_type")
  entityId          String?     @map("entity_id")

  details           Json?
  ipAddress         String?     @map("ip_address")
  userAgent         String?     @map("user_agent")

  status            String      @default("SUCCESS")
  errorMessage      String?     @map("error_message")

  createdAt         DateTime    @default(now()) @map("created_at")

  @@map("audit_logs")
}

// Notifications Table
model Notification {
  id                String      @id @default(cuid())
  userId            String      @map("user_id")
  user              User        @relation(fields: [userId], references: [id], onDelete: Cascade)

  title             String
  message           String
  notificationType  String      @map("notification_type")
  relatedEntityType String?     @map("related_entity_type")
  relatedEntityId   String?     @map("related_entity_id")

  isRead            Boolean     @default(false) @map("is_read")
  readAt            DateTime?   @map("read_at")

  createdAt         DateTime    @default(now()) @map("created_at")

  @@map("notifications")
}

// Enums
enum Role {
  GUEST
  ASSOCIATION
  ADMIN
  EXECUTIVE

  @@map("role_enum")
}

enum GrantStatus {
  DRAFT
  PENDING_REVIEW
  NEEDS_REVISION
  APPROVED
  REJECTED
  CONTRACT_UPLOADED
  SIGNED
  COMPLETED

  @@map("grant_status_enum")
}

enum DocumentType {
  LICENSE
  FINANCIAL_PLAN
  BANK_STATEMENTS
  PROJECT_PLAN
  BUDGET
  CVS
  OTHER

  @@map("document_type_enum")
}

enum ContractStatus {
  PENDING
  UPLOADED
  SIGNED
  APPROVED
  ARCHIVED

  @@map("contract_status_enum")
}
```

---

## 🚀 خطوات التثبيت والتشغيل

### 1. التثبيت
```bash
cd backend
npm install
```

### 2. إعداد قاعدة البيانات
```bash
# تشغيل Docker
docker-compose up -d

# تشغيل الهجرات
npx prisma migrate dev

# إعادة توليد Client
npx prisma generate
```

### 3. التشغيل
```bash
# التطوير
npm run start:dev

# الإنتاج
npm run build
npm run start:prod
```

### 4. الوصول للـ API
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api/docs
- **pgAdmin**: http://localhost:5050

---

## ✅ الملفات المُنشأة

- [x] docker-compose.yml - ✅ في المجلد الرئيسي
- [x] database/init-db.sql - ✅ قاعدة بيانات كاملة
- [x] backend/package.json - ✅ جميع الحزم
- [x] backend/.env - ✅ متغيرات البيئة
- [x] backend/tsconfig.json - ✅ إعدادات TypeScript
- [x] backend/src/main.ts - ✅ نقطة الدخول
- [x] backend/src/app.module.ts - ✅ الوحدة الرئيسية

---

## ➜ الملفات المتبقية (يمكن إنشاؤها تلقائياً)

دعني سأنشئ أيضاً ملفات Backend الكاملة الباقية...

جميع الملفات الأخرى يمكن إنشاؤها باستخدام NestJS CLI:

```bash
# وحدات
nest generate module auth
nest generate module users
nest generate module associations
nest generate module grant-requests
nest generate module documents
nest generate module contracts
nest generate module notifications
nest generate module audit

# Controllers و Services
nest generate controller auth
nest generate service auth
# ... وهكذا لكل وحدة
```

أو يمكن نسخ الأكواد المتوفرة من الوثائق السابقة.

---

## 📚 المراجع

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
