import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { favoriteService } from '../services/api';
import { resolveImageSource } from '../theme/assets';
import { useAuth } from '../context/AuthContext';

export const FavoritesScreen = ({ navigation }) => {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [format, setFormat] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fallbackFavorites = [
    {
      _id: 'fav-1',
      title: 'Tips Pola Makan Seimbang Hari Ini',
      category: 'Nutrisi',
      type: 'article',
      readTime: '3 mnt baca',
      heroImage:
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    },
    {
      _id: 'fav-2',
      title: 'Latihan Kardio Ringan di Rumah',
      category: 'Olahraga',
      type: 'video',
      videoDuration: '12:30',
      heroImage:
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const res = await favoriteService.getFavorites();
      if (res?.data && res.data.length > 0) {
        setFavorites(res.data);
      } else {
        setFavorites(fallbackFavorites);
      }
    } catch (err) {
      console.error(err);
      setFavorites(fallbackFavorites);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [isAuthenticated]);

  const onRefresh = () => {
    setRefreshing(true);
    loadFavorites();
  };

  const removeFavorite = async (id) => {
    try {
      await favoriteService.toggleFavorite(id);
      setFavorites((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
      setFavorites((prev) => prev.filter((item) => item._id !== id));
    }
  };

  const filteredFavorites = favorites.filter((item) => {
    if (format === 'all') return true;
    if (format === 'article') return item.type === 'article' || !item.type;
    if (format === 'video') return item.type === 'video';
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Top Bar with Back Button if navigation can go back */}
      {navigation.canGoBack() && (
        <View style={styles.navBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Ionicons name="chevron-back" size={20} color="#183D3A" />
            <Text style={styles.backText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Header */}
      <View style={[styles.header, !navigation.canGoBack() && styles.headerPaddingTop]}>
        <View style={styles.headerTextBox}>
          <Text style={styles.title}>Favorit</Text>
          <Text style={styles.subtitle}>
            Koleksi artikel dan panduan olahraga pilihanmu
          </Text>
        </View>

        <TouchableOpacity activeOpacity={0.8} style={styles.filterBtn}>
          <Ionicons name="options-outline" size={18} color="#15877F" />
        </TouchableOpacity>
      </View>

      {/* Format Filter Pills */}
      <View style={styles.tabRow}>
        {[
          { id: 'all', label: 'Semua' },
          { id: 'article', label: 'Artikel' },
          { id: 'video', label: 'Video' },
        ].map((t) => (
          <TouchableOpacity
            key={t.id}
            onPress={() => setFormat(t.id)}
            style={[styles.tab, format === t.id && styles.tabActive]}
          >
            <Text
              style={[styles.tabText, format === t.id && styles.tabTextActive]}
            >
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#27C5B8" size="large" />
        </View>
      ) : filteredFavorites.length === 0 ? (
        /* Empty State (Figma "HealthyLife - Favorit kosong") */
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBox}>
            <Ionicons name="bookmark-outline" size={40} color="#27C5B8" />
          </View>
          <Text style={styles.emptyHeading}>Belum Ada Favorit</Text>
          <Text style={styles.emptyDesc}>
            Tandai artikel atau video yang kamu sukai agar mudah ditemukan
            kembali di sini.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Jelajah')}
            style={styles.exploreBtn}
          >
            <Text style={styles.exploreBtnText}>Jelajahi Konten</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Saved Collection List (Figma "HealthyLife - Favorit") */
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#27C5B8']}
            />
          }
        >
          {filteredFavorites.map((item) => {
            const isVideo = item.type === 'video';
            return (
              <TouchableOpacity
                key={item._id}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('Detail', { id: item._id })}
                style={styles.card}
              >
                <View style={styles.previewBox}>
                  <Image
                    source={resolveImageSource(item.heroImage, isVideo ? 'workout' : 'mealThumb')}
                    style={styles.thumb}
                  />
                  {isVideo && (
                    <View style={styles.playBadge}>
                      <Ionicons name="play" size={14} color="#15877F" />
                    </View>
                  )}
                </View>

                <View style={styles.cardDetails}>
                  <View style={styles.catBadge}>
                    <Text style={styles.catBadgeText}>{item.category}</Text>
                  </View>

                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.title}
                  </Text>

                  <Text style={styles.cardMeta}>
                    {isVideo
                      ? item.videoDuration || '12:30'
                      : item.readTime || '3 mnt baca'}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => removeFavorite(item._id)}
                  style={styles.bookmarkAction}
                >
                  <Ionicons name="bookmark" size={20} color="#27C5B8" />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFB',
  },
  navBar: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 6,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#183D3A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 16,
  },
  headerPaddingTop: {
    paddingTop: 54,
  },
  headerTextBox: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#183D3A',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#718481',
    marginTop: 4,
  },
  filterBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE9E7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 18,
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE9E7',
  },
  tabActive: {
    backgroundColor: '#27C5B8',
    borderColor: '#27C5B8',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#183D3A',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    paddingBottom: 60,
  },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E6F7F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#183D3A',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#718481',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  exploreBtn: {
    backgroundColor: '#27C5B8',
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 22,
    width: '100%',
    alignItems: 'center',
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 14,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DFE9E7',
    alignItems: 'center',
  },
  previewBox: {
    width: 90,
    height: 90,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E6F7F5',
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  playBadge: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -14 }, { translateY: -14 }],
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardDetails: {
    flex: 1,
    marginLeft: 14,
    paddingRight: 6,
  },
  catBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E6F7F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 5,
  },
  catBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15877F',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#183D3A',
    lineHeight: 19,
  },
  cardMeta: {
    fontSize: 12,
    color: '#718481',
    marginTop: 5,
  },
  bookmarkAction: {
    padding: 6,
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
});
