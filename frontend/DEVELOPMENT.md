# دليل التطوير - نظام داما

## معلومات المشروع

**اسم المشروع:** نظام داما للمنح والتأهيل - Frontend
**الإصدار:** 0.1.0
**الحالة:** قيد التطوير

## متطلبات التطوير

- Node.js v18 أو أحدث
- npm v9 أو أحدث (أو yarn)
- Visual Studio Code (اختياري)

## التثبيت والتشغيل

```bash
# 1. الانتقال للمشروع
cd frontend

# 2. تثبيت المكتبات
npm install

# 3. إنشاء ملف البيئة
cp .env.example .env

# 4. تشغيل الخادم
npm start
```

التطبيق سيكون متاحاً على `http://localhost:3000`

## هيكل المشروع

### src/api/
- **client.ts** - إنشاء Axios instance مع interceptors
  - إضافة JWT token لكل طلب
  - معالجة أخطاء 401 وإعادة التوجيه للدخول

### src/store/
إدارة الحالة المركزية باستخدام Redux Toolkit

- **index.ts** - تكوين Redux store
- **slices/**
  - **authSlice.ts** - المصادقة والمستخدم
  - **grantsSlice.ts** - إدارة المنح
  - **associationsSlice.ts** - إدارة الجمعيات
  - **documentsSlice.ts** - إدارة الملفات
  - **contractsSlice.ts** - إدارة العقود
  - **uiSlice.ts** - حالة الواجهة

### src/pages/
الصفحات الرئيسية للتطبيق

- **Login.tsx** - تسجيل الدخول
- **Register.tsx** - التسجيل الجديد
- **Dashboard.tsx** - لوحة التحكم
- **GrantRequests.tsx** - المنح
- **Associations.tsx** - الجمعيات
- **Documents.tsx** - الملفات
- **Contracts.tsx** - العقود
- **Profile.tsx** - الملف الشخصي

### src/components/
مكونات React قابلة لإعادة الاستخدام

#### Common/
- **Button.tsx** - مكون الزر (أنواع وأحجام مختلفة)
- **Input.tsx** - مكون حقل الإدخال
- **Select.tsx** - مكون القائمة المنسدلة
- **Card.tsx** - مكون البطاقة
- **Modal.tsx** - مكون النافذة الحوارية
- **LoadingSpinner.tsx** - مؤشر التحميل
- **ErrorMessage.tsx** - رسالة الخطأ
- **SuccessMessage.tsx** - رسالة النجاح

#### Layout/
- **Navbar.tsx** - شريط التنقل العلوي
- **Sidebar.tsx** - الشريط الجانبي
- **MainLayout.tsx** - المخطط الرئيسي

### src/types/
تعريفات TypeScript لجميع الأنواع

- User, Auth, Login, Register
- Grant, GrantRequest
- Association
- Document
- Contract
- UIState, Notification
- ApiResponse, PaginatedResponse

### src/hooks/
Custom React hooks

- **useAuth.ts** - hook للمصادقة
- يمكن إضافة hooks أخرى حسب الحاجة

## المتغيرات البيئية

```env
REACT_APP_API_URL=http://localhost:3000/api/v1
REACT_APP_NODE_ENV=development
REACT_APP_DEBUG=false
```

## الأوامر المتاحة

```bash
# تشغيل وضع التطوير
npm start

# بناء الإصدار الإنتاجي
npm run build

# تشغيل الاختبارات
npm test

# فحص الأداء
npm run analyze
```

## معايير الكود

### TypeScript
- استخدام Strong typing دائماً
- تجنب `any` قدر الإمكان
- استخدام interfaces بدلاً من types عند الإمكان

### React
- استخدام Functional Components
- استخدام Hooks بدلاً من Class Components
- تجنب useCallback و useMemo إلا عند الحاجة

### Naming Conventions
- **Components**: PascalCase (Button, MainLayout)
- **Files**: PascalCase للـ Components، lowercase للملفات الأخرى
- **Variables**: camelCase (userName, isLoading)
- **Constants**: UPPER_CASE (API_BASE_URL)

### التعليقات
```typescript
// استخدم تعليقات بسيطة وواضحة
// تجنب التعليقات الطويلة غير الضرورية

/**
 * للدوال المعقدة، استخدم JSDoc comments
 * @param email - البريد الإلكتروني للمستخدم
 * @returns boolean - هل البريد صحيح
 */
function validateEmail(email: string): boolean {
  // ...
}
```

## سير العمل مع Git

```bash
# 1. إنشاء فرع جديد
git checkout -b feature/feature-name

# 2. إجراء التغييرات
# 3. إضافة التغييرات
git add .

# 4. الكوميت
git commit -m "رسالة واضحة للتغيير"

# 5. الـ Push
git push origin feature/feature-name

# 6. فتح Pull Request
```

### رسائل الـ Commit
استخدم رسائل واضحة ومختصرة:
- `feat: إضافة ميزة جديدة`
- `fix: إصلاح خطأ`
- `refactor: إعادة هيكلة الكود`
- `docs: تحديث التوثيق`
- `style: تنسيق الكود`

## مراحل التطوير

### 1. صفحات المصادقة
- [x] صفحة Login
- [x] صفحة Register
- [ ] Reset Password
- [ ] Email Verification

### 2. لوحة التحكم
- [x] Dashboard الأساسية
- [ ] الرسوم البيانية
- [ ] الإحصائيات المتقدمة

### 3. إدارة المنح
- [x] عرض المنح
- [ ] تقديم طلب منح
- [ ] تتبع حالة الطلب
- [ ] تقييم المنح

### 4. إدارة الجمعيات
- [x] عرض الجمعيات
- [ ] إضافة جمعية
- [ ] تعديل بيانات الجمعية
- [ ] إدارة الأعضاء

### 5. إدارة المستندات
- [x] عرض الملفات
- [ ] رفع ملفات
- [ ] حذف ملفات
- [ ] معاينة الملفات

### 6. إدارة العقود
- [x] عرض العقود
- [ ] إنشاء عقد
- [ ] التوقيع الإلكتروني
- [ ] أرشفة العقود

### 7. الملف الشخصي
- [x] عرض البيانات الشخصية
- [x] تحديث البيانات
- [ ] تغيير كلمة المرور
- [ ] المصادقة الثنائية

## اختبار الميزات

### تسجيل الدخول
```
البريد: test@example.com
كلمة المرور: password123
```

### البيانات الوهمية
يتم إنشاء بيانات وهمية في الـ backend

## استكشاف الأخطاء

### الخطأ: CORS
تأكد من أن الـ backend يسمح بـ CORS

### الخطأ: 401 Unauthorized
- تأكد من أن التوكن صحيح
- تحقق من تاريخ انتهاء التوكن

### الخطأ: بيانات لم تُحمل
- تحقق من اتصال الشبكة
- تحقق من عنوان API في .env

## الموارد المفيدة

- [React Documentation](https://react.dev)
- [Redux Toolkit Docs](https://redux-toolkit.js.org)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Router Docs](https://reactrouter.com)

## الاتصال والدعم

في حالة وجود أسئلة أو استفسارات، يرجى التواصل مع فريق التطوير.

---

تم آخر تحديث: يونيو 2026
