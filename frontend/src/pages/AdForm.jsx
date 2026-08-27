/** تصميم سوق الحي الواثق: نموذج نشر مباشر يمنع الأسعار غير المقصودة ويشرح الحقول بوضوح. */
import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { toast } from '../components/Toast.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { compressImage, validatePhone } from '../utils.js';

const DURATIONS = [
  { value: 30, label: '30 يوماً' },
  { value: 60, label: '60 يوماً' },
  { value: 90, label: '90 يوماً' },
  { value: 180, label: '6 أشهر' },
  { value: 365, label: 'سنة كاملة' }
];

export default function AdForm({ editAd, onDone, onRequireAuth, onCancel }) {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [keepImages, setKeepImages] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'USD',
    phone: '',
    category: '',
    area: '',
    customArea: '',
    durationDays: 30
  });

  useEffect(() => {
    api.get('/api/ads/categories').then(setCategories).catch(() => {});
    api.get('/api/ads/areas').then(setAreas).catch(() => {});
    if (editAd) {
      setForm({
        title: editAd.title,
        description: editAd.description,
        price: String(editAd.price),
        currency: editAd.currency,
        phone: editAd.phone,
        category: editAd.category,
        area: editAd.area,
        customArea: editAd.customArea || '',
        durationDays: editAd.durationDays
      });
      setKeepImages(JSON.stringify(editAd.images || []));
    } else if (user) {
      setForm((f) => ({ ...f, phone: user.phone || '' }));
    }
  }, [editAd]);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []).slice(0, 5 - imageFiles.length);
    const newFiles = [];
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        try {
          const compressed = await compressImage(file);
          newFiles.push(compressed);
        } catch (err) {
          newFiles.push(file);
        }
      }
    }
    setImageFiles((prev) => [...prev, ...newFiles].slice(0, 5));
    e.target.value = '';
  }

  function handleVideo(e) {
    const file = e.target.files && e.target.files[0];
    if (file && file.size > 15 * 1024 * 1024) {
      toast('الفيديو يجب أن يكون أقل من 15 ميجابايت', 'error');
      return;
    }
    setVideoFile(file || null);
  }

  function removeImage(i) {
    setImageFiles((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function submit() {
    if (!user) return onRequireAuth();
    if (!form.title.trim()) return toast('عنوان الإعلان مطلوب', 'error');
    if (!form.description.trim()) return toast('وصف الإعلان مطلوب', 'error');
    if (form.price === '' || isNaN(Number(form.price)) || Number(form.price) <= 0)
      return toast('أدخل سعراً صحيحاً', 'error');
    if (!form.phone.trim()) return toast('رقم الهاتف مطلوب', 'error');
    if (!validatePhone(form.phone)) return toast('رقم الهاتف غير صحيح', 'error');
    if (!form.category) return toast('اختر الفئة', 'error');
    if (!form.area) return toast('اختر المنطقة', 'error');
    if (!agree) return toast('يجب الموافقة على شروط الاستخدام', 'error');

    setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append('keepImages', keepImages);
    imageFiles.forEach((f) => fd.append('images', f));
    if (videoFile) fd.append('images', videoFile);

    try {
      if (editAd) {
        await api.put(`/api/ads/${editAd.id}`, fd);
        toast('تم حفظ التعديلات', 'success');
      } else {
        await api.upload('/api/ads', fd);
        toast('تم نشر إعلانك بنجاح', 'success');
      }
      onDone();
    } catch (e) {
      toast(e.message, 'error');
    }
    setLoading(false);
  }

  return (
    <div className="form-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
          {editAd ? 'تعديل الإعلان' : 'نشر إعلان جديد'}
        </h2>
        {onCancel && (
          <button className="btn btn-ghost btn-sm" onClick={onCancel}>إلغاء</button>
        )}
      </div>

      <div className="form-group">
        <label>عنوان الإعلان <span className="req">*</span></label>
        <input value={form.title} onChange={(e) => set('title', e.target.value)} maxLength={80} placeholder="مثال: سيارة تويوتا كورولا 2018" />
      </div>

      <div className="form-group">
        <label>الوصف <span className="req">*</span></label>
        <textarea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="اكتب تفاصيل الإعلان: الحالة، المواصفات، طريقة التواصل..." />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>السعر <span className="req">*</span></label>
          <input type="number" min="1" value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="مثال: 2500000" />
        </div>
        <div className="form-group">
          <label>العملة</label>
          <select value={form.currency} onChange={(e) => set('currency', e.target.value)}>
            <option value="USD">دولار أمريكي $</option>
            <option value="SYP">ليرة سورية ل.س</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>رقم الهاتف <span className="req">*</span></label>
        <input value={form.phone} onChange={(e) => set('phone', e.target.value)} dir="ltr" placeholder="09xxxxxxx" />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>الفئة <span className="req">*</span></label>
          <select value={form.category} onChange={(e) => set('category', e.target.value)}>
            <option value="">اختر الفئة...</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>المنطقة <span className="req">*</span></label>
          <select value={form.area} onChange={(e) => set('area', e.target.value)}>
            <option value="">اختر المنطقة...</option>
            {areas.filter((a) => a !== 'قرية/منطقة أخرى').map((a) => <option key={a} value={a}>{a}</option>)}
            <option value="قرية/منطقة أخرى">قرية/منطقة أخرى (اكتبها)</option>
          </select>
        </div>
      </div>

      {form.area === 'قرية/منطقة أخرى' && (
        <div className="form-group">
          <label>اسم القرية/المنطقة</label>
          <input value={form.customArea} onChange={(e) => set('customArea', e.target.value)} placeholder="اكتب اسم المنطقة" />
        </div>
      )}

      <div className="form-group">
        <label>مدة الإعلان</label>
        <select value={form.durationDays} onChange={(e) => set('durationDays', Number(e.target.value))}>
          {DURATIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label>صور الإعلان (حتى 5 صور)</label>
        <div className="upload-grid">
          {imageFiles.map((f, i) => (
            <div key={i} className="upload-box">
              <img src={URL.createObjectURL(f)} alt="" />
              <button className="remove" onClick={() => removeImage(i)}>
                <i className="fas fa-xmark" />
              </button>
            </div>
          ))}
          {imageFiles.length < 5 && (
            <label className="upload-box">
              <i className="fas fa-camera" />
              <span>إضافة</span>
              <input type="file" accept="image/*" multiple hidden onChange={handleFiles} />
            </label>
          )}
        </div>
      </div>

      <div className="form-group">
        <label>فيديو (اختياري، حتى 15 ميجابايت)</label>
        <input type="file" accept="video/*" onChange={handleVideo} />
        {videoFile && (
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="fas fa-file-video" style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '0.85rem' }}>{videoFile.name}</span>
            <button className="btn btn-sm btn-ghost" onClick={() => setVideoFile(null)}>إزالة</button>
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="check-row">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          <span>
            أوافق على شروط الاستخدام وأتحمل مسؤولية صحة إعلاني والتعامل مع الطرف الآخر
          </span>
        </label>
      </div>

      <button className="btn btn-primary btn-block" onClick={submit} disabled={loading}>
        {loading ? 'جاري النشر...' : editAd ? 'حفظ التعديلات' : 'نشر الإعلان'}
      </button>
    </div>
  );
}
