import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';
import { useSelector, useDispatch } from 'react-redux';

import EvaluationTable from './component/evaluatoinempluy.js';
import EvaluationTableManager from './Evaluationemaneger.js';
const Dashboard = () => {
  const [view, setView] = useState("evaluations"); // نبدأ بعرض التقييمات
  const user = useSelector((state) => state.employee.employee);
  const role = user.userType;
  return (
    <div className="dashboard-container rtl" dir="rtl">
      {/* شريط جانبي على اليمين */}
      <div className="sidebar p-3">
        <h3 className="text-white mb-4">لوحة التحكم</h3>

        <button 
          className={`btn mb-3 w-100 ${view === "evaluations" ? "btn-warning" : "btn-outline-warning"}`} 
          onClick={() => setView("evaluations")}
        >
          التقييمات
        </button>

    
      </div>

      {/* محتوى البيانات */}
      <div className="content p-4">
        {view === "evaluations" && (
          role === "manager" ? <EvaluationTableManager /> : <EvaluationTable />
        )}
       
      </div>
    </div>
  );



/*     <button 
          className={`btn mb-3 w-100 ${view === "results" ? "btn-danger" : "btn-outline-danger"}`} 
          onClick={() => setView("results")}
        >
          النتائج
        </button> 
        
 {view === "results" && (
          role === "manager" ? <ResultEvaluationTableManager /> : <ResultEvaluationsTable />
        )}
        
        
        */

};

export default Dashboard;
