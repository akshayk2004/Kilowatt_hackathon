import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Colors from '../constants/Colors';
import { Theme } from '../constants/Theme';
import { getCustomerDetail } from '../services/api';

const CustomerDetailScreen = ({ route }) => {
  const { id } = route.params;
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await getCustomerDetail(id);
        setCustomer(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />;
  }

  if (!customer) return null;

  return (
    <ScrollView style={Theme.container} contentContainerStyle={{ padding: 16 }}>
      <View style={Theme.card}>
        <Text style={Theme.title}>{customer.name}</Text>
        <Text style={Theme.subtitle}>{customer.email}</Text>
        
        <View style={styles.statsRow}>
          <View>
            <Text style={styles.label}>Total Spend</Text>
            <Text style={styles.value}>${customer.totalSpend}</Text>
          </View>
          <View>
            <Text style={styles.label}>Last Active</Text>
            <Text style={styles.value}>{customer.lastOrderDays} days ago</Text>
          </View>
        </View>
      </View>

      <Text style={Theme.heading}>AI Recommendation</Text>
      <View style={[Theme.card, { borderColor: Colors.primary }]}>
        <Text style={styles.actionTitle}>{customer.aiSuggestion.action}</Text>
        <Text style={styles.actionMessage}>{customer.aiSuggestion.message}</Text>
      </View>

      <Text style={Theme.heading}>Order History</Text>
      {customer.orders.map(order => (
        <View key={order.id} style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderId}>Order #{order.id}</Text>
            <Text style={styles.orderTotal}>${order.total}</Text>
          </View>
          <Text style={styles.orderItems}>{order.items}</Text>
          <Text style={styles.orderDate}>{new Date(order.date).toLocaleDateString()}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  value: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionTitle: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  actionMessage: {
    color: Colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  orderCard: {
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  orderId: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  orderTotal: {
    color: Colors.success,
    fontWeight: 'bold',
  },
  orderItems: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
  orderDate: {
    color: Colors.textSecondary,
    fontSize: 10,
  }
});

export default CustomerDetailScreen;
