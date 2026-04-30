// EdetAds.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector } from "react-redux";

const EdetAds = () => {
  const user = useSelector((state) => state.employee.employee); 
  const navigate = useNavigate();
  const location = useLocation();

  // استخراج idad من الرابط
  const queryParams = new URLSearchParams(location.search);
  const idad = queryParams.get("idad");

  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [ad, setAd] = useState(null);

  // جلب بيانات الإعلان من API
  useEffect(() => {
    if (idad) {
      axios
        .get(`http://localhost/dashboard/evaluation/getAd.php?idad=${idad}`)
        .then((res) => {
          setAd(res.data);
          if (res.data) {
            setDescription(res.data.description || "");
            setType(res.data.type || "");
          }
        })
        .catch((err) => console.error("خطأ في جلب البيانات:", err));
    }
  }, [idad]);

  if (!idad) {
    return <p>لم يتم تمرير رقم الإعلان</p>;
  }

  if (!ad) {
    return <p>جاري تحميل بيانات الإعلان...</p>;
  }

  // تعديل الإعلان
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
      formData.append("idad", idad); // تمرير idad للـ PHP

      if (imageFile) formData.append("image", imageFile);

      const response = await axios.post(
        "http://localhost/dashboard/evaluation/updateAd.php", // ملف للتعديل
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        alert(response.data.message);
        navigate("/datamaneg");
      } else {
        alert(response.data.error || response.data.message);
      }
    } catch (error) {
      console.error("خطأ في تعديل الإعلان:", error);
      alert("حدث خطأ أثناء التعديل");
    }
    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <h2>تعديل إعلان رقم {idad}</h2>
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
  <label className="form-label">صورة الإعلان</label>
  <div className="mb-2">
    {/* عرض الصورة الجديدة إذا تم اختيارها، وإلا عرض الصورة القديمة */}
    <img
      src={
        imageFile
          ? URL.createObjectURL(imageFile) // الصورة الجديدة مؤقتًا قبل الإرسال
          : ad.img.startsWith("http")
          ? ad.img
          : `http://localhost/dashboard/evaluation/uploads/${ad.img}`
      }
      alt={description}
      style={{ width: "80px", borderRadius: "5px" }}
    />
  </div>
  <input
    type="file"
    className="form-control"
    accept="image/*"
    onChange={(e) => setImageFile(e.target.files[0])}
  />
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
          {loading ? "جاري التعديل..." : "حفظ التعديلات"}
        </button>
      </form>
    </div>
  );
};

export default EdetAds;
