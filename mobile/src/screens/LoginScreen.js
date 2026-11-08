import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from '../components/BrandLogo';
export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate('MainTabs');
      }
    }
  }, [isAuthenticated, navigation]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email dan kata sandi wajib diisi');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login(email.trim(), password);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          'Gagal masuk. Periksa kembali email dan kata sandi Anda.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('budi@healthylife.com');
    setPassword('password123');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Logo Row */}
        <View style={styles.brandRow}>
          <BrandLogo size={44} />
          <Text style={styles.brandTitle}>HealthyLife</Text>
        </View>

        {/* Welcome Card (Transparent Gradient Style) */}
        <View style={styles.welcomeCard}>
          <View style={styles.greetingTag}>
            <Ionicons name="sunny-outline" size={16} color="#15877F" />
            <Text style={styles.greetingTagText}>Senang bertemu lagi</Text>
          </View>
          <Text style={styles.welcomeTitle}>
            Selamat Datang{'\n'}Kembali
          </Text>
          <Text style={styles.welcomeSubtitle}>
            Lanjutkan langkah sehatmu bersama kami
          </Text>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Demo Quick Fill */}
        <TouchableOpacity onPress={fillDemo} style={styles.demoCard}>
          <View>
            <Text style={styles.demoTitle}>Akun Demo</Text>
            <Text style={styles.demoSubtitle}>budi@healthylife.com</Text>
          </View>
          <Text style={styles.demoAction}>Pakai</Text>
        </TouchableOpacity>

        {/* Form Inputs */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={18}
                color="#718481"
                style={styles.icon}
              />
              <TextInput
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  if (error) setError('');
                }}
                placeholder="nama@email.com"
                placeholderTextColor="#A0AEC0"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Kata Sandi</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color="#718481"
                style={styles.icon}
              />
              <TextInput
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  if (error) setError('');
                }}
                placeholder="Masukkan kata sandi"
                placeholderTextColor="#A0AEC0"
                secureTextEntry={!showPassword}
                style={styles.input}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={18}
                  color="#718481"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Lupa Kata Sandi */}
          <TouchableOpacity activeOpacity={0.7} style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Lupa Kata Sandi?</Text>
          </TouchableOpacity>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            style={styles.submitBtn}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitText}>Masuk</Text>
            )}
          </TouchableOpacity>

          {/* Switch to Register */}
          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Belum punya akun? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.switchLink}>Daftar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 54,
    paddingBottom: 40,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#27C5B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#183D3A',
    letterSpacing: -0.3,
  },
  welcomeCard: {
    backgroundColor: 'rgba(230, 247, 245, 0.75)',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 239, 235, 0.85)',
    marginBottom: 24,
  },
  greetingTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  greetingTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#15877F',
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#183D3A',
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: '#15877F',
    marginTop: 8,
    fontWeight: '500',
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },
  demoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAFBFB',
    borderWidth: 1,
    borderColor: '#DFE9E7',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 20,
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#183D3A',
  },
  demoSubtitle: {
    fontSize: 12,
    color: '#718481',
  },
  demoAction: {
    fontSize: 12,
    fontWeight: '700',
    color: '#27C5B8',
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#183D3A',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE9E7',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#183D3A',
  },
  eyeBtn: {
    padding: 6,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: -4,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#15877F',
  },
  submitBtn: {
    backgroundColor: '#27C5B8',
    borderRadius: 18,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  switchText: {
    fontSize: 13,
    color: '#718481',
  },
  switchLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15877F',
  },
});
