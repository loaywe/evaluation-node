import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const AddEvaluationManager = () => {
  const { id } = useParams(); // id من الرابط
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [employeeEval, setEmployeeEval] = useState(null);
  const [scores, setScores] = useState({});

  // 1️⃣ جلب التقييم المحدد (الموظف + التقييم الذاتي)
  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3700/evaluation/evaluation/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const evaluation = res.data.employeeEvaluation;
        setEmployeeEval(evaluation);

        // إعداد الدرجات الافتراضية من الأسئلة الموجودة ضمن selfEvaluation
        const defaults = {};
        evaluation.selfEvaluation.answers.forEach(a => {
          defaults[a.question._id] = a.score || 0;
        });
        setScores(defaults);

      } catch (err) {
        console.error("Error fetching evaluation:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluation();
  }, [id, token]);

  if (loading) return <p className="text-center mt-5">جاري التحميل...</p>;
  if (!employeeEval) return <p className="text-center mt-5">التقييم غير موجود</p>;

  // تغيير الدرجة
  const handleChange = (qid, value) => {
    let v = parseInt(value) || 0;
    if (v > 10) v = 10;

    setScores(prev => ({ ...prev, [qid]: v }));
  };

  // حفظ تقييم المدير
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const answers = employeeEval.selfEvaluation.answers.map(a => ({
        question: a.question._id,
        score: scores[a.question._id] || 0
      }));

      await axios.post(
        "http://localhost:3700/evaluation/add-evaluation",
        {
          employeeEvaluationId: id,
          answers
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("تم حفظ تقييم المدير بنجاح ✅");

    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء حفظ التقييم");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow">

        <h4>الموظف: {employeeEval.employee.fullName}</h4>
        <p>البريد: {employeeEval.employee.email}</p>

        <hr />

        <h5>التقييم الذاتي</h5>
        {employeeEval.selfEvaluation.answers.map((a, i) => (
          <p key={i}>
            <strong>{a.question.text}</strong> : {a.score}/10
          </p>
        ))}

        <hr />

        <h5>تقييم المدير</h5>
        <form onSubmit={handleSubmit}>
          {employeeEval.selfEvaluation.answers.map(a => (
            <div className="mb-3" key={a.question._id}>
              <label className="form-label">{a.question.text}</label>
              <input
                type="number"
                className="form-control"
                min="0"
                max="10"
                value={scores[a.question._id]}
                onChange={(e) => handleChange(a.question._id, e.target.value)}
                required
              />
            </div>
          ))}

          <button className="btn btn-success">حفظ التقييم</button>
        </form>

      </div>
    </div>
  );
};

export default AddEvaluationManager;
