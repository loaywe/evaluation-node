import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { updateEmployee } from "../../radex/Employees";

function UserAccount() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.employee.employee);

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);

  // لإدارة الصورة المرفوعة
  const [previewImage, setPreviewImage] = useState(null);
  const [file, setFile] = useState(null);

  // جلب بيانات المستخدم عند التحميل
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("لم يتم تسجيل الدخول");

        const response = await axios.get(
          "http://localhost:3700/users/miacuont",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.user) {
          dispatch(updateEmployee(response.data.user));
          setFormData(response.data.user);
        } else {
          setError(response.data.error || "حدث خطأ أثناء جلب البيانات");
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || err.message || "حدث خطأ");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [dispatch]);

  // التعامل مع تغييرات الحقول
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files && files[0]) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setPreviewImage(URL.createObjectURL(selectedFile));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // تبديل وضع التعديل
  const handleEditToggle = () => setEditing(!editing);

  // حفظ التعديلات
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("لم يتم تسجيل الدخول");

      const dataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "age") {
            dataToSend.append(key, parseInt(value, 10));
          } else {
            dataToSend.append(key, value);
          }
        }
      });

      // إضافة الصورة إذا تم اختيار ملف
      if (file) dataToSend.append("image", file); // ← الاسم يجب أن يكون "image"

      const response = await axios.put(
        "http://localhost:3700/users/update-profile",
        dataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.user) {
        dispatch(updateEmployee(response.data.user));
        setFormData(response.data.user);
        setEditing(false);
        setFile(null);
        setPreviewImage(null);
      } else {
        setError(response.data.error || "حدث خطأ أثناء حفظ البيانات");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "حدث خطأ أثناء حفظ البيانات");
    }
  };

  if (loading) return <div>جاري تحميل البيانات...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!user) return null;

  const imageUrl = previewImage
    ? previewImage
    : user.imge
    ? user.imge
    : "/person.png";

  return (
    <div className="container mt-5" dir="rtl">
      <h3>الملف الشخصي</h3>

      {/* عرض ومعاينة الصورة */}
      <div className="text-center mb-4">
        <img
          src={imageUrl}
          alt="الصورة الشخصية"
          className="rounded-circle border border-3 border-primary"
          style={{ width: "120px", height: "120px", objectFit: "cover" }}
        />
        {editing && (
          <div className="mt-2">
            <input
              type="file"
              name="image" // ← تم التعديل هنا
              accept="image/*"
              className="form-control"
              onChange={handleChange}
            />
          </div>
        )}
      </div>

      {/* بيانات المستخدم */}
      <ul className="list-group mb-3">
        <li className="list-group-item d-flex justify-content-between">
          <strong>اسم المستخدم</strong>
          <span>{formData.username || formData.fullName || "-"}</span>
        </li>

        {Object.entries(formData).map(([key, value]) => {
          if (["imge", "username", "fullName"].includes(key)) return null;

          const fieldLabels = {
            age: "العمر",
            gender: "الجنس",
            department: "القسم",
            email: "البريد الإلكتروني",
            phone: "رقم الهاتف",
            password: "كلمة المرور",
            address: "العنوان",
          };

          return (
            <li
              className="list-group-item d-flex justify-content-between"
              key={key}
            >
              <strong>{fieldLabels[key] || key}</strong>
              {editing ? (
                <input
                  type={key === "password" ? "password" : "text"}
                  name={key}
                  value={value || ""}
                  onChange={handleChange}
                  className="form-control"
                  style={{ width: "60%" }}
                />
              ) : (
                <span>{value || "-"}</span>
              )}
            </li>
          );
        })}
      </ul>

      {/* أزرار التحكم */}
      <div className="d-flex justify-content-between">
        {editing && (
          <button className="btn btn-success" onClick={handleSave}>
            حفظ التعديلات
          </button>
        )}
        <button className="btn btn-primary" onClick={handleEditToggle}>
          {editing ? "إلغاء" : "تعديل البيانات"}
        </button>
      </div>
    </div>
  );
}

export default UserAccount;
