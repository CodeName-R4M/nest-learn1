import { useState, useEffect, useRef } from 'react';
import './ProfileDropdown.css';

function ProfileDropdown({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    onLogout();
  };

  // Format the account creation date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="profile-dropdown-container" ref={dropdownRef}>
      <button 
        className="profile-avatar-btn" 
        onClick={toggleDropdown}
        aria-label="Profile menu"
      >
        <img 
          src={user.photoURL} 
          alt={user.displayName} 
          className="user-avatar" 
        />
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="profile-dropdown-menu">
          <div className="profile-header">
            <img 
              src={user.photoURL} 
              alt={user.displayName} 
              className="profile-large-avatar" 
            />
            <h3 className="profile-name">{user.displayName}</h3>
            <p className="profile-email">{user.email}</p>
          </div>

          <div className="profile-divider"></div>

          <div className="profile-details">
            <div className="profile-detail-item">
              <span className="detail-icon">👤</span>
              <div className="detail-content">
                <span className="detail-label">Display Name</span>
                <span className="detail-value">{user.displayName || 'Not set'}</span>
              </div>
            </div>

            <div className="profile-detail-item">
              <span className="detail-icon">📧</span>
              <div className="detail-content">
                <span className="detail-label">Email</span>
                <span className="detail-value">{user.email}</span>
              </div>
            </div>

            <div className="profile-detail-item">
              <span className="detail-icon">🆔</span>
              <div className="detail-content">
                <span className="detail-label">User ID</span>
                <span className="detail-value detail-id">{user.uid}</span>
              </div>
            </div>

            <div className="profile-detail-item">
              <span className="detail-icon">📅</span>
              <div className="detail-content">
                <span className="detail-label">Member Since</span>
                <span className="detail-value">
                  {formatDate(user.metadata?.creationTime)}
                </span>
              </div>
            </div>

            <div className="profile-detail-item">
              <span className="detail-icon">🔐</span>
              <div className="detail-content">
                <span className="detail-label">Last Sign In</span>
                <span className="detail-value">
                  {formatDate(user.metadata?.lastSignInTime)}
                </span>
              </div>
            </div>

            {user.emailVerified !== undefined && (
              <div className="profile-detail-item">
                <span className="detail-icon">✉️</span>
                <div className="detail-content">
                  <span className="detail-label">Email Verified</span>
                  <span className="detail-value">
                    {user.emailVerified ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="profile-divider"></div>

          <div className="profile-actions">
            <button onClick={handleLogoutClick} className="logout-btn-dropdown">
              <span className="logout-icon">🚪</span>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;

