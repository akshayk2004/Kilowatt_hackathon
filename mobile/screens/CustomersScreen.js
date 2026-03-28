import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, ActivityIndicator } from 'react-native';
import Colors from '../constants/Colors';
import { Theme } from '../constants/Theme';
import CustomerCard from '../components/CustomerCard';
import { getCustomers } from '../services/api';

const CustomersScreen = ({ navigation }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await getCustomers();
        setCustomers(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={Theme.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search customers..."
          placeholderTextColor={Colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <CustomerCard 
              customer={item} 
              onPress={() => navigation.navigate('CustomerDetail', { id: item.id })} 
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchBar: {
    backgroundColor: Colors.surface,
    color: Colors.text,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  }
});

export default CustomersScreen;
