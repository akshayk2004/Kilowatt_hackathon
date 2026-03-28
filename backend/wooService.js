const { customers, orders } = require('./mockData');
const { transformData } = require('./transform');

class WooService {
  async fetchCustomers() {
    // Simulating API delay
    return new Promise(resolve => setTimeout(() => resolve(customers), 200));
  }

  async fetchOrders() {
    return new Promise(resolve => setTimeout(() => resolve(orders), 200));
  }

  async getTransformedCustomers() {
    try {
      // In a real scenario, this would have try-catch around Axios calls.
      const rawCustomers = await this.fetchCustomers();
      const rawOrders = await this.fetchOrders();
      return transformData(rawCustomers, rawOrders);
    } catch (error) {
      console.error("WooCommerce fetch failed. Falling back to local data.", error);
      return transformData(customers, orders);
    }
  }
}

module.exports = new WooService();
