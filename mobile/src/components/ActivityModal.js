import React, { useState } from 'react';
import {
  Modal,
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
import { activityService } from '../services/api';

export const ActivityModal = ({ visible, onClose, onActivitySaved }) => {
  const [category, setCategory] = useState('Olahraga');
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('30');
  const [calories, setCalories] = useState('120');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Olahraga', 'Nutrisi', 'Air Minum'];

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Nama aktivitas wajib diisi');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Map 'Air Minum' to 'Hidrasi' for backend compatibility
      const backendCategory = category === 'Air Minum' ? 'Hidrasi' : category;

      await activityService.createActivity({
        title: title.trim(),
        category: backendCategory,
        durationMinutes: parseInt(duration, 10) || 0,
        calories: parseInt(calories, 10) || 0,
        notes: notes.trim(),
      });

      setTitle('');
      setDuration('30');
      setCalories('120');
      setNotes('');
      if (onActivitySaved) onActivitySaved();
      onClose();
    } catch (err) {
      console.error(err);
      setError('Gagal menyimpan aktivitas. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.sheet}>
          <View style={styles.handleBar} />

          <View style={styles.header}>
            <Text style={styles.title}>Catat Aktivitas</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#718481" />
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Category selection */}
            <View style={styles.categoryRow}>
              {categories.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setCategory(c)}
                  style={[
                    styles.categoryTab,
                    category === c && styles.categoryTabActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      category === c && styles.categoryTextActive,
                    ]}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Title */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nama Aktivitas</Text>
              <TextInput
                value={title}
                onChangeText={(t) => {
                  setTitle(t);
                  if (error) setError('');
                }}
                placeholder="Jalan pagi"
                placeholderTextColor="#A0AEC0"
                style={styles.input}
              />
            </View>

            {/* Duration & Calories in a row */}
            <View style={[styles.fieldGroup, styles.row]}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.label}>Durasi (mnt)</Text>
                <TextInput
                  value={duration}
                  onChangeText={setDuration}
                  keyboardType="numeric"
                  placeholder="30"
                  placeholderTextColor="#A0AEC0"
                  style={styles.input}
                />
              </View>

              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.label}>Kalori (kkal)</Text>
                <TextInput
                  value={calories}
                  onChangeText={setCalories}
                  keyboardType="numeric"
                  placeholder="120"
                  placeholderTextColor="#A0AEC0"
                  style={styles.input}
                />
              </View>
            </View>

            {/* Notes */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Catatan</Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Jalan santai di sekitar rumah."
                placeholderTextColor="#A0AEC0"
                multiline
                numberOfLines={3}
                style={[styles.input, styles.textArea]}
              />
            </View>

            {/* Action Buttons */}
            <TouchableOpacity
              onPress={handleSave}
              disabled={loading}
              style={styles.saveBtn}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveBtnText}>Simpan ke Riwayat</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Batal</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(24, 61, 58, 0.45)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 36,
    maxHeight: '88%',
  },
  handleBar: {
    width: 36,
    height: 4,
    backgroundColor: '#DFE9E7',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#183D3A',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F6F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    marginBottom: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE9E7',
  },
  categoryTabActive: {
    backgroundColor: '#27C5B8',
    borderColor: '#27C5B8',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#183D3A',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  fieldGroup: {
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#183D3A',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE9E7',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#183D3A',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveBtn: {
    backgroundColor: '#27C5B8',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 4,
  },
  cancelText: {
    color: '#718481',
    fontSize: 14,
    fontWeight: '600',
  },
});
