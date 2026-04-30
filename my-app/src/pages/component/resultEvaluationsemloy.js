import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector } from "react-redux";

const ResultEvaluationsTable = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState("final"); // final, internal, external
  const user = useSelector((state) => state.employee.employee);

  useEffect(() => {
    if (!user?._id) return;
    fetchEvaluations();
  }, [user?._id]);

  const fetchEvaluations = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3700/evaluation/my-evaluations", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      let data = res.data.evaluations || [];
      // ترتيب التقييمات حسب التاريخ
      data = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
console.log(data);
      // احسب التطور لكل تقييم
      const withTrend = data.map((ev, i) => {
        const getScore = (type) => {
          if (type === "internal") return ev.selfEvaluation?.finalScore || 0;
          if (type === "external") return ev.managerEvaluation?.finalScore || 0;
          return ((ev.selfEvaluation?.finalScore || 0) + (ev.managerEvaluation?.finalScore || 0)) / 2;
        };
        const score = getScore(viewType);
        const prevScore = i > 0 ? getScore(viewType, data[i - 1]) : null;
        let trend = "-";
        if (prevScore !== null) {
          trend = score > prevScore ? "↑" : score < prevScore ? "↓" : "→";
        }
        return { ...ev, trend };
      });

      setEvaluations(withTrend);
    } catch (err) {
      console.error("خطأ في جلب التقييمات:", err);
      setEvaluations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewChange = (type) => {
    setViewType(type);
    // إعادة حساب التطور عند تغيير نوع التقييم
    setEvaluations((prev) =>
      prev.map((ev, i) => {
        const getScore = (type) => {
          if (type === "internal") return ev.selfEvaluation?.finalScore || 0;
          if (type === "external") return ev.managerEvaluation?.finalScore || 0;
          return ((ev.selfEvaluation?.finalScore || 0) + (ev.managerEvaluation?.finalScore || 0)) / 2;
        };
        const score = getScore(type);
        const prevScore = i > 0 ? getScore(type, prev[i - 1]) : null;
        let trend = "-";
        if (prevScore !== null) {
          trend = score > prevScore ? "↑" : score < prevScore ? "↓" : "→";
        }
        return { ...ev, trend };
      })
    );
  };

  if (loading) return <p className="text-center mt-5">جاري تحميل التقييمات...</p>;
  if (!evaluations.length) return <p className="text-center mt-5">لا توجد بيانات للتقييمات</p>;

  return (
    <div className="container mt-5">
      <h2>تطور تقييم الموظف</h2>

      <div className="mb-3">
        <button
          className={`btn me-2 ${viewType === "internal" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => handleViewChange("internal")}
        >
          التقييم الداخلي
        </button>
        <button
          className={`btn me-2 ${viewType === "external" ? "btn-success" : "btn-outline-success"}`}
          onClick={() => handleViewChange("external")}
        >
          التقييم الخارجي
        </button>
        <button
          className={`btn ${viewType === "final" ? "btn-danger" : "btn-outline-danger"}`}
          onClick={() => handleViewChange("final")}
        >
          التقييم النهائي
        </button>
      </div>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>التاريخ</th>
            <th>
              {viewType === "internal"
                ? "التقييم الداخلي"
                : viewType === "external"
                ? "التقييم الخارجي"
                : "التقييم النهائي"}
            </th>
            <th>التطور</th>
          </tr>
        </thead>
        <tbody>
          {evaluations.map((ev, index) => {
            const score =
              viewType === "internal"
                ? ev.selfEvaluation?.finalScore || 0
                : viewType === "external"
                ? ev.managerEvaluation?.finalScore || 0
                : ((ev.selfEvaluation?.finalScore || 0) + (ev.managerEvaluation?.finalScore || 0)) / 2;

            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{new Date(ev.createdAt).toLocaleDateString()}</td>
                <td>{score}</td>
                <td>{ev.trend}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ResultEvaluationsTable;
