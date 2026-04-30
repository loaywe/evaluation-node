import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateEmployee } from '../radex/Employees'; // عدّل حسب مسار Slice
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:3700/users/login",
        { email, password }  // إرسال البيانات كـ JSON
      );

      if (response.data.user) {
        const user = response.data.user;
        // إعداد بيانات الموظف لتخزينها في Redux و localStorage
        const employeeData = {
          username: user.fullName || "",        // مطابق لاسم الحقل في Redux
          email: user.email || "",
          userType: user.role || "employee",   // type بدل role
          imge: user.imge || "",            // مطابق للحقل المخزن في MongoDB
          phone: user.phone || "",
          address: user.address || "",
          age: user.age || 20,
          gender: user.gender || "",
        };

        // تحديث Redux + localStorage
        dispatch(updateEmployee(employeeData));
        localStorage.setItem("token", response.data.token);
        navigate("/"); // الانتقال للصفحة الرئيسية بعد تسجيل الدخول
      } else {
        setError(response.data.error || "خطأ في تسجيل الدخول");
      }
    } catch (err) {
      console.error(err);
      setError("خطأ في الاتصال بالخادم");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow p-4">
            <h3 className="card-title text-center mb-4">تسجيل الدخول</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
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
                <label className="form-label">كلمة المرور</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                تسجيل الدخول
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
