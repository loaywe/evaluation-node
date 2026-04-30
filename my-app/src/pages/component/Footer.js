import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>معلومات التواصل</h3>
          <div className="contact-info">
            <div className="info-item">
              <h4>الهاتف:</h4>
              <p>+966 12 345 6789</p>
             
            </div>
            
            <div className="info-item">
              <h4>البريد الإلكتروني:</h4>
              <p>loau.lhrouf@gmail.com</p>
          
            </div>
            
            <div className="info-item">
              <h4>ساعات العمل:</h4>
              <p>الأحد - الخميس: 8 صباحًا - 5 مساءً</p>
            
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} سوقكم. جميع الحقوق محفوظة</p>
      </div>
    </footer>
  );
};

export default Footer; 