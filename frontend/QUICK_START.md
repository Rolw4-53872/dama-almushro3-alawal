# البدء السريع - نظام داما

## التثبيت في 3 خطوات

```bash
# 1. التثبيت
npm install

# 2. تشغيل
npm start

# 3. فتح المتصفح
# http://localhost:3000
```

## البيانات الاختبارية

### تسجيل الدخول
```
البريد: test@example.com
كلمة المرور: password123
```

## الصفحات الرئيسية

| الصفحة | الـ URL | الوصف |
|--------|--------|-------|
| Login | `/login` | تسجيل الدخول |
| Dashboard | `/` | لوحة التحكم |
| المنح | `/grants` | طلبات المنح |
| الجمعيات | `/associations` | إدارة الجمعيات |
| الملفات | `/documents` | إدارة الملفات |
| العقود | `/contracts` | إدارة العقود |
| الملف الشخصي | `/profile` | الملف الشخصي |

## أوامر مهمة

```bash
# البناء
npm run build

# الاختبارات
npm test

# تنظيف node_modules
rm -rf node_modules
npm install
```

## المشاكل الشائعة

### Port مستخدم
```bash
PORT=3001 npm start
```

### أخطاء في المكتبات
```bash
npm install --force
```

### مشاكل CORS
تحقق من إعدادات Backend

## هيكل المشروع المختصر

```
src/
├── pages/           # الصفحات (7)
├── components/      # المكونات (13)
├── store/           # Redux (6 slices)
├── types/           # TypeScript
├── api/             # Axios client
└── App.tsx          # Routing
```

## الميزات الرئيسية

- 🔐 مصادقة آمنة مع JWT
- 📊 لوحة تحكم متقدمة
- 📋 إدارة المنح والعقود
- 📁 رفع الملفات
- 👥 إدارة الجمعيات
- 📱 Responsive Design
- 🎨 Tailwind CSS

## الملفات الأساسية

- `App.tsx` - التوجيه الرئيسي
- `store/` - Redux Store
- `components/` - المكونات
- `.env` - متغيرات البيئة

## الدعم

- اقرأ `README.md`
- اقرأ `DEVELOPMENT.md`
- اقرأ `SETUP.md`

---

Ready to code! 🚀
