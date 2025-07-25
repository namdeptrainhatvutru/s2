import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const router = useRouter();

  const handleRegister = () => {
    if (!username || !password || !rePassword) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    if (password !== rePassword) {
      Alert.alert('Thông báo', 'Mật khẩu nhập lại không khớp!');
      return;
    }
    // TODO: Gửi dữ liệu lên server để đăng ký tài khoản
    Alert.alert('Đăng ký thành công!', 'Bạn có thể đăng nhập ngay.');
    router.replace('/login');
  };

  return (
    <ImageBackground
    source={require('@/assets/images/meme2.webp')}
      style={styles.container}
    >
      <View style={styles.form}>
        <Text style={styles.title}>Đăng ký tài khoản</Text>
        <TextInput
          style={styles.input}
          placeholder="Tên đăng nhập"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#aaa"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#aaa"
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Nhập lại mật khẩu"
          value={rePassword}
          onChangeText={setRePassword}
          placeholderTextColor="#aaa"
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Đăng ký</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/login')}>
          <Text style={styles.loginText}>Đã có tài khoản? Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1930',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  form: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 14,
    padding: 24,
    
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1a2a4f',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
    marginBottom: 24,
    textAlign: 'center',
  },

  button: {
    backgroundColor: '#00b894',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 1,
  },
  loginText: {
    color: '#00b894',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: 8,
  },
});