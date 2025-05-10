import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Platform,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { COLORS, FONTS, SPACING, SIZES, SHADOWS } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import * as Haptics from 'expo-haptics';
import { playSoundById, stopSound } from '../../services/audio';

const settingsBg = require('../../../assets/images/backgrounds/settings_bg.png');

type SettingsScreenNavigationProp = NavigationProp<RootStackParamList>;

const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { signOut, user } = useAuthStore();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [hapticsEnabled, setHapticsEnabled] = React.useState(true);

  const handleLogout = async () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('[SettingsScreen] Signing out...');
              await signOut();
              console.log('[SettingsScreen] Sign out complete. Resetting navigation...');
              navigation.reset({
                index: 0,
                routes: [{ name: 'AuthLoading' }],
              });
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ],
    );
  };

  const renderSettingItem = (
    icon: string,
    title: string,
    value: boolean,
    onValueChange: (value: boolean) => void,
    description?: string,
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingItemLeft}>
        <Ionicons name={icon as any} size={24} color={COLORS.primary} />
        <View style={styles.settingItemTextContainer}>
          <Text style={styles.settingItemTitle}>{title}</Text>
          {description && (
            <Text style={styles.settingItemDescription}>{description}</Text>
          )}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: COLORS.neutralLight, true: COLORS.primaryLight }}
        thumbColor={value ? COLORS.primary : COLORS.neutralMedium}
      />
    </View>
  );

  useEffect(() => {
    playSoundById('settings_menu', { isLooping: true });
    return () => { stopSound(); };
  }, []);

  return (
    <ImageBackground source={settingsBg} style={{ flex: 1 }} resizeMode="cover">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => { playSoundById('back_button'); navigation.goBack(); }}
          >
            <Ionicons name="chevron-back" size={28} color={COLORS.neutralDark} />
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            {renderSettingItem(
              'notifications-outline',
              'Push Notifications',
              notificationsEnabled,
              setNotificationsEnabled,
              'Get reminders for meditation and daily check-ins'
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App Settings</Text>
            {renderSettingItem(
              'volume-medium-outline',
              'Sound Effects',
              soundEnabled,
              setSoundEnabled,
              'Play sound effects during meditation'
            )}
            {renderSettingItem(
              'phone-portrait-outline',
              'Haptic Feedback',
              hapticsEnabled,
              setHapticsEnabled,
              'Enable vibration feedback'
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            {user?.email && (
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 8 }}>
                <Ionicons name="mail-outline" size={18} color={COLORS.primary} style={{ marginRight: 8 }} />
                <Text style={{ color: COLORS.neutralDark, fontSize: 15 }}>{user.email}</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={24} color={COLORS.error} />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  backButton: {
    marginRight: SPACING.s,
  },
  title: {
    ...FONTS.heading.h2,
    color: COLORS.neutralDark,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: COLORS.white,
    marginTop: SPACING.m,
    paddingVertical: SPACING.s,
    borderRadius: SIZES.radiusMedium,
    ...SHADOWS.small,
  },
  sectionTitle: {
    ...FONTS.heading.h3,
    color: COLORS.neutralDark,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingItemTextContainer: {
    marginLeft: SPACING.m,
    flex: 1,
  },
  settingItemTitle: {
    ...FONTS.body.regular,
    color: COLORS.neutralDark,
  },
  settingItemDescription: {
    ...FONTS.body.small,
    color: COLORS.neutralMedium,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
  },
  logoutText: {
    ...FONTS.body.regular,
    color: COLORS.error,
    marginLeft: SPACING.m,
  },
});

export default SettingsScreen;