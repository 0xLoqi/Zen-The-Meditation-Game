import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Pressable, Modal, TouchableWithoutFeedback, ImageBackground, SafeAreaView } from 'react-native';
import { Video } from 'expo-av';
import PatternBackground from '../../components/PatternBackground';
import FloatingLeaves from '../../components/FloatingLeaves';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { getFriendCode, setFriendCode } from '../../firebase/user';
// import { generateReferralCode } from '../../firebase/auth'; // Uncomment if using generateReferralCode
import { useNavigation, useRoute } from '@react-navigation/native';
// import LinearGradient from 'react-native-linear-gradient'; // Uncomment if using gradients
import MiniZenni from '../../components/MiniZenni';
import { useUserStore } from '../../store/userStore';
import ProfileHeader from '../../components/profile/ProfileHeader';
import AchievementsCard from '../../components/profile/AchievementsCard';
import GlowPointButton from '../../components/profile/GlowPointButton';
import TopFriendsRow from '../../components/profile/TopFriendsRow';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getXPForNextLevel } from '../../firebase/meditation';

// Placeholder assets
const miniZenni = require('../../../assets/images/minizenni.png');
const glowbagIcon = require('../../../assets/images/glowbags/Glowbag_common.png');
const badgeIcon = require('../../../assets/images/badges/locked_achievement.png');
const editIcon = require('../../../assets/images/minizenni.png'); // fallback to Zenni image for now
const animatedBg = require('../../../assets/images/backgrounds/animated_darkmode_bg.mp4');
const bgImg = require('../../../assets/images/backgrounds/home_screen_bg_3.png');

const userData = { username: 'ZenMaster' }; // Placeholder for user data

const InfoModal = ({ visible, onClose, title, description }) => (
  <Modal visible={visible} transparent animationType="fade">
    <TouchableWithoutFeedback onPress={onClose} accessible accessibilityLabel="Close info modal">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent} accessible accessibilityLabel={title}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalDesc}>{description}</Text>
          <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn} accessibilityLabel="Close">
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);

