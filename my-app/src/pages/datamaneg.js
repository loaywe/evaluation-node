import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';
import AdsTable  from'./component/Ads.js';
import EmployeesTable  from'./component/employe.js';

import EvaluationTable  from'./component/evaluatoin.js';

import ResultEvaluationsTable  from'./component/resultevaluatoin.js';

const employees = [
  { id: 1, name: "أحمد", position: "مدير" },
  { id: 2, name: "سارة", position: "مهندسة" },
];

const ads = [
  { id: 1, title: "إعلان 1", description: "وصف الإعلان 1" },
  { id: 2, title: "إعلان 2", description: "وصف الإعلان 2" },
];

const evaluations = [
  { id: 1, employee: "أحمد", score: 85 },
  { id: 2, employee: "سارة", score: 92 },
];

const results = [
  { id: 1, employee: "أحمد", score: 85 },
  { id: 2, employee: "سارة", score: 92 },
];

const DataList = ({ data, type }) => {
  return (
    <div className="data-list" dir="rtl">
      {data.length === 0 && <p>لا توجد بيانات</p>}
         {type === "employees" && <EmployeesTable />}

     {type === "ads" && <AdsTable />}


           {type === "evaluations" && <EvaluationTable />}
           {type === "results" && <ResultEvaluationsTable />}

    
    </div>
  );
};

const Dashboard = () => {
  const [view, setView] = useState("employees");

  let dataToShow;
  if (view === "employees") dataToShow = employees;
  if (view === "ads") dataToShow = ads;
  if (view === "evaluations") dataToShow = evaluations;
  
  if (view === "results") dataToShow = results;

  return (
    <div className="dashboard-container rtl"  dir="rtl">
      {/* شريط جانبي على اليمين */}
      <div className="sidebar p-3">
        <h3 className="text-white mb-4">لوحة التحكم</h3>
        <button className={`btn mb-3 w-100 ${view === "employees" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setView("employees")}>الموظفين</button>
        <button className={`btn mb-3 w-100 ${view === "ads" ? "btn-success" : "btn-outline-success"}`} onClick={() => setView("ads")}>الإعلانات</button>
        <button className={`btn mb-3 w-100 ${view === "evaluations" ? "btn-warning" : "btn-outline-warning"}`} onClick={() => setView("evaluations")}>التقييمات</button>
          <button 
    className={`btn mb-3 w-100 ${view === "results" ? "btn-danger" : "btn-outline-danger"}`} 
    onClick={() => setView("results")}
  >
    النتائج
  </button>
      </div>

      {/* محتوى البيانات */}
      <div className="content p-4">
        <DataList data={dataToShow} type={view} />

      </div>
    </div>
  );
};

export default Dashboard;
