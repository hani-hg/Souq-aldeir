# إعداد إعادة تعيين كلمة المرور عبر Firebase

يستخدم الموقع endpoint الخادم `/api/password-reset` لإنشاء رابط Firebase آمن، ثم يرسل الرسالة عبر Resend من العنوان `noreply@souqaldeir.com`. صفحة `/reset-password.html` تتحقق من رمز الرابط وتعيّن كلمة المرور الجديدة عبر Firebase Web SDK.

## متطلبات الأمان

- يجب أن يكون `firebaseAdmin: true` في `/api/health` قبل اعتماد إرسال رسائل الاستعادة؛ الخادم يستخدم Firebase Admin لإنشاء رابط الإجراء، بينما تنفذ Firebase Web SDK عملية `confirmPasswordReset` النهائية. لا نستخدم `updateUser()` من المتصفح ولا نضع Service Account في الواجهة.
- رمز Firebase الخاص بإعادة تعيين كلمة المرور محدود الصلاحية وفق Firebase (حوالي ساعة كحد أقصى) ويُستهلك مرة واحدة عند نجاح `confirmPasswordReset`. لا يمكن تمديد عمره من Resend؛ Resend ناقل للرسالة فقط.
- تعالج الصفحة أخطاء `auth/expired-action-code` و`auth/invalid-action-code` وترفض الرمز المنتهي أو المستخدم سابقًا.
- تعيد `/api/password-reset` رسالة عامة موحّدة ولا تكشف ما إذا كان البريد مسجلًا؛ وهذا يمنع كشف قائمة المستخدمين. كما توجد حماية من كثرة الطلبات.

## إعداد Firebase المطلوب

تأكد من التالي في مشروع Firebase `souq-aldeir`:

1. تفعيل **Email/Password** من Authentication → Sign-in method.
2. إضافة `www.souqaldeir.com` و`souqaldeir.com` إلى Authentication → Settings → Authorized domains.
3. التأكد من أن الحساب يملك بريدًا حقيقيًا، وليس عنوانًا داخليًا منتهيًا بـ `@souq-aldeir.local`.
4. إضافة `RESEND_API_KEY` إلى Vercel Production، مع توثيق النطاق في Resend. المرسل الثابت في الموقع هو `noreply@souqaldeir.com`.

## التحقق

نفّذ:

```text
https://www.souqaldeir.com/api/health
```

يجب أن يعيد `ok: true` مع `passwordResetDelivery: "resend"` و`config.resend: true` و`passwordResetReady: true`.

## النشر على Vercel

في Vercel يجب إضافة `RESEND_API_KEY` إلى Production، مع بقاء Firebase Admin و`APP_URL=https://www.souqaldeir.com` مضبوطين. لا تضع المفتاح في GitHub أو الواجهة. بعد النشر، افتح تبويب «نسيت كلمة المرور» وأدخل بريدًا حقيقيًا مرتبطًا بحساب Email/Password.

إذا ظهر `auth/operation-not-allowed` فطريقة Email/Password غير مفعلة. إذا ظهر `auth/unauthorized-continue-uri` أو لم تصل الرسالة، راجع Authorized domains وقالب البريد في Firebase.
