import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, AlertCircle, Download, ChevronRight, X } from 'lucide-react';

const exportCSV = (data, filename) => {
  if (!data || !data.length) return;
  const headers = ['id', 'name', 'email', 'totalSpend', 'ordersCount', 'preferredCategory', 'risk'].join(',');
  const rows = data.map(obj => {
    return [
      obj.id, 
      `"${obj.name}"`, 
      `"${obj.email}"`, 
      obj.totalSpend || 0, 
      obj.orders?.length || 0, 
      `"${obj.preferredCategory || 'None'}"`,
      obj.lastOrderDays > 30 ? 'High' : 'Low'
    ].join(',');
  });
  const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const navigate = useNavigate();

  const fetchCustomers = () => {
    fetch('http://localhost:3000/api/customers')
      .then(res => res.json())
      .then(data => {
        setCustomers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching customers:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (!newName || !newEmail) return;
    try {
      await fetch('http://localhost:3000/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, email: newEmail })
      });
      setIsModalOpen(false);
      setNewName('');
      setNewEmail('');
      setLoading(true);
      fetchCustomers();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="customers-page">
      <div className="flex-between" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="title-large" style={{ margin: '0 0 8px 0' }}>Customer Directory</h1>
          <p className="text-muted" style={{ margin: 0, fontSize: '0.95rem' }}>Manage and analyze your customer base.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn btn-outline" style={{ backgroundColor: 'white' }} onClick={() => exportCSV(filteredCustomers, 'customers_export.csv')}>
            <Download size={18} /> Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            + Add Customer
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden', borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px', borderBottom: 'none' }}>
        <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-color)' }}>
           <div style={{ position: 'relative' }}>
             <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
             <input 
               type="text" 
               placeholder="Search by name or email..." 
               className="search-input"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           
           <div style={{ display: 'flex', gap: '12px' }}>
             <button className="btn btn-outline" style={{ backgroundColor: 'white' }}>
               <Filter size={18} /> Filters
             </button>
             <select style={{ padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'white', fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer' }}>
               <option>Sort by: Spend (High - Low)</option>
               <option>Sort by: Spend (Low - High)</option>
               <option>Sort by: Recent Order</option>
             </select>
           </div>
        </div>

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading directory...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead style={{ backgroundColor: '#f8fafc' }}>
                <tr>
                  <th style={{ paddingLeft: '32px' }}>Customer</th>
                  <th>Total Spend</th>
                  <th>Total Orders</th>
                  <th>Pref. Category</th>
                  <th>Status & Risk</th>
                  <th style={{ width: '60px' }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(customer => (
                  <tr 
                    key={customer.id} 
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/customers/${customer.id}`)}
                  >
                    <td style={{ paddingLeft: '32px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem' }}>
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>{customer.name}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--text-main)' }}>₹{customer.totalSpend?.toLocaleString() || 0}</td>
                    <td><span style={{ backgroundColor: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', fontWeight: 700 }}>{customer.orders?.length || 0}</span></td>
                    <td style={{ textTransform: 'capitalize' }}>
                      <span style={{ display: 'inline-flex', padding: '6px 14px', borderRadius: '99px', border: '1px solid #e2e8f0', fontSize: '0.85rem', fontWeight: 600 }}>
                        {customer.preferredCategory || 'None'}
                      </span>
                    </td>
                    <td>
                      {customer.lastOrderDays > 30 ? (
                        <span className="badge badge-danger">
                          <AlertCircle size={14} /> Churn Risk
                        </span>
                      ) : (
                        <span className="badge badge-success">Active</span>
                      )}
                    </td>
                    <td style={{ paddingRight: '32px', textAlign: 'right', color: 'var(--text-muted)' }}>
                      <ChevronRight size={20} />
                    </td>
                  </tr>
                ))}
                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '64px', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                      No customers match your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div style={{ padding: '16px 24px', backgroundColor: 'white', borderTop: 'none', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-color)' }}>
         <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Showing {filteredCustomers.length} results</span>
         <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-outline" style={{ padding: '8px 16px', borderRadius: '8px' }} disabled>Previous</button>
            <button className="btn btn-outline" style={{ padding: '8px 16px', borderRadius: '8px' }}>Next</button>
         </div>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '400px', position: 'relative' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={20} />
            </button>
            <h2 style={{ marginTop: 0, marginBottom: '24px', fontWeight: 800 }}>Add New Customer</h2>
            <form onSubmit={handleAddCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600 }}>Full Name</label>
                <input required type="text" value={newName} onChange={e => setNewName(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600 }}>Email Address</label>
                <input required type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>Save Customer</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
