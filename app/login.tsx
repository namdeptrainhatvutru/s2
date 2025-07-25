import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
      router.push('/');
    
  };

  return (
    <ImageBackground
      source={require('@/assets/images/meme.webp')}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Text style={styles.title}>SOUND MEME</Text>
        <Text style={styles.subtitle}>Đăng nhập để tiếp tục</Text>
      </View>
      <View style={styles.form}>
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
        <View style={styles.rememberRow}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setRemember(!remember)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkboxBox, remember && styles.checkboxBoxChecked]}>
              {remember && <Text style={styles.checkboxTick}>✓</Text>}
            </View>
            <Text style={styles.rememberText}>Ghi nhớ đăng nhập</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.registerText}>Đăng ký tài khoản</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.forgotText}>Quên mật khẩu?</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Kenhtao.net</Text>
      </View>
    </ImageBackground>
  );
};

export default login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
    marginBottom: 4,
  },
  subtitle: {
    color: '#b0c4d4',
    fontSize: 16,
    marginBottom: 12,
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
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#00b894',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxBoxChecked: {
    backgroundColor: '#00b894',
    borderColor: '#00b894',
  },
  checkboxTick: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: -2,
  },
  rememberText: {
    color: '#b0c4d4',
    fontSize: 15,
  },
  registerText: {
    color: '#00b894',
    fontWeight: 'bold',
    fontSize: 15,
    textDecorationLine: 'underline',
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
  forgotText: {
    color: '#b0c4d4',
    textAlign: 'right',
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    marginTop: 14,
  },
  footerText: {
    color: '#b0c4d4',
    fontSize: 13,
    letterSpacing: 1,
  },
});