import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Colors from '../constants/Colors';
import { Theme } from '../constants/Theme';
import { sendChatMessage } from '../services/api';

const ChatScreen = () => {
  const [messages, setMessages] = useState([
    { id: '1', role: 'ai', text: "Hi! I'm your AI CRM Assistant. Try asking me for 'risky customers' or 'top spenders'." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await sendChatMessage(userMsg);
      setMessages(prev => [
        ...prev, 
        { 
          id: (Date.now() + 1).toString(), 
          role: 'ai', 
          text: res.data.reply,
          customers: res.data.customers 
        }
      ]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', text: "Sorry, I couldn't connect to the backend." }]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isAi = item.role === 'ai';
    return (
      <View style={[styles.messageWrapper, isAi ? styles.aiWrapper : styles.userWrapper]}>
        <View style={[styles.messageBubble, isAi ? styles.aiBubble : styles.userBubble]}>
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
        
        {/* Render suggested customers if AI provided any */}
        {isAi && item.customers && item.customers.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.customersScroll}>
            {item.customers.map(c => (
              <View key={c.id} style={styles.inlineCard}>
                <Text style={styles.inlineCardName}>{c.name}</Text>
                <Text style={styles.inlineCardSpend}>Spend: ${c.totalSpend}</Text>
                {c.lastOrderDays > 30 && <Text style={styles.inlineCardRisk}>Risk ({c.lastOrderDays} days)</Text>}
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
      style={Theme.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatContainer}
        showsVerticalScrollIndicator={false}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask AI assistant..."
          placeholderTextColor={Colors.textSecondary}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={loading}>
          <Text style={styles.sendButtonText}>{loading ? "..." : "Send"}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    padding: 16,
    flexGrow: 1,
  },
  messageWrapper: {
    marginBottom: 16,
    maxWidth: '85%',
  },
  aiWrapper: {
    alignSelf: 'flex-start',
  },
  userWrapper: {
    alignSelf: 'flex-end',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
  },
  aiBubble: {
    backgroundColor: Colors.surfaceLight,
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: Colors.primaryVariant,
    borderBottomRightRadius: 4,
  },
  messageText: {
    color: Colors.text,
    fontSize: 16,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    color: Colors.text,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  customersScroll: {
    marginTop: 8,
    flexDirection: 'row',
  },
  inlineCard: {
    backgroundColor: Colors.surfaceLight,
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 140,
  },
  inlineCardName: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  inlineCardSpend: {
    color: Colors.success,
    fontSize: 12,
    marginTop: 4,
  },
  inlineCardRisk: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
  }
});

export default ChatScreen;
