import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddSelfEvaluation = ({ employeeId }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [period, setPeriod] = useState(new Date().getFullYear());
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // جلب الأسئلة عند تحميل المكون
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token"); // ← جلب التوكن مباشرة
        if (!token) throw new Error("لم يتم تسجيل الدخول");

        const response = await axios.get(
          "http://localhost:3700/evaluation/questions",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setQuestions(response.data.questions);
        setAnswers(Array(response.data.questions.length).fill("")); // تهيئة الإجابات
      } catch (err) {
        console.error(err);
        setError("حدث خطأ أثناء جلب الأسئلة");
      }
    };

    fetchQuestions();
  }, []);

  const handleChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("التوكن غير موجود، الرجاء تسجيل الدخول");
      return;
    }

    if (answers.length !== questions.length) {
      setError("يجب الإجابة على جميع الأسئلة");
      return;
    }

    const formattedAnswers = answers.map((score, idx) => ({
      question: questions[idx]._id,
      score: Number(score),
    }));

    try {
      const response = await axios.post(
        "http://localhost:3700/evaluation/self",
        { employeeId, answers: formattedAnswers, period },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(response.data.message);
      setError("");
      navigate("/evaluation"); // العودة إلى لوحة التقييمات
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "حدث خطأ أثناء إضافة التقييم");
      setMessage("");
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h2>تقييم ذاتي للموظف</h2>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        {questions.map((q, idx) => (
          <div key={q._id} style={{ marginBottom: "12px" }}>
            <label>
              {q.text} (0-10):{" "}
              <input
                type="number"
                min="0"
                max="10"
                value={answers[idx]}
                onChange={(e) => handleChange(idx, e.target.value)}
                required
                style={{ marginLeft: "8px", width: "60px" }}
              />
            </label>
          </div>
        ))}

        <div style={{ marginBottom: "12px" }}>
          <label>
            الفترة:{" "}
             <label> {period}  </label>
                      

          </label>
        </div>

        <button
          type="submit"
          style={{ padding: "8px 16px", borderRadius: "4px", cursor: "pointer" }}
        >
          إرسال التقييم
        </button>
      </form>
    </div>
  );
};

export default AddSelfEvaluation;
