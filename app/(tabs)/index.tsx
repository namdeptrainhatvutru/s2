import { API } from '@env';
import { useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Clipboard,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
interface Sound {
  id: number;
  name: string;
  color: string;
  source: string;
  category: string;
}
let playingPromise: Promise<void> = Promise.resolve();
export default function HomeScreen() {
  const [data, setData] = useState<Sound[]>([]);
  const [pressedId, setPressedId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [search, setSearch] = useState('');
  const soundRef = useRef<Audio.Sound | null>(null);
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  
  const fetchData = async () => {
    try {
      const response = await fetch(`${API}/files`);
    
      const json = await response.json();
      setData(json.files);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const playSound = async (source: string, id: number) => {
    // Đảm bảo các thao tác âm thanh diễn ra tuần tự
    playingPromise = playingPromise.then(async () => {
      try {
        // Dừng và giải phóng âm cũ nếu có
        if (soundRef.current) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }
      } catch (e) {
        console.warn('Failed to stop/unload previous sound:', e);
      }

      setPressedId(id);
      setIsPlaying(true);

      try {
        const { sound } = await Audio.Sound.createAsync({ uri: source });
        soundRef.current = sound;

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
            sound.unloadAsync();
            setPressedId(null);
          }
        });

        await sound.playAsync();
        setTimeout(() => setPressedId(null), 150);
      } catch (error) {
        setIsPlaying(false);
        setPressedId(null);
        console.error('Error playing sound:', error);
      }
    });
  };

  useEffect(() => {
    fetchData();
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const categories = ['Tất cả', ...Array.from(new Set(data.map((item) => item.category)))];

  const filteredData = data.filter((item) => {
    const matchCategory =
      selectedCategory === 'Tất cả' || item.category === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: 'Check out this sound I uploaded!',
        url: 'http://192.168.1.25:3000/sounds/ten-file.mp3',
        title: 'My Sound',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Dismissed');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  const banner = [
    { id: 1, image: "https://i.pinimg.com/736x/66/45/c3/6645c30331a0dc5d9565b34749e01f3c.jpg" },
    { id: 2, image: "https://i.pinimg.com/1200x/04/ea/8e/04ea8ef416dc8e7fac77138b918217f0.jpg" },
    { id: 3, image: "https://i.pinimg.com/736x/ef/4b/28/ef4b285f696f5a7a049287e63ce47cf5.jpg" },
  ]
  

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % banner.length;
      scrollRef.current?.scrollTo({
        x: index * (400 + 10),
        animated: true,
      });
      setCurrentIndex(index); // Cập nhật UI nếu cần (không ảnh hưởng interval)
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  const handleDownload = async (url: string, name: string) => {
    try {
      const fileUri = FileSystem.documentDirectory + name;
      const downloadResumable = FileSystem.createDownloadResumable(url, fileUri);
      const result = await downloadResumable.downloadAsync();
      if (result && result.uri) {
        alert('Đã tải về: ' + result.uri);
        // Linking.openURL(result.uri) nếu muốn mở file
      } else {
        alert('Tải file thất bại!');
      }
    } catch (error) {
      alert('Tải file thất bại!');
      console.error(error);
    }
  };
  
  return (
    <FlatList
      ListHeaderComponent={
        <>
          <StatusBar barStyle="dark-content" />
          {/* Header */}
          <ImageBackground source={require('@/assets/images/meme.webp')} style={styles.header}>
            <Text style={styles.headerTitle}>Meme Sound</Text>
          </ImageBackground>
          {/* Search */}

          <View style={styles.searchContainer}>
            <Image 
              source={require('@/assets/images/search.png')} 
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm âm thanh..."
              onChangeText={setSearch}
              value={search}
              placeholderTextColor="#999"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>×</Text>
              </TouchableOpacity>
            )}
          </View>
          {/* Banner */}
          <View style={styles.bannerContainer}>
            <ScrollView
              pagingEnabled={false}
              scrollEventThrottle={16}
              ref={scrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {banner.map((item) => (
                <Image
                  key={item.id}
                  source={{ uri: item.image }}
                  style={{ width: 400, height: 200, borderRadius: 10, marginRight: 10 }}
                />
              ))}
            </ScrollView>
          </View>
          {/* Categories */}
          <View style={styles.categoryContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScroll}
            >
              {categories.map((cat) => (
                <Pressable
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={[
                    styles.categoryButton,
                    selectedCategory === cat && styles.categoryButtonSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === cat && styles.categoryTextSelected,
                    ]}
                  >
                    {cat}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </>
      }
      numColumns={3}
      data={filteredData}
      keyExtractor={(item) => item.id.toString()}
      columnWrapperStyle={styles.columnWrapper}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <View style={styles.soundCard}>
          {/* Sound Button */}
          <Pressable 
            onPress={() => playSound(item.source, item.id)}
            style={styles.soundButton}
          >
            <View style={[styles.colorCircle, { backgroundColor: item.color }]}>
              <Image
                style={styles.buttonImage}
                source={
                  pressedId === item.id
                    ? require('@/assets/images/button2.png')
                    : require('@/assets/images/button1.png')
                }
              />
            </View>
          </Pressable>
          
          {/* Sound Name */}
          <TouchableOpacity
            onPress={() => {
              router.push(
                `/detail?id=${item.id}&name=${item.name}&source=${item.source}&category=${
                  item.category
                }&color=${encodeURIComponent(item.color)}`
              );
            }}
            style={styles.nameContainer}
          >
            <Text style={styles.soundName} numberOfLines={1} ellipsizeMode="tail">
              {item.name}
            </Text>
          </TouchableOpacity>
          
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
              <Image style={styles.actionIcon} source={require('@/assets/images/share.png')} />
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => {
                Clipboard.setString(item.source);
              }}
              style={styles.iconButton}
            >
              <Image style={styles.actionIcon} source={require('@/assets/images/link.png')} />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => handleDownload(item.source, `${item.name}.mp3`)} style={styles.iconButton}>
              <Image style={styles.actionIcon} source={require('@/assets/images/cloud.png')} />
            </TouchableOpacity>
          </View>
        </View>
      )}
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Không tìm thấy âm thanh nào</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 12,
    marginBottom: 12,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    tintColor: '#999',
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 20,
    color: '#999',
    fontWeight: 'bold',
  },
  categoryContainer: {
    marginBottom: 12,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#eee',
    borderRadius: 20,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryButtonSelected: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    color: '#333',
    fontWeight: '500',
    fontSize: 14,
  },
  categoryTextSelected: {
    color: '#fff',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  listContent: {

    paddingBottom: 20,
  },
  soundCard: {
    width: '30%',
    marginBottom: 24,
    alignItems: 'center',
  },
  soundButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  colorCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  nameContainer: {
    marginTop: 8,
    width: '100%',
  },
  soundName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    gap: 8,
  },
  iconButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    width: 20,
    height: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  bannerContainer: {
    height: 200,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 16,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
  },
});
