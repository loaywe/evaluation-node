import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const AddProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    productName: '',
    description: '',
    category: '',
    condition: 'new',
    startingPrice: '',
    auctionEndTime: '',
    quantity: 1,
    fixedPrice: ''
  });

  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!image) return setError('يرجى اختيار صورة');

    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, val]) => data.append(key, val));
      data.append('image', image);  // يجب أن يكون اسم الحقل "image"
      data.append('imageType', 'product'); // لتحديد نوع الصورة (اختياري)

      const token = localStorage.getItem('token');
     await axios.post('http://localhost:3006/addproducts', data, {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data',
    imagetype: 'product'  // تم تمريرها هنا بدلًا من داخل body
  }
});


      navigate('/');
    } catch (err) {
      setError('فشل في إضافة المنتج. يرجى المحاولة لاحقًا');
    }
  };

  return (
    <div dir='rtl'  style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', background: '#f1f1f1', borderRadius: '10px' }}>
      <h2 style={{ textAlign: 'center' }}>إضافة منتج</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <label>اسم المنتج *</label>
        <input type="text" name="productName" value={form.productName} onChange={handleChange} required style={{ width: '100%', marginBottom: '1rem' }} />

        <label>الوصف</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows="3" style={{ width: '100%', marginBottom: '1rem' }} />

        <label>التصنيف *</label>
        <select name="category" value={form.category} onChange={handleChange} required style={{ width: '100%', marginBottom: '1rem' }}>
          <option value="">اختر</option>
          <option value="إلكترونيات">إلكترونيات</option>
          <option value="العقارات">العقارات</option>
          <option value="مركبات">مركبات</option>
          <option value="أزياء">أزياء</option>
          <option value="أثاث">أثاث</option>
          <option value="اخرى">اخرى</option>
        </select>

        <label>الحالة</label>
        <select name="condition" value={form.condition} onChange={handleChange} style={{ width: '100%', marginBottom: '1rem' }}>
          <option value="new">جديد</option>
          <option value="used">مستعمل</option>
        </select>

        <label>سعر البدء *</label>
        <input type="number" name="startingPrice" value={form.startingPrice} onChange={handleChange} required style={{ width: '100%', marginBottom: '1rem' }} />

        <label>السعر الثابت (اختياري)</label>
        <input type="number" name="fixedPrice" value={form.fixedPrice} onChange={handleChange} style={{ width: '100%', marginBottom: '1rem' }} />

        <label>تاريخ انتهاء المزاد *</label>
        <input type="datetime-local" name="auctionEndTime" value={form.auctionEndTime} onChange={handleChange} required style={{ width: '100%', marginBottom: '1rem' }} />

        <label>الكمية *</label>
        <input type="number" name="quantity" value={form.quantity} onChange={handleChange} min="1" required style={{ width: '100%', marginBottom: '1rem' }} />

        <label>صورة المنتج *</label>
        <input type="file" accept="image/*" onChange={handleImageChange} required style={{ width: '100%', marginBottom: '1rem' }} />
        {preview && <img src={preview} alt="preview" style={{ width: '100%', maxHeight: '250px', objectFit: 'contain', marginBottom: '1rem' }} />}

        <button type="submit" style={{ width: '100%', padding: '0.8rem', background: '#007bff', color: 'white', border: 'none' }}>
          إضافة المنتج
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
