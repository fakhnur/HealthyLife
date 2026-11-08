import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { activityService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ActivityModal } from '../components/ActivityModal';

export const ActivitiesScreen = ({ navigation }) => {
  const { isAuthenticated } = useAuth();
  const [summary, setSummary] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const fallbackActivities = [
    {
      _id: 'act-1',
      title: 'Latihan Kardio Ringan',
      category: 'Olahraga',
      subtitle: 'Video edukasi • 20 mnt',
      durationMinutes: 20,
      calories: 95,
      time: '07:30',
    },
    {
      _id: 'act-2',
      title: 'Makan Siang Seimbang',
      category: 'Nutrisi',
      subtitle: 'Dari artikel nutrisi',
      calories: 480,
      time: '12:45',
    },
  ];

  const loadData = async () => {
    try {
      const [sumRes, actRes] = await Promise.all([
        activityService.getSummary().catch(() => ({ data: null })),
        activityService.getActivities().catch(() => ({ data: [] })),
      ]);

      if (sumRes?.data) setSummary(sumRes.data);
      if (actRes?.data && actRes.data.length > 0) {
        setActivities(actRes.data);
      } else {
        setActivities(fallbackActivities);
      }
    } catch (err) {
      console.error('Failed to load activities data:', err);
      setActivities(fallbackActivities);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isAuthenticated]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleDelete = (id) => {
    Alert.alert('Hapus Aktivitas', 'Apakah kamu yakin ingin menghapus catatan aktivitas ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            await activityService.deleteActivity(id);
            loadData();
          } catch (err) {
            console.error(err);
            setActivities((prev) => prev.filter((a) => a._id !== id));
          }
        },
      },
    ]);
  };

  const handleAddWater = async () => {
    try {
      if (activityService.updateWater) {
        await activityService.updateWater(250);
      }
      loadData();
    } catch (err) {
      console.error(err);
      if (summary?.today) {
        setSummary({
          ...summary,
          today: {
            ...summary.today,
            waterMl: (summary.today.waterMl || 1800) + 250,
          },
        });
      }
    }
  };

  const today = summary?.today || {
    steps: 8750,
    targetSteps: 10000,
    caloriesBurned: 329,
    waterMl: 1800,
    activeMinutes: 45,
  };

  const defaultWeekDays = [
    { dayName: 'Sen', dayNumber: 2, hasDot: true, isToday: false },
    { dayName: 'Sel', dayNumber: 3, hasDot: true, isToday: false },
    { dayName: 'Rab', dayNumber: 4, hasDot: true, isToday: false },
    { dayName: 'Kam', dayNumber: 5, hasDot: true, isToday: false },
    { dayName: 'Jum', dayNumber: 6, hasDot: true, isToday: false },
    { dayName: 'Sab', dayNumber: 7, hasDot: true, isToday: true },
    { dayName: 'Min', dayNumber: 8, hasDot: false, isToday: false },
  ];

  const weekStrip =
    summary?.weekStrip && summary.weekStrip.length === 7
      ? summary.weekStrip.map((d) => ({
          dayName: d.dayName,
          dayNumber: d.dayNumber,
          hasDot: d.hasActivity || d.isCompleted,
          isToday: d.isToday,
        }))
      : defaultWeekDays;

  const stepPct = Math.min(
    100,
    Math.round((today.steps / (today.targetSteps || 10000)) * 100)
  );

  const waterInLiters = ((today.waterMl || 1800) / 1000).toFixed(1);

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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTextBox}>
            <Text style={styles.title}>Aktivitas</Text>
            <Text style={styles.subtitle}>
              Pantau kemajuan dan catat pola hidup sehatmu
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setModalVisible(true)}
            style={styles.addBtn}
          >
            <Ionicons name="add" size={26} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Date Selector Header */}
        <View style={styles.dateRow}>
          <Text style={styles.dateLabel}>
            {new Date().toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.todayLink}>Hari ini</Text>
          </TouchableOpacity>
        </View>

        {/* Week Strip Horizontal */}
        <View style={styles.weekStripContainer}>
          {weekStrip.map((day, idx) => {
            const isToday = day.isToday;
            return (
              <View
                key={idx}
                style={[styles.dayItem, isToday && styles.dayItemToday]}
              >
                <Text style={[styles.dayName, isToday && styles.dayNameToday]}>
                  {day.dayName}
                </Text>
                <Text style={[styles.dayNum, isToday && styles.dayNumToday]}>
                  {day.dayNumber}
                </Text>
                <View
                  style={[
                    styles.dayDot,
                    day.hasDot
                      ? isToday
                        ? styles.dayDotWhite
                        : styles.dayDotActive
                      : styles.dayDotInactive,
                  ]}
                />
              </View>
            );
          })}
        </View>

        {/* 2x2 Metrics Grid */}
        <View style={styles.metricsGrid}>
          {/* Card 1: Langkah */}
          <View style={styles.metricCard}>
            <View style={styles.metricHead}>
              <Ionicons name="footsteps-outline" size={18} color="#27C5B8" />
              <Text style={styles.metricTitle}>Langkah</Text>
            </View>
            <Text style={styles.metricValue}>
              {today.steps.toLocaleString('id-ID')}{' '}
              <Text style={styles.metricSubvalue}>
                / {(today.targetSteps || 10000).toLocaleString('id-ID')}
              </Text>
            </Text>
            <View style={styles.progressBarTrack}>
              <View
                style={[styles.progressBarFill, { width: `${stepPct}%` }]}
              />
            </View>
          </View>

          {/* Card 2: Kalori */}
          <View style={styles.metricCard}>
            <View style={styles.metricHead}>
              <Ionicons name="flame-outline" size={18} color="#27C5B8" />
              <Text style={styles.metricTitle}>Kalori</Text>
            </View>
            <Text style={styles.metricValue}>
              {today.caloriesBurned}{' '}
              <Text style={styles.metricUnit}>kkal</Text>
            </Text>
            <Text style={styles.metricFooterText}>Energi terbakar</Text>
          </View>

          {/* Card 3: Air Minum */}
          <View style={styles.metricCard}>
            <View style={styles.metricHead}>
              <Ionicons name="water-outline" size={18} color="#27C5B8" />
              <Text style={styles.metricTitle}>Air Minum</Text>
            </View>
            <Text style={styles.metricValue}>
              {waterInLiters}{' '}
              <Text style={styles.metricSubvalue}>/ 2.0 L</Text>
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleAddWater}
              style={styles.addWaterBtn}
            >
              <Text style={styles.addWaterBtnText}>+250ml</Text>
            </TouchableOpacity>
          </View>

          {/* Card 4: Waktu Aktif */}
          <View style={styles.metricCard}>
            <View style={styles.metricHead}>
              <Ionicons name="timer-outline" size={18} color="#27C5B8" />
              <Text style={styles.metricTitle}>Waktu Aktif</Text>
            </View>
            <Text style={styles.metricValue}>
              {today.activeMinutes}{' '}
              <Text style={styles.metricUnit}>mnt</Text>
            </Text>
            <Text style={styles.metricFooterText}>Terus bergerak!</Text>
          </View>
        </View>

        {/* Section: Riwayat Hari Ini */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Riwayat Hari Ini</Text>
        </View>

        {/* History List */}
        <View style={styles.historyList}>
          {activities.map((act) => {
            const isNutrisi = act.category === 'Nutrisi';
            const isHidrasi =
              act.category === 'Hidrasi' || act.category === 'Air Minum';
            const iconName = isNutrisi
              ? 'restaurant-outline'
              : isHidrasi
              ? 'water-outline'
              : 'barbell-outline';

            const subtitle =
              act.subtitle ||
              (act.category === 'Olahraga'
                ? `Video edukasi • ${act.durationMinutes || 20} mnt`
                : isNutrisi
                ? 'Dari artikel nutrisi'
                : 'Pencatatan hidrasi harian');

            const timeStr =
              act.time ||
              (act.createdAt
                ? new Date(act.createdAt).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '10:00');

            return (
              <View key={act._id} style={styles.historyCard}>
                <View style={styles.historyIconBox}>
                  <Ionicons name={iconName} size={22} color="#15877F" />
                </View>

                <View style={styles.historyInfo}>
                  <Text style={styles.historyItemTitle}>{act.title}</Text>
                  <Text style={styles.historyItemSubtitle}>{subtitle}</Text>
                </View>

                <View style={styles.historyMetaCol}>
                  <Text style={styles.historyTime}>{timeStr}</Text>
                  {act.calories > 0 && (
                    <View style={styles.historyCalBadge}>
                      <Text style={styles.historyCalBadgeText}>
                        {act.calories} kkal
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Modal Bottom Sheet */}
      <ActivityModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onActivitySaved={loadData}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTextBox: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#183D3A',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#718481',
    marginTop: 4,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#27C5B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#183D3A',
  },
  todayLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#15877F',
  },
  weekStripContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#DFE9E7',
    marginBottom: 20,
  },
  dayItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 18,
    minWidth: 40,
  },
  dayItemToday: {
    backgroundColor: '#27C5B8',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 24,
  },
  dayName: {
    fontSize: 11,
    color: '#718481',
    fontWeight: '600',
  },
  dayNameToday: {
    color: '#FFFFFF',
  },
  dayNum: {
    fontSize: 16,
    fontWeight: '700',
    color: '#183D3A',
    marginVertical: 4,
  },
  dayNumToday: {
    color: '#FFFFFF',
  },
  dayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  dayDotActive: {
    backgroundColor: '#27C5B8',
  },
  dayDotWhite: {
    backgroundColor: '#FFFFFF',
  },
  dayDotInactive: {
    backgroundColor: '#E5E7EB',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DFE9E7',
    minHeight: 124,
    justifyContent: 'space-between',
  },
  metricHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricTitle: {
    fontSize: 13,
    color: '#718481',
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#183D3A',
    marginVertical: 4,
  },
  metricSubvalue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#718481',
  },
  metricUnit: {
    fontSize: 14,
    fontWeight: '600',
    color: '#718481',
  },
  progressBarTrack: {
    height: 5,
    backgroundColor: '#EDF3F2',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#27C5B8',
    borderRadius: 3,
  },
  metricFooterText: {
    fontSize: 12,
    color: '#718481',
    marginTop: 4,
  },
  addWaterBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#E6F7F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  addWaterBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15877F',
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#183D3A',
    letterSpacing: -0.3,
  },
  historyList: {
    gap: 12,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#DFE9E7',
  },
  historyIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#E6F7F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyInfo: {
    flex: 1,
    marginLeft: 14,
  },
  historyItemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#183D3A',
  },
  historyItemSubtitle: {
    fontSize: 12,
    color: '#718481',
    marginTop: 2,
  },
  historyMetaCol: {
    alignItems: 'flex-end',
    gap: 6,
  },
  historyTime: {
    fontSize: 12,
    color: '#718481',
    fontWeight: '500',
  },
  historyCalBadge: {
    backgroundColor: '#E6F7F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  historyCalBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15877F',
  },
});
