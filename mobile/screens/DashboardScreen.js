import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import Colors from '../constants/Colors';
import { Theme } from '../constants/Theme';
import KpiCard from '../components/KpiCard';
import FloatingAiButton from '../components/FloatingAiButton';
import { getDashboard } from '../services/api';

const DashboardScreen = ({ navigation }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await getDashboard();
      setData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <View style={Theme.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchDashboard} tintColor={Colors.primary} />}
      >
        <Text style={Theme.heading}>Overview</Text>
        
        {data && (
          <>
            <View style={styles.row}>
              <KpiCard title="Customers" value={data.kpis.totalCustomers} />
              <KpiCard title="Revenue" value={`$${data.kpis.revenue}`} />
            </View>
            <View style={styles.row}>
              <KpiCard title="Orders" value={data.kpis.orders} />
              <KpiCard title="At Risk" value={data.kpis.atRisk} isHighlight={data.kpis.atRisk > 0} />
            </View>

            <Text style={Theme.heading}>AI Insight</Text>
            <View style={Theme.card}>
              <Text style={styles.insightText}>{data.insight}</Text>
            </View>
          </>
        )}
      </ScrollView>

      <FloatingAiButton onPress={() => navigation.navigate('Chat')} />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  insightText: {
    color: Colors.text,
    fontSize: 16,
    lineHeight: 24,
  }
});

export default DashboardScreen;
