# تهيئة Supabase Presence الخاصة

ميزة «متصل الآن» تستخدم Firebase Authentication القائم في الموقع لإصدار Firebase ID token، ثم تتحقق Supabase من الرمز عبر تكامل Firebase Third-party Auth. لا نستخدم مفتاح `service_role` في المتصفح، ولا نحتاج إلى ترحيل حسابات Firebase أو إضافة custom claims؛ سياسات SQL تسمح بدور `anon` الافتراضي فقط بعد التحقق من `iss` و`aud` لمشروع `souq-aldeir`.

## خطوات الإعداد

1. في لوحة Supabase، افتح المشروع الصحيح ثم **Authentication → Third-Party Auth → Add provider → Firebase**، وأدخل Firebase Project ID: `souq-aldeir`. راجع [دليل Supabase الرسمي لتكامل Firebase](https://supabase.com/docs/guides/auth/third-party/firebase-auth).
2. افتح **SQL Editor** في Supabase، والصق محتوى [`presence_policies.sql`](./presence_policies.sql) ثم نفّذه. السياسات تسمح للمستخدم الموثّق بقراءة حالة Presence، وتقيّد النشر بقناة تحمل UID المطابق لرمز Firebase الخاص به.
3. افتح **Realtime → Settings** وعطّل **Allow public access** حتى تُرفض القنوات العامة وتُفرض سياسات RLS على القنوات الخاصة. هذا الإعداد على مستوى المشروع وقد يؤثر في قنوات Realtime عامة أخرى؛ راجع أي استخدام آخر قبل تغييره. مرجع السياسات: [Supabase Realtime Authorization](https://supabase.com/docs/guides/realtime/authorization).
4. تأكد من وجود `SUPABASE_URL` و`SUPABASE_ANON_KEY` ضمن متغيرات Production في Vercel؛ ذكرت أنها جاهزة مسبقًا. لا تضف مفتاح `service_role` أو `sb_secret` إلى الموقع أو المستودع.

بعد إعداد هذه الخطوات، أخبرني لأتحقق من الإعدادات وأطلب موافقتك قبل نشر الكود. **لن يُدفع أي تغيير إلى الموقع ضمن هذه الخطوة.**