import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { contentService, favoriteService } from '../services/api';
import { resolveImageSource } from '../theme/assets';
import { ActivityModal } from '../components/ActivityModal';

export const DetailScreen = ({ navigation, route }) => {
  const { id } = route.params;

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const fallbackDetail = {
    _id: id || 'detail-1',
    title: 'Tips Pola Makan Seimbang Hari Ini',
    category: 'Nutrisi',
    readTime: '3 mnt baca',
    heroImage:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    author: {
      name: 'Dian Pratiwi, S.Gz.',
      role: 'Ahli gizi',
    },
    body: 'Makan seimbang tak harus rumit. Mulai dari isi piring yang beragam dan porsi sesuai kebutuhanmu.',
    stepsHeading: 'Susun piring, langkah demi langkah',
    steps: [
      {
        title: 'Perbanyak warna.',
        description:
          'Isi sekitar setengah piring dengan sayur dan buah untuk serat dan vitamin.',
      },
      {
        title: 'Lengkapi sisanya.',
        description:
          'Pilih nasi atau umbi sebagai karbohidrat, serta ikan, telur, tahu, atau tempe.',
      },
    ],
    quote:
      '“Bukan soal makan sempurna, tetapi kebiasaan baik yang bisa kamu ulangi.”',
    adviceHeading: 'Jangan lupakan air putih',
    advice:
      'Minum air secara teratur dan batasi minuman manis. Sesuaikan porsi dengan rasa lapar dan aktivitasmu.',
  };

  useEffect(() => {
    const loadDetail = async () => {
      try {
        setLoading(true);
        const res = await contentService.getContentById(id);
        if (res?.data) {
          setContent(res.data);
          setIsFavorited(!!res.data.isFavorited);
        } else {
          setContent(fallbackDetail);
        }
      } catch (err) {
        console.warn('[DetailScreen] Could not load content from API, showing fallback:', err?.message);
        setContent(fallbackDetail);
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [id]);

  const handleToggleFavorite = async () => {
    try {
      const res = await favoriteService.toggleFavorite(id);
      setIsFavorited(res?.isFavorited ?? !isFavorited);
    } catch (err) {
      console.error(err);
      setIsFavorited(!isFavorited);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${content?.title || 'HealthyLife'} - Baca selengkapnya di aplikasi HealthyLife!`,
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#27C5B8" size="large" />
      </View>
    );
  }

  const data = content || fallbackDetail;

  return (
    <View style={styles.container}>
      {/* Top Navigation Row */}
      <View style={styles.navBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={20} color="#183D3A" />
          <Text style={styles.backText}>Kembali</Text>
        </TouchableOpacity>

        <View style={styles.actionRow}>
          <TouchableOpacity onPress={handleShare} style={styles.iconAction}>
            <Ionicons name="share-outline" size={20} color="#183D3A" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleToggleFavorite}
            style={[styles.iconAction, isFavorited && styles.iconActionFavorited]}
          >
            <Ionicons
              name={isFavorited ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={isFavorited ? '#FFFFFF' : '#183D3A'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <Image
          source={resolveImageSource(data.heroImage, 'mealHero')}
          style={styles.heroImg}
        />
        <View style={styles.bodyContent}>
          {/* Category Pill */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{data.category}</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{data.title}</Text>

          {/* Author & Date Metadata */}
          <View style={styles.authorRow}>
            <Ionicons name="checkmark-circle" size={17} color="#27C5B8" />
            <Text style={styles.authorName}>
              {data.author?.name || 'Dian Pratiwi, S.Gz.'} ·{' '}
              {data.author?.role || 'Ahli gizi'}
            </Text>
          </View>
          <Text style={styles.dateMeta}>
            7 November 2026 · {data.readTime || '3 mnt baca'}
          </Text>

          {/* Body Paragraph */}
          <Text style={styles.leadText}>
            {data.body || data.excerpt || fallbackDetail.body}
          </Text>

          {/* Step Cards / Section */}
          <View style={styles.stepsSection}>
            <Text style={styles.sectionHeading}>
              {data.stepsHeading || 'Susun piring, langkah demi langkah'}
            </Text>

            {(data.steps && data.steps.length > 0
              ? data.steps
              : fallbackDetail.steps
            ).map((st, i) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>
                  <Text style={styles.bulletTitle}>{st.title} </Text>
                  {st.description}
                </Text>
              </View>
            ))}
          </View>

          {/* Quote Block */}
          <View style={styles.quoteCard}>
            <View style={styles.quoteBar} />
            <Text style={styles.quoteText}>
              {data.quote || fallbackDetail.quote}
            </Text>
          </View>

          {/* Advice Block */}
          <View style={styles.adviceBlock}>
            <Text style={styles.adviceHeading}>
              {data.adviceHeading || fallbackDetail.adviceHeading}
            </Text>
            <Text style={styles.adviceText}>
              {data.advice || fallbackDetail.advice}
            </Text>
          </View>

          {/* Log Activity Action Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setModalVisible(true)}
            style={styles.logActivityBtn}
          >
            <Text style={styles.logActivityText}>
              Catat aktivitas ini ke tracker
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal Bottom Sheet */}
      <ActivityModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBar: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#183D3A',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  iconAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE9E7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconActionFavorited: {
    backgroundColor: '#27C5B8',
    borderColor: '#27C5B8',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  heroImg: {
    width: '100%',
    height: 230,
    borderRadius: 22,
    backgroundColor: '#E6F7F5',
    marginBottom: 18,
  },
  bodyContent: {
    gap: 12,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E6F7F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15877F',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#183D3A',
    lineHeight: 32,
    letterSpacing: -0.4,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#183D3A',
  },
  dateMeta: {
    fontSize: 13,
    color: '#718481',
  },
  leadText: {
    fontSize: 15,
    color: '#183D3A',
    lineHeight: 23,
    marginTop: 6,
  },
  stepsSection: {
    marginTop: 10,
    gap: 10,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '800',
    color: '#183D3A',
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bulletDot: {
    fontSize: 16,
    color: '#15877F',
    marginRight: 8,
    lineHeight: 22,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: '#183D3A',
    lineHeight: 22,
  },
  bulletTitle: {
    fontWeight: '700',
    color: '#183D3A',
  },
  quoteCard: {
    flexDirection: 'row',
    backgroundColor: '#EDFBF7',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    alignItems: 'center',
  },
  quoteBar: {
    width: 3,
    height: '100%',
    backgroundColor: '#27C5B8',
    borderRadius: 2,
    marginRight: 12,
  },
  quoteText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#15877F',
    lineHeight: 21,
    fontStyle: 'italic',
  },
  adviceBlock: {
    gap: 6,
    marginTop: 4,
  },
  adviceHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#183D3A',
  },
  adviceText: {
    fontSize: 14,
    color: '#183D3A',
    lineHeight: 22,
  },
  logActivityBtn: {
    backgroundColor: '#27C5B8',
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  logActivityText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
