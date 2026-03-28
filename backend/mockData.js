const customers = [
  { id: 1, first_name: 'Sarah', last_name: 'Jenkins', email: 'sarah.j@example.com' },
  { id: 2, first_name: 'Michael', last_name: 'Chang', email: 'm.chang@example.com' },
  { id: 3, first_name: 'Emily', last_name: 'Rossi', email: 'erossi88@example.com' },
  { id: 4, first_name: 'David', last_name: 'O\'Connor', email: 'doconnor.d@example.com' },
  { id: 5, first_name: 'Aisha', last_name: 'Patel', email: 'aisha.p@example.com' },
  { id: 6, first_name: 'James', last_name: 'Wilson', email: 'jwilson99@example.com' },
  { id: 7, first_name: 'Olivia', last_name: 'Martinez', email: 'omartinez@example.com' },
  { id: 8, first_name: 'William', last_name: 'Taylor', email: 'wtaylor.co@example.com' }
];

const orders = [
  { id: 101, customer_id: 1, total: 120, date_created: '2025-01-15T10:00:00Z', line_items: [{ name: 'Summer Dress', category: 'dresses' }] },
  { id: 102, customer_id: 2, total: 45, date_created: '2025-01-20T14:30:00Z', line_items: [{ name: 'Graphic T-Shirt', category: 't-shirts' }] },
  { id: 103, customer_id: 3, total: 85, date_created: '2025-02-10T09:15:00Z', line_items: [{ name: 'Running Shoes', category: 'shoes' }] },
  { id: 104, customer_id: 4, total: 210, date_created: '2025-03-05T11:45:00Z', line_items: [{ name: 'Formal Suit', category: 'formal' }, { name: 'Silk Tie', category: 'accessories' }] },
  { id: 105, customer_id: 5, total: 30, date_created: '2025-04-12T16:20:00Z', line_items: [{ name: 'Basic Tee', category: 't-shirts' }] },
  { id: 106, customer_id: 6, total: 150, date_created: '2025-05-22T08:00:00Z', line_items: [{ name: 'Sportswear Set', category: 'sportswear' }] },
  { id: 107, customer_id: 1, total: 95, date_created: '2025-06-18T10:00:00Z', line_items: [{ name: 'Summer Dress', category: 'dresses' }, { name: 'Polarized Sunglasses', category: 'accessories' }] },
  { id: 108, customer_id: 2, total: 200, date_created: '2025-07-21T14:30:00Z', line_items: [{ name: 'Winter Coat', category: 'outerwear' }] },
  { id: 109, customer_id: 7, total: 110, date_created: '2025-08-11T09:15:00Z', line_items: [{ name: 'Running Shoes', category: 'shoes' }] },
  { id: 110, customer_id: 8, total: 75, date_created: '2025-09-05T11:45:00Z', line_items: [{ name: 'Casual Shirt', category: 't-shirts' }] },
  { id: 111, customer_id: 3, total: 180, date_created: '2025-10-15T16:20:00Z', line_items: [{ name: 'Formal Suit', category: 'formal' }] },
  { id: 112, customer_id: 4, total: 60, date_created: '2025-11-25T08:00:00Z', line_items: [{ name: 'Graphic T-Shirt', category: 't-shirts' }] },
  { id: 113, customer_id: 5, total: 130, date_created: '2025-12-10T10:00:00Z', line_items: [{ name: 'Sportswear Set', category: 'sportswear' }] },
  { id: 114, customer_id: 6, total: 220, date_created: '2026-01-20T14:30:00Z', line_items: [{ name: 'Winter Coat', category: 'outerwear' }] },
  { id: 115, customer_id: 7, total: 90, date_created: '2026-02-14T09:15:00Z', line_items: [{ name: 'Running Shoes', category: 'shoes' }] },
  { id: 116, customer_id: 8, total: 55, date_created: '2026-03-01T11:45:00Z', line_items: [{ name: 'Basic Tee', category: 't-shirts' }] },
  { id: 117, customer_id: 1, total: 190, date_created: '2026-03-25T16:20:00Z', line_items: [{ name: 'Evening Gown', category: 'formal' }] }
];

module.exports = { customers, orders };
