# أوربيتا ستور — Frontend

متجر React عربي RTL مربوط بباك إند ASP.NET Core.

## التشغيل

### 1. الباك إند (منفذ 5229)
```bash
cd ..
dotnet run
```

### 2. الفرونت إند (منفذ 5173)
```bash
npm install
npm run dev
```

افتح: http://localhost:5173

## حساب الأدمن
| الحقل | القيمة |
|-------|--------|
| الهاتف | `07700000001` |
| كلمة المرور | `Admin@123` |

## الصفحات

### المتجر
- `/` — الرئيسية
- `/products` — المتجر
- `/products/:id` — تفاصيل منتج
- `/cart` — السلة
- `/checkout` — الدفع (Qi Card)
- `/order/success` — نجاح الطلب
- `/login` — `/register` — `/account`

### لوحة التحكم `/admin`
- المنتجات، التصنيفات، الطلبات، العملاء
- الكوبونات، المحتوى (بانرات)، الإعدادات
- إحصائيات Dashboard

## الربط مع API
الـ proxy في `vite.config.ts` يوجّه `/api` و `/Login` و `/register` إلى `localhost:5229`.
