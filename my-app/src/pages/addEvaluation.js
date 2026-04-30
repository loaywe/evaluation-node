import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const AddEvaluation = () => {
  const user = useSelector((state) => state.employee.employee);
  const navigate = useNavigate();

  const [evaluation, setEvaluation] = useState({
    employeeid: "",
    employee_name: "",
    department: "",
    evaluation_type: "داخلي",
    date: "",
    evaluatorid: "",
    punctuality: 0,
    productivity: 0,
    teamwork: 0,
    discipline: 0,
    initiative: 0,
    "problem-solving": 0,
    communication: 0,
    creativity: 0,
    "goal-achievement": 0,
    "time-management": 0,
    adaptability: 0,
    attention_to_detail: 0,
    accountability: 0,
    "overall-score": 0,
  });

  const [employees, setEmployees] = useState([]);
  const [evaluators, setEvaluators] = useState([]);
  const [loading, setLoading] = useState(false);

  const fieldLabels = {
    punctuality: "الانضباط في الوقت",
    productivity: "الإنتاجية",
    teamwork: "العمل الجماعي",
    discipline: "الانضباط",
    initiative: "المبادرة",
    "problem-solving": "حل المشكلات",
    communication: "التواصل",
    creativity: "الإبداع",
    "goal-achievement": "تحقيق الأهداف",
    "time-management": "إدارة الوقت",
    adaptability: "القدرة على التكيف",
    attention_to_detail: "الاهتمام بالتفاصيل",
    accountability: "المسؤولية",
  };

  // جلب الموظفين
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost/dashboard/evaluation/selsctemploye.php", {
        params: { username: user.username },
      })
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];
        setEmployees(data);
        evaluation.evaluatorid= response.data.idemloyee;
        setLoading(false);
      })
      .catch((error) => {
        console.error("خطأ في جلب بيانات الموظفين:", error);
        setEmployees([]);
        setLoading(false);
      });
  }, [user.username]);

  // جلب المقييمين
  const fetchEvaluators = (employeeid) => {
    console.log("جلب المقييمين:", user?.username, employeeid);
    setLoading(true);

    axios
      .get("http://localhost/dashboard/evaluation/getEvaluators.php", {
        params: { username: user.username, employeeid },
      })
      .then((response) => {
        console.log("استجابة السيرفر:", response.data);

        if (response.data.success && response.data.manager) {
          setEvaluators([response.data.manager]);
        } else {
          setEvaluators([]);
          console.warn("لم يتم العثور على مقيّم:", response.data);
        }

        setLoading(false);
      })
      .catch((error) => {
        setEvaluators([]);
        setLoading(false);

        if (error.response) {
          console.error("خطأ في استجابة السيرفر:", error.response.data);
        } else if (error.request) {
          console.error("لم يتم استلام أي رد من السيرفر:", error.request);
        } else {
          console.error("حدث خطأ:", error.message);
        }
        console.log("كائن الخطأ الكامل:", error);
      });
  };

  // استدعاء المقييمين عند تغيير نوع التقييم أو الموظف
  useEffect(() => {
    if (evaluation.evaluation_type === "خارجي" && evaluation.employeeid) {
      fetchEvaluators(evaluation.employeeid);
    }
  }, [evaluation.evaluation_type, evaluation.employeeid]);

  // التعامل مع تغيير الحقول
  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = name in fieldLabels ? parseInt(value) || 0 : value;

    if (fieldLabels[name] && val > 10) val = 10;

    const newEvaluation = { ...evaluation, [name]: val };

    // تحديث التقييم العام
    const total = Object.keys(fieldLabels).reduce(
      (sum, key) => sum + (parseInt(newEvaluation[key]) || 0),
      0
    );
    const maxTotal = Object.keys(fieldLabels).length * 10;
    newEvaluation["overall-score"] = Math.round((total / maxTotal) * 100);

    setEvaluation(newEvaluation);
  };

  // إرسال التقييم
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(evaluation).forEach((key) => formData.append(key, evaluation[key]));
      formData.append("username", user.username);

      const response = await axios.post(
        "http://localhost/dashboard/evaluation/addEvaluation.php",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        alert(response.data.message);
        setEvaluation({ ...evaluation, evaluatorid: "", "overall-score": 0 });
    navigate("/datamaneg");

      } else {
        alert(response.data.error || "فشل إضافة التقييم");
      }
    } catch (error) {
      console.error("خطأ أثناء الإضافة:", error);
      alert("حدث خطأ أثناء إضافة التقييم");
    }

    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <h2>إضافة تقييم جديد</h2>
      <form onSubmit={handleSubmit} className="card p-4">
        {/* اختيار الموظف */}
        <div className="mb-3">
          <label className="form-label">اختر الموظف:</label>
          <select
            className="form-control"
            name="employeeid"
            value={evaluation.employeeid}
            onChange={handleChange}
            required
          >
            <option value="">-- اختر الموظف --</option>
            {employees.map((emp) => (
              <option key={emp.idemloyee} value={emp.idemloyee}>
                {emp.name} ({emp.department})
              </option>
            ))}
          </select>
        </div>

        {/* نوع التقييم */}
        <div className="mb-3">
          <label className="form-label">نوع التقييم:</label>
          <select
            className="form-control"
            name="evaluation_type"
            value={evaluation.evaluation_type}
            onChange={handleChange}
          >
            <option value="داخلي">داخلي </option>
            <option value="خارجي">خارجي </option>
          </select>
        </div>

        {/* اختيار المقييم إذا كان خارجي */}
        {evaluation.evaluation_type === "خارجي" && (
          <div className="mb-3">
            <label className="form-label">اختر المقييم:</label>
            <select
              className="form-control"
              name="evaluatorid"
              value={evaluation.evaluatorid}
              onChange={handleChange}
              required
            >
              <option value="">-- اختر المقييم --</option>
              {evaluators.map((ev) => (
                <option key={ev.Managerid} value={ev.Managerid}>
                  {ev.name} ({ev.department})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* التاريخ */}
        <div className="mb-3">
          <label className="form-label">تاريخ التقييم:</label>
          <input
            type="date"
            name="date"
            className="form-control"
            value={evaluation.date}
            onChange={handleChange}
            required
          />
        </div>

        {/* الحقول الرقمية */}
        {Object.keys(fieldLabels).map((key) => (
          <div className="mb-3" key={key}>
            <label className="form-label">{fieldLabels[key]}</label>
            <input
              type="number"
              name={key}
              className="form-control"
              value={evaluation[key]}
              onChange={handleChange}
              min="0"
              max="10"
              required
            />
          </div>
        ))}

        {/* التقييم العام */}
        <div className="mb-3">
          <label className="form-label">التقييم العام (من 100):</label>
          <input
            type="number"
            className="form-control"
            value={evaluation["overall-score"]}
            disabled
          />
        </div>

        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? "جاري الحفظ..." : "إضافة التقييم"}
        </button>
      </form>
    </div>
  );
};

export default AddEvaluation;
