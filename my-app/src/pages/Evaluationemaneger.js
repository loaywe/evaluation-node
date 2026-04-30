import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const EvaluationTableManagerSingle = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [filteredEvaluations, setFilteredEvaluations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3700/evaluation/department", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvaluations(res.data.evaluations);
        setFilteredEvaluations(res.data.evaluations); // نسخ البيانات للفلترة
      } catch (err) {
        console.error("Error fetching evaluations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, []);

  // فلترة التقييمات حسب البحث
  useEffect(() => {
    if (!searchTerm) {
      setFilteredEvaluations(evaluations);
      setCurrentIndex(0);
    } else {
      const filtered = evaluations.filter(e =>
        e.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEvaluations(filtered);
      setCurrentIndex(0);
    }
  }, [searchTerm, evaluations]);

  if (loading) return <p>جارٍ تحميل التقييمات...</p>;
  if (evaluations.length === 0) return <p>لا توجد تقييمات بعد</p>;

  // إذا لم توجد نتائج للبحث، نعرض رسالة لكنها لا تختفي
  const currentEval = filteredEvaluations[currentIndex] || {};

  const selfScore = currentEval.selfScore ?? 0;
  const managerScore = currentEval.managerScore ?? 0;
  const finalScore = ((selfScore + managerScore) / (managerScore ? 2 : 1)).toFixed(2);

  const handleNext = () => {
    if (currentIndex < filteredEvaluations.length - 1) setCurrentIndex(currentIndex + 1);
  };
  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const canAddEvaluation = currentEval.selfScore !== null && currentEval.managerScore === null;

  const handleAddEvaluation = (evaluationId) => {
    navigate(`/addEvaluationemaneger/${evaluationId}`);
  };

  return (
    <div className="card p-4 mb-3 shadow-sm">
      {/* حقل البحث */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="ابحث باسم الموظف..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* إذا لم توجد نتائج */}
      {filteredEvaluations.length === 0 ? (
        <p className="text-danger">لا توجد نتائج مطابقة للبحث</p>
      ) : (
        <>
          <h4 className="mb-2">الموظف: {currentEval.employeeName}</h4>
          <p><strong>الفترة:</strong> {currentEval.period}</p>
          {currentEval.evaluationId && <p><strong>معرف التقييم:</strong> {currentEval.evaluationId}</p>}

          <div className="mt-3">
            <h5>التقييم الذاتي</h5>
            <table className="table table-bordered table-striped">
              <thead className="table-light">
                <tr>
                  <th>السؤال</th>
                  <th>الدرجة</th>
                </tr>
              </thead>
              <tbody>
                {currentEval.selfAnswers?.length > 0
                  ? currentEval.selfAnswers.map((a, i) => (
                      <tr key={i}>
                        <td>{a.questionText}</td>
                        <td>{a.score}</td>
                      </tr>
                    ))
                  : <tr><td colSpan="2">لا توجد إجابات</td></tr>
                }
              </tbody>
            </table>
          </div>

          <div className="mt-3">
            <h5>تقييم المدير</h5>
            <table className="table table-bordered table-striped">
              <thead className="table-light">
                <tr>
                  <th>السؤال</th>
                  <th>الدرجة</th>
                </tr>
              </thead>
              <tbody>
                {currentEval.managerAnswers?.length > 0
                  ? currentEval.managerAnswers.map((a, i) => (
                      <tr key={i}>
                        <td>{a.questionText}</td>
                        <td>{a.score}</td>
                      </tr>
                    ))
                  : <tr><td colSpan="2">لم يتم التقييم بعد</td></tr>
                }
              </tbody>
            </table>
          </div>

          <div className="mt-3">
            <p><strong>الدرجة الذاتية:</strong> {selfScore}</p>
            <p><strong>درجة المدير:</strong> {managerScore || '-'}</p>
            <p><strong>المجموع النهائي:</strong> {finalScore}</p>
          </div>

          <div className="d-flex gap-2 mt-3">
            {canAddEvaluation && (
              <button className="btn btn-success" onClick={() => handleAddEvaluation(currentEval.evaluationId)}>
                إضافة تقييم
              </button>
            )}
            <button className="btn btn-secondary" onClick={handlePrev} disabled={currentIndex === 0}>
              السابق
            </button>
            <button className="btn btn-primary" onClick={handleNext} disabled={currentIndex === filteredEvaluations.length - 1}>
              التالي
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EvaluationTableManagerSingle;
