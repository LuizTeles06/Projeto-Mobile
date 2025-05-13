import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { Send } from 'lucide-react-native';
import { ChatMessage } from '@/components/chatbot/ChatMessage';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

// Mock responses for the chatbot
const getBotResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! How can I assist you today with your analytics or dashboard?";
  } else if (lowerMessage.includes('dashboard')) {
    return "Your dashboard shows key metrics like user growth, revenue, tasks, and completion rates. You can view more details in the Analytics section.";
  } else if (lowerMessage.includes('chart') || lowerMessage.includes('graph')) {
    return "The Analytics section provides various charts including line charts, bar charts, and pie charts. You can switch between them and change the time frame to see different patterns in your data.";
  } else if (lowerMessage.includes('revenue') || lowerMessage.includes('sales')) {
    return "Your current revenue is $42,853, which is up 8.1% compared to the previous period. Keep up the good work!";
  } else if (lowerMessage.includes('user') || lowerMessage.includes('customer')) {
    return "You have 12,592 total users, with a growth rate of 12.3% compared to the last period. Most of your users are active on weekdays.";
  } else if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
    return "I'm here to help! You can ask me about your dashboard metrics, chart data, or how to use this application. What specific information are you looking for?";
  } else if (lowerMessage.includes('thank')) {
    return "You're welcome! If you have any more questions, feel free to ask.";
  } else {
    return "I'm not sure I understand. Could you rephrase your question about your analytics, dashboard, or charts?";
  }
};

export default function ChatbotScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your analytics assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  
  const flatListRef = useRef<FlatList>(null);
  
  const handleSend = () => {
    if (message.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: message,
        sender: 'user',
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setMessage('');
      
      // Simulate bot response delay
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: getBotResponse(message),
          sender: 'bot',
          timestamp: new Date(),
        };
        
        setMessages(prevMessages => [...prevMessages, botMessage]);
        
        // Scroll to bottom after bot response
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }, 1000);
      
      // Scroll to bottom after user message
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };
  
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <SafeAreaView style={[styles.container, isDark && styles.containerDark]} edges={['bottom']}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={80}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <ChatMessage message={item} />}
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
          />
          
          <View style={[styles.inputContainer, isDark && styles.inputContainerDark]}>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              placeholder="Type your message..."
              placeholderTextColor={isDark ? '#94A3B8' : '#64748B'}
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={200}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Send size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messageList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  inputContainerDark: {
    backgroundColor: '#1E293B',
    borderTopColor: '#334155',
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1A2138',
    backgroundColor: '#F1F5F9',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 120,
  },
  inputDark: {
    color: '#FFFFFF',
    backgroundColor: '#334155',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});