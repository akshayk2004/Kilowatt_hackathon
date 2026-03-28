function getDaysSince(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

function extractCategory(lineItems) {
  const names = lineItems.map(item => item.name.toLowerCase());
  if (names.some(n => n.includes('dress') || n.includes('suit'))) return 'Formal';
  if (names.some(n => n.includes('shoe') || n.includes('jacket'))) return 'Outerwear/Shoes';
  return 'Casual';
}

function transformData(rawCustomers, rawOrders) {
  return rawCustomers.map(customer => {
    const customerOrders = rawOrders.filter(o => o.customer_id === customer.id);
    
    // Calculate total spend
    const totalSpend = customerOrders.reduce((sum, order) => sum + parseFloat(order.total), 0);
    
    // Find last order
    const sortedOrders = [...customerOrders].sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
    const lastOrder = sortedOrders.length > 0 ? sortedOrders[0] : null;
    const lastOrderDays = lastOrder ? getDaysSince(lastOrder.date_created) : Infinity;

    // Get preferred category from latest order
    const preferredCategory = lastOrder ? extractCategory(lastOrder.line_items) : 'Unknown';

    return {
      id: customer.id,
      name: `${customer.first_name} ${customer.last_name}`,
      email: customer.email,
      totalSpend: parseFloat(totalSpend.toFixed(2)),
      orders: customerOrders.map(o => ({
        id: o.id,
        date: o.date_created,
        total: parseFloat(o.total),
        items: o.line_items.map(i => i.name).join(', ')
      })),
      lastOrderDays,
      preferredCategory
    };
  });
}

module.exports = { transformData };
