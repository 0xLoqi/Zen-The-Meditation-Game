import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MiniZenni from '../MiniZenni';
import { Ionicons } from '@expo/vector-icons';
import ProfileStatsBar from './ProfileStatsBar';

function equippedToMiniZenniProps(equipped) {
  if (!equipped) return {};
  return {
    outfitId: equipped.outfit,
    headgearId: equipped.headgear,
    auraId: equipped.aura,
    faceId: equipped.face,
    accessoryId: equipped.accessory,
    companionId: equipped.companion,
  };
}

const ProfileHeader = ({ profile, isOwn, streak, level, xp, xpForNext, globalRank, lastMeditationDate }) => {
  // Use equipped cosmetics for own profile, fallback for friend
  const equipped = isOwn
    ? profile?.cosmetics?.equipped
    : profile?.cosmetics?.equipped || profile;
  const miniProps = equippedToMiniZenniProps(equipped);
  return (
    <View style={styles.header}>
      <View style={styles.pillBg}>
        <Text style={styles.username}>{profile.username || profile.name || 'ZenUser'}</Text>
        <Text style={styles.title}>{profile.currentTitle || 'Mini in Training'}</Text>
        {isOwn && profile.friendCode && (
          <View style={styles.friendCodeRow}>
            <Text style={styles.friendCodeLabel}>Friend Code:</Text>
            <Text style={styles.friendCodeValue}>{profile.friendCode}</Text>
            <TouchableOpacity>
              <Ionicons name="copy-outline" size={16} color="#FF8C42" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <MiniZenni size="large" {...miniProps} />
      <ProfileStatsBar
        streak={streak}
        level={level}
        xp={xp}
        xpForNext={xpForNext}
        globalRank={globalRank}
        lastMeditationDate={lastMeditationDate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: { alignItems:'center', marginBottom:24 },
  pillBg: { backgroundColor: 'rgba(35,32,20,0.95)', borderRadius: 18, paddingHorizontal: 24, paddingVertical: 10, alignItems: 'center', marginTop: 8 },
  username: { fontWeight:'bold', fontSize:26, color:'#fff', marginTop:4 },
  title: { color:'#FFD580', fontSize:16, marginBottom:8 },
  friendCodeRow: { flexDirection:'row', alignItems:'center', marginTop:6 },
  friendCodeLabel: { color:'#FFD580', fontWeight:'bold', marginRight:4 },
  friendCodeValue: { color:'#fff', fontWeight:'bold', marginRight:8 },
});

export default ProfileHeader; 