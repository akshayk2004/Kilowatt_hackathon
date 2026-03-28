import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import DashboardScreen from './screens/DashboardScreen';
import CustomersScreen from './screens/CustomersScreen';
import CustomerDetailScreen from './screens/CustomerDetailScreen';
import ChatScreen from './screens/ChatScreen';
import Colors from './constants/Colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const globalScreenOptions = {
  headerStyle: { backgroundColor: Colors.surface },
  headerTintColor: Colors.text,
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...globalScreenOptions,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') {
            iconName = focused ? 'podium' : 'podium-outline';
          } else if (route.name === 'Customers') {
            iconName = focused ? 'people' : 'people-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Customers" component={CustomersScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={globalScreenOptions}>
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabs} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="CustomerDetail" 
          component={CustomerDetailScreen} 
          options={{ title: 'Customer Profile' }} 
        />
        <Stack.Screen 
          name="Chat" 
          component={ChatScreen} 
          options={{ title: 'AI Assistant' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
