import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { contentService, favoriteService } from '../services/api';
import { resolveImageSource } from '../theme/assets';

export const ExploreScreen = ({ navigation, route }) => {
  const initialCategory = route?.params?.category || 'Semua';

  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState('');
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    'Semua',
    'Artikel Sehat',
    'Video Edukasi',
    'Panduan Gizi',
    'Olahraga',
  ];

  const fallbackFeatured = {
    _id: '6aefd78ec5d1bd2641b58e56',
    title: 'Tips Pola Makan Seimbang Hari Ini',
    category: 'Nutrisi',
    readTime: '3 mnt baca',
    isFavorited: true,
    heroImage:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  };

  const fallbackContents = [
    {
      _id: 'exp-rec-1',
      title: '5 Kebiasaan Pagi untuk Metabolisme Cepat',
      category: 'Nutrisi',
      type: 'article',
      readTime: '4 mnt baca',
      isFavorited: false,
      heroImage:
        'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80',
    },
    {
      _id: 'exp-rec-2',
      title: 'Latihan Kardio Ringan di Rumah',
      category: 'Video Edukasi · Olahraga',
      type: 'video',
      videoDuration: '12:30',
      isFavorited: true,
      heroImage:
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const loadContents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category !== 'Semua') {
        if (category === 'Artikel Sehat') params.type = 'article';
        else if (category === 'Video Edukasi') params.type = 'video';
        else if (category === 'Panduan Gizi') params.category = 'Nutrisi';
        else params.category = category;
      }
      if (search.trim()) params.search = search.trim();

      const res = await contentService.getContents(params);
      if (res?.data && res.data.length > 0) {
        setContents(res.data);
      } else {
        setContents(fallbackContents);
      }
    } catch (err) {
      console.error(err);
      setContents(fallbackContents);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContents();
  }, [category, search]);

  const toggleBookmark = async (item) => {
    try {
      await favoriteService.toggleFavorite(item._id);
      setContents((prev) =>
        prev.map((c) =>
          c._id === item._id ? { ...c, isFavorited: !c.isFavorited } : c
        )
      );
    } catch (err) {
      console.error(err);
      setContents((prev) =>
        prev.map((c) =>
          c._id === item._id ? { ...c, isFavorited: !c.isFavorited } : c
        )
      );
    }
  };

  const featuredItem =
    contents.find((c) => c.title?.includes('Tips Pola Makan')) ||
    contents.find((c) => c.isFeatured && c.category === 'Nutrisi') ||
    contents.find((c) => c.isFeatured) ||
    contents[0] ||
    fallbackFeatured;
  const listItems =
    contents.length > 1
      ? contents.filter((c) => c._id !== featuredItem._id)
      : fallbackContents;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTextBox}>
            <Text style={styles.title}>Jelajahi hidup sehat</Text>
            <Text style={styles.subtitle}>
              Inspirasi kecil untuk sehat setiap hari
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Favorites')}
            style={styles.bookmarkHeaderBtn}
          >
            <Ionicons name="bookmark-outline" size={20} color="#183D3A" />
          </TouchableOpacity>
        </View>

        {/* Search Input with Filter Icon */}
        <View style={styles.searchWrapper}>
          <Ionicons
            name="search-outline"
            size={18}
            color="#718481"
            style={styles.searchIcon}
          />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Cari artikel, video, atau nutrisi"
            placeholderTextColor="#718481"
            style={styles.searchInput}
          />
          <TouchableOpacity activeOpacity={0.7} style={styles.filterBtn}>
            <Ionicons name="options-outline" size={18} color="#15877F" />
          </TouchableOpacity>
        </View>

        {/* Categories Horizontal */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catScroll}
        >
          {categories.map((c) => {
            const isActive = category === c;
            return (
              <TouchableOpacity
                key={c}
                onPress={() => setCategory(c)}
                style={[styles.catPill, isActive && styles.catPillActive]}
              >
                <Text
                  style={[styles.catText, isActive && styles.catTextActive]}
                >
                  {c}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Featured Hero Card (Pilihan Hari Ini) - Exact Figma SVG Parity */}
        {!search && (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              navigation.navigate('Detail', { id: featuredItem._id })
            }
            style={styles.heroCard}
          >
            <Image
              source={resolveImageSource(featuredItem.heroImage, 'mealHero')}
              style={styles.heroImage}
              resizeMode="cover"
            />

            {/* Figma gradient: #0E302B from 0.031 to 0.937 opacity */}
            <LinearGradient
              colors={['rgba(14, 48, 43, 0.0314)', 'rgba(14, 48, 43, 0.9373)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.heroGradient}
            >
              {/* Foreground Content */}
              <View style={styles.heroOverlayContent}>
                <View style={styles.heroTopRow}>
                  <View style={styles.heroBadge}>
                    <Text style={styles.heroBadgeText}>PILIHAN HARI INI</Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => toggleBookmark(featuredItem)}
                    style={styles.heroSaveBtn}
                  >
                    <Ionicons name="bookmark" size={13} color="#16877E" />
                    <Text style={styles.heroSaveText}>Simpan</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.heroBottomContent}>
                  <Text style={styles.heroTitle} numberOfLines={2}>
                    {featuredItem.title}
                  </Text>
                  <Text style={styles.heroMeta}>
                    {featuredItem.category} ·{' '}
                    {featuredItem.readTime || '3 mnt baca'}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Section: Untuk kamu */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Untuk kamu</Text>
          <Text style={styles.sectionSublabel}>Pilihan HealthyLife</Text>
        </View>

        {/* List of Content Cards */}
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color="#27C5B8" size="large" />
          </View>
        ) : (
          <View style={styles.cardsContainer}>
            {listItems.map((item, index) => {
              const isVideo = item.type === 'video';

              if (isVideo) {
                // Large Video Card layout from Figma
                return (
                  <TouchableOpacity
                    key={item._id || index}
                    activeOpacity={0.9}
                    onPress={() =>
                      navigation.navigate('Detail', { id: item._id })
                    }
                    style={styles.videoCard}
                  >
                    <View style={styles.videoImgBox}>
                      <Image
                        source={resolveImageSource(item.heroImage, 'workout')}
                        style={styles.videoImg}
                      />
                      <View style={styles.playOverlay}>
                        <Ionicons name="play" size={20} color="#15877F" />
                      </View>
                      <View style={styles.durationPill}>
                        <Text style={styles.durationText}>
                          {item.videoDuration || '12:30'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.videoBottomRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.videoCategoryText}>
                          {item.category}
                        </Text>
                        <Text style={styles.videoTitleText} numberOfLines={2}>
                          {item.title}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => toggleBookmark(item)}
                        style={styles.bookmarkBtn}
                      >
                        <Ionicons
                          name={item.isFavorited ? 'bookmark' : 'bookmark-outline'}
                          size={20}
                          color={item.isFavorited ? '#15877F' : '#718481'}
                        />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              }

              // Article Card layout from Figma
              return (
                <TouchableOpacity
                  key={item._id || index}
                  activeOpacity={0.9}
                  onPress={() =>
                    navigation.navigate('Detail', { id: item._id })
                  }
                  style={styles.articleCard}
                >
                  <Image
                    source={resolveImageSource(item.heroImage, 'mealThumb')}
                    style={styles.articleImg}
                  />

                  <View style={styles.articleContent}>
                    <View style={styles.articleTag}>
                      <Text style={styles.articleTagText}>{item.category}</Text>
                    </View>
                    <Text style={styles.articleTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text style={styles.articleMeta}>
                      {item.readTime || '4 mnt baca'}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => toggleBookmark(item)}
                    style={styles.articleBookmarkBtn}
                  >
                    <Ionicons
                      name={item.isFavorited ? 'bookmark' : 'bookmark-outline'}
                      size={20}
                      color={item.isFavorited ? '#15877F' : '#718481'}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFB',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 110,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  headerTextBox: {
    flex: 1,
    paddingRight: 10,
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
  bookmarkHeaderBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE9E7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE9E7',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#183D3A',
    padding: 0,
  },
  filterBtn: {
    paddingLeft: 8,
  },
  catScroll: {
    gap: 8,
    marginBottom: 20,
    paddingRight: 10,
  },
  catPill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE9E7',
  },
  catPillActive: {
    backgroundColor: '#27C5B8',
    borderColor: '#27C5B8',
  },
  catText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#183D3A',
  },
  catTextActive: {
    color: '#FFFFFF',
  },
  heroCard: {
    height: 176,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#0E302B',
  },
  heroImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  heroGradient: {
    flex: 1,
  },
  heroOverlayContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9098)',
    width: 100,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16877E',
    letterSpacing: 0.4,
  },
  heroSaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9294)',
    paddingHorizontal: 10,
    height: 23,
    borderRadius: 11.5,
  },
  heroSaveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16877E',
  },
  heroBottomContent: {
    gap: 3,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 26,
    letterSpacing: -0.3,
    maxWidth: 280,
  },
  heroMeta: {
    fontSize: 12,
    color: '#E1F6F1',
    fontWeight: '500',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#183D3A',
  },
  sectionSublabel: {
    fontSize: 12,
    color: '#718481',
    fontWeight: '500',
  },
  loadingBox: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  cardsContainer: {
    gap: 14,
  },
  articleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DFE9E7',
  },
  articleImg: {
    width: 90,
    height: 90,
    borderRadius: 14,
    backgroundColor: '#E6F7F5',
  },
  articleContent: {
    flex: 1,
    marginLeft: 14,
    paddingRight: 6,
  },
  articleTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#E6F7F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
  },
  articleTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15877F',
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#183D3A',
    lineHeight: 19,
  },
  articleMeta: {
    fontSize: 12,
    color: '#718481',
    marginTop: 6,
  },
  articleBookmarkBtn: {
    padding: 4,
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
  videoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DFE9E7',
  },
  videoImgBox: {
    position: 'relative',
    height: 150,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#E6F7F5',
  },
  videoImg: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationPill: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(17, 24, 39, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  durationText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  videoBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 2,
  },
  videoCategoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#15877F',
  },
  videoTitleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#183D3A',
    marginTop: 2,
  },
  bookmarkBtn: {
    padding: 6,
  },
});
