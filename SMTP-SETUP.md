# إعداد إعادة تعيين كلمة المرور عبر Outlook SMTP

يعمل الموقع الآن عبر `POST /api/password-reset`. الخادم ينشئ رابط Firebase رسميًا بواسطة Firebase Admin SDK ثم يرسله عبر Outlook SMTP باستخدام STARTTLS. لا تُرسل كلمة مرور التطبيق إلى المتصفح ولا تُحفظ في GitHub.

## المتغيرات المطلوبة

انسخ `.env.example` إلى `.env` في الخادم أو أضف القيم نفسها في لوحة متغيرات البيئة لدى مزود الاستضافة:

```env
APP_URL=https://your-real-domain.example
PORT=5000
CORS_ORIGIN=https://your-real-domain.example
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=souq.aldeir@outlook.sa
SMTP_APP_PASSWORD=ضع_كلمة_مرور_التطبيق_هنا
```

يحتاج الخادم أيضًا إلى بيانات Firebase Admin SDK. يمكن إدخالها كمتغير واحد:

```env
FIREBASE_SERVICE_ACCOUNT_JSON={...}
```

أو كمتغيرات منفصلة:

```env
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

استخدم أحد الخيارين فقط، ولا تضع الملف الحقيقي `.env` داخل المستودع. ملف `.gitignore` يمنع ذلك تلقائيًا.

## التشغيل

بعد ضبط المتغيرات، شغّل:

```bash
npm install
npm start
```

ثم تحقق من الخادم عبر:

```bash
curl https://your-real-domain.example/api/health
```

يجب أن يعيد الخادم كائن JSON يحتوي على `ok: true`. جرّب طلب إعادة التعيين من واجهة الموقع بعد التأكد من أن الحساب يستخدم بريدًا إلكترونيًا حقيقيًا. الحسابات القديمة المرتبطة برقم هاتف أو البريد الداخلي لا يمكن إرسال رابط Outlook إليها قبل إضافة بريد استرداد حقيقي.

## ملاحظات أمان وتشغيل

يجب استخدام App Password لحساب Outlook مع تفعيل المصادقة المناسبة، وليس كلمة المرور الأساسية للحساب. يجب تشغيل الخادم عبر HTTPS في الإنتاج، وتعيين `APP_URL` إلى نطاق الموقع الحقيقي. المسار يستخدم ردًا محايدًا ومحددًا بخمس محاولات لكل عنوان وIP خلال 15 دقيقة لتقليل كشف الحسابات والرسائل المزعجة.

## النشر على Vercel

اربط مستودع GitHub بالمشروع من لوحة Vercel واختر **Import Project**. سيكتشف Vercel دوال Node.js داخل مجلد `api` تلقائيًا. لا تحتاج إلى تشغيل خادم دائم؛ الدالة `api/password-reset.js` تعمل عند طلب إعادة التعيين، والدالة `api/health.js` مخصصة للفحص.

بعد ربط المستودع، افتح **Project Settings → Environment Variables** وأضف القيم إلى بيئة **Production** ثم أعد النشر. يوصى بتعيين `APP_URL` إلى نطاق Vercel النهائي، مثل `https://souq-aldeir.vercel.app`، وتعيين `CORS_ORIGIN` إلى نفس النطاق. إذا لم تحدد `APP_URL` فستستخدم الدالة `VERCEL_URL` تلقائيًا، لكن يظل ضبط `APP_URL` أفضل لضمان ثبات رابط البريد.

استخدم أمر البناء الافتراضي أو اتركه فارغًا، واجعل أمر التشغيل غير مطلوب لدوال `api`. يجب أن تكون نقطة الفحص:

```text
https://your-domain.vercel.app/api/health
```

تدعم Vercel دوال Node.js وتقرأ المتغيرات أثناء تنفيذ الدالة، كما أن متغيرات البيئة مشفرة في التخزين ولا تُضمّن في كود الواجهة [1] [2]. خطة Hobby مجانية للمشاريع الشخصية، لكنها تخضع لسياسة الاستخدام العادل والاستخدام غير التجاري وفق وثائق Vercel [3].

[1]: https://vercel.com/docs/functions/runtimes/node-js
[2]: https://vercel.com/docs/environment-variables
[3]: https://vercel.com/docs/plans/hobby
