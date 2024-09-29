import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import Checkbox from 'expo-checkbox';
import { getUserEmail } from '../api/apis';

const TodoItem = ({ item, toggleTodo, deleteTodo, updateTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(item.text);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const email = await getUserEmail();
        setUserEmail(email);
      } catch (error) {
        console.error('Failed to fetch user email:', error);
      }
    };
    fetchEmail();
  }, []);

  const handleUpdate = () => {
    console.log(`Saving edited text: ${editedText} for todo with id: ${item.id}`);
    updateTodo(editedText);
    setIsEditing(false);
  };

  return (
    <View style={styles.todoContainer}>
      {userEmail === "admin@gmail.com" && (
        <View style={styles.userInfo}>
          <Text style={styles.userEmail}>👤 {item.email}</Text>
        </View>
      )}

      <View style={styles.todoItem}>
        <Checkbox
          value={item.completed}
          onValueChange={() => toggleTodo(item.id)}
          style={styles.checkbox}
        />

        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.editInput}
              value={editedText}
              onChangeText={setEditedText}
              autoFocus
            />
            <TouchableOpacity onPress={handleUpdate} style={styles.updateButton}>
              <Text style={styles.buttonText}>✓</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => toggleTodo(item.id)} style={styles.todoTextContainer}>
            <Text style={[styles.todoText, item.completed && styles.completedTodo]}>
              {item.text}
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.buttonsContainer}>
          {!isEditing ? (
            <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButton}>
              <Text style={styles.buttonText}>✎</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity onPress={() => deleteTodo(item.id)} style={styles.deleteButton}>
            <Text style={styles.buttonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  todoContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userEmail: {
    fontSize: 14,
    color: '#555',
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
  },
  todoTextContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  todoText: {
    fontSize: 16,
  },
  completedTodo: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  editButton: {
    marginRight: 10,
  },
  deleteButton: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 18,
  },
  editContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  editInput: {
    flex: 1,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#007AFF',
    marginRight: 10,
  },
  updateButton: {
    backgroundColor: '#007AFF',
    padding: 5,
    borderRadius: 5,
  },
  checkbox: {
    marginRight: 10,
  },
});

export default TodoItem;
