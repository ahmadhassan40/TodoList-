import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { resetPassword } from '../api/apis';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    try {
      await resetPassword(email);
      Alert.alert('Success', 'Password reset email sent');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Reset Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Input placeholder="Email" value={email} onChangeText={setEmail} />
      <Button title="Reset Password" onPress={handleResetPassword} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
});

export default ForgotPasswordScreen;
