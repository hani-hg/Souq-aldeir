/* ============================================================
   demo-ads.js
   إعلانات وهمية جاهزة للعرض (عقارات، سيارات، أثاث، إلكترونيات، وظائف).
   يتم إضافتها فقط عند الضغط على الزر من لوحة التحكم، ولمرة واحدة.
   ============================================================ */

const DEMO_ADS = [
  { title: 'شقة سكنية 150م - حي الجورة', description: 'شقة واسعة، ثلاث غرف نوم وصالة، طابق ثاني، تشطيب حديث، قريبة من الخدمات.', price: 25000000, category: 'عقارات', area: 'دير الزور', phone: '0933000001', images: ['https://picsum.photos/seed/souq-apt1/600/450'] },
  { title: 'محل تجاري للإيجار - شارع الحرية', description: 'محل واجهة زجاجية، مساحة 40م، مناسب لأي نشاط تجاري.', price: 500000, category: 'عقارات', area: 'دير الزور', phone: '0933000002', images: ['https://picsum.photos/seed/souq-shop1/600/450'] },
  { title: 'كيا سيراتو 2015', description: 'فحص كامل، مالك واحد، صيانة دورية منتظمة، حالة ممتازة.', price: 18000000, category: 'سيارات', area: 'دير الزور', phone: '0933000003', images: ['https://picsum.photos/seed/souq-car1/600/450'] },
  { title: 'هيونداي أكسنت 2012 للبيع', description: 'اقتصادية بالمصروف، جير عادي، إطارات جديدة.', price: 11500000, category: 'سيارات', area: 'الميادين', phone: '0933000004', images: ['https://picsum.photos/seed/souq-car2/600/450'] },
  { title: 'طقم صالون خشب زان 7 قطع', description: 'صناعة محلية فاخرة، حشوة اسفنج كثيف، حالة كالجديد.', price: 3200000, category: 'أثاث', area: 'دير الزور', phone: '0933000005', images: ['https://picsum.photos/seed/souq-sofa1/600/450'] },
  { title: 'غرفة نوم كاملة مع خزانة 6 أبواب', description: 'تصميم عصري، خشب MDF عالي الجودة، شاملة الطاولات الجانبية.', price: 2800000, category: 'أثاث', area: 'البوكمال', phone: '0933000006', images: ['https://picsum.photos/seed/souq-bed1/600/450'] },
  { title: 'لابتوب Dell Core i5 جيل ثامن', description: 'رام 8GB، هارد SSD، بطارية ممتازة، مناسب للدراسة والعمل.', price: 2100000, category: 'إلكترونيات', area: 'دير الزور', phone: '0933000007', images: ['https://picsum.photos/seed/souq-laptop1/600/450'] },
  { title: 'مطلوب مندوب مبيعات', description: 'شركة مواد غذائية بحاجة لمندوب مبيعات بخبرة سنة على الأقل، راتب ثابت + عمولة.', price: 0, category: 'وظائف', area: 'دير الزور', phone: '0933000008', images: [] }
];

async function seedDemoAds() {
  if (!currentUser || !isAdmin) { showToast('صلاحية الأدمن مطلوبة', 'bad'); return; }
  if (!confirm('سيتم إضافة ' + DEMO_ADS.length + ' إعلان تجريبي إلى الموقع. متابعة؟')) return;
  try {
    const batchPromises = DEMO_ADS.map(ad => {
      const durationDays = 60;
      const expiresAt = new Date(Date.now() + durationDays * 86400000);
      return db.collection('ads').add({
        title: ad.title, description: ad.description, price: ad.price, currency: 'ل.س',
        phone: ad.phone, category: ad.category, area: ad.area,
        images: ad.images, imageUrl: ad.images[0] || null, videoUrl: null,
        featured: false, views: 0, isDemo: true,
        userId: currentUser.uid, userEmail: currentUser.email, userName: 'سوق دير الزور',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        expiresAt: firebase.firestore.Timestamp.fromDate(expiresAt),
        durationDays
      });
    });
    await Promise.all(batchPromises);
    showToast('تمت إضافة الإعلانات التجريبية بنجاح ✅', 'ok');
    loadAds();
  } catch (e) {
    showToast('حدث خطأ أثناء إضافة الإعلانات التجريبية', 'bad');
  }
}

