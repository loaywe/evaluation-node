import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function About() {
  const navigate = useNavigate();

  // جلب بيانات المستخدم من ال Redux
  const user = useSelector((state) => state.employee.employee);

  // أنماط CSS
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: "'Tajawal', sans-serif"
    },
    hero: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      backgroundImage: `url('EIN-lessons-supporting-fertility-transitions-high-fertility-1600x850.avif')`,
      backgroundPosition: 'center',
      textAlign: 'center',
      padding: '100px 20px',
      borderRadius: '10px',
      marginBottom: '40px',
      backgroundSize: 'cover'
    },
    title: {
      fontSize: '2.5rem',
      marginBottom: '15px'
    },
    subtitle: {
      fontSize: '1.3rem',
      opacity: '0.9'
    },
    section: {
      marginBottom: '50px',
      padding: '20px',
      background: '#f9f9f9',
      borderRadius: '8px'
    },
    sectionTitle: {
      color: '#2c3e50',
      borderBottom: '2px solid #eee',
      paddingBottom: '10px',
      marginBottom: '20px'
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginTop: '30px'
    },
    featureCard: {
      background: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
    },
    featureTitle: {
      color: '#3498db'
    },
    stepsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginTop: '30px'
    },
    step: {
      flexBasis: '18%',
      textAlign: 'center',
      marginBottom: '20px'
    },
    stepNumber: {
      display: 'inline-block',
      width: '40px',
      height: '40px',
      background: '#3498db',
      color: 'white',
      borderRadius: '50%',
      lineHeight: '40px',
      fontWeight: 'bold',
      marginBottom: '10px'
    },
    ctaSection: {
      textAlign: 'center',
      padding: '40px',
      background: '#2c3e50',
      color: 'white',
      borderRadius: '10px',
      marginTop: '50px'
    },
    ctaButton: {
      background: '#e74c3c',
      color: 'white',
      border: 'none',
      padding: '12px 30px',
      fontSize: '1.1rem',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      marginTop: '20px'
    },
    ctaButtonHover: {
      background: '#c0392b'
    }
  };

  const poutonclik = () => {
    navigate("/Signup");
  };

  return (
    <div dir='rtl' style={styles.container}>
      <div style={styles.hero}>
        <p style={styles.subtitle}>
          <h1 style={styles.title}>المقيم - منصة تساهم في شفافية التقييم</h1>
          <br />
          حيث تلتقي الفرص بالثقة
        </p>
      </div>

      <div>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>مرحبًا بكم في المقيم</h2>
        <p>
  منصة رائدة في مجال تقييم أداء الموظفين، نقدم لكم مساحة آمنة وموثوقة لقياس أداء فرقكم ومتابعة
  تطورهم المهني بشكل دقيق. سواء كنت موظفًا ترغب في معرفة تقييمك الذاتي، أو مديرًا تبحث عن
  تقييم فريقك بموضوعية، فإن منصتنا تمنحك البيانات والتقارير التي تساعدك على تحسين الأداء
  واتخاذ القرارات الصحيحة.
</p>

        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>لماذا تختار المقيم</h2>
          <div style={styles.featuresGrid}>
            <div style={styles.featureCard}>
              <h3 style={styles.featureTitle}>⚡  شفافية التقيم</h3>
              <p>تجربة تقيم للموظفين الداخلي والخارجي</p>
            </div>
            <div style={styles.featureCard}>
              <h3 style={styles.featureTitle}>🛡️ أمان التقييمات</h3>
              <p>  عدم السماح بالتلاعب في التقيم  </p>
            </div>
            <div style={styles.featureCard}>
              <h3 style={styles.featureTitle}>📱 واجهة سهلة</h3>
              <p>تصميم بديهي وسهل الاستخدام لجميع الفئات العمرية</p>
            </div>
          
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>كيف يعمل الموقع؟</h2>
          <div style={styles.stepsContainer}>
            <div style={styles.step}>
              <span style={styles.stepNumber}>1</span>
              <p>قم بالتسجيل في المنصة (موظف أو مدير)</p>
            </div>
          
            <div style={styles.step}>
              <span style={styles.stepNumber}>3</span>
              <p>شارك في التقيم </p>
            </div>
            <div style={styles.step}>
              <span style={styles.stepNumber}>4</span>
              <p>أكمل عملية التقيم الشفاف</p>
            </div>
            <div style={styles.step}>
              <span style={styles.stepNumber}>5</span>
              <p>اطلع على تقييمك    </p>
            </div>
          </div>
        </section>

        {/* زر التسجيل يظهر فقط إذا المستخدم غير مسجل أو userType === "visitor" */}
        {( !user || user.userType === "visitor") && (
          <section style={styles.ctaSection}>
            <h2>جاهز للانضمام إلينا؟</h2>
            <p>سجل حسابك الآن وابدأ رحلة التقيم </p>
            <button
              style={styles.ctaButton}
              onMouseOver={(e) => e.target.style.background = styles.ctaButtonHover.background}
              onMouseOut={(e) => e.target.style.background = styles.ctaButton.background}
              onClick={poutonclik}
            >
              تسجيل جديد
            </button>
          </section>
        )}
      </div>
    </div>
  );
}

export default About;
