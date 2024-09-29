import { API_KEY } from './constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Emailkey = "email";
const TokenKey = "authToken";
const AdminEmail = 'admin@gmail.com'

export const storeUserToken = async (token,email) => {
  try {
    await AsyncStorage.setItem(TokenKey, token);
    await AsyncStorage.setItem(Emailkey, email);
  } catch (error) {
    console.error('Failed to store auth token:', error);
  }
};
export const getUserEmail = async () => {
  try {
    return await AsyncStorage.getItem(Emailkey);
  } catch (error) {
    console.error('Failed to store auth token:', error);
  }
};

export const getUserToken = async () => {
  try {
    const token = await AsyncStorage.getItem(TokenKey);
    return token;
  } catch (error) {
    console.error('Failed to retrieve auth token:', error);
  }
};


export const loginUser = async (email, password) => {
  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    const result = await response.json();
    if (result.error) {
      throw new Error(result.error.message);
    }

    await storeUserToken(result.idToken,email); 

    return result; 
  } catch (error) {
    throw new Error('Error Occurred: ' + error.message);
  }
};

export const signupUser = async (email, password) => {
  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || 'Unknown error');
    }

    await storeUserToken(result.idToken); 

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const logoutUser = async () => {
    try {
      console.log("logout called")
        await AsyncStorage.removeItem(Emailkey);
        await AsyncStorage.removeItem(TokenKey);
        return true;
    }
    catch(exception) {
        return false;
    }
};

export const resetPassword = async (email) => {
  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestType: 'PASSWORD_RESET',
          email: email,
        }),
      }
    );

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error.message);
    }

    return result; 
  } catch (error) {
    throw new Error('Error resetting password: ' + error.message);
  }
};

export const fetchTodos = async (userEmail) => {
  try {
    const response = await fetch(
      'https://react-native-db-bbcf8-default-rtdb.firebaseio.com/todos.json'
    );

    const data = await response.json();

    if (data) {
      // console.log(userEmail)
      // console.log(AdminEmail)
      if(userEmail === AdminEmail){
        return Object.keys(data)
          .map(key => ({ id: key, ...data[key] }));
      }else{
        return Object.keys(data)
          .map(key => ({ id: key, ...data[key] }))
          .filter(todo => todo.email === userEmail);
      }
      
    }

    return [];
  } catch (error) {
    console.error('Error fetching todos:', error);
    return [];
  }
};


export const addTodo = async (todo) => {
  try {
    const response = await fetch(
      'https://react-native-db-bbcf8-default-rtdb.firebaseio.com/todos.json',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      }
    );

    const result = await response.json();
    return { id: result.name, ...todo };
  } catch (error) {
    console.error('Error adding todo:', error);
    return null;
  }
};

export const updateTodo = async (id, updatedFields) => {
  try {
    const response = await fetch(
      `https://react-native-db-bbcf8-default-rtdb.firebaseio.com/todos/${id}.json`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFields), 
      }
    );

    const result = await response.json();
    console.log('Todo updated:', result);
    return result;
  } catch (error) {
    console.error('Error updating todo:', error);
  }
};


export const deleteTodo = async (id) => {
  try {
    await fetch(
      `https://react-native-db-bbcf8-default-rtdb.firebaseio.com/todos/${id}.json`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error deleting todo:', error);
  }
};
