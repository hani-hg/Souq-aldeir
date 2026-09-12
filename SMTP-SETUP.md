# إعداد إعادة تعيين كلمة المرور عبر Firebase

يستخدم الموقع الآن `auth.sendPasswordResetEmail(email)` من Firebase Web SDK مباشرة. لذلك لا يعتمد مسار استعادة كلمة المرور للمستخدم أو لمسؤول الموقع على Firebase Admin أو Service Account أو Outlook SMTP أو EmailJS. Firebase ينشئ الرابط ويرسل الرسالة الأصلية من خلال قالب البريد الموجود في Firebase Console.

## إعداد Firebase المطلوب

تأكد من التالي في مشروع Firebase `souq-aldeir`:

1. تفعيل **Email/Password** من Authentication → Sign-in method.
2. إضافة `souq-aldeir.vercel.app` إلى Authentication → Settings → Authorized domains.
3. التأكد من أن الحساب يملك بريدًا حقيقيًا، وليس عنوانًا داخليًا منتهيًا بـ `@souq-aldeir.local`.
4. ضبط قالب رسالة Password reset من Authentication → Templates إذا أردت تغيير النص أو اسم المرسل.

## التحقق

نفّذ:

```text
https://souq-aldeir.vercel.app/api/health
```

يجب أن يعيد `ok: true` مع `passwordResetDelivery: "firebase-client"`. قد تظهر حالة Firebase Admin أو SMTP بشكل منفصل لأن ملفات الخادم القديمة ما زالت موجودة للتوافق، لكنها ليست مطلوبة لمسار الاستعادة الجديد.

## النشر على Vercel

لا تحتاج استعادة كلمة المرور إلى متغيرات Outlook أو Firebase Admin في Vercel. يكفي نشر ملفات الواجهة مع إعداد Firebase Client الموجود في `js/firebase-config.js`. بعد النشر، افتح نافذة «نسيت كلمة المرور» وأدخل بريدًا حقيقيًا مرتبطًا بحساب Email/Password.

إذا ظهر `auth/operation-not-allowed` فطريقة Email/Password غير مفعلة. إذا ظهر `auth/unauthorized-continue-uri` أو لم تصل الرسالة، راجع Authorized domains وقالب البريد في Firebase.
