import React from 'react';

const Contact = () => {
  const styles = {
    container: {
      maxWidth: '600px',
      margin: '40px auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center'
    },
    title: {
      color: '#333',
      fontSize: '24px',
      marginBottom: '30px'
    },
    contactItem: {
      margin: '20px 0',
      padding: '15px',
      backgroundColor: '#f5f5f5',
      borderRadius: '5px'
    },
    label: {
      fontWeight: 'bold',
      display: 'block',
      marginBottom: '5px',
      color: '#555'
    },
    info: {
      color: '#222',
      fontSize: '18px'
    },
    link: {
      color: '#1a73e8',
      textDecoration: 'none'
    }
  };

  return (
    <div dir='rtl'  style={styles.container}>
      <h1 style={styles.title}>معلومات التواصل</h1>
      
      <div style={styles.contactItem}>
        <span style={styles.label}>الهاتف:</span>
        <p style={styles.info}>+966 12 345 6789</p>
        <a href="tel:+966123456789" style={styles.link}>اتصل الآن</a>
      </div>
      
      <div style={styles.contactItem}>
        <span style={styles.label}>البريد الإلكتروني:</span>
        <p style={styles.info}>info@souqkom.com</p>
        <a href="mailto:info@souqkom.com" style={styles.link}>أرسل رسالة</a>
      </div>
      
      <div style={styles.contactItem}>
        <span style={styles.label}>ساعات العمل:</span>
        <p style={styles.info}>الأحد - الخميس: 8 صباحًا - 5 مساءً</p>
      </div>
    </div>
  );
};

export default Contact;