import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const profile = () => {
  // Demo user info
  const router = useRouter();
  const user = {
    name: 'Meme User',
    username: 'memer123',
    email: 'memer@email.com',
    avatar: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740",
  };

  return (
    <ScrollView>
    <ImageBackground source={require('@/assets/images/meme4.webp')} style={{ flex: 1}}>
      <View style={styles.headerBg} />
      <TouchableOpacity onPress={()=>{router.push('/register')}} style={styles.profileCard}>
        <View style={styles.avatarWrapper}>
          <Image source={{uri:user.avatar}} style={styles.avatar} />
        </View>
        <Text style={styles.name}>Chưa đăng nhập <Text style={styles.verified}>✔️</Text></Text>
        <Text style={styles.email}>{user.email}</Text>
      </TouchableOpacity>
      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Profile Settings</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Change Password</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Notification</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Transaction History</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>
      <View style={{height:500,backgroundColor:'#fff',justifyContent:'center',alignItems:'center',borderRadius:20,marginHorizontal:20,marginTop:10,shadowColor:'#000',shadowOpacity:0.1,shadowOffset:{width:0,height:2},shadowRadius:4,elevation:2}}>
                    <Text>Sound của bạn</Text>
      </View>
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </ImageBackground></ScrollView>
  );
};

export default profile;

const styles = StyleSheet.create({
  headerBg: {
    height: 180,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  profileCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: -90,
    paddingTop: 70,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  avatarWrapper: {
    position: 'absolute',
    top: -45,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 5,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#eee',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#22305b',
    marginTop: 8,
    marginBottom: 2,
  },
  verified: {
    fontSize: 16,
    color: '#00b894',
  },
  email: {
    fontSize: 15,
    color: '#888',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 16,
    marginTop: 8,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    color: '#888',
    fontSize: 13,
    marginBottom: 2,
  },
  statValue: {
    color: '#00b894',
    fontWeight: 'bold',
    fontSize: 18,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 10,
    marginBottom: 8,
  },
  actionBtn: {
    backgroundColor: '#f7f8fa',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginHorizontal: 4,
    alignItems: 'center',
    minWidth: 70,
  },
  actionBtnText: {
    color: '#22305b',
    fontWeight: 'bold',
    fontSize: 14,
  },
  menuSection: {
    marginTop: 24,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    color: '#22305b',
    fontSize: 16,
    fontWeight: '500',
  },
  menuArrow: {
    color: '#bbb',
    fontSize: 22,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#ff5e57',
    paddingVertical: 14,
    marginHorizontal: 60,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth:1,
    marginTop: 10,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
});