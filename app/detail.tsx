import { Audio } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router/build/hooks';
import React, { useRef, useState } from 'react';
import { Alert, Image, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import WheelColorPicker from 'react-native-wheel-color-picker';
const categories = [
  'Anime & Manga', 'Games', 'Memes', 'Movies', 'Music', 'Politics', 'Pranks', 'Reactions',
  'Sound Effects', 'Sports', 'Television', 'Tiktok Trends', 'Viral', 'Whatsapp Audios'
];

const detail = () => {
  const { id, name, source, category, color } = useLocalSearchParams();

  const [pressedId, setPressedId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const router = useRouter();

  // State cho edit modal
  const [editVisible, setEditVisible] = useState(false);
  const [editName, setEditName] = useState(name as string);
  const [editCategory, setEditCategory] = useState(category as string);
  const [editColor, setEditColor] = useState(color as string);
  const [showCategories, setShowCategories] = useState(false);

  const playSound = async (source: string, id: number) => {
    if (isPlaying && soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      } catch (e) {
        console.warn('Failed to stop/unload previous sound:', e);
      }
    }

    setPressedId(id);
    setIsPlaying(true);

    try {
      const { sound } = await Audio.Sound.createAsync({ uri: `${source}` });
      soundRef.current = sound;
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
          sound.unloadAsync();
        }
      });
      await sound.playAsync();
      setTimeout(() => setPressedId(null), 150);
    } catch (error) {
      console.error('Error playing sound:', error);
      setIsPlaying(false);
      setPressedId(null);
    }
  };

  const handleDel = async () => {
    try {
      const response = await fetch(`http://192.168.1.25:3000/files/${id}`, { method: 'DELETE' });
      if (response.ok) {
        Alert.alert('Xóa thành công');
        router.back();
      }
    } catch (error) {
      console.error('Error handling press:', error);
    }
  };

  const handleEdit = () => {
    setEditVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!editName || !editCategory || !editColor) {
      Alert.alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    try {
      const response = await fetch(`http://192.168.1.25:3000/files/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          category: editCategory,
          color: editColor,
        }),
      });
      if (response.ok) {
        Alert.alert('Cập nhật thành công!');
        setEditVisible(false);
      } else {
        Alert.alert('Cập nhật thất bại!');
      }
    } catch (err) {
      Alert.alert('Có lỗi xảy ra!');
    }
  };

  return (
    <View style={styles.stepContainer}>
      <View style={styles.titleContainer}>
        <Pressable onPress={() => playSound(`${source}`, Number(id))}>
          <Image
            style={{
              backgroundColor: `${color}`,
              borderRadius: 100,
              height: 100,
              width: 100,
            }}
            source={
              pressedId === Number(id)
                ? require('@/assets/images/button2.png')
                : require('@/assets/images/button1.png')
            }
          />
        </Pressable>
        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18, marginTop: 8 }}>{name}</Text>
        <Text style={{ color: '#666', marginBottom: 8 }}>{category}</Text>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
          <TouchableOpacity onPress={handleDel}>
            <Image style={{ width: 28, height: 28 }} source={require('@/assets/images/delete.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleEdit}>
            <Image style={{ width: 28, height: 28 }} source={require('@/assets/images/edit.png')} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal Edit */}
      <Modal visible={editVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.editModal}>
            <Text style={styles.modalTitle}>Chỉnh sửa âm thanh</Text>
            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="Tên âm thanh"
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={[styles.colorSelector, { backgroundColor: editColor, marginBottom: 12 }]}
              onPress={() => setShowCategories(false)}
            >
              <Text style={styles.colorSelectorText}>Màu hiện tại</Text>
            </TouchableOpacity>
            <WheelColorPicker
              color={editColor}
              onColorChange={setEditColor}
              thumbSize={24}
              sliderSize={24}
              gapSize={16}
              autoResetSlider
            />
            <TouchableOpacity
              style={styles.categorySelector}
              onPress={() => setShowCategories(!showCategories)}
            >
              <Text style={editCategory ? styles.selectedCategoryText : styles.placeholderText}>
                {editCategory || 'Chọn danh mục'}
              </Text>
            </TouchableOpacity>
            {showCategories && (
              <View style={styles.dropdownContainer}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryItem,
                      editCategory === cat && styles.categoryItemSelected,
                    ]}
                    onPress={() => {
                      setEditCategory(cat);
                      setShowCategories(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.categoryItemText,
                        editCategory === cat && styles.categoryItemTextSelected,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setEditVisible(false)}>
                <Text style={styles.modalButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleSaveEdit}>
                <Text style={styles.modalButtonText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default detail;

const styles = StyleSheet.create({
  stepContainer: {
    marginBottom: 16,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editModal: {
    
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'stretch',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  colorSelector: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  colorSelectorText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  categorySelector: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  placeholderText: {
    color: '#999',
    fontSize: 16,
  },
  selectedCategoryText: {
    color: '#333',
    fontSize: 16,
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 4,
    marginBottom: 8,
    maxHeight: 180,
  },
  categoryItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryItemSelected: {
    backgroundColor: '#f0f8ff',
  },
  categoryItemText: {
    fontSize: 16,
    color: '#333',
  },
  categoryItemTextSelected: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  modalButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 100,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});