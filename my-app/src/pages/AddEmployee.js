import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AddEmployee  = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    gender: '',
    age: '',
department:''    
  });
    const [departments, setDepartments] = useState([]); // لتخزين الأقسام

  const [idImage, setIdImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get('http://localhost/dashboard/evaluation/getdepartmint.php');
        if (res.data.success) {
          setDepartments(res.data.departments);
        }
      } catch (err) {
        console.error('خطأ في جلب الأقسام:', err);
      }
    };
    fetchDepartments();
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validateAge = (age) => {
    const ageNum = parseInt(age);
    return !isNaN(ageNum) && ageNum >= 0 && ageNum <= 120;
  };

  const validateGender = (gender) => {
    const allowedGenders = ['ذكر', 'أنثى', 'other'];
    return allowedGenders.includes(gender);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('حجم الصورة يجب أن يكون أقل من 5MB');
        return;
      }
      
      // Check file type
      const fileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!fileTypes.includes(file.type)) {
        setError('يجب أن تكون الصورة من نوع JPEG, JPG, أو PNG');
        return;
      }

      setIdImage(file);
      setError('');
    }
  };

  const validateForm = () => {
if (!formData.username || !formData.password || !formData.confirmPassword || !formData.email || 
    !formData.phone || !formData.country || !formData.city ||
    !formData.gender || !formData.age || !formData.department) {
  setError('يجب إدخال جميع الحقول المطلوبة');
  return false;
}


    if (formData.password.length < 8) {
      setError('يجب أن تكون كلمة المرور 8 أحرف على الأقل');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return false;
    }

    if (!validateEmail(formData.email)) {
      setError('تنسيق البريد الإلكتروني غير صالح');
      return false;
    }

    if (!validatePhone(formData.phone)) {
      setError('رقم الهاتف يجب أن يتكون من 10 أرقام');
      return false;
    }

    if (!validateGender(formData.gender)) {
      setError('يرجى تحديد الجنس بشكل صحيح');
      return false;
    }
    if (!formData.department) {
  setError('يرجى اختيار القسم');
  return false;
}


    if (!validateAge(formData.age)) {
      setError('يرجى إدخال عمر صالح');
      return false;
    }

    if (!idImage) {
      setError('الصورة مطلوبة');
      return false;
    }

    return true;
  };const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  setLoading(true);

  try {
    const formPayload = new FormData();
    formPayload.append('name', formData.username);
    formPayload.append('email', formData.email);
    formPayload.append('password', formData.password);
    formPayload.append('phone', formData.phone);
    formPayload.append('gender', formData.gender);
    formPayload.append('age', formData.age);
    formPayload.append('department', formData.department);
const location = `${formData.city}, ${formData.country}`;

// إضافة إلى FormData
formPayload.append('location', location);
    if (idImage) {
      formPayload.append('image', idImage);
    }

    const response = await axios.post(
      'http://localhost/dashboard/evaluation/regester.php',
      formPayload,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    );

    if (response.data.success) {
      alert('تم إنشاء المستخدم بنجاح');
      navigate('/datamaneg'); // الانتقال لتسجيل الدخول بعد التسجيل
    } else {
      setError(response.data.message || 'حدث خطأ أثناء إنشاء المستخدم');
    }
  } catch (err) {
    console.error(err);
    setError('خطأ في الاتصال بالخادم');
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={styles.pageContainer}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>
         تسجيل مستخدم جديد
        </h2>
        {error && <div style={styles.errorContainer}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>اسم المستخدم *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="أدخل اسم المستخدم"
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>كلمة المرور *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="أدخل كلمة المرور"
              minLength="8"
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>تأكيد كلمة المرور *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="أعد إدخال كلمة المرور"
              minLength="8"
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>البريد الإلكتروني *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="example@email.com"
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>رقم الهاتف *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="05XXXXXXXX"
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>البلد *</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="أدخل اسم البلد"
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>المدينة *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="أدخل اسم المدينة"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>الجنس *</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              style={styles.select}
            >
              <option value="">اختر الجنس</option>
              <option value="ذكر">ذكر</option>
              <option value="أنثى">أنثى</option>
            
            </select>
          </div>
          
          <div style={styles.formGroup}>
             <label>القسم *</label>
        <select name="department" value={formData.department} onChange={handleChange} required>
          <option value="">اختر القسم</option>
          {departments.map((dep, idx) => (
            <option key={idx} value={dep}>{dep}</option>
          ))}
        </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>العمر *</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min="0"
              max="120"
              style={styles.input}
              placeholder="أدخل عمرك"
            />
          </div>

          
          <div style={styles.formGroup}>
            <label style={styles.label}>صورة الهوية *</label>
            <div style={styles.fileInputContainer}>
              <input
                type="file"
                name="idImage"
                onChange={handleFileChange}
                accept="image/jpeg,image/jpg,image/png"
                required
                style={styles.fileInput}
              />
              <div style={styles.fileInputLabel}>
                {idImage ? 'تم اختيار صورة' : 'اختر صورة الهوية'}
              </div>
            </div>
            {idImage && (
              <div style={styles.imagePreviewContainer}>
                <img
                  src={URL.createObjectURL(idImage)}
                  alt="معاينة"
                  style={styles.imagePreview}
                />
              </div>
            )}
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={loading ? styles.buttonDisabled : styles.button}
          >
            {loading ? 'جاري التسجيل...' : 'تسجيل'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  },
  formContainer: {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    color: '#2d3748',
    marginBottom: '30px',
    fontSize: '28px',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontWeight: '600',
    color: '#4a5568',
    fontSize: '14px',
  },
  input: {
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '16px',
    backgroundColor: '#fff',
    transition: 'all 0.2s',
    width: '100%',
    '&:focus': {
      borderColor: '#4299e1',
      boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.1)',
    },
    '&[type="number"]': {
      '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
        opacity: 1,
        height: '24px',
      },
    },
  },
  select: {
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '16px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s',
    width: '100%',
    '&:focus': {
      borderColor: '#4299e1',
      boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.1)',
    },
  },
  fileInputContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  fileInput: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
    zIndex: 2,
  },
  fileInputLabel: {
    padding: '12px',
    backgroundColor: '#f7fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    color: '#4a5568',
    fontSize: '14px',
    textAlign: 'center',
    width: '100%',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  imagePreviewContainer: {
    marginTop: '8px',
    textAlign: 'center',
  },
  imagePreview: {
    maxWidth: '200px',
    maxHeight: '200px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  button: {
    padding: '14px',
    backgroundColor: '#4299e1',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: '#3182ce',
    },
  },
  buttonDisabled: {
    padding: '14px',
    backgroundColor: '#a0aec0',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'not-allowed',
  },
  errorContainer: {
    backgroundColor: '#fff5f5',
    border: '1px solid #feb2b2',
    color: '#c53030',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    textAlign: 'center',
  },
};

export default AddEmployee ;
