import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, PieChart, ShoppingBag, Settings, HelpCircle, ArrowUpRight } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: 'var(--accent-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PieChart size={18} strokeWidth={3} />
        </div>
        <span style={{ color: 'var(--text-main)' }}>Dashboard CRM</span>
      </div>
      
      <div style={{ padding: '0 8px', marginBottom: '16px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Main Menu
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Overview</span>
        </NavLink>
        <NavLink to="/customers" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Users size={20} />
          <span>Customers</span>
        </NavLink>
        <NavLink to="/products" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <ShoppingBag size={20} />
          <span>Products</span>
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <PieChart size={20} />
          <span>Analytics</span>
        </NavLink>
      </nav>
      
      <div style={{ marginTop: 'auto' }}>
        <div className="card" style={{ padding: '20px', backgroundColor: '#f8fafc', border: '1px solid var(--border-color)', boxShadow: 'none', marginBottom: '24px' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px' }}>Pro Features</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Unlock advanced sales analytics and predictive AI models.</p>
          <button className="btn btn-primary" style={{ width: '100%', padding: '8px', fontSize: '0.8rem', borderRadius: '8px' }}>
            Upgrade Now
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div className="nav-item">
            <Settings size={20} />
            <span>Settings</span>
          </div>
          <div className="nav-item">
            <HelpCircle size={20} />
            <span>Help Center</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
