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
