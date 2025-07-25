import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import WheelColorPicker from 'react-native-wheel-color-picker';

export default function TabTwoScreen() {
  const [visible, setVisible] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [color, setColor] = useState('#ff3b30');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const router = useRouter();
  
  // Danh sách category có sẵn
  const categories = [
    'Anime & Manga',
    'Games',
    'Memes',
    'Movies',
    'Music',
    'Politics',
    'Pranks',
    'Reactions',
    'Sound Effects',
    'Sports',
    'Television',
    'Tiktok Trends',
    'Viral',
    'Whatsapp Audios'
  ];

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/mpeg',
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setSelectedFile(file);
        console.log('Đã chọn file:', file.name);
      }
    } catch (err) {
      console.log('Lỗi chọn file:', err);
    }
  };

  const handleAddSound = async () => {
    if (!selectedFile) {
      Alert.alert('Thông báo', 'Vui lòng chọn file âm thanh trước!');
      return;
    }

    if (!name || !color || !category) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    const fileUri = selectedFile.uri.startsWith('file://') ? selectedFile.uri : `file://${selectedFile.uri}`;

    const formData = new FormData();
    formData.append('audio', {
      uri: fileUri,
      name: selectedFile.name,
      type: 'audio/mpeg',
    } as any);
    formData.append('name', name);
    formData.append('color', color);
    formData.append('category', category);

    try {
      // Hiển thị thông báo đang tải
      Alert.alert('Đang tải...', 'Vui lòng đợi trong giây lát');

      const response = await fetch('http://192.168.1.25:3000/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Upload thành công:', data);
        Alert.alert('Thành công', 'Thêm file âm thanh thành công!');
        setSelectedFile(null);
        setName('');
        setColor('#ff3b30');
        setCategory('');
      } else {
        const errorText = await response.text();
        console.log('Lỗi upload:', errorText);
        Alert.alert('Lỗi', `Không thể tải lên: ${errorText}`);
      }
    } catch (err) {
      console.log('Lỗi upload:', err);
      Alert.alert('Lỗi kết nối', 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau!');
    }
  };

  return (
    <ImageBackground source={require('@/assets/images/meme3.webp')} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        

        <View style={styles.formContainer}>
          {/* Preview */}
          <View style={styles.previewContainer}>
            <View 
              style={[
                styles.colorPreview, 
                {backgroundColor: color}
              ]}
            >
              <Image
                source={require('@/assets/images/button1.png')}
                style={styles.previewIcon}
              />
            </View>
            <Text style={styles.previewText}>
              {name || 'Tên âm thanh'}
            </Text>
            <Text style={styles.previewCategory}>
              {category || 'Danh mục'}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tên âm thanh</Text>
            <TextInput 
              placeholder="Nhập tên âm thanh..." 
              value={name} 
              onChangeText={setName} 
              style={styles.input}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Danh mục</Text>
            <TouchableOpacity 
              style={styles.categorySelector} 
              onPress={() => setShowCategories(!showCategories)}
            >
              <Text style={category ? styles.selectedCategoryText : styles.placeholderText}>
                {category || 'Chọn danh mục'}
              </Text>
              <Image 
                source={require('@/assets/images/down-arrow.png')} 
                style={[
                  styles.dropdownIcon,
                  showCategories && styles.dropdownIconRotated
                ]}
              />
            </TouchableOpacity>
            
            {showCategories && (
              <Modal
                visible={showCategories}
                transparent={true}
                animationType="fade"
              >
                <TouchableWithoutFeedback onPress={() => setShowCategories(false)}>
                  <View style={styles.modalCategoryOverlay}>
                    <View style={styles.dropdownContainer}>
                      <View style={styles.dropdownHeader}>
                        <Text style={styles.dropdownTitle}>Chọn danh mục</Text>
                      </View>
                      <FlatList
                        data={categories}
                        keyExtractor={(item) => item}
                        style={styles.categoryList}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={[
                              styles.categoryItem,
                              category === item && styles.categoryItemSelected
                            ]}
                            onPress={() => {
                              setCategory(item);
                              setShowCategories(false);
                            }}
                          >
                            <Text
                              style={[
                                styles.categoryItemText,
                                category === item && styles.categoryItemTextSelected
                              ]}
                            >
                              {item}
                            </Text>
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Màu sắc</Text>
            <TouchableOpacity 
              style={[styles.colorSelector, {backgroundColor: color}]} 
              onPress={() => setVisible(true)}
            >
              <Text style={styles.colorSelectorText}>Chọn màu</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>File âm thanh</Text>
            <TouchableOpacity style={styles.fileSelector} onPress={pickFile}>
              <Text style={styles.fileSelectorText}>
                {selectedFile ? selectedFile.name : 'Chọn file âm thanh'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Submit button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleAddSound}>
            <Text style={styles.submitButtonText}>Thêm âm thanh</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Color Picker Modal */}
      <Modal visible={visible} animationType="fade" transparent={true}>
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => {
            setVisible(false);
            console.log('Màu đã chọn:', color);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Chọn màu sắc</Text>
              <WheelColorPicker
                color={color}
                onColorChange={(newColor) => {
                  setColor(newColor);
                }}
                thumbSize={30}
                sliderSize={30}
                gapSize={20}
                autoResetSlider
              />
              
            </View>
          </View>
        </Pressable>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 20,
    justifyContent: 'center',
    paddingTop: 40,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  colorPreview: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewIcon: {
    width: 80,
    height: 80,
    borderRadius: 100,
  },
  previewText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  previewCategory: {
    fontSize: 14,
    color: '#666',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  categorySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  placeholderText: {
    color: '#999',
    fontSize: 16,
  },
  selectedCategoryText: {
    color: '#333',
    fontSize: 16,
  },
  dropdownIcon: {
    width: 20,
    height: 20,
    tintColor: '#666',
    transform: [{ rotate: '0deg' }],
  },
  dropdownIconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  dropdownContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    maxHeight: 300,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modalCategoryOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  categoryList: {
    maxHeight: 250,
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
  colorSelector: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSelectorText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
  fileSelector: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  fileSelectorText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex:1,
    backgroundColor: 'transparent',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalContent: {
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
