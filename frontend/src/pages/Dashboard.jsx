import React, { useEffect, useState } from 'react';
import { Users, DollarSign, ShoppingBag, AlertCircle, Sparkles, TrendingUp, ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';



const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const downloadReport = () => {
    if (!stats) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(stats, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = "dashboard_report.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  useEffect(() => {
    fetch('http://localhost:3000/api/dashboard')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching dashboard stats:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading Analytics...</div>;

  return (
    <div className="dashboard-page">
      <div className="flex-between" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="title-large" style={{ margin: '0 0 8px 0' }}>Welcome back, Admin</h1>
          <p className="text-muted" style={{ margin: 0, fontSize: '0.95rem' }}>Here's what's happening with your store today.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-outline" style={{ backgroundColor: 'white' }}>Download Report</button>
          <button className="btn btn-primary" onClick={downloadReport}>Add Product</button>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="flex-between">
            <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: '#eef2ff', color: '#4f46e5' }}>
              <DollarSign size={22} />
            </div>
            <MoreHorizontal size={20} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '4px' }}>Total Revenue</p>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>₹{stats?.kpis?.revenue?.toLocaleString() || '124,500'}</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <span className="badge badge-success" style={{ padding: '4px 8px' }}><ArrowUpRight size={14} /> 12.5%</span>
            <span className="text-muted">vs last month</span>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="flex-between">
            <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: '#fdf4ff', color: '#c026d3' }}>
              <Users size={22} />
            </div>
            <MoreHorizontal size={20} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '4px' }}>Active Customers</p>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats?.kpis?.totalCustomers || '1,240'}</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <span className="badge badge-success" style={{ padding: '4px 8px' }}><ArrowUpRight size={14} /> 5.2%</span>
            <span className="text-muted">vs last month</span>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="flex-between">
            <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: '#fff7ed', color: '#f97316' }}>
              <ShoppingBag size={22} />
            </div>
            <MoreHorizontal size={20} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '4px' }}>Total Orders</p>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats?.kpis?.orders || '8,432'}</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <span className="badge badge-danger" style={{ padding: '4px 8px' }}><ArrowDownRight size={14} /> 1.1%</span>
            <span className="text-muted">vs last month</span>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="flex-between">
            <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: '#fef2f2', color: '#ef4444' }}>
              <AlertCircle size={22} />
            </div>
            <MoreHorizontal size={20} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '4px' }}>Churn Risk</p>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats?.kpis?.atRisk || '42'}</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <span className="text-muted">Customers needing attention</span>
          </div>
        </div>
      </div>

      {/* Main Charts Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        
        {/* Revenue Analytics Chart */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="flex-between" style={{ marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '4px' }}>Revenue Analytics</h2>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>Monthly recurring revenue over time</p>
            </div>
            <select style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: '#f8fafc', fontWeight: 600, color: 'var(--text-muted)' }}>
              <option>This Year</option>
              <option>Last 6 Months</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div style={{ flex: 1, minHeight: '300px', marginLeft: '-20px' }}>
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={stats?.chartData || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dx={-10} tickFormatter={(val) => `₹${val/1000}k`} />
                 <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                 <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
               </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Sources Chart */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="flex-between" style={{ marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '4px' }}>Traffic Sources</h2>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>Where your users are coming from</p>
            </div>
          </div>
          <div style={{ flex: 1, minHeight: '300px' }}>
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={stats?.sourceData || []} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                 <XAxis type="number" hide />
                 <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }} width={80} />
                 <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                 <Bar dataKey="value" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={24} />
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* AI Insights Section */}
      {stats?.insight && (
        <div className="card" style={{ backgroundColor: '#ffffff', border: '1px solid #e0e7ff', display: 'flex', gap: '20px', alignItems: 'flex-start', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', backgroundColor: '#6366f1' }}></div>
          <div style={{ backgroundColor: '#eef2ff', color: '#4f46e5', padding: '14px', borderRadius: '16px' }}>
            <Sparkles size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>Shoplytixs AI Insight</h3>
              <span className="badge badge-success" style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }}>New</span>
            </div>
            <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '1rem', maxWidth: '800px' }}>
              {stats.insight}
            </p>
            {stats.kpis?.atRisk > 0 && (
              <button className="btn btn-primary" style={{ marginTop: '20px' }}>
                Create Automated Win-back Campaign
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