const styles = StyleSheet.create({
  customizeBtn: { flexDirection:'row', alignItems:'center', backgroundColor:'#FFD580', borderRadius:18, padding:14, marginTop:8, alignSelf:'center' },
  customizeBtnText: { color:'#232014', fontWeight:'bold', fontSize:18 },
  container: {
    flex: 1,
    // backgroundColor: '#FFF8E9', // REMOVE or comment out this line
  },
  scrollContentWithBackArrow: { padding: 16, paddingBottom: 100, paddingTop: 56 },
  heroPaneCentered: { alignItems: 'center', justifyContent: 'center', marginBottom: 8, marginTop: 32 },
  profileZenniLargeModern: { width: 160, height: 160, resizeMode: 'contain', alignSelf: 'center' },
  userNameModern: { alignSelf: 'center', fontWeight: 'bold', fontSize: 26, color: '#F5E9D0', marginBottom: 12, marginTop: 4 },
  glowbagIcon: { position: 'relative', marginRight: 8 },
  glowbagImage: { width: 40, height: 40 },
  unreadBadge: { position: 'absolute', top: -4, right: -4, backgroundColor: '#FF8C42', borderRadius: 8, paddingHorizontal: 4 },
  unreadText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  progressRing: { alignItems: 'center', marginBottom: 8 },
  ringPlaceholder: { width: 110, height: 110, borderRadius: 55, borderWidth: 7, borderColor: '#FFD580', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', ...SHADOW },
  levelText: { fontWeight: 'bold', fontSize: 36, color: '#FF8C42' },
  streakRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  flame: { fontSize: 22, marginRight: 4 },
  streakText: { fontWeight: 'bold', fontSize: 20, color: '#FF8C42' },
  badgesBar: { flexDirection: 'row', marginBottom: 8 },
  badgeTouchable: { marginRight: 8 },
  badgeIcon: { width: 40, height: 40 },
  friendChip: { backgroundColor: '#FFD580', borderRadius: CARD_RADIUS, paddingHorizontal: 12, justifyContent: 'center', marginLeft: 8, ...SHADOW },
  friendChipText: { color: '#7A5C00', fontWeight: 'bold' },
  customizeButtonContainer: { alignItems: 'center', marginVertical: 16 },
  customizeButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(35,32,20,0.95)', borderRadius: 24, paddingVertical: 14, paddingHorizontal: 32, ...SHADOW },
  customizeButtonLabel: { fontWeight: 'bold', fontSize: 18, color: '#FFD580' },
  editText: { color: '#FF8C42', fontWeight: 'bold' },
  currencyRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  tokenPill: { backgroundColor: '#FFD580', borderRadius: CARD_RADIUS, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, marginRight: 12, ...SHADOW },
  tokenText: { fontWeight: 'bold', color: '#7A5C00', marginRight: 4, fontSize: 18 },
  plusText: { color: '#FF8C42', fontWeight: 'bold', fontSize: 22 },
  glowbagNotification: { position: 'absolute', top: 0, right: 48, padding: 8, zIndex: 1 },
  glowbagSilhouette: { width: 32, height: 32, opacity: 0.3 },
  questPanel: { backgroundColor: '#fff', borderRadius: CARD_RADIUS, padding: 16, marginBottom: 8, ...SHADOW },
  questTitle: { fontWeight: 'bold', fontSize: 17, marginBottom: 8 },
  questRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  questText: { flex: 1 },
  progressBar: { flex: 2, height: 8, backgroundColor: '#FFD580', borderRadius: 4, marginHorizontal: 8 },
  progressFill: { width: '60%', height: '100%', backgroundColor: '#FF8C42', borderRadius: 4 },
  claimButton: { backgroundColor: '#FF8C42', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4 },
  claimText: { color: '#fff', fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDesc: {
    fontSize: 14,
    color: '#7A5C00',
    marginBottom: 20,
  },
  modalCloseBtn: {
    backgroundColor: '#FF8C42',
    padding: 10,
    borderRadius: 5,
  },
  modalCloseText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  leavesBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    pointerEvents: 'none',
  },
  friendCodeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  friendCodeLabel: { fontWeight: 'bold', marginRight: 4 },
  friendCodeValue: { fontFamily: 'monospace', color: '#FF8C42', marginRight: 8 },
  copyButton: { padding: 4 },
  backArrow: { position: 'absolute', top: 56, left: 20, zIndex: 10, padding: 8, backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 20, shadowColor: '#FFD580', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 4 },
  backArrowIcon: { textShadowColor: '#FFD580', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
  friendCodePill: { flexDirection: 'row', alignSelf: 'center', alignItems: 'center', backgroundColor: '#FFF8E9', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6, marginBottom: 18, marginTop: 2, shadowColor: '#FFD580', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 },
  friendCodeLabelModern: { color: '#7A5C00', fontWeight: 'bold', marginRight: 4 },
  friendCodeValueModern: { color: '#FF8C42', fontWeight: 'bold', marginRight: 6 },
  copyButtonModern: { padding: 2 },
  statItemModern: { alignItems: 'center', flex: 1 },
  statValueModern: { fontWeight: 'bold', fontSize: 20, color: '#FFD580', marginTop: 2 },
  statLabelModern: { fontSize: 12, color: '#F5E9D0', marginTop: 2 },
  questPanelModern: { backgroundColor: 'rgba(35,32,20,0.95)', borderRadius: CARD_RADIUS, padding: 20, marginBottom: 16, ...SHADOW },
  questTitleModern: { fontWeight: 'bold', fontSize: 18, marginBottom: 12, color: '#FFD580' },
  questRowModern: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  questTextModern: { flex: 1, fontWeight: 'bold', color: '#F5E9D0' },
  progressBarModern: { flex: 2, height: 8, backgroundColor: '#FFD580', borderRadius: 4, marginHorizontal: 8 },
  progressFillModern: { width: '60%', height: '100%', backgroundColor: '#FF8C42', borderRadius: 4 },
  claimButtonModern: { backgroundColor: '#2C2617', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 6 },
  claimButtonActive: { backgroundColor: '#FFD580' },
  claimTextModern: { color: '#FFD580', fontWeight: 'bold' },
  claimTextActive: { color: '#232014' },
  customizeButtonContainerBottom: { alignItems: 'center', marginVertical: 24, marginBottom: 40 },
  animatedBg: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  userNamePill: {
    alignSelf: 'center',
    backgroundColor: 'rgba(35,32,20,0.95)',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 8,
    marginBottom: 12,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  backButton: {
    position: 'absolute',
    top: 18,
    left: 18,
    zIndex: 50,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  pillCard: {},
});

const pillCard = [
  styles.pillCard,
  { backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 18, padding: 18, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }
];

const ProfileScreen = () => {
  const [modal, setModal] = useState({ visible: false, title: '', description: '' });
  const [friendCode, setFriendCodeState] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const userData = useUserStore((s) => s.userData);
  const isOwn = !route.params?.friend;
  const profile = isOwn ? userData : route.params.friend;
  const globalRank = profile?.globalRank || '#1234';
  const darkMode = true; // Hardcoded for now

  useEffect(() => {
    // Replace with actual user ID logic if available
    const userId = 'demoUserId';
    getFriendCode(userId).then(code => {
      if (code) {
        setFriendCodeState(code);
      } else {
        // const newCode = generateReferralCode();
        // setFriendCode(userId, newCode).then(() => setFriendCodeState(newCode));
      }
    });
  }, []);
  const showModal = (title, description) => setModal({ visible: true, title, description });
  const closeModal = () => setModal({ ...modal, visible: false });

  const handleEditAvatar = () => {
    alert('Edit avatar coming soon!');
  };
  const handleFriendsPress = () => {
    alert('Friends screen coming soon!');
  };
  const handleCopyCode = () => {
    Clipboard.setStringAsync(friendCode);
  };

  // Pills: dark or light mode
  const pillCard = [
    styles.pillCard,
    darkMode
      ? { backgroundColor: 'rgba(35,32,20,0.95)', borderRadius: 18, padding: 18, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }
      : { backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 18, padding: 18, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }
  ];

  if (!profile) return <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text>Loading...</Text></View>;

  return (
    <ImageBackground source={bgImg} style={{flex:1}} resizeMode="cover">
      <SafeAreaView style={{flex:1, paddingTop: insets.top, paddingBottom: insets.bottom}}>
        {/* Back Button */}
        <TouchableOpacity
          style={[styles.backButton, { top: insets.top + 18, left: insets.left + 18, backgroundColor: darkMode ? 'rgba(35,32,20,0.95)' : '#fff' }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color={darkMode ? '#FFD580' : '#232014'} />
        </TouchableOpacity>
        <ScrollView contentContainerStyle={{padding:20, paddingTop: 32}} showsVerticalScrollIndicator={false}>
          <ProfileHeader
            profile={profile}
            isOwn={isOwn}
            streak={profile.streak ?? 0}
            level={profile.level}
            xp={profile.xp}
            xpForNext={getXPForNextLevel((profile.level || 1) - 1)}
            globalRank={globalRank}
            lastMeditationDate={profile.lastMeditationDate}
          />
          <AchievementsCard achievements={profile.achievements} darkMode={darkMode} />
          <GlowPointButton profile={profile} isOwn={isOwn} darkMode={darkMode} />
          <TopFriendsRow friends={profile.topFriends} darkMode={darkMode} />
          {isOwn && (
            <TouchableOpacity
              style={[styles.customizeBtn, { backgroundColor: darkMode ? '#000' : '#FFD580' }]}
              onPress={()=>navigation.navigate('Store')}
            >
              <Ionicons name="settings-outline" size={24} color={darkMode ? '#FFD580' : '#232014'} style={{marginRight:8}} />
              <Text style={[styles.customizeBtnText, { color: darkMode ? '#FFD580' : '#232014' }]}>Customize</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const CARD_RADIUS = 16;
const SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 3,
};

export default ProfileScreen; 