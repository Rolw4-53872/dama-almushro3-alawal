# نظام داما للمنح والتأهيل - Frontend

تطبيق React متكامل لإدارة المنح والتأهيل مع واجهة مستخدم عصرية وسهلة الاستخدام.

## المميزات الرئيسية

- المصادقة والتفويض مع JWT
- إدارة المنح والطلبات
- إدارة الجمعيات والمؤسسات
- إدارة المستندات والملفات
- إدارة العقود والاتفاقيات
- لوحة تحكم شاملة مع إحصائيات

## التقنيات المستخدمة

- React 19 + TypeScript
- Redux Toolkit لإدارة الحالة
- React Hook Form + Zod للنماذج
- Tailwind CSS للتصميم
- React Router v7 للملاحة
- Axios للطلبات

## البنية الأساسية

```
src/
├── api/              # Axios client مع interceptors
├── components/       # مكونات React
│   ├── Common/      # زر، حقل إدخال، بطاقة، إلخ
│   └── Layout/      # Navbar، Sidebar، MainLayout
├── pages/           # الصفحات الرئيسية
├── store/           # Redux store و slices
├── types/           # TypeScript interfaces
├── App.tsx          # المكون الرئيسي
└── index.css        # الأنماط العامة
```

## البدء السريع

```bash
# التثبيت
npm install

# تشغيل التطوير
npm start

# البناء الإنتاجي
npm run build
```

## الصفحات

1. **Login/Register** - تسجيل الدخول والتسجيل الجديد
2. **Dashboard** - لوحة التحكم مع إحصائيات
3. **Grant Requests** - عرض وطلب المنح
4. **Associations** - إدارة الجمعيات
5. **Documents** - رفع وإدارة الملفات
6. **Contracts** - إدارة العقود
7. **Profile** - الملف الشخصي والإعدادات

## إعدادات البيئة

```env
REACT_APP_API_URL=http://localhost:3000/api/v1
REACT_APP_NODE_ENV=development
```

## المصادقة

- تسجيل دخول آمن مع JWT
- حفظ التوكن في localStorage
- إعادة توجيه تلقائي عند انتهاء الصلاحية
- معالجة شاملة للأخطاء

## المكونات المشتركة

- Button (أنواع وأحجام مختلفة)
- Input (مع معالجة الأخطاء)
- Select (قوائم منسدلة)
- Card (بطاقات)
- Modal (نوافذ حوارية)
- LoadingSpinner (مؤشر التحميل)
- ErrorMessage / SuccessMessage

## Redux Slices

- **authSlice** - المصادقة والمستخدم
- **grantsSlice** - إدارة المنح
- **associationsSlice** - إدارة الجمعيات
- **documentsSlice** - إدارة الملفات
- **contractsSlice** - إدارة العقود
- **uiSlice** - حالة الواجهة

## Tailwind Theme

نظام ألوان متسق:
- Primary (أزرق) - للإجراءات الرئيسية
- Secondary (بنفسجي) - للإجراءات الثانوية
- Success (أخضر) - للنجاح
- Danger (أحمر) - للأخطاء
- Warning (برتقالي) - للتحذيرات

## التطوير والاختبار

```bash
# الاختبارات
npm test

# الفحص الثابت
npm run lint
```

للمزيد من المعلومات، راجع الملفات داخل المشروع.
