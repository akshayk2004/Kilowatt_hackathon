import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

const CustomerCard = ({ customer, onPress }) => {
  const isHighRisk = customer.lastOrderDays > 30;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.name}>{customer.name}</Text>
        {isHighRisk && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Risk</Text>
          </View>
        )}
      </View>
      <View style={styles.stats}>
        <Text style={styles.statText}>Spend: ${customer.totalSpend}</Text>
        <Text style={styles.statText}>Orders: {customer.orders?.length || 0}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  badge: {
    backgroundColor: Colors.error + '33', // 20% opacity
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  badgeText: {
    color: Colors.error,
    fontSize: 12,
    fontWeight: 'bold',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statText: {
    color: Colors.textSecondary,
    fontSize: 14,
  }
});

export default CustomerCard;
