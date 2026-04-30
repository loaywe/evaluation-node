import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

const EvaluationTable = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('داخلي');
  const [editEval, setEditEval] = useState(null); // التقييم الذي يتم تعديله
  const user = useSelector((state) => state.employee.employee);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvaluations(type);
  }, [type]);

  const fetchEvaluations = (evalType) => {
    setLoading(true);
    axios.get("http://localhost/dashboard/evaluation/evaluationinpt.php", {
      params: { 
        username: user.username,
        type: evalType
      }
    })
    .then(response => {
      setEvaluations(response.data.evaluations || []);
      setLoading(false);
    })
    .catch(error => {
      console.error("خطأ في جلب بيانات التقييمات:", error);
      setLoading(false);
    });
  };

  // ✅ حذف التقييم
  const handleDelete = (evaluationId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا التقييم؟")) return;

    axios.delete("http://localhost/dashboard/evaluation/deletevaluaiot.php", {
      data: { username: user.username, evaluation_id: evaluationId }
    })
    .then(() => {
      setEvaluations(evaluations.filter(ev => ev.evaluation_id !== evaluationId));
    })
    .catch(error => {
      console.error("خطأ في حذف التقييم:", error);
    });
  };
 const handleaddEvaluation = () => {
    navigate("/addEvaluation");
  };
  // ✅ فتح نافذة التعديل
  const handleEdit = (evaluationId) => {
        navigate(`/EdetEvaluation?evaluationId=${evaluationId}`);

  };

  // ✅ حفظ التعديل
  const handleSaveEdit = () => {
    axios.put("http://localhost/dashboard/evaluation/evaluationinpt.php", {
      username: user.username,
      evaluation: editEval
    })
    .then(() => {
      setEvaluations(evaluations.map(ev => ev.evaluation_id === editEval.evaluation_id ? editEval : ev));
      setEditEval(null);
    })
    .catch(error => {
      console.error("خطأ في تعديل التقييم:", error);
    });
  };

  if (loading) return <p className="text-center mt-5">جاري تحميل التقييمات...</p>;

  return (
    <div className="container mt-5">
      <h2>تقييمات الموظفين</h2>
      <button className="btn btn-primary mb-3" onClick={handleaddEvaluation}>إضافة تقييم</button>

      <div className="mb-3">
        <button className={`btn me-2 ${type==='داخلي' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setType('داخلي')}>تقييم داخلي</button>
        <button className={`btn ${type==='خارجي' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setType('خارجي')}>تقييم خارجي</button>
      </div>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>اسم الموظف</th>
            <th>القسم</th>
            <th>تاريخ التقييم</th>
            <th>الإنتاجية</th>
            <th>العمل الجماعي</th>
            <th>الانضباط</th>
            <th>المبادرة</th>
            <th>حل المشكلات</th>
            <th>التواصل</th>
            <th>الإبداع</th>
            <th>تحقيق الهدف</th>
            <th>إدارة الوقت</th>
            <th>المرونة</th>
            <th>التفاصيل</th>
            <th>المسؤولية</th>
            <th>المجموع الكلي</th>
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {evaluations.map((ev, index) => (
            <tr key={index+1}>
              <td>{index+1}</td>
              <td>{ev.name}</td>
              <td>{ev.department}</td>
              <td>{ev.date}</td>
              <td>{ev.productivity}</td>
              <td>{ev.teamwork}</td>
              <td>{ev.discipline}</td>
              <td>{ev.initiative}</td>
              <td>{ev['problem-solving']}</td>
              <td>{ev.communication}</td>
              <td>{ev.creativity}</td>
              <td>{ev['goal-achievement']}</td>
              <td>{ev['time-management']}</td>
              <td>{ev.adaptability}</td>
              <td>{ev.attention_to_detail}</td>
              <td>{ev.accountability}</td>
              <td>{ev['overall-score']}</td>


             <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(ev.evaluation_id)}>تعديل</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(ev.evaluation_id)} >حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ نافذة التعديل */}
      {editEval && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">تعديل التقييم</h5>
                <button type="button" className="btn-close" onClick={() => setEditEval(null)}></button>
              </div>
              <div className="modal-body">
                <label>الإنتاجية</label>
                <input type="number" className="form-control mb-2"
                  value={editEval.productivity}
                  onChange={e => setEditEval({...editEval, productivity: e.target.value})} />
                
                <label>العمل الجماعي</label>
                <input type="number" className="form-control mb-2"
                  value={editEval.teamwork}
                  onChange={e => setEditEval({...editEval, teamwork: e.target.value})} />

                {/* يمكنك تكرار الحقول لبقية التقييمات */}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditEval(null)}>إلغاء</button>
                <button className="btn btn-success" onClick={handleSaveEdit}>حفظ</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationTable;
