# خطوات الإعداد والتثبيت

## المرحلة الأولى: التثبيت الأساسي

### 1. التحقق من المتطلبات

```bash
# التحقق من إصدار Node.js
node --version  # يجب أن يكون v18 أو أحدث

# التحقق من إصدار npm
npm --version   # يجب أن يكون v9 أو أحدث
```

### 2. تثبيت المكتبات

```bash
cd frontend
npm install
```

### 3. إعداد ملف البيئة

```bash
# نسخ ملف المثال
cp .env.example .env

# تحرير .env وتعديل البيانات إذا لزم الأمر
# REACT_APP_API_URL=http://localhost:3000/api/v1
```

## المرحلة الثانية: التحقق من التثبيت

```bash
# تشغيل الخادم
npm start
```

يجب أن يفتح المتصفح على `http://localhost:3000`

## المرحلة الثالثة: البناء الإنتاجي

```bash
# بناء الإصدار الإنتاجي
npm run build

# حجم الملف النهائي يجب أن يكون أقل من 500 KB
```

## إعدادات IDE (VS Code)

### Extensions المقترحة

```json
{
  "recommendations": [
    "ES7+ React/Redux/React-Native snippets",
    "Prettier - Code formatter",
    "TypeScript Vue Plugin (Volar)",
    "Tailwind CSS IntelliSense"
  ]
}
```

### إعدادات Workspace

ملف `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## الاختبار الأولي

### 1. اختبار الصفحة الرئيسية

- افتح `http://localhost:3000`
- يجب أن ترى صفحة تسجيل الدخول

### 2. اختبار النافذة البرمجية

اضغط `F12` للتحقق من:
- عدم وجود أخطاء في الـ Console
- الشبكة تعمل بشكل صحيح

### 3. اختبار الـ Redux DevTools

```bash
npm install redux-devtools-extension
```

ثم في Store:
```typescript
import { composeWithDevTools } from 'redux-devtools-extension';

export const store = configureStore({
  reducer: { /* ... */ },
  middleware: composeWithDevTools(),
});
```

## استكشاف الأخطاء الشائعة

### الخطأ: "Port 3000 already in use"

```bash
# البحث عن العملية التي تستخدم المنفذ
lsof -i :3000

# أو استخدام منفذ آخر
PORT=3001 npm start
```

### الخطأ: "Module not found"

```bash
# حذف node_modules وإعادة التثبيت
rm -rf node_modules
npm install
```

### الخطأ: "CORS error"

تأكد من إعدادات الـ Backend:
- يجب أن يسمح بـ CORS من `http://localhost:3000`

### الخطأ: "Cannot find module '@types'"

```bash
npm install --save-dev @types/react @types/react-dom
```

## الاتصال بـ Backend المحلي

### 1. تشغيل Bash Server

```bash
cd ../backend  # انتقل لمجلد backend
npm start
```

يجب أن يعمل على `http://localhost:3000/api/v1`

### 2. اختبار الاتصال

```bash
curl http://localhost:3000/api/v1/health
```

يجب أن يرد `{ "status": "ok" }`

### 3. تحديث .env إذا لزم

```env
REACT_APP_API_URL=http://localhost:3000/api/v1
```

## التثبيت المتقدم

### استخدام Yarn بدلاً من npm

```bash
# التثبيت
npm install -g yarn
yarn install

# التشغيل
yarn start

# البناء
yarn build
```

### مع Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

البناء:
```bash
docker build -t dama-frontend .
docker run -p 3000:3000 dama-frontend
```

## القائمة المرجعية قبل بدء التطوير

- [ ] تثبيت Node.js و npm
- [ ] استنساخ المشروع
- [ ] تشغيل `npm install`
- [ ] نسخ `.env.example` إلى `.env`
- [ ] التحقق من اتصال الـ Backend
- [ ] تشغيل `npm start`
- [ ] فتح Developer Tools (F12)
- [ ] التحقق من عدم وجود أخطاء

## خطوات ما بعد التثبيت

1. اقرأ `README.md` لفهم بنية المشروع
2. اقرأ `DEVELOPMENT.md` لفهم معايير التطوير
3. تصفح ملفات المشروع للتعرف على الكود
4. جرب الميزات الموجودة
5. ابدأ بإضافة ميزات جديدة

## موارد مفيدة

- [تثبيت Node.js](https://nodejs.org)
- [npm Documentation](https://docs.npmjs.com)
- [Create React App](https://create-react-app.dev)
- [Redux Toolkit Quick Start](https://redux-toolkit.js.org/usage/usage-guide)

## للمساعدة

في حالة الحاجة للمساعدة:
1. تحقق من الأخطاء في Console
2. راجع ملف DEVELOPMENT.md
3. ابحث في المشاريع المشابهة على GitHub

---

تم آخر تحديث: يونيو 2026
