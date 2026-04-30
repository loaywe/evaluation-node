import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const EditEvaluation = () => {
  const user = useSelector((state) => state.employee.employee);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const evaluationId = queryParams.get("evaluationId");

  const [evaluation, setEvaluation] = useState(null);
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

  // جلب بيانات التقييم
  useEffect(() => {
    if (evaluationId) {
      const formData = new FormData();
      formData.append("evaluation_id", evaluationId);
      formData.append("username", user.username);

      axios
        .post(
          "http://localhost/dashboard/evaluation/selectevaluationid.php",
          formData,
          {
            params: { evaluationId: evaluationId, username: user.username },
            headers: { "Content-Type": "multipart/form-data" },
          }
        )
        .then((res) => {
          if (res.data.success) {
            setEvaluation(res.data.evaluation);
          } else {
            alert(res.data.error || "فشل جلب بيانات التقييم");
          }
        })
        .catch((err) => console.error("خطأ في جلب البيانات:", err));
    }
  }, [evaluationId, user.username]);

  if (!evaluationId) return <p>لم يتم تمرير رقم التقييم</p>;
  if (!evaluation) return <p>جاري تحميل بيانات التقييم...</p>;

  // تحديث القيم وحساب التقييم العام
  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = parseInt(value) || 0;
    if (val > 10) val = 10;

    const newEvaluation = { ...evaluation, [name]: val };

    // حساب التقييم العام
    const numericFields = Object.keys(fieldLabels).filter(
      (key) => newEvaluation[key] !== undefined
    );
    const total = numericFields.reduce((sum, key) => {
      return sum + (parseInt(newEvaluation[key]) || 0);
    }, 0);
    const maxTotal = numericFields.length * 10;
    newEvaluation["overall-score"] = Math.round((total / maxTotal) * 100);

    setEvaluation(newEvaluation);
  };

  // إرسال التعديلات
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", user.username);
      formData.append("evaluation_id", evaluationId);

      Object.keys(evaluation).forEach((key) => {
        formData.append(key, evaluation[key]);
      });

   const response = await axios.post(
  "http://localhost/dashboard/evaluation/updetevaluation.php",
  formData, // ✅ مباشرة
  { headers: { "Content-Type": "multipart/form-data" } }
);


      if (response.data.success) {
        alert(response.data.message);
        navigate("/datamaneg");
      } else {
        alert(response.data.error || "فشل تعديل التقييم");
      }
    } catch (error) {
      console.error("خطأ أثناء التعديل:", error);
      alert("حدث خطأ أثناء التعديل");
    }

    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <h2>تعديل التقييم رقم {evaluationId}</h2>
      <form onSubmit={handleSubmit} className="card p-4">
        {/* اسم الموظف */}
        <div className="mb-3">
          <label className="form-label">الموظف:</label>
          <input
            type="text"
            className="form-control"
            value={evaluation.employee_name || ""}
            disabled
          />
        </div>

        {/* اسم المقيم */}
        <div className="mb-3">
          <label className="form-label">المقيم:</label>
          <input
            type="text"
            className="form-control"
            value={evaluation.evaluator_name || ""}
            disabled
          />
        </div>

        {/* نوع التقييم */}
        <div className="mb-3">
          <label className="form-label">نوع التقييم:</label>
          <input
            type="text"
            className="form-control"
            value={evaluation.evaluation_type || ""}
            disabled
          />
        </div>

        {/* القسم */}
        <div className="mb-3">
          <label className="form-label">القسم:</label>
          <input
            type="text"
            name="department"
            className="form-control"
            value={evaluation.department || ""}
            disabled
          />
        </div>

        {/* التاريخ */}
        <div className="mb-3">
          <label className="form-label">تاريخ التقييم:</label>
          <input
            type="date"
            name="date"
            className="form-control"
            value={evaluation.date ? evaluation.date.split(" ")[0] : ""}
            onChange={handleChange}
          />
        </div>

        {/* الحقول الديناميكية */}
        {Object.keys(fieldLabels).map((key) => (
          <div className="mb-3" key={key}>
            <label className="form-label">{fieldLabels[key]}</label>
            <input
              type="number"
              name={key}
              className="form-control"
              value={evaluation[key] || 0}
              onChange={handleChange}
              min="0"
              max="10"
            />
          </div>
        ))}

        {/* التقييم العام */}
        <div className="mb-3">
          <label className="form-label">التقييم العام (من 100):</label>
          <input
            type="number"
            className="form-control"
            value={evaluation["overall-score"] || 0}
            disabled
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "جاري الحفظ..." : "حفظ التعديلات"}
        </button>
      </form>
    </div>
  );
};

export default EditEvaluation;
