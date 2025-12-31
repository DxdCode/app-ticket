import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useMessages } from '@/hooks/useMessages';
import { Message } from '@/types/type-messages';
import Input from '@/components/Input';
import Button from '@/components/Button';
import MessageBubble from '@/components/MessageBubble';
import { Ionicons } from '@expo/vector-icons';
import useUser from '@/hooks/useUser';

export default function Messages() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { loading, error, sendMessage, getMessages } = useMessages();
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (id) loadMessages();
  }, [id]);

  const loadMessages = async () => {
    if (!id) return;
    const msgs = await getMessages(id);
    if (msgs) setMessages(msgs);
  };

  const handleSend = async () => {
    if (!inputValue.trim() || !id) return;
    const result = await sendMessage(id, inputValue);
    if (result) {
      setInputValue("");
      await loadMessages();
    }
  };

  return (
    <View style={styles.container}>
      {messages.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubbles-outline" size={64} color="#cbd5e1" />
          <Text style={styles.emptyText}>Inicia una conversación</Text>
          <Text style={styles.emptySubtext}>Envía un mensaje y recibe ayuda instantánea</Text>
        </View>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble
              message={item.message}
              time={new Date(item.timeCreated)}
              role={item.role as 'user' | 'agent' | 'ia'}
              isCurrentUser={item.senderId === user?.id}
            />
          )}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#1a1d29" />
          <Text style={styles.loadingText}>Procesando...</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <View style={styles.inputWrapper}>
            <Input
              label=""
              placeholder="Escribe tu mensaje..."
              value={inputValue}
              onChangeText={setInputValue}
              editable={!loading}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              title=""
              onPress={handleSend}
              disabled={loading}
              variant="primary"
              icon={<Ionicons name="send" size={20} color="#ffffff" />}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#94a3b8',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#cbd5e1',
    marginTop: 8,
    textAlign: 'center',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginHorizontal: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#64748b',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 3,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
  },
  inputWrapper: {
    flex: 1,
  },
  buttonWrapper: {
    width: 52,
    height: 52,
  },
});