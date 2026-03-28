import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, LogOut, Settings, UserCircle, ChevronDown } from 'lucide-react';
import './AdminNavbar.css';

function AdminNavbar() {
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem('user')) || {};
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    const handleLogout = () => {
        navigate('/')
        setTimeout(() => {
            sessionStorage.removeItem("user");
            window.location.reload();
        }, 100)
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="admin-navbar">
            <div className="admin-navbar-container">
                <div className="admin-navbar-left">
                    <h2 className="admin-navbar-title">Hệ thống quản lý</h2>
                </div>

                {/* Right Side Actions */}
                <div className="admin-navbar-actions">
                    {/* Notifications */}
                    <button className="navbar-btn notification-btn">
                        <Bell size={20} />
                        <span className="notification-badge">3</span>
                    </button>

                    {/* User Info with Dropdown */}
                    <div className="user-menu-container" ref={userMenuRef}>
                        <button
                            className="navbar-user-info"
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        >
                            <div className="user-avatar">
                                <User size={18} />
                            </div>
                            <div className="user-details">
                                <span className="user-name">{user.name || 'Admin'}</span>
                                <span className="user-role">Quản lý</span>
                            </div>
                            <ChevronDown
                                size={16}
                                className={`chevron-icon ${isUserMenuOpen ? 'rotated' : ''}`}
                            />
                        </button>

                        {/* Dropdown Menu */}
                        {isUserMenuOpen && (
                            <div className="user-dropdown-menu">
                                <div className="dropdown-header">
                                    <div className="dropdown-user-avatar">
                                        <User size={24} />
                                    </div>
                                    <div className="dropdown-user-info">
                                        <span className="dropdown-user-name">{user.name || 'Admin'}</span>
                                        <span className="dropdown-user-email">{user.username || 'admin@puretaste.com'}</span>
                                    </div>
                                </div>

                                <div className="dropdown-divider"></div>

                                <div className="dropdown-items">
                                    <button className="dropdown-item">
                                        <UserCircle size={18} />
                                        <span>Thông tin cá nhân</span>
                                    </button>
                                    <button className="dropdown-item">
                                        <Settings size={18} />
                                        <span>Cài đặt</span>
                                    </button>
                                </div>

                                <div className="dropdown-divider"></div>

                                <button className="dropdown-item logout-item" onClick={handleLogout}>
                                    <LogOut size={18} />
                                    <span>Đăng xuất</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminNavbar;
