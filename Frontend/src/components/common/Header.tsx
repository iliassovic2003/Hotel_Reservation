import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <Link to="/" className="logo">
        Premium Escape<span>+</span>
      </Link>
      <div className="header-right">
        <Link to="/login" className="profile-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
            <path d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </Link>
      </div>
    </header>
  );
};

export default Header;