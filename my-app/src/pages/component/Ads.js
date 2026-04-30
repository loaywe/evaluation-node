// AdsTable.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

const AdsTable = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.employee.employee); // تأكد أن الريدوكس يحتوي على username
  const navigate = useNavigate();

  // جلب البيانات عند تحميل الكمبوننت
  useEffect(() => {
    axios.get("http://localhost/dashboard/evaluation/selectads.php")
      .then(response => {
        setAds(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("خطأ في جلب البيانات:", error);
        setLoading(false);
      });
  }, []);

  // إضافة إعلان جديد محليًا فقط
  const handleAddAd = () => {
         navigate("/addads"); // الانتقال للصفحة الرئيسية بعد تسجيل الدخول

  
  };


  
const handleEdetAd = (idads) => {
    navigate(`/EdetAds?idad=${idads}`);

  
  };
  // حذف إعلان
  const handleDelete = async (idads, idEmployeeAd) => {
    // تحقق من أن المستخدم هو صاحب الإعلان (idemployee = 11)
  

    if (!window.confirm("هل أنت متأكد من حذف هذا الإعلان؟")) return;

    try {
      const response = await axios.delete("http://localhost/dashboard/evaluation/deletads.php", {
        data: { 
          idads,
          username: user.username
        }
      });

      if (response.data.success) {
        setAds(prevAds => prevAds.filter(ad => ad.idads !== idads));
        alert(response.data.message);
      } else {
        alert(response.data.error || response.data.message);
      }
    } catch (error) {
      console.error("خطأ في الحذف:", error.response || error.message);
      alert("حدث خطأ أثناء الحذف");
    }
  };

  if (loading) return <p className="text-center mt-5">جاري تحميل البيانات...</p>;

  return (
    <div className="container mt-5">
      <h2>إعلانات</h2>
      <button className="btn btn-primary mb-3" onClick={handleAddAd}>إضافة إعلان</button>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Description</th>
            <th>Image</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ads.map(   (ad, index) => (
            <tr key={index+1}>
              <td>{index+1}</td>
              <td>{ad.description}</td>
              <td>
                <img 
                  src={ad.img.startsWith("http") ? ad.img : `http://localhost/dashboard/evaluation/uploads/${ad.img}`} 
                  alt={ad.description} 
                  style={{ width: "80px", borderRadius: "5px" }} 
                />
              </td>
              <td>{ad.type}</td>
              <td>
                <button className="btn btn-success btn-sm me-2" onClick={() => handleEdetAd(ad.idads)}>Edet</button>
                <button 
                  className="btn btn-danger btn-sm" 
                  onClick={() => handleDelete(ad.idads, ad.idemployee)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdsTable;
