import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { Download, Calendar, ArrowUpRight } from 'lucide-react';

const COLORS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444'];

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const downloadReport = () => {
    if (!stats) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(stats, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = "analytics_report.json";
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
        console.error('Error fetching analytics:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading Advanced Analytics...</div>;

  return (
    <div className="analytics-page">
      <div className="flex-between" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="title-large" style={{ margin: '0 0 8px 0' }}>Advanced Analytics</h1>
          <p className="text-muted" style={{ margin: 0, fontSize: '0.95rem' }}>Deep dive into your store's performance metrics.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
             <Calendar size={18} color="var(--text-muted)" />
             <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Jan 2025 - Mar 2026</span>
          </div>
          <button className="btn btn-primary" onClick={downloadReport}>
            <Download size={18} /> Export Full Report
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Growth Trend */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="flex-between" style={{ marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '4px' }}>Revenue Growth Trend</h2>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>Cumulative revenue acceleration</p>
            </div>
          </div>
          <div style={{ flex: 1, minHeight: '350px', marginLeft: '-20px' }}>
             <ResponsiveContainer width="100%" height={320}>
               <LineChart data={stats?.chartData || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dx={-10} tickFormatter={(val) => `₹${val/1000}k`} />
                 <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                 <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />
               </LineChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Order Volume */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="flex-between" style={{ marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '4px' }}>Order Volume Over Time</h2>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>Monthly quantity of completed orders</p>
            </div>
            <span className="badge badge-success"><ArrowUpRight size={14} /> 24% YoY</span>
          </div>
          <div style={{ flex: 1, minHeight: '350px', marginLeft: '-20px' }}>
             <ResponsiveContainer width="100%" height={320}>
               <AreaChart data={stats?.chartData || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.5}/>
                     <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dx={-10} />
                 <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                 <Area type="monotone" dataKey="sales" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
               </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Source Distribution Pie */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
           <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '4px' }}>Traffic Attribution</h2>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>Where sales originate</p>
           </div>
           <div style={{ flex: 1, minHeight: '300px' }}>
             <ResponsiveContainer width="100%" height={320}>
               <PieChart>
                 <Pie
                   data={stats?.sourceData || []}
                   cx="50%"
                   cy="50%"
                   innerRadius={80}
                   outerRadius={110}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {(stats?.sourceData || []).map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                 <Legend iconType="circle" wrapperStyle={{ fontWeight: 600, fontSize: '0.85rem' }} />
               </PieChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Sales by Category Barchart */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
           <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '4px' }}>Revenue by Traffic Source</h2>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>Comparing channels</p>
           </div>
           <div style={{ flex: 1, minHeight: '300px', marginLeft: '-20px' }}>
             <ResponsiveContainer width="100%" height={320}>
               <BarChart data={stats?.sourceData || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dx={-10} tickFormatter={(val) => `₹${val/1000}k`} />
                 <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                 <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={40} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
