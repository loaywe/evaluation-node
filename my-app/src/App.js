import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Navbar from './pages/component/Navbar';
import axios from 'axios';
 
// مصفوفة ثابتة للإعلانات الثابتة a1–a10 مع نصوص حول التقييم
const defaultAdsStatic = [
  { img: "/a1.jpg", description: "تحسين مستواك في التقييم الشهري!" },
  { img: "/a3.jpg", description: "شارك في التقييم للحصول على التقدير" },
  { img: "/a5.jpg", description: "تقييمك يساهم في تطوير الفريق" },
  { img: "/a7.jpg", description: "تقديم أفضل ما لديك يُكافأ دائمًا" },
  { img: "/a9.jpg", description: "تحفيز الموظفين المتميزين" },
  { img: "/a10.jpg", description: "التقييم يساعد على النمو المهني" },
];

// مصفوفة افتراضية للإعلانات المتحركة b1–b10
const defaultAdsBanner = [
  
  { img: "/b4.jpg", description: "تقييمات الموظفين في إرتفاع مستمر" },
  { img: "/b5.jpg", description: "شارك في تحسين فريقك" },
  { img: "/b6.jpg", description: "أداء استثنائي يستحق التقدير" },
  { img: "/b7.jpg", description: "تقييمات الشهر أُعلنت الآن" },
  { img: "/b8.jpg", description: "تابع نتائج أفضل 5 موظفين" },
  { img: "/b9.jpg", description: "حفز نفسك لتحقيق الأفضل" },
  { img: "/b10.jpg", description: "شاركنا تقييمك للحصول على الجوائز" },
];

// مصفوفة افتراضية لأفضل الموظفين
const defaultBestEmployees = [
  { employee_id: 1, employee_name: "محمد علي", employee_image: "emp1.jpg", avg_score: 95 },
  { employee_id: 2, employee_name: "سارة أحمد", employee_image: "emp2.jpg", avg_score: 90 },
  { employee_id: 3, employee_name: "خالد سمير", employee_image: "emp3.jpg", avg_score: 88 },
  { employee_id: 4, employee_name: "ليلى حسن", employee_image: "emp4.jpg", avg_score: 85 },
  { employee_id: 5, employee_name: "يوسف محمود", employee_image: "emp5.jpg", avg_score: 83 },
];

function App() {
  const [data, setData] = useState({
    adsBanner: defaultAdsBanner,
    adsStatic: defaultAdsStatic.slice(0, 3), // 3 إعلانات ثابتة فقط
    bestEmployees: defaultBestEmployees
  });
const [bestEmployees, setBestEmployees] = useState([defaultBestEmployees]);
  // تفعيل tooltip
  useEffect(() => {
    const bootstrap = require('bootstrap/dist/js/bootstrap.bundle.min.js');
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(el => new bootstrap.Tooltip(el));
    axios.get('http://localhost:3700/evaluation/apphome').then(response => {
      setBestEmployees(response.data.bestEmployees);
      console.log('Fetched data:', response.data);
    }).catch(error => {
      console.error('Error fetching data:', error);
    });
  }, []);

  return (
    <div className="App">
      <div className="container mt-4">

        {/* الإعلانات المتحركة */}
        <section className="mb-5">
          <div id="adsCarousel" className="carousel slide mb-4" data-bs-ride="carousel" data-bs-interval="4000">
            <div className="carousel-inner">
              {data.adsBanner.map((ad, index) => (
                <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                  <img
                    src={ad.img}
                    className="d-block w-100 rounded-4 shadow"
                    alt="إعلان متحرك"
                    style={{ objectFit: "cover", height: "350px" }}
                  />
                  <div className="carousel-caption d-flex justify-content-center align-items-center" style={{ top: 0, bottom: 0 }}>
                    <p className="text-white text-center fw-bold"
                       style={{ fontSize: "1.5rem", textShadow: "2px 2px 4px rgba(0,0,0,0.6)", background: "transparent" }}>
                      {ad.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#adsCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">السابق</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#adsCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">التالي</span>
            </button>
          </div>

          {/* الإعلانات الثابتة */}
          <div className="row">
            {data.adsStatic.map((ad, index) => (
              <div key={index} className="col-md-4 mb-3">
                <div className="card shadow-sm h-100">
                  <img
                    src={ad.img}
                    className="card-img-top"
                    alt="إعلان ثابت"
                    style={{ objectFit: "cover", height: "200px" }}
                  />
                  <div className="card-body text-center">
                    <p className="card-text">{ad.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* أفضل موظف */}
        <section className="mb-5">
          <h3 className="text-center mb-4">🏆 أفضل موظف</h3>
          <div className="card mx-auto shadow-lg" style={{ maxWidth: '400px' }}>
            <img
              src={ bestEmployees[0].employee_image}
              className="card-img-top"
              alt={bestEmployees[0].employee_name}
              style={{ objectFit: 'cover', height: '300px' }}
            />
            <div className="card-body text-center">
              <h5 className="card-title">{bestEmployees[0].employee_name}</h5>
              <p className="card-text">
                <span className="badge bg-success">التقييم: {bestEmployees[0].avg_score}</span>
              </p>
            </div>
          </div>
        </section>

        {/* أفضل 5 موظفين */}
        <section>
          <h3 className="text-center mb-4">🌟 أفضل 5 موظفين</h3>
          <div className="table-responsive">
            <table className="table table-striped table-hover text-center align-middle">
              <thead className="table-dark">
                <tr>
                  <th>الصورة</th>
                  <th>الاسم</th>
                  <th>التقييم</th>
                </tr>
              </thead>
              <tbody>
           {Array.isArray(bestEmployees) && bestEmployees.slice(0, 5).map((emp, index) => (
  <tr key={index}>
    <td>
      <img
        src={emp.employee_image}
        alt="الموظف"
        width="50"
        height="50"
        className="rounded-circle"
        data-bs-toggle="tooltip"
        title={`الموظف: ${emp.employee_name}\nالتقييم: ${emp.avg_score}`}
        style={{ objectFit: 'cover' }}
      />
    </td>
    <td>{emp.employee_name}</td>
    <td><span className="badge bg-success">{emp.avg_score}</span></td>
  </tr>
))}

              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
