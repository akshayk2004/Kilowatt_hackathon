class AiService {
  constructor() {
    this.highRiskThreshold = 30; // days
  }

  getHighRiskCustomers(customers) {
    return customers.filter(c => c.lastOrderDays > this.highRiskThreshold);
  }

  getTopCustomers(customers) {
    return [...customers].sort((a, b) => b.totalSpend - a.totalSpend).slice(0, 5);
  }

  analyzeDashboard(customers) {
    const highRisk = this.getHighRiskCustomers(customers);
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpend, 0);
    const totalOrders = customers.reduce((sum, c) => sum + c.orders.length, 0);

    return {
      kpis: {
        totalCustomers: customers.length,
        revenue: totalRevenue.toFixed(2),
        orders: totalOrders,
        atRisk: highRisk.length
      },
      insight: highRisk.length > 0 
        ? `${highRisk.length} customers may churn. Consider sending a reactivation campaign.` 
        : "Looking good! No customers are currently at high risk of churn."
    };
  }

  suggestAction(customer) {
    if (customer.lastOrderDays > this.highRiskThreshold) {
      return {
        action: "Send Discount",
        message: `Customer hasn't purchased in ${customer.lastOrderDays} days. Recommend sending 15% discount on ${customer.preferredCategory} collection.`
      };
    } else if (customer.totalSpend > 100) {
      return {
        action: "Promote Collection",
        message: `High value customer. Promote our new upcoming ${customer.preferredCategory} collection.`
      };
    } else {
      return {
        action: "Follow up",
        message: "Send a friendly check-in email."
      };
    }
  }

  processChat(message, customers) {
    const msg = message.toLowerCase();
    
    if (msg.includes("risk") || msg.includes("churn")) {
      const risky = this.getHighRiskCustomers(customers);
      return {
        reply: `I found ${risky.length} customers who haven't purchased in over 30 days. Here they are.`,
        customers: risky
      };
    }

    if (msg.includes("top") || msg.includes("best") || msg.includes("spend")) {
      const top = this.getTopCustomers(customers);
      return {
        reply: `Here are our top spending customers.`,
        customers: top
      };
    }

    if (msg.includes("hello") || msg.includes("hi")) {
      return {
        reply: "Hello! I am your AI CRM Assistant. You can ask me to 'show risky customers' or 'show top customers'.",
        customers: []
      };
    }

    return {
      reply: "I'm not sure how to help with that right now. Try asking me for 'risky customers' or 'top spenders'.",
      customers: []
    };
  }
}

module.exports = new AiService();
