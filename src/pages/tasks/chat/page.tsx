import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, List, Typography, Spin, Avatar } from 'antd';
import { SendOutlined, UserOutlined } from '@ant-design/icons';
import io from 'socket.io-client';
import { API_URL } from '../../../App';
import { useLocation } from 'react-router';

const { Text } = Typography;

interface Message {
  id: string;
  text: string;
  sender: {
    id: number;
    name: string;
  };
  timestamp: Date;
  read: boolean;
}

const ChatPage: React.FC = () => {
  const [socket, setSocket] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  
  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const userId = Number(queryParams.get('userId') || '0');
  const userName = queryParams.get('userName') || 'Пользователь';
  const taskId = Number(queryParams.get('taskId') || '0');
  const isEmbedded = queryParams.get('embedded') === 'true';
  
  // Initialize socket connection
  useEffect(() => {
    if (!userId) return;
    
    // Connect to the socket server
    const newSocket = io(API_URL, {
      query: { 
        userId: userId,
        userName: userName,
        taskId: taskId || 'general'
      }
    });
    
    setSocket(newSocket);
    
    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [userId, userName, taskId]);
  
  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return;
    
    // Listen for incoming messages
    socket.on('message', (newMessage: Message) => {
      setMessages(prev => [...prev, newMessage]);
    });
    
    // Load previous messages for this task
    socket.emit('getMessages', { taskId: taskId || 'general' }, (historyMessages: Message[]) => {
      setMessages(historyMessages);
      setLoading(false);
    });
    
    // Mark messages as read when the chat is opened
    socket.emit('markAsRead', { 
      userId: userId,
      taskId: taskId || 'general'
    });
    
    return () => {
      socket.off('message');
    };
  }, [socket, userId, taskId]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSend = () => {
    if (inputMessage.trim() && socket) {
      // Create message object
      const newMessage = {
        text: inputMessage,
        taskId: taskId || 'general',
        sender: {
          id: userId,
          name: userName
        }
      };
      
      // Send message through socket
      socket.emit('sendMessage', newMessage);
      
      // Clear input field
      setInputMessage('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  
  const formatTime = (timestamp: Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: isEmbedded ? '100%' : 'calc(100vh - 64px)',
      padding: isEmbedded ? 0 : '20px',
      maxWidth: isEmbedded ? '100%' : '800px',
      margin: isEmbedded ? 0 : '0 auto',
      background: '#fff',
      borderRadius: isEmbedded ? 0 : '8px',
      overflow: 'hidden',
      boxShadow: isEmbedded ? 'none' : '0 2px 10px rgba(0, 0, 0, 0.08)'
    }}>
      {/* Chat header */}
      {!isEmbedded && (
        <div style={{ 
          padding: '16px 20px', 
          borderBottom: '1px solid #f0f0f0',
          fontWeight: 'bold',
          fontSize: '18px'
        }}>
          {taskId ? `Чат задачи #${taskId}` : 'Общий чат'}
        </div>
      )}
      
      {/* Messages area */}
      <div style={{ 
        flex: 1, 
        overflow: 'auto', 
        padding: '16px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Spin size="large" />
          </div>
        ) : messages.length === 0 ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            flex: 1,
            color: '#999',
            flexDirection: 'column'
          }}>
            <span style={{ fontSize: '48px', marginBottom: '16px' }}>💬</span>
            <p>Сообщений пока нет. Начните общение!</p>
          </div>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={messages}
            renderItem={(message) => {
              const isCurrentUser = message.sender.id === userId;
              
              return (
                <List.Item style={{ 
                  justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                  padding: '8px 0'
                }}>
                  <div style={{ 
                    maxWidth: '70%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isCurrentUser ? 'flex-end' : 'flex-start'
                  }}>
                    {!isCurrentUser && (
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        marginBottom: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        <Avatar 
                          size="small" 
                          icon={<UserOutlined />} 
                          style={{ marginRight: '6px' }}
                        />
                        {message.sender.name}
                      </div>
                    )}
                    
                    <div style={{
                      backgroundColor: isCurrentUser ? '#1890ff' : '#f0f2f5',
                      color: isCurrentUser ? 'white' : 'rgba(0, 0, 0, 0.85)',
                      padding: '10px 14px',
                      borderRadius: '16px',
                      borderBottomLeftRadius: isCurrentUser ? '16px' : '4px',
                      borderBottomRightRadius: isCurrentUser ? '4px' : '16px',
                      wordBreak: 'break-word'
                    }}>
                      {message.text}
                    </div>
                    
                    <Text type="secondary" style={{ fontSize: '12px', marginTop: '4px' }}>
                      {formatTime(message.timestamp)}
                    </Text>
                  </div>
                </List.Item>
              );
            }}
          />
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div style={{ 
        padding: '16px', 
        borderTop: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Input
          placeholder="Введите сообщение..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ flex: 1 }}
        />
        <Button 
          type="primary" 
          icon={<SendOutlined />} 
          onClick={handleSend}
        />
      </div>
    </div>
  );
};

export default ChatPage;