import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { resolveImageSource } from '../theme/assets';

export const ProfileScreen = ({ navigation }) => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Konfirmasi Keluar', 'Apakah kamu yakin ingin keluar dari akun?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const menuItems = [
    {
      id: 'favorites',
      label: 'Koleksi Favorit',
      subtitle: 'Artikel dan video tersimpan',
      icon: 'bookmark-outline',
      onPress: () => navigation.navigate('Favorites'),
    },
    {
      id: 'targets',
      label: 'Target Kesehatan',
      subtitle: 'Langkah, hidrasi, dan kalori',
      icon: 'flag-outline',
      onPress: () => navigation.navigate('Aktivitas'),
    },
    {
      id: 'notifications',
      label: 'Pengingat & Notifikasi',
      subtitle: 'Jadwal minum air dan bergerak',
      icon: 'notifications-outline',
    },
    {
      id: 'help',
      label: 'Pusat Bantuan',
      subtitle: 'FAQ dan panduan aplikasi',
      icon: 'help-circle-outline',
    },
    {
      id: 'about',
      label: 'Tentang HealthyLife',
      subtitle: 'Versi 1.0.0 · Hidup Sehat Setiap Hari',
      icon: 'information-circle-outline',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Profil</Text>
        <Text style={styles.subtitle}>Kelola akun dan target kesehatanmu</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* User Card */}
        <View style={styles.userCard}>
          <Image
            source={resolveImageSource(user?.avatar, 'budiAvatar')}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'Budi'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'budi@healthylife.id'}</Text>
            <View style={styles.badge}>
              <Ionicons name="shield-checkmark" size={13} color={colors.tealDeep} />
              <Text style={styles.badgeText}>Member Aktif</Text>
            </View>
          </View>
        </View>

        {/* Stats Preview */}
        <View style={styles.statsCard}>
          <View style={styles.statCol}>
            <Text style={styles.statVal}>8.750</Text>
            <Text style={styles.statLabel}>Langkah</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statVal}>329</Text>
            <Text style={styles.statLabel}>Kkal</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statVal}>1.8 L</Text>
            <Text style={styles.statLabel}>Air Minum</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Pengaturan & Aktivitas</Text>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={item.onPress}
              style={styles.menuItem}
            >
              <View style={styles.menuIconBox}>
                <Ionicons name={item.icon} size={20} color={colors.tealDeep} />
              </View>
              <View style={styles.menuInfo}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSub}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.muted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Auth Action */}
        {isAuthenticated ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleLogout}
            style={styles.logoutBtn}
          >
            <Ionicons name="log-out-outline" size={18} color={colors.danger} />
            <Text style={styles.logoutText}>Keluar dari Akun</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Login')}
            style={styles.loginBtn}
          >
            <Ionicons name="log-in-outline" size={18} color="#FFFFFF" />
            <Text style={styles.loginBtnText}>Masuk ke Akun</Text>
          </TouchableOpacity>
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
  header: {
    paddingTop: 54,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF3F2',
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
  scroll: {
    padding: 20,
    paddingBottom: 110,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DFE9E7',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E6F7F5',
  },
  userInfo: {
    marginLeft: 14,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#183D3A',
  },
  userEmail: {
    fontSize: 13,
    color: '#718481',
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E6F7F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#15877F',
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#EDF9F6',
    borderRadius: 18,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#D4EFEB',
    marginBottom: 20,
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statVal: {
    fontSize: 17,
    fontWeight: '700',
    color: '#183D3A',
  },
  statLabel: {
    fontSize: 12,
    color: '#15877F',
    marginTop: 2,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#D4EFEB',
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#DFE9E7',
    marginBottom: 20,
  },
  menuSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#718481',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginVertical: 10,
    paddingHorizontal: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F6F5',
  },
  menuIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#E6F7F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuInfo: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#183D3A',
  },
  menuSub: {
    fontSize: 12,
    color: '#718481',
    marginTop: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.danger,
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: '#27C5B8',
    borderRadius: 16,
  },
  loginBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
