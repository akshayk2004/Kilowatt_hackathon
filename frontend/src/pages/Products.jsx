import React, { useEffect, useState } from 'react';
import { Search, Filter, Download, ChevronRight, Package, TrendingUp, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const exportCSV = (data, filename) => {
  if (!data || !data.length) return;
  const headers = ['id', 'name', 'category', 'unitsSold', 'revenue', 'status'].join(',');
  const rows = data.map(obj => {
    return [
      `"${obj.id}"`, 
      `"${obj.name}"`, 
      `"${obj.category}"`, 
      obj.unitsSold || 0, 
      obj.revenue || 0, 
      `"${obj.status || 'In Stock'}"`
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

const Products = () => {
  const [data, setData] = useState({ products: [], performanceData: [] });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const fetchData = () => {
    fetch('http://localhost:3000/api/products')
      .then(res => res.json())
      .then(resData => {
        setData(resData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newName || !newCategory) return;
    try {
      await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, category: newCategory })
      });
      setIsModalOpen(false);
      setNewName('');
      setNewCategory('');
      setLoading(true);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = data.products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="products-page">
      <div className="flex-between" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="title-large" style={{ margin: '0 0 8px 0' }}>Product Analytics</h1>
          <p className="text-muted" style={{ margin: 0, fontSize: '0.95rem' }}>Track performance across your inventory.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn btn-outline" style={{ backgroundColor: 'white' }} onClick={() => exportCSV(filteredProducts, 'products_export.csv')}>
            <Download size={18} /> Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            + Add Product
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '24px' }}>
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: '#eef2ff', color: '#4f46e5' }}>
              <Package size={20} />
            </div>
            <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Total Products</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{data.products.length} Active</h2>
        </div>
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#10b981' }}>
              <TrendingUp size={20} />
            </div>
            <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Top Category</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, textTransform: 'capitalize' }}>
            {data.products.length ? data.products[0].category : 'N/A'}
          </h2>
        </div>
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: '#fef2f2', color: '#ef4444' }}>
              <TrendingUp size={20} style={{ transform: 'scaleY(-1)' }} />
            </div>
            <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Lowest Performing</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, textTransform: 'capitalize' }}>
            {data.products.length > 0 ? data.products[data.products.length-1].name : 'N/A'}
          </h2>
        </div>
      </div>
      
      {/* Product Performance Analytics Chart */}
      <div className="card" style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column' }}>
        <div className="flex-between" style={{ marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '4px' }}>Global Product Sales Performance</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Monthly revenue trend across all inventory</p>
          </div>
        </div>
        
        <div style={{ width: '100%', height: '320px', marginLeft: '-20px' }}>
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={data.performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
               <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
               <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dx={-10} tickFormatter={(val) => `₹${val/1000}k`} />
               <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dx={10} />
               <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
               <Bar yAxisId="left" dataKey="revenue" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={32} name="Total Revenue (₹)" />
               <Line yAxisId="right" type="monotone" dataKey="unitsSold" stroke="#10b981" strokeWidth={3} dot={{r:4}} name="Units Sold" />
             </BarChart>
           </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden', borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px', borderBottom: 'none' }}>
        <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-color)' }}>
           <div style={{ position: 'relative' }}>
             <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
             <input 
               type="text" 
               placeholder="Search products..." 
               className="search-input"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           
           <div style={{ display: 'flex', gap: '12px' }}>
             <button className="btn btn-outline" style={{ backgroundColor: 'white' }}>
               <Filter size={18} /> Filters
             </button>
           </div>
        </div>

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading inventory & analytics...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead style={{ backgroundColor: '#f8fafc' }}>
                <tr>
                  <th style={{ paddingLeft: '32px' }}>Product Info</th>
                  <th>Category</th>
                  <th>Units Sold</th>
                  <th>Total Revenue</th>
                  <th>Status</th>
                  <th style={{ width: '60px' }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id} style={{ cursor: 'pointer' }}>
                    <td style={{ paddingLeft: '32px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Package size={20} color="#64748b" />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>{product.name}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>SKU: PRD-{Math.floor(Math.random() * 9000) + 1000}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>
                      <span style={{ display: 'inline-flex', padding: '6px 14px', borderRadius: '8px', backgroundColor: '#f1f5f9', fontSize: '0.85rem', fontWeight: 600 }}>
                        {product.category}
                      </span>
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--text-main)' }}>{product.unitsSold}</td>
                    <td style={{ fontWeight: 800, color: 'var(--success)' }}>₹{product.revenue?.toLocaleString()}</td>
                    <td>
                      <span className="badge badge-success">In Stock</span>
                    </td>
                    <td style={{ paddingRight: '32px', textAlign: 'right', color: 'var(--text-muted)' }}>
                      <ChevronRight size={20} />
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '64px', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                      No products match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '400px', position: 'relative' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={20} />
            </button>
            <h2 style={{ marginTop: 0, marginBottom: '24px', fontWeight: 800 }}>Add New Product</h2>
            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600 }}>Product Name</label>
                <input required type="text" value={newName} onChange={e => setNewName(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600 }}>Category</label>
                <input required type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="e.g. formal, sportswear" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>Save Product</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
