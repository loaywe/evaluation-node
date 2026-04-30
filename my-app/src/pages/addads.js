import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// AddAd.js
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from 'react-redux';

const AddAd = () => {
  const user = useSelector((state) => state.employee.employee); // تأكد أن الريدوكس يحتوي على username
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !type) {
      alert("الرجاء تعبئة الحقول الأساسية");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", user.username);
      formData.append("description", description);
      formData.append("type", type);
      if (imageFile) formData.append("image", imageFile);

      const response = await axios.post(
        "http://localhost/dashboard/evaluation/insertads.php",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        alert(response.data.message);
        setDescription("");
        setImageFile(null);
        setType("");
navigate('/datamaneg');
      } else {
        alert(response.data.error || response.data.message);
      }
    } catch (error) {
      console.error("خطأ في إضافة الإعلان:", error);
      alert("حدث خطأ أثناء الإضافة");
    }
    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <h2>إضافة إعلان جديد</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">الوصف</label>
          <input
            type="text"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
<div className="mb-3">
  <label className="form-label">اختر صورة</label>
  <input
    type="file"
    className="form-control"
    accept="image/*"
    onChange={(e) => setImageFile(e.target.files[0])}
  />
  {/* عرض الصورة المختارة */}
  {imageFile && (
    <div className="mt-2">
      <img
        src={URL.createObjectURL(imageFile)}
        alt="معاينة"
        style={{ width: "100px", borderRadius: "5px" }}
      />
    </div>
  )}
</div>

        <div className="mb-3">
          <label className="form-label">النوع</label>
          <input
            type="text"
            className="form-control"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "جاري الإضافة..." : "إضافة الإعلان"}
        </button>
      </form>
    </div>
  );
};

export default AddAd;
