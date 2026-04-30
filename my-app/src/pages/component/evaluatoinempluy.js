import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const EvaluationTable = () => {
  const user = useSelector(state => state.employee.employee);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [evaluations, setEvaluations] = useState([]);
  const [filteredEvaluations, setFilteredEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!token) return;
    fetchEvaluations();
  }, [token]);

  const fetchEvaluations = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`http://localhost:3700/evaluation/my-evaluations`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = response.data.evaluations || [];
      setEvaluations(data);
      setFilteredEvaluations(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "حدث خطأ أثناء جلب التقييمات");
    } finally {
      setLoading(false);
    }
  };

  // فلترة التقييمات حسب الفترة
  useEffect(() => {
    if (!searchTerm) {
      setFilteredEvaluations(evaluations);
      setCurrentIndex(0);
    } else {
      const filtered = evaluations.filter(ev =>
        ev.period?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEvaluations(filtered);
      setCurrentIndex(0);
    }
  }, [searchTerm, evaluations]);

  const handleAddEvaluation = () => {
    navigate("/addEvaluationemploy");
  };

  const calculateTotal = (evaluation) => {
    const selfScore = evaluation?.selfEvaluation?.finalScore || 0;
    const managerScore = evaluation?.managerEvaluation?.finalScore || 0;
    return Math.round((selfScore + managerScore) / (managerScore ? 2 : 1));
  };

  const handlePrev = () => setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));
  const handleNext = () => setCurrentIndex(prev => (prev < filteredEvaluations.length - 1 ? prev + 1 : prev));

  if (loading) return <p className="text-center mt-5">جاري تحميل التقييمات...</p>;
  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;

  const ev = filteredEvaluations[currentIndex] || {};

  return (
    <div className="container mt-5">
      <h2 className="mb-4">تقييمات الموظف</h2>

      {/* حقل البحث حسب الفترة */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="ابحث حسب الفترة..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {filteredEvaluations.length === 0 && searchTerm && (
          <small className="text-danger">لا توجد نتائج مطابقة للبحث</small>
        )}
      </div>

      {/* زر إضافة تقييم يظهر دائمًا */}
      <button className="btn btn-success mb-3" onClick={handleAddEvaluation}>
        إضافة تقييم
      </button>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>الفترة</th>
            <th>التقييم الذاتي</th>
            <th>تقييم المدير</th>
            <th>المجموع الكلي</th>
          </tr>
        </thead>
        <tbody>
          {filteredEvaluations.length > 0 ? (
            <tr>
              <td>{currentIndex + 1}</td>
              <td>{ev.period || "-"}</td>
              <td>
                {ev.selfEvaluation?.answers?.length > 0
                  ? ev.selfEvaluation.answers.map(a => (
                      <div key={a._id}>{a.question?.text || a.questionText}: {a.score}/10</div>
                    ))
                  : "لا توجد إجابات"}
                <br />
                <strong>مجموع التقييم الذاتي: {ev.selfEvaluation?.finalScore || 0}</strong>
              </td>
              <td>
                {ev.managerEvaluation?.answers?.length > 0
                  ? ev.managerEvaluation.answers.map(a => (
                      <div key={a._id}>{a.question?.text || a.questionText}: {a.score}/10</div>
                    ))
                  : "لم يتم التقييم بعد"}
                <br />
                <strong>مجموع تقييم المدير: {ev.managerEvaluation?.finalScore || 0}</strong>
              </td>
              <td>
                <strong>{calculateTotal(ev)}</strong>
              </td>
            </tr>
          ) : (
            <tr>
              <td colSpan="5" className="text-center">لا توجد نتائج مطابقة للبحث</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* أزرار التصفح */}
      <div className="d-flex justify-content-between mt-3">
        <button 
          className="btn btn-primary" 
          onClick={handlePrev} 
          disabled={currentIndex === 0 || filteredEvaluations.length === 0}
        >
          السابق
        </button>
        <button 
          className="btn btn-primary" 
          onClick={handleNext} 
          disabled={currentIndex === filteredEvaluations.length - 1 || filteredEvaluations.length === 0}
        >
          التالي
        </button>
      </div>

      <p className="mt-2 text-center">
        {filteredEvaluations.length > 0 
          ? `تقييم ${currentIndex + 1} من ${filteredEvaluations.length}` 
          : "لا توجد تقييمات حتى الآن"}
      </p>
    </div>
  );
};

export default EvaluationTable;
