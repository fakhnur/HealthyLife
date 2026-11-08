import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { activityService, contentService, favoriteService } from '../services/api';
import { resolveImageSource } from '../theme/assets';
import { ActivityModal } from '../components/ActivityModal';

export const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [featured, setFeatured] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const fallbackFeatured = {
    _id: '6aefd78ec5d1bd2641b58e56',
    title: 'Tips Pola Makan Seimbang',
    category: 'Hidup Seimbang',
    readTime: '3 min baca',
    heroImage:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    isFavorited: false,
  };

  const fallbackRecommendations = [
    {
      _id: 'rec-1',
      title: '5 Kebiasaan Pagi Sehat',
      category: 'Nutrisi',
      type: 'article',
      readTime: '4 min baca · Tim HealthyLife',
      heroImage:
        'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80',
    },
    {
      _id: 'rec-2',
      title: 'Gerak Ringan, Energi Seharian',
      category: 'Olahraga',
      type: 'video',
      videoDuration: '12:30',
      readTime: 'Bersama Coach Rani',
      heroImage:
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const loadHomeData = async () => {
    try {
      const [sumRes, contentRes] = await Promise.all([
        activityService.getSummary().catch(() => ({ data: null })),
        contentService.getContents({}).catch(() => ({ data: [] })),
      ]);

      if (sumRes?.data) setSummary(sumRes.data);

      if (contentRes?.data && contentRes.data.length > 0) {
        const feat =
          contentRes.data.find((c) => c.title?.includes('Tips Pola Makan')) ||
          contentRes.data.find((c) => c.isFeatured && c.category === 'Nutrisi') ||
          contentRes.data.find((c) => c.isFeatured) ||
          contentRes.data[0] ||
          fallbackFeatured;
        setFeatured(feat);

        const recs = contentRes.data.filter((c) => c._id !== feat._id).slice(0, 4);
        if (recs.length > 0) {
          setRecommendations(recs);
        } else {
          setRecommendations(fallbackRecommendations);
        }
      } else {
        setFeatured(fallbackFeatured);
        setRecommendations(fallbackRecommendations);
      }
    } catch (err) {
      console.error('Failed to load home data:', err);
      setFeatured(fallbackFeatured);
      setRecommendations(fallbackRecommendations);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadHomeData();
  };

  const today = summary?.today || {
    steps: 8750,
    targetSteps: 10000,
    caloriesBurned: 329,
    waterMl: 1750,
    activeMinutes: 45,
  };

  const stepPct = Math.min(
    100,
    Math.round((today.steps / (today.targetSteps || 10000)) * 100)
  );

  const toggleFavorite = async (item) => {
    try {
      const res = await favoriteService.toggleFavorite(item._id);
      if (featured && featured._id === item._id) {
        setFeatured({ ...featured, isFavorited: res?.isFavorited ?? !featured.isFavorited });
      }
    } catch (err) {
      console.error(err);
      if (featured && featured._id === item._id) {
        setFeatured({ ...featured, isFavorited: !featured.isFavorited });
      }
    }
  };

  // SVG circular progress calculation
  const circleRadius = 34;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const progressOffset =
    circleCircumference - (circleCircumference * Math.min(stepPct, 100)) / 100;

  const categoriesList = [
    { id: 'Semua', label: 'Semua' },
    { id: 'Artikel Sehat', label: 'Artikel Sehat', filterCat: 'Nutrisi' },
    { id: 'Video Edukasi', label: 'Video Edukasi', filterCat: 'Olahraga' },
    { id: 'Nutrisi', label: 'Nutrisi', filterCat: 'Nutrisi' },
    { id: 'Olahraga', label: 'Olahraga', filterCat: 'Olahraga' },
  ];

  const handleCategoryPress = (cat) => {
    setActiveCategory(cat.id);
    if (cat.id !== 'Semua') {
      navigation.navigate('Jelajah', { category: cat.filterCat || cat.label });
    }
  };

  const displayedFeatured = featured || fallbackFeatured;
  const displayedRecs =
    recommendations.length > 0 ? recommendations : fallbackRecommendations;

  return (
    <View style={styles.container}>
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
        {/* Top Header */}
        <View style={styles.topHeader}>
          <View style={styles.userProfileRow}>
            <Image
              source={resolveImageSource(user?.avatar, 'budiAvatar')}
              style={styles.avatarImg}
            />
            <View style={styles.greetingBox}>
              <Text style={styles.greeting}>
                Halo, {user?.name ? user.name.split(' ')[0] : 'Budi'}
              </Text>
              <Text style={styles.subgreeting}>Yuk, mulai hari lebih sehat.</Text>
            </View>
          </View>

          {/* Bookmark Button to Open Favorites */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Favorites')}
            style={styles.bookmarkHeaderBtn}
          >
            <Ionicons name="bookmark-outline" size={20} color="#183D3A" />
          </TouchableOpacity>
        </View>

        {/* Step Progress Card (Figma "Langkah hari ini") */}
        <View style={styles.progressCard}>
          {/* Circular Progress on Left */}
          <View style={styles.circleContainer}>
            <Svg width={80} height={80} viewBox="0 0 80 80">
              {/* Track */}
              <Circle
                cx="40"
                cy="40"
                r={circleRadius}
                stroke="#D4EFEB"
                strokeWidth="6"
                fill="none"
              />
              {/* Progress */}
              <Circle
                cx="40"
                cy="40"
                r={circleRadius}
                stroke="#27C5B8"
                strokeWidth="6"
                strokeDasharray={`${circleCircumference}`}
                strokeDashoffset={`${progressOffset}`}
                strokeLinecap="round"
                fill="none"
                transform="rotate(-90 40 40)"
              />
            </Svg>
            <View style={styles.circleInner}>
              <Ionicons name="footsteps" size={17} color="#27C5B8" />
              <Text style={styles.circlePctText}>
                {(today.steps / (today.targetSteps || 10000) * 100)
                  .toFixed(1)
                  .replace('.', ',')}
                %
              </Text>
            </View>
          </View>

          {/* Stats on Right */}
          <View style={styles.progressInfo}>
            <Text style={styles.progressLabel}>Langkah hari ini</Text>
            <Text style={styles.stepCount}>
              {today.steps.toLocaleString('id-ID')}{' '}
              <Text style={styles.stepTarget}>
                / {today.targetSteps.toLocaleString('id-ID')}
              </Text>
            </Text>

            <View style={styles.bottomCardRow}>
              <View style={styles.calorieRow}>
                <Ionicons name="flame-outline" size={16} color="#EC9461" />
                <Text style={styles.calorieText}>{today.caloriesBurned} kkal</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setModalVisible(true)}
                style={styles.catatBtn}
              >
                <Ionicons name="add" size={15} color="#27C5B8" />
                <Text style={styles.catatBtnText}>Catat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Category Pills (Horizontal) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categoriesList.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.8}
                onPress={() => handleCategoryPress(cat)}
                style={[
                  styles.categoryPill,
                  isActive && styles.categoryPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    isActive && styles.categoryPillTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Section: Pilihan Hari Ini */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pilihan Hari Ini</Text>
        </View>

        {displayedFeatured && (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              navigation.navigate('Detail', { id: displayedFeatured._id })
            }
            style={styles.featuredCard}
          >
            <Image
              source={resolveImageSource(displayedFeatured.heroImage, 'mealHero')}
              style={styles.featuredImg}
            />

            <View style={styles.featuredInfo}>
              <View style={styles.featuredTopRow}>
                <Text style={styles.featuredCategory}>
                  {displayedFeatured.category
                    ? displayedFeatured.category.toUpperCase()
                    : 'HIDUP SEIMBANG'}
                </Text>
                <TouchableOpacity
                  onPress={() => toggleFavorite(displayedFeatured)}
                  style={styles.bookmarkIconBtn}
                >
                  <Ionicons
                    name={
                      displayedFeatured.isFavorited ? 'bookmark' : 'bookmark-outline'
                    }
                    size={18}
                    color={
                      displayedFeatured.isFavorited ? '#27C5B8' : '#718481'
                    }
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.featuredTitle} numberOfLines={2}>
                {displayedFeatured.title}
              </Text>

              <View style={styles.featuredMetaRow}>
                <Ionicons name="time-outline" size={14} color="#718481" />
                <Text style={styles.featuredMetaText}>
                  {displayedFeatured.readTime || '3 min baca'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Section: Untuk Kamu */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Untuk Kamu</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Jelajah')}
            activeOpacity={0.7}
          >
            <Text style={styles.seeAllText}>Lihat semua</Text>
          </TouchableOpacity>
        </View>

        {/* Recommendations List */}
        <View style={styles.recsContainer}>
          {displayedRecs.map((item, index) => {
            const isVideo = item.type === 'video';
            return (
              <TouchableOpacity
                key={item._id || index}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('Detail', { id: item._id })}
                style={styles.recCard}
              >
                <View style={styles.recImgWrapper}>
                  <Image
                    source={resolveImageSource(item.heroImage, isVideo ? 'workout' : 'mealThumb')}
                    style={styles.recImg}
                  />
                  {isVideo && (
                    <>
                      <View style={styles.playOverlay}>
                        <Ionicons name="play" size={16} color="#27C5B8" />
                      </View>
                      <View style={styles.videoDurationBadge}>
                        <Text style={styles.videoDurationText}>
                          {item.videoDuration || '12:30'}
                        </Text>
                      </View>
                    </>
                  )}
                </View>
                <View style={styles.recContent}>
                  <Text style={styles.recCategory}>{item.category}</Text>
                  <Text style={styles.recTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.recSubtitle} numberOfLines={1}>
                    {item.readTime || item.author?.name || 'Tim HealthyLife'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Modal Catat Aktivitas Bottom Sheet */}
      <ActivityModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onActivitySaved={loadHomeData}
      />
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
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  userProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E6F7F5',
  },
  greetingBox: {
    marginLeft: 12,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '800',
    color: '#183D3A',
    letterSpacing: -0.3,
  },
  subgreeting: {
    fontSize: 13,
    color: '#718481',
    marginTop: 2,
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
  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDFBF7',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D4EFEB',
    marginBottom: 20,
  },
  circleContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  circleInner: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circlePctText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15877F',
    marginTop: 2,
  },
  progressInfo: {
    flex: 1,
    marginLeft: 16,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#15877F',
  },
  stepCount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#183D3A',
    marginTop: 2,
  },
  stepTarget: {
    fontSize: 13,
    fontWeight: '500',
    color: '#718481',
  },
  bottomCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  calorieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  calorieText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#183D3A',
  },
  catatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#27C5B8',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  catatBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#27C5B8',
  },
  categoryScroll: {
    gap: 8,
    marginBottom: 22,
    paddingRight: 10,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE9E7',
  },
  categoryPillActive: {
    backgroundColor: '#27C5B8',
    borderColor: '#27C5B8',
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#183D3A',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 22,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#183D3A',
    letterSpacing: -0.3,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#15877F',
  },
  featuredCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DFE9E7',
  },
  featuredImg: {
    width: 115,
    height: 115,
    borderRadius: 14,
    backgroundColor: '#E6F7F5',
  },
  featuredInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  featuredTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featuredCategory: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15877F',
    letterSpacing: 0.6,
  },
  bookmarkIconBtn: {
    padding: 2,
  },
  featuredTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#183D3A',
    lineHeight: 21,
  },
  featuredMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featuredMetaText: {
    fontSize: 12,
    color: '#718481',
  },
  recsContainer: {
    gap: 12,
  },
  recCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DFE9E7',
  },
  recImgWrapper: {
    position: 'relative',
    width: 105,
    height: 90,
    borderRadius: 14,
    overflow: 'hidden',
  },
  recImg: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E6F7F5',
  },
  playOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -16 }, { translateY: -16 }],
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoDurationBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(17, 24, 39, 0.75)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  videoDurationText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  recContent: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  recCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: '#15877F',
  },
  recTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#183D3A',
    marginTop: 3,
    lineHeight: 20,
  },
  recSubtitle: {
    fontSize: 12,
    color: '#718481',
    marginTop: 4,
  },
});
