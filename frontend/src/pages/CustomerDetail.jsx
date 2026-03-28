import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Navigation, ShoppingBag, Sparkles, Tag, Calendar, TrendingUp } from 'lucide-react';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/api/customers/${id}`)
      .then(res => res.json())
      .then(data => {
        setCustomer(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching customer:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading profile...</div>;
  if (!customer || customer.error) return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--danger)' }}>Customer profile not found</div>;

  const isAtRisk = customer.lastOrderDays > 30;

  return (
    <div className="customer-detail-page">
      <button 
        onClick={() => navigate('/customers')} 
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '32px', fontWeight: 600, fontSize: '0.95rem' }}
      >
        <ArrowLeft size={18} /> Back to Directory
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '32px' }}>
        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'linear-gradient(90deg, #4f46e5, #0ea5e9)' }}></div>
            <div style={{ width: '90px', height: '90px', borderRadius: '24px', backgroundColor: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800 }}>
              {customer.name?.charAt(0) || 'C'}
            </div>
            <div style={{ flex: 1, marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.5px' }}>{customer.name}</h1>
                {isAtRisk ? <span className="badge badge-danger">High Churn Risk</span> : <span className="badge badge-success">Active Customer</span>}
              </div>
              <div style={{ display: 'flex', gap: '24px', color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500, marginTop: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={18} /> {customer.email || 'No email provided'}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={18} /> Joined Jan 2026</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Navigation size={18} /> Last active {customer.lastOrderDays || 'unknown'} days ago</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '0px', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ShoppingBag size={22} color="var(--accent-color)" /> Complete Order History
              </h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table" style={{ width: '100%', minWidth: '400px' }}>
                <thead style={{ backgroundColor: '#f8fafc' }}>
                  <tr>
                    <th style={{ paddingLeft: '32px' }}>Order ID</th>
                    <th>Date</th>
                    <th>Items Purchased</th>
                    <th style={{ paddingRight: '32px', textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.orders?.map(order => (
                    <tr key={order.id}>
                      <td style={{ paddingLeft: '32px', fontWeight: 600 }}>#{order.id}</td>
                      <td>{new Date(order.date).toLocaleDateString()}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{order.items}</td>
                      <td style={{ paddingRight: '32px', textAlign: 'right', fontWeight: 800, color: 'var(--text-main)' }}>₹{order.total}</td>
                    </tr>
                  ))}
                  {(!customer.orders || customer.orders.length === 0) && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '24px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
               <TrendingUp size={20} color="var(--accent-color)"/> Profile Metrics
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Lifetime Value (LTV)</span>
                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-main)' }}>₹{customer.totalSpend?.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Total Orders</span>
                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-main)', backgroundColor: '#f1f5f9', padding: '4px 12px', borderRadius: '8px' }}>{customer.orders?.length || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Preferred Category</span>
                <span style={{ fontWeight: 700, textTransform: 'capitalize', display: 'inline-flex', padding: '6px 14px', borderRadius: '99px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>{customer.preferredCategory || 'None'}</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ border: '2px solid #e0e7ff', backgroundColor: '#faf5ff', padding: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1, color: '#4f46e5' }}>
               <Sparkles size={120} />
            </div>
            
            <h2 style={{ fontSize: '1.25rem', marginBottom: '24px', color: '#4338ca', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 800 }}>
              <Sparkles size={22} /> Shoplytixs AI Prescriptive
            </h2>
            
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e0e7ff', marginBottom: '24px' }}>
               <div style={{ color: '#4f46e5', lineHeight: 1.6, fontSize: '1.05rem', fontWeight: 800, marginBottom: '8px' }}>
                 {customer.aiSuggestion?.action || 'Engagement Opportunity'}
               </div>
               <div style={{ color: '#475569', lineHeight: 1.6, fontSize: '0.95rem' }}>
                 {customer.aiSuggestion?.message || `Send a personalized discount code to re-engage this customer.`}
               </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button className="btn" style={{ backgroundColor: 'white', color: '#4c1d95', border: '1px solid #c7d2fe', width: '100%', display: 'flex', justifyContent: 'center', padding: '14px', fontSize: '1rem', fontWeight: 700 }}>
                <Tag size={18} /> Copy Discount Link
              </button>
              <button className="btn btn-primary" style={{ backgroundColor: '#4f46e5', color: 'white', width: '100%', display: 'flex', justifyContent: 'center', padding: '14px', fontSize: '1rem', fontWeight: 700 }}>
                Automate Campaign
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
