// EmployeesTable.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

const EmployeesTable = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.employee.employee); // username من الريدوكس
  const navigate = useNavigate();

  useEffect(() => {
  axios.get("http://localhost/dashboard/evaluation/selsctemploye.php", {
  params: { username: user.username }
})
.then(response => {
  setEmployees(response.data);
  setLoading(false);
})
.catch(error => {
  console.error("خطأ في جلب بيانات الموظفين:", error);
  setLoading(false);
});

  }, []);

  const handleAddEmployee = () => {
    navigate("/addEmployee");
  };

  const handleEditEmployee = (idemloyee) => {
    navigate(`/editEmployee?idemloyee=${idemloyee}`);
  };

  const handleDelete = async (idemloyee) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الموظف؟")) return;

    try {
      const response = await axios.delete("http://localhost/dashboard/evaluation/deletemploye.php", {
        data: { 
          idemloyee,
          username: user.username
        }
      });

      if (response.data.success) {
        setEmployees(prev => prev.filter(emp => emp.idemloyee !== idemloyee));
        alert(response.data.message);
      } else {
        alert(response.data.error || response.data.message);
      }
    } catch (error) {
      console.error("خطأ في الحذف:", error.response || error.message);
      alert("حدث خطأ أثناء الحذف");
    }
  };

  if (loading) return <p className="text-center mt-5">جاري تحميل بيانات الموظفين...</p>;

  return (
    <div className="container mt-5">
      <h2>الموظفين</h2>
      <button className="btn btn-primary mb-3" onClick={handleAddEmployee}>إضافة موظف</button>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>الاسم</th>
            <th>العمر</th>
            <th>الجنس</th>
            <th>الموقع</th>
            <th>القسم</th>
            <th>Email</th>
            <th>الهاتف</th>
            <th>الصورة</th>
            <th>المدير</th>
            <th>العميات</th>
          </tr>
        </thead>
      <tbody>
  {employees.map((emp, index) => (
    <tr key={emp.index+1}>
      <td>{index + 1}</td> {/* الرقم التسلسلي */}
      <td>{emp.name}</td>
      <td>{emp.age}</td>
      <td>{emp.gender}</td>
      <td>{emp.location}</td>
      <td>{emp.department}</td>
      <td>{emp.email}</td>
      <td>{emp.phone}</td>
      <td>
        {emp.image && (
          <img 
            src={emp.image.startsWith("http") ? emp.image : `http://localhost/dashboard/evaluation/uploads/${emp.image}`} 
            alt={emp.name} 
            style={{ width: "80px", borderRadius: "5px" }} 
          />
        )}
      </td>
      <td>{emp.manager_name}</td>
      <td>
        <button className="btn btn-success btn-sm me-2" onClick={() => handleEditEmployee(emp.idemloyee)}>Edit</button>
        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(emp.idemloyee)}>Delete</button>
      </td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
};

export default EmployeesTable;
