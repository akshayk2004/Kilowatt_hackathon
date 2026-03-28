import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

const KpiCard = ({ title, value, isHighlight }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.value, isHighlight && styles.highlight]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    flex: 1,
    marginHorizontal: 4,
    marginVertical: 8,
    minHeight: 100,
    justifyContent: 'center',
  },
  title: {
    color: Colors.textSecondary,
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 8,
  },
  value: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  highlight: {
    color: Colors.error,
  }
});

export default KpiCard;
