import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Sparkles, LogOut, Settings, UserCircle, CheckCircle } from 'lucide-react';

const Topbar = ({ onToggleChat }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New high-value order #106 received', time: '10 mins ago', unread: true },
    { id: 2, text: 'System update: AI Models refreshed', time: '2 hours ago', unread: true },
    { id: 3, text: 'Emma Watson marked as Churn Risk', time: '1 day ago', unread: false }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  return (
    <header className="topbar">
      <div style={{ position: 'relative' }}>
        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          placeholder="Search for anything..." 
          className="search-input"
        />
      </div>
      
      <div className="topbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <button 
          className="btn-ai-glow" 
          onClick={onToggleChat}
        >
          Ask Shoplytixs AI
        </button>

        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)' }}></div>

        {/* Notifications Dropdown */}
        <div className="dropdown" ref={notifRef}>
          <div 
            style={{ position: 'relative', cursor: 'pointer', padding: '8px', color: 'var(--text-main)' }} 
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
          >
            <Bell size={22} />
            {unreadCount > 0 && (
              <span style={{ 
                position: 'absolute', top: '6px', right: '6px', 
                width: '10px', height: '10px', backgroundColor: 'var(--danger)', 
                borderRadius: '50%', border: '2px solid var(--bg-main)', boxSizing: 'content-box' 
              }}></span>
            )}
          </div>

          {showNotifications && (
            <div className="dropdown-menu">
              <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>Notifications</span>
                <button onClick={markAllRead} style={{ background: 'transparent', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Mark all read</button>
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.map(n => (
                  <div key={n.id} className="dropdown-item" style={{ backgroundColor: n.unread ? 'white' : '#f8fafc', padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                      <div style={{ marginTop: '4px' }}>
                        {n.unread ? <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--accent-color)' }} /> : <CheckCircle size={16} color="var(--text-muted)" />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.95rem', color: n.unread ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: n.unread ? 600 : 500 }}>{n.text}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px', fontWeight: 500 }}>{n.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="dropdown" ref={profileRef}>
          <div 
            className="user-profile" 
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          >
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Admin User</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Store Manager</span>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <img src="https://i.pravatar.cc/150?img=11" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>

          {showProfile && (
            <div className="dropdown-menu" style={{ width: '260px' }}>
              <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#f8fafc' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', overflow: 'hidden' }}>
                    <img src="https://i.pravatar.cc/150?img=11" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>Admin User</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>dashboard@crm.com</div>
                </div>
              </div>
              
              <div style={{ padding: '8px 0' }}>
                <div className="dropdown-item" style={{ flexDirection: 'row', alignItems: 'center', gap: '14px', padding: '14px 20px' }}>
                  <UserCircle size={18} color="var(--text-muted)" />
                  <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>My Profile</span>
                </div>
                <div className="dropdown-item" style={{ flexDirection: 'row', alignItems: 'center', gap: '14px', padding: '14px 20px' }}>
                  <Settings size={18} color="var(--text-muted)" />
                  <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>Settings & Billing</span>
                </div>
              </div>
              
              <div style={{ borderTop: '1px solid var(--border-color)', padding: '8px 0' }}>
                <div className="dropdown-item" style={{ flexDirection: 'row', alignItems: 'center', gap: '14px', padding: '14px 20px', color: 'var(--danger)' }}>
                  <LogOut size={18} />
                  <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Sign Out</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
      </div>
    </header>
  );
};

export default Topbar;
