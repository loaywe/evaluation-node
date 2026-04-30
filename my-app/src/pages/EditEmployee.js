import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector } from "react-redux";

const EditEmployee = () => {
  const user = useSelector((state) => state.employee.employee); // بيانات المستخدم الحالي
  const navigate = useNavigate();
  const location = useLocation();

  // استخراج id الموظف من الرابط
  const queryParams = new URLSearchParams(location.search);
  const idemloyee = queryParams.get("idemloyee");

  const [employee, setEmployee] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState(0);
  const [locationEmp, setLocationEmp] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // جلب بيانات الموظف من API
useEffect(() => {
  if (idemloyee && user && user.username) {
    axios
      .get(`http://localhost/dashboard/evaluation/selectemployeid.php`, {
        params: {
          idemloyee: idemloyee,
          username: user.username
        }
      })
      .then((res) => {
        setEmployee(res.data);
        if (res.data) {
          setName(res.data.name || "");
          setEmail(res.data.email || "");
          setDepartment(res.data.department || "");
          setPhone(res.data.phone || "");
          setGender(res.data.gender || "");
          setAge(res.data.age || 0);
          setLocationEmp(res.data.location || "");
        }
      })
      .catch((err) => console.error("خطأ في جلب البيانات:", err));
  }
  }, [idemloyee]);

  if (!idemloyee) return <p>لم يتم تمرير رقم الموظف</p>;
  if (!employee) return <p>جاري تحميل بيانات الموظف...</p>;

  // تعديل بيانات الموظف
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !department) {
      alert("الرجاء تعبئة الحقول الأساسية: الاسم، البريد الإلكتروني، القسم.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", user.username); // المستخدم الحالي للتحقق
      formData.append("idemloyee", idemloyee);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("department", department);
      formData.append("phone", phone);
      formData.append("gender", gender);
      formData.append("age", age);
      formData.append("location", locationEmp);

      if (imageFile) formData.append("image", imageFile);

      const response = await axios.post(
        "http://localhost/dashboard/evaluation/updetemploye.php",
        formData,{ params: {
          idemloyee: idemloyee,
          username: user.username
        }},
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        alert(response.data.message);
        navigate("/datamaneg"); // إعادة التوجيه لقائمة الموظفين
      } else {
        alert(response.data.error || response.data.message);
      }
    } catch (error) {
      console.error("خطأ في تعديل الموظف:", error);
      alert("حدث خطأ أثناء التعديل");
    }
    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <h2>تعديل بيانات الموظف رقم {idemloyee}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">الاسم</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">البريد الإلكتروني</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">القسم</label>
          <input
            type="text"
            className="form-control"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">رقم الهاتف</label>
          <input
            type="text"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">الجنس</label>
          <input
            type="text"
            className="form-control"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">العمر</label>
          <input
            type="number"
            className="form-control"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value))}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">الموقع</label>
          <input
            type="text"
            className="form-control"
            value={locationEmp}
            onChange={(e) => setLocationEmp(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">صورة الموظف</label>
          <div className="mb-2">
            <img
              src={
                imageFile
                  ? URL.createObjectURL(imageFile)
                  : employee.image
                  ? `http://localhost/dashboard/evaluation/uploads/${employee.image}`
                  : ""
              }
              alt={name}
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

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "جاري التعديل..." : "حفظ التعديلات"}
        </button>
      </form>
    </div>
  );
};

export default EditEmployee;
