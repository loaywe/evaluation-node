import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearEmployee } from '../../radex/Employees';
import axios from 'axios';
import Ads from "./Ads";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const modalRef = useRef(null);
  const dropdownRef = useRef(null);
  const user = useSelector((state) => state.employee.employee);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
const imageUrl = user.imge 
  ? user.imge 
  : "/person.png";

  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const handleLogout = () => {
  // مسح بيانات المستخدم من Redux
  dispatch(clearEmployee());

  // مسح التوكن من localStorage
  localStorage.removeItem('token');
  // إغلاق قائمة الملف الشخصي
  setProfileDropdownOpen(false);

  // الانتقال إلى الصفحة الرئيسية
  navigate('/');
};

  const handleViewProfile = () => {
    // Close dropdown
    setProfileDropdownOpen(false);
    // Navigate to user account page
    navigate('/UserAccount');
  };


  let links = [];
if (user.userType === "visitor") {
  links = [
       

    { path: "/", label: "الرئيسية" },
                 { path: "/About", label: " المقيم " },

         { path: "/Contact", label: "تواصل معنا" },
     { path: "/Login", label: "تسجيل الدخول" },


  ];
} else {
  if (user.userType === "admin") {

   links = [
            { path: "/", label: "الرئيسية" },
    { path: "/About", label: " المقيم " },

    { path: "/Contact", label: "تواصل معنا" },
                { path: "/datamaneg", label: "إدارة البيانات"},


  ];
}
else{
  links = [

            { path: "/", label: "الرئيسية" },
    { path: "/About", label: " المقيم" },

    { path: "/Contact", label: "تواصل معنا" },

                { path: "/evaluation", label: "التقييم" },


  ];}

 }


  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <nav style={styles.navbar}>
        <div style={styles.navContainer}>
          {/* Profile and Hamburger Section */}
          <div style={styles.leftSection}>
            <div style={styles.profileContainer} ref={dropdownRef}>
              <button 
                className='profil'
                onClick={toggleProfileDropdown}
                style={styles.profileButton}
              >
                <img 
                  src={imageUrl} 
                  alt="الصورة الشخصية" 
                  style={styles.actionButton}
                />
              </button>
              {profileDropdownOpen && (
                <div style={styles.dropdownMenu}>
                  <button 
                    onClick={handleViewProfile}
                    style={styles.dropdownItem}
                  >
                    عرض الملف الشخصي
                  </button>
                  <button 
                    onClick={handleLogout}
                    style={styles.dropdownItem}
                  >
                    تسجيل الخروج
                  </button>
                </div>
              )}
            </div>

            <div style={styles.hamburger} onClick={toggleMobileMenu}>
              <div style={{...styles.hamburgerLine, ...(mobileMenuOpen ? styles.hamburgerLine1Active : {})}}></div>
              <div style={{...styles.hamburgerLine, ...(mobileMenuOpen ? styles.hamburgerLine2Active : {})}}></div>
              <div style={{...styles.hamburgerLine, ...(mobileMenuOpen ? styles.hamburgerLine3Active : {})}}></div>
            </div>
          </div>

          {/* Navigation Links Section */}
          <ul style={{
            ...styles.navList,
            ...(!mobileMenuOpen && styles.mobileNavHidden)
          }}>
            {links.map((link, index) => (
              <li key={index} style={styles.navItem}>
                <Link 
                  to={link.path} 
                  style={{
                    ...styles.navLink,
                    ...(location.pathname === link.path ? styles.activeNavLink : {})
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

     

     
    </>
  );
}

const styles = {
  
  navbar: {
    backgroundColor: '#2a2a72',
    backgroundImage: 'linear-gradient(315deg, #2a2a72 0%, #009ffd 74%)',
    padding: '0',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    position: 'relative',
    flexDirection: 'row-reverse', // RTL layout
    gap: '200px', // Reduced gap between sections
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    '@media (max-width: 768px)': {
      gap: '10px',
    }
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center center',
    width: '100%',
  },
  logo: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    padding: '15px 0',
  },
  navList: {
    display: 'flex',
    alignItems: 'center',
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    transition: 'all 0.3s ease',
    flexDirection: 'row-reverse', // RTL for navigation links
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      position: 'absolute',
      backgroundColor: '#2a2a72',
      top: '60px',
      left: 0,
      padding: '20px 0',
      boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
      zIndex: 1000,
    }
  },
  mobileNavHidden: {
    '@media (max-width: 768px)': {
      display: 'none',
    }
  },
  navItem: {
    margin: '0 6px',
    '@media (max-width: 768px)': {
      margin: '10px 0',
      width: '100%',
    }
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '1rem',
    padding: '6px 12px',
    transition: 'all 0.2s ease',
    display: 'block',
    textAlign: 'center',
    minWidth: '100px',
    borderRadius: '4px',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      transform: 'translateY(-2px)',
    },
  },
  activeNavLink: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    fontWeight: 'bold',
  },
  profileContainer: {
    position: 'relative',
    '@media (max-width: 768px)': {
      marginTop: '15px',
    }
  },
  profileButton: {
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    minWidth: '180px',
    zIndex: 1001,
    marginTop: '8px',
    border: '1px solid #e2e8f0',
    animation: 'fadeIn 0.2s ease-in-out',
  },
  dropdownItem: {
    width: '100%',
    padding: '12px 16px',
    border: 'none',
    backgroundColor: 'transparent',
    textAlign: 'right',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#374151',
    transition: 'background-color 0.2s ease',
    borderBottom: '1px solid #f3f4f6',
    '&:hover': {
      backgroundColor: '#f9fafb',
    },
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  profileImage: {
    width: '35px',
    height: '35px',
    borderRadius: '50%',
    cursor: 'pointer',
    objectFit: 'cover',
    border: '2px solid #fff',
    transition: 'all 0.2s ease',
    ':hover': {
      transform: 'scale(1.1)',
      boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
    }
  },
  hamburger: {
    display: 'none',
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '30px',
    height: '25px',
    cursor: 'pointer',
    '@media (max-width: 768px)': {
      display: 'flex',
    }
  },
  hamburgerLine: {
    width: '100%',
    height: '3px',
    backgroundColor: '#fff',
    borderRadius: '5px',
    transition: 'all 0.3s ease',
  },
  hamburgerLine1Active: {
    transform: 'rotate(45deg) translate(5px, 5px)',
  },
  hamburgerLine2Active: {
    opacity: 0,
  },
  hamburgerLine3Active: {
    transform: 'rotate(-45deg) translate(7px, -6px)',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: '30px',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    maxHeight: '90vh',
    overflowY: 'auto',
    width: '90%',
    maxWidth: '500px',
  },

   actionButton: {
    objectFit: 'cover',
    backgroundColor: '#f1f5f9',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'block',
    fontSize: '1.2rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    overflow: 'hidden',
    '&:hover': {
      backgroundColor: '#e2e8f0',
      transform: 'scale(1.05)',
    },
    '&:active': {
      transform: 'scale(0.95)',
    },
  },
};

// Add CSS animation for dropdown
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

export default Navbar;
