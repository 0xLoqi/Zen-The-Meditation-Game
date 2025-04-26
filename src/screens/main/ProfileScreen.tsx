import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Pressable, Modal, TouchableWithoutFeedback } from 'react-native';
import PatternBackground from '../../components/PatternBackground';
import FloatingLeaves from '../../components/FloatingLeaves';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { getFriendCode, setFriendCode } from '../../firebase/user';
import { generateReferralCode } from '../../firebase/auth';
import { useNavigation } from '@react-navigation/native';
// import LinearGradient from 'react-native-linear-gradient'; // Uncomment if using gradients

// Placeholder assets
const miniZenni = require('../../../assets/images/minizenni.png');
const glowbagIcon = require('../../../assets/images/glowbags/Glowbag_common.png');
const badgeIcon = require('../../../assets/images/badges/locked_achievement.png');
const editIcon = require('../../../assets/images/minizenni.png'); // fallback to Zenni image for now

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

const ProfileScreen = () => {
  const [modal, setModal] = useState({ visible: false, title: '', description: '' });
  const [friendCode, setFriendCodeState] = useState('');
  const navigation = useNavigation();
  useEffect(() => {
    // Replace with actual user ID logic if available
    const userId = 'demoUserId';
    getFriendCode(userId).then(code => {
      if (code) {
        setFriendCodeState(code);
      } else {
        const newCode = generateReferralCode();
        setFriendCode(userId, newCode).then(() => setFriendCodeState(newCode));
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
  return (
    <PatternBackground>
      <FloatingLeaves count={6} style={styles.leavesBackground} />
      <View style={[styles.container, { backgroundColor: 'transparent' }]}>
        <TouchableOpacity style={styles.backArrow} onPress={() => navigation.goBack()} accessibilityLabel="Back" accessible>
          <Ionicons name="chevron-back" size={36} color="#FF8C42" style={styles.backArrowIcon} />
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.scrollContentWithBackArrow}>
          {/* 1. Hero Pane */}
          <View style={styles.heroPaneCentered}>
            <Image source={miniZenni} style={styles.profileZenniLarge} />
          </View>
          <Text style={styles.userName}>{userData.username}</Text>
          {friendCode ? (
            <View style={styles.friendCodeRow}>
              <Text style={styles.friendCodeLabel}>Friend Code:</Text>
              <Text style={styles.friendCodeValue}>{friendCode}</Text>
              <TouchableOpacity onPress={handleCopyCode} style={styles.copyButton} accessibilityLabel="Copy friend code" accessible>
                <Ionicons name="copy-outline" size={18} color="#FF8C42" />
              </TouchableOpacity>
            </View>
          ) : null}

          {/* 2. Progress Ring */}
          <View style={styles.progressRing}>
            <View style={styles.ringPlaceholder}>
              <Text style={styles.levelText}>12</Text>
            </View>
            <View style={styles.streakRow}>
              <Text style={styles.flame}>🔥</Text>
              <Text style={styles.streakText}>21</Text>
            </View>
          </View>

          {/* 3. Stats & Badges Bar */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgesBar}>
            {[...Array(5)].map((_, i) => (
              <TouchableOpacity key={i} style={styles.badgeTouchable} activeOpacity={0.7} onPress={() => showModal('Locked Badge', 'Unlock this badge by completing special achievements!')} accessibilityLabel="Locked badge info" accessible>
                <Image source={badgeIcon} style={styles.badgeIcon} />
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.friendChip} onPress={handleFriendsPress} activeOpacity={0.7} accessibilityLabel="Friends list" accessible>
              <Text style={styles.friendChipText}>Friends: 3</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* 4. Customize Tiles */}
          <View style={styles.customizeTiles}>
            {['Outfit', 'Headgear', 'Aura', 'Companion'].map((label, i) => (
              <TouchableOpacity key={i} style={styles.customizeTile} activeOpacity={0.7} accessibilityLabel={`Edit ${label}`} accessible>
                <Text style={styles.customizeTileLabel}>{label}</Text>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 5. Zen Tokens & Glowbags Row */}
          <View style={styles.currencyRow}>
            <TouchableOpacity style={styles.tokenPill} activeOpacity={0.7} onPress={() => showModal('Zen Tokens', 'Tokens are used to unlock premium features and restore streaks.')} accessibilityLabel="Zen Tokens info" accessible>
              <Text style={styles.tokenText}>120</Text>
              <Text style={styles.plusText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* 6. Daily Quest Panel */}
          <View style={styles.questPanel}>
            <Text style={styles.questTitle}>Today's Quests</Text>
            {[...Array(3)].map((_, i) => (
              <View key={i} style={styles.questRow}>
                <Text style={styles.questText}>Quest {i + 1}</Text>
                <View style={styles.progressBar}><View style={styles.progressFill} /></View>
                <TouchableOpacity style={styles.claimButton} activeOpacity={0.7} onPress={() => showModal('Quest Claimed', 'You have claimed your quest reward!')} accessibilityLabel="Claim quest reward" accessible>
                  <Text style={styles.claimText}>Claim</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* 7. Settings & Subscription Footer */}
        {/* Footer removed */}
        <InfoModal {...modal} onClose={closeModal} />
      </View>
    </PatternBackground>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#FFF8E9', // REMOVE or comment out this line
  },
  scrollContentWithBackArrow: { padding: 16, paddingBottom: 100, paddingTop: 56 },
  heroPaneCentered: { alignItems: 'center', justifyContent: 'center', marginBottom: 8, marginTop: 32 },
  profileZenniLarge: { width: 160, height: 160, resizeMode: 'contain', alignSelf: 'center', shadowColor: '#FFD580', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },
  userName: { alignSelf: 'center', fontWeight: 'bold', fontSize: 20, color: '#7A5C00', marginBottom: 8 },
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
  customizeTiles: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  customizeTile: { backgroundColor: '#fff', borderRadius: CARD_RADIUS, padding: 12, alignItems: 'center', flex: 1, marginHorizontal: 4, ...SHADOW },
  customizeTileLabel: { fontWeight: 'bold', marginBottom: 4 },
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
});

export default ProfileScreen; 