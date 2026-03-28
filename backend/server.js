const express = require('express');
const cors = require('cors');
const wooService = require('./wooService');
const aiService = require('./aiService');
const { orders } = require('./mockData');

const app = express();
app.use(cors());
app.use(express.json());

let activeCustomers = [];

app.use(async (req, res, next) => {
  if (activeCustomers.length === 0) {
    activeCustomers = await wooService.getTransformedCustomers();
  }
  next();
});

// Existing routes
app.get('/api/dashboard', (req, res) => {
  const dashboardData = aiService.analyzeDashboard(activeCustomers);
  
  // Aggregate chart data securely
  const chartDataMap = {};
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  orders.forEach(o => {
    const d = new Date(o.date_created);
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
    const monthYear = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().substring(2)}`;
    
    if (!chartDataMap[key]) {
      chartDataMap[key] = { key, name: monthYear, revenue: 0, sales: 0 };
    }
    chartDataMap[key].revenue += o.total;
    chartDataMap[key].sales += 1;
  });
  
  const chartData = Object.values(chartDataMap)
    .sort((a, b) => a.key.localeCompare(b.key))
    .map(({ name, revenue, sales }) => ({ name, revenue, sales }));

  // Pseudo-randomizing traffic sources logic based on order ID for persistence
  const sourceDataMap = { 'Organic': 0, 'Direct': 0, 'Social': 0, 'Referral': 0 };
  const sourceKeys = Object.keys(sourceDataMap);
  orders.forEach(o => {
     sourceDataMap[sourceKeys[o.id % 4]] += o.total;
  });
  const sourceData = Object.keys(sourceDataMap).map(k => ({ name: k, value: sourceDataMap[k] }));

  res.json({ ...dashboardData, chartData, sourceData });
});

app.get('/api/customers', (req, res) => {
  res.json(activeCustomers);
});

app.get('/api/customers/:id', (req, res) => {
  const customer = activeCustomers.find(c => c.id === parseInt(req.params.id));
  if (!customer) return res.status(404).json({ error: 'Customer not found' });
  const aiSuggestion = aiService.suggestAction(customer);
  res.json({ ...customer, aiSuggestion });
});

app.post('/api/customers', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email required' });
  
  const newId = activeCustomers.length ? Math.max(...activeCustomers.map(c => c.id)) + 1 : 1;
  const newCustomer = {
    id: newId,
    name,
    email,
    totalSpend: 0,
    orders: [],
    lastOrderDays: 0,
    preferredCategory: 'None'
  };
  activeCustomers.push(newCustomer);
  res.json(newCustomer);
});

app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });
  const aiResponse = aiService.processChat(message, activeCustomers);
  res.json(aiResponse);
});

// New routes
app.get('/api/products', (req, res) => {
  const productMap = {};
  const perfMap = {};
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  orders.forEach(o => {
    const d = new Date(o.date_created);
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
    const monthYear = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().substring(2)}`;
    
    if (!perfMap[key]) {
      perfMap[key] = { key, name: monthYear, unitsSold: 0, revenue: 0 };
    }

    o.line_items.forEach(item => {
      if (!productMap[item.name]) {
        productMap[item.name] = { 
          id: item.name.toLowerCase().replace(/ /g, '-'), 
          name: item.name, 
          category: item.category, 
          unitsSold: 0, 
          revenue: 0, 
          status: 'In Stock' 
        };
      }
      productMap[item.name].unitsSold += 1;
      const itemRev = (o.total / o.line_items.length);
      productMap[item.name].revenue += itemRev;
      
      perfMap[key].unitsSold += 1;
      perfMap[key].revenue += itemRev;
    });
  });
  
  const products = Object.values(productMap).map(p => ({
     ...p, revenue: parseFloat(p.revenue.toFixed(2))
  })).sort((a, b) => b.revenue - a.revenue);

  const performanceData = Object.values(perfMap)
    .sort((a, b) => a.key.localeCompare(b.key))
    .map(p => ({ name: p.name, unitsSold: p.unitsSold, revenue: parseFloat(p.revenue.toFixed(2)) }));
  
  res.json({ products, performanceData });
});

app.post('/api/products', (req, res) => {
  const { name, category } = req.body;
  if (!name || !category) return res.status(400).json({ error: 'Name and category required' });
  
  // To inject into dynamic data, we spoof a 0$ order so it appears in the catalog natively
  orders.push({
    id: 9990 + orders.length,
    customer_id: 1,
    total: 0,
    date_created: new Date().toISOString(),
    line_items: [{ name, category }]
  });
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CRM Backend running on http://localhost:${PORT}`);
});
