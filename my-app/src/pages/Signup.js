import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    email: '',
    gender: '',
    age: '',
    department: '',
    role: 'employee', // افتراضي
  });

  const [departments, setDepartments] = useState([]);
  const [idImage, setIdImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        // جلب الأقسام (يمكن تعديل الرابط حسب backend الجديد)
        const res = await axios.get('http://localhost:3700/users/departments');
        setDepartments(res.data.departments || []);
      } catch (err) {
        console.error('خطأ في جلب الأقسام:', err);
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError('حجم الصورة يجب أن يكون أقل من 5MB');
        return;
      }
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setError('يجب أن تكون الصورة من نوع JPEG, JPG, أو PNG');
        return;
      }
      setIdImage(file);
      setError('');
    }
  };

  const validateForm = () => {
    const { firstName, lastName, password, confirmPassword, email, gender, age, department } = formData;
    if (!firstName || !lastName || !password || !confirmPassword || !email || !gender || !age || !department) {
      setError('جميع الحقول مطلوبة');
      return false;
    }
    if (password.length < 8) {
      setError('يجب أن تكون كلمة المرور 8 أحرف على الأقل');
      return false;
    }
    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return false;
    }
    if (!idImage) {
      setError('الصورة مطلوبة');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formPayload = new FormData();
      formPayload.append('firstName', formData.firstName);
      formPayload.append('lastName', formData.lastName);
      formPayload.append('email', formData.email);
      formPayload.append('password', formData.password);
      formPayload.append('gender', formData.gender);
      formPayload.append('age', formData.age);
      formPayload.append('department', formData.department);
      formPayload.append('role', formData.role);
if (idImage) formPayload.append('idImage', idImage);

      const response = await axios.post(
        'http://localhost:3700/users/register2',
        formPayload,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      if (response.data.user) {
        alert('تم إنشاء المستخدم بنجاح');
        navigate('/login');
      } else {
        setError(response.data.error || 'حدث خطأ أثناء التسجيل');
      }
    } catch (err) {
      console.error(err);
      setError('خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>تسجيل مستخدم جديد</h2>
      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="firstName" placeholder="الاسم الأول" value={formData.firstName} onChange={handleChange} required />
        <input type="text" name="lastName" placeholder="اسم العائلة" value={formData.lastName} onChange={handleChange} required />
        <input type="email" name="email" placeholder="البريد الإلكتروني" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="كلمة المرور" value={formData.password} onChange={handleChange} required />
        <input type="password" name="confirmPassword" placeholder="تأكيد كلمة المرور" value={formData.confirmPassword} onChange={handleChange} required />
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">اختر الجنس</option>
          <option value="male">ذكر</option>
          <option value="female">أنثى</option>
        </select>
        <input type="number" name="age" placeholder="العمر" value={formData.age} onChange={handleChange} required />
        <select name="department" value={formData.department} onChange={handleChange} required>
          <option value="">اختر القسم</option>
          {departments.map((dep, idx) => <option key={idx} value={dep}>{dep}</option>)}
        </select>
        <input type="file" name="idImage" onChange={handleFileChange} required />
        <button type="submit" disabled={loading}>{loading ? 'جاري التسجيل...' : 'تسجيل'}</button>
      </form>
    </div>
  );
};

export default Signup;
