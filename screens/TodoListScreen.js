import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView,TextInput,Button } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import TodoItem from '../components/TodoItem';
import { fetchTodos, addTodo as addTodoToDB, updateTodo as updateTodoInDB, deleteTodo as deleteTodoFromDB,logoutUser, getUserEmail } from '../api/apis';


const Tab = createMaterialTopTabNavigator();

const TodoListScreen = ({ navigation }) => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [userEmail,setUserEmail] = useState('');

  useEffect(() => {
    const getTodos = async () => {
      const userEmail = await getUserEmail();
      setUserEmail(userEmail)
      try {
        const fetchedTodos = await fetchTodos(userEmail);
        setTodos(fetchedTodos);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to fetch todos',
        });
      }
    };

    getTodos();
  }, []);

  const addTodo = async () => {
    if (newTodo.trim() !== '') {
      try {
        const newTodoItem = { text: newTodo, completed: false,email: userEmail};
        const addedTodo = await addTodoToDB(newTodoItem);
        setTodos([...todos, addedTodo]);
        setNewTodo('');
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Task added successfully',
        });
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to add todo',
        });
      }
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find(todo => todo.id === id);
      if (todo) {
        const updatedTodo = { ...todo, completed: !todo.completed };
        await updateTodoInDB(id, updatedTodo);
        setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)));
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update task',
      });
    }
  };

  const deleteTodo = async (id) => {
    try {
      await deleteTodoFromDB(id);
      setTodos(todos.filter(todo => todo.id !== id));
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Task deleted successfully',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to delete Task',
      });
    }
  };


const updateTodo = async (id, newText) => {
 
  try {
    
    const currentTodo = todos.find(todo => todo.id === id);
    if (!currentTodo) {
      throw new Error('Task not found');
    }
   
    const updatedTodo = { ...currentTodo, text: newText };
    
    const result = await updateTodoInDB(id, updatedTodo);
  
    console.log('API Update Result:', result);
  
    setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)));

   
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Task updated successfully',
    });
  } catch (error) {
    console.error('Error updating todo:', error); 
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'Failed to update Task',
    });
  }
};


const handleLogout = async () => {
  const success = await logoutUser();
  if (success) {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  } else {
    console.error('Failed to log out');
  }
};

  const TodoList = ({ completed }) => (
    <FlatList
      data={todos.filter(todo => todo.completed === completed)}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TodoItem
          item={item}
          toggleTodo={() => toggleTodo(item.id)}
          deleteTodo={() => deleteTodo(item.id)}
          updateTodo={(newText) => updateTodo(item.id, newText)}
        />
      )}
      ListEmptyComponent={
        <Text style={styles.emptyListText}>
          {completed ? "No completed tasks yet" : "No current tasks. Add one!"}
        </Text>
      }
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Task Manager</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Add a new task"
          value={newTodo}
          onChangeText={setNewTodo}
          style={styles._input_}
        />
        <Button title="Add" onPress={addTodo} style={styles.addButton} />
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#8E8E93',
          tabBarIndicatorStyle: { backgroundColor: '#007AFF' },
          tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold' },
        }}
      >
        <Tab.Screen name="Current" children={() => <TodoList completed={false} />} />
        <Tab.Screen name="Completed" children={() => <TodoList completed={true} />} />
      </Tab.Navigator>
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  logoutButton: {
    padding: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom:15
  },
  _input_: {
    flex:1,
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal:20,
    paddingVertical:10,
    fontSize: 16,
  },
  addButton: {
    width: 60,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 10,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#8E8E93',
  },
});

export default TodoListScreen;
