// EvaluationsTable.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from 'react-redux';

const ResultEvaluationsTable = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState("final"); // final, internal, external
  const user = useSelector(state => state.employee.employee);

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost/dashboard/evaluation/resultevaluation.php", {
      params: { username: user.username }
    })
    .then(response => {
      if (response.data.success) {
        setEvaluations(response.data.employees);
      }
      setLoading(false);
    })
    .catch(error => {
      console.error("خطأ في جلب التقييمات:", error);
      setLoading(false);
    });
  }, [user.username]);

  if (loading) return <p className="text-center mt-5">جاري تحميل التقييمات...</p>;

  return (
    <div className="container mt-5">
      <h2>التقييمات</h2>

      {/* أزرار التبديل بين أنواع التقييم */}
      <div className="mb-3">
        <button
          className={`btn me-2 ${viewType === "internal" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setViewType("internal")}
        >
          التقييم الداخلي
        </button>
        <button
          className={`btn me-2 ${viewType === "external" ? "btn-success" : "btn-outline-success"}`}
          onClick={() => setViewType("external")}
        >
          التقييم الخارجي
        </button>
        <button
          className={`btn ${viewType === "final" ? "btn-danger" : "btn-outline-danger"}`}
          onClick={() => setViewType("final")}
        >
          التقييم النهائي
        </button>
      </div>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>الاسم</th>
            <th>التاريخ</th>
            <th>{viewType === "internal" ? "التقييم الداخلي" : viewType === "external" ? "التقييم الخارجي" : "التقييم النهائي"}</th>
            <th>التطور</th>
          </tr>
        </thead>
        <tbody>
          {evaluations.map((emp, index) => (
            <tr key={index + 1}>
              <td>{index + 1}</td>
              <td>{emp.name}</td>
              <td>{emp.date}</td>
              <td>
                {viewType === "internal" && emp.internal_score}
                {viewType === "external" && emp.external_score}
                {viewType === "final" && emp.final_score}
              </td>
              <td>{emp.evolution}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultEvaluationsTable;
