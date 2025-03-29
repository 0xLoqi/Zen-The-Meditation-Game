import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Image,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  Animated,
  Easing
} from 'react-native';
import { COLORS, FONTS, SPACING, SIZES, SHADOWS } from './src/constants/theme';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// Get device dimensions
const { width, height } = Dimensions.get('window');

// Import images
const zenni = require('./assets/images/zenni.png');
const miniZenni = require('./assets/images/minizenni.png');
const appIcon = require('./assets/images/icon.png');

// Create stack navigators for auth and main flows
const AuthStack = createStackNavigator();
const MainStack = createStackNavigator();

// Types
import { MeditationType, MeditationDuration, OutfitId } from './src/types/index';

// Mock auth state for demo
const mockAuth = {
  isAuthenticated: false,
  isLoading: false,
  login: (email: string, password: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockAuth.isAuthenticated = true;
        resolve();
      }, 1500);
    });
  },
  signup: (email: string, username: string, password: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockAuth.isAuthenticated = true;
        resolve();
      }, 1500);
    });
  },
  logout: (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockAuth.isAuthenticated = false;
        resolve();
      }, 500);
    });
  }
};

// Splash Screen Component
const SplashScreen = ({ navigation }: any) => {
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];
  const pulseAnim = useState(new Animated.Value(1))[0];
  
  useEffect(() => {
    // Initial animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic)
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5))
      })
    ]).start();
    
    // Pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1200,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin)
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin)
        })
      ])
    ).start();
    
    // Navigate after a delay
    setTimeout(() => {
      navigation.replace('Login');
    }, 2500);
  }, []);

  return (
    <View style={styles.splashContainer}>
      <Animated.View 
        style={[
          styles.logoContainer, 
          { 
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { scale: pulseAnim }
            ]
          }
        ]}
      >
        <Image 
          source={appIcon} 
          style={styles.zenniLogo}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

// Login Screen Component
const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const zenAnim = useState(new Animated.Value(0))[0];
  const pulseAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    // Initial animation for form and content
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic)
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic)
      }),
      Animated.timing(zenAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
        easing: Easing.out(Easing.elastic(1.2))
      })
    ]).start();
    
    // Subtle breathing effect for Zenni
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 3000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin)
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin)
        })
      ])
    ).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      alert('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      await mockAuth.login(email, password);
      // After successful login, navigation will be handled by the auth state change
    } catch (error) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.centeredContainer}>
          <Animated.View 
            style={[
              styles.zenniImageContainer, 
              { 
                opacity: zenAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: pulseAnim }
                ]
              }
            ]}
          >
            <Image 
              source={zenni} 
              style={styles.zenniImage}
              resizeMode="contain"
            />
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.formContainer, 
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.screenTitle}>Welcome Back</Text>
            
            <View style={styles.inputWrapper}>
              <Ionicons 
                name="mail-outline" 
                size={24} 
                color={COLORS.primaryDark} 
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={COLORS.neutralMedium}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            
            <View style={styles.inputWrapper}>
              <Ionicons 
                name="lock-closed-outline" 
                size={24} 
                color={COLORS.primaryDark} 
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Password"
                placeholderTextColor={COLORS.neutralMedium}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.passwordToggle}
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={24} 
                  color={COLORS.neutralMedium} 
                />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>
            
            <View style={styles.footerTextContainer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity 
                onPress={() => {
                  if (Platform.OS !== 'web') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  navigation.navigate('Signup');
                }}
              >
                <Text style={styles.footerLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Signup Screen Component
const SignupScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic)
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic)
      })
    ]).start();
  }, []);

  const handleSignup = async () => {
    if (!email || !username || !password || !confirmPassword) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      alert('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await mockAuth.signup(email, username, password);
      // After successful signup, navigation will be handled by the auth state change
    } catch (error) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      alert('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            if (Platform.OS !== 'web') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            navigation.goBack();
          }}
        >
          <Ionicons name="chevron-back" size={26} color={COLORS.neutralDark} />
        </TouchableOpacity>
        
        <View style={styles.centeredContainer}>
          <Animated.View 
            style={[
              styles.zenniImageContainerSmall, 
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Image 
              source={zenni} 
              style={styles.zenniImageSmall}
              resizeMode="contain"
            />
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.formContainer, 
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
          <Text style={styles.screenTitle}>Create Account</Text>
          <Text style={styles.screenSubtitle}>Start your mindfulness journey with Zen</Text>
          
          <View style={styles.inputWrapper}>
            <Ionicons 
              name="mail-outline" 
              size={24} 
              color={COLORS.primaryDark} 
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={COLORS.neutralMedium}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          
          <View style={styles.inputWrapper}>
            <Ionicons 
              name="person-outline" 
              size={24} 
              color={COLORS.primaryDark} 
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Choose a username"
              placeholderTextColor={COLORS.neutralMedium}
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
            />
          </View>
          
          <View style={styles.inputWrapper}>
            <Ionicons 
              name="lock-closed-outline" 
              size={24} 
              color={COLORS.primaryDark} 
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Create password"
              placeholderTextColor={COLORS.neutralMedium}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.passwordToggle}
            >
              <Ionicons 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={24} 
                color={COLORS.neutralMedium} 
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.inputWrapper}>
            <Ionicons 
              name="shield-checkmark-outline" 
              size={24} 
              color={COLORS.primaryDark} 
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Confirm password"
              placeholderTextColor={COLORS.neutralMedium}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity 
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.passwordToggle}
            >
              <Ionicons 
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                size={24} 
                color={COLORS.neutralMedium} 
              />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.footerTextContainer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity 
              onPress={() => {
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                navigation.navigate('Login');
              }}
            >
              <Text style={styles.footerLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Home Screen Component (redesigned)
const HomeScreen = ({ navigation }: any) => {
  // Mock data for demo
  const userData = {
    streak: 7,
    xp: 350,
    level: 3,
    tokens: 120,
    equippedOutfit: 'default' as OutfitId,
    username: 'ZenUser'
  };
  
  const requiredXP = 400; // XP needed for next level
  const xpPercentage = (userData.xp / requiredXP) * 100;
  
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(20))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic)
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic)
      })
    ]).start();
  }, []);

  const openMeditationSelection = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    alert('Meditation Selection would open here');
  };
  
  const openDailyCheckIn = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    alert('Daily Check-in would open here');
  };
  
  const openWardrobe = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    alert('Wardrobe would open here');
  };
  
  const openGuruMode = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    alert('Guru Mode would open here');
  };

  const handleLogout = async () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    await mockAuth.logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.homeContent}>
        {/* User Profile and Stats Section */}
        <Animated.View 
          style={[
            styles.profileSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.profileHeader}>
            <View style={styles.miniZenniContainer}>
              <Image 
                source={miniZenni} 
                style={styles.miniZenniImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.username}>{userData.username}</Text>
              <View style={styles.levelContainer}>
                <Text style={styles.levelText}>Level {userData.level}</Text>
              </View>
              
              {/* XP Bar */}
              <View style={styles.xpBarContainer}>
                <View style={styles.xpBarBackground}>
                  <View 
                    style={[
                      styles.xpBarFill, 
                      { width: `${xpPercentage}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.xpText}>{userData.xp}/{requiredXP} XP</Text>
              </View>
            </View>
          </View>
          
          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name="flame" size={18} color={COLORS.accent} />
              </View>
              <Text style={styles.statValue}>{userData.streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <MaterialCommunityIcons name="meditation" size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.statValue}>{userData.xp}</Text>
              <Text style={styles.statLabel}>Total XP</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <FontAwesome5 name="coins" size={16} color={COLORS.accent} />
              </View>
              <Text style={styles.statValue}>{userData.tokens}</Text>
              <Text style={styles.statLabel}>Tokens</Text>
            </View>
          </View>
        </Animated.View>
        
        {/* Meditation Card */}
        <Animated.View
          style={[
            styles.mainFeatureCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.mainFeatureButton}
            onPress={openMeditationSelection}
            activeOpacity={0.8}
          >
            <View style={styles.mainFeatureContent}>
              <View style={styles.mainFeatureIconContainer}>
                <MaterialCommunityIcons name="meditation" size={36} color={COLORS.white} />
              </View>
              <View style={styles.mainFeatureTextContainer}>
                <Text style={styles.mainFeatureTitle}>Start Meditation</Text>
                <Text style={styles.mainFeatureSubtitle}>Choose type and duration</Text>
              </View>
              <Ionicons name="chevron-forward" size={28} color={COLORS.white} />
            </View>
          </TouchableOpacity>
        </Animated.View>
        
        {/* Feature Tiles */}
        <Animated.View 
          style={[
            styles.featureTileRow,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.featureTile} 
            onPress={openDailyCheckIn}
            activeOpacity={0.7}
          >
            <View style={[styles.featureTileIcon, { backgroundColor: COLORS.primaryLight }]}>
              <Ionicons name="calendar" size={26} color={COLORS.white} />
            </View>
            <Text style={styles.featureTileText}>Daily{'\n'}Check-in</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.featureTile} 
            onPress={openWardrobe}
            activeOpacity={0.7}
          >
            <View style={[styles.featureTileIcon, { backgroundColor: COLORS.accentLight }]}>
              <Ionicons name="shirt-outline" size={26} color={COLORS.white} />
            </View>
            <Text style={styles.featureTileText}>Zenni{'\n'}Wardrobe</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.featureTile} 
            onPress={openGuruMode}
            activeOpacity={0.7}
          >
            <View style={[styles.featureTileIcon, { backgroundColor: COLORS.tertiaryLight }]}>
              <Ionicons name="sparkles" size={26} color={COLORS.white} />
            </View>
            <Text style={styles.featureTileText}>Guru{'\n'}Mode</Text>
          </TouchableOpacity>
        </Animated.View>
        
        {/* Meditation Types Cards */}
        <Animated.View
          style={[
            { marginTop: SPACING.xl, marginBottom: SPACING.m },
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Meditation Types</Text>
          
          <TouchableOpacity 
            style={[styles.meditationTypeCard, { backgroundColor: COLORS.calmColor }]}
            onPress={() => openMeditationSelection()}
            activeOpacity={0.8}
          >
            <View style={styles.meditationTypeContent}>
              <View style={styles.meditationTypeIconContainer}>
                <Ionicons name="water-outline" size={28} color={COLORS.white} />
              </View>
              <View style={styles.meditationTypeTextContainer}>
                <Text style={styles.meditationTypeTitle}>Calm Meditation</Text>
                <Text style={styles.meditationTypeDescription}>Reduce anxiety and find inner peace</Text>
              </View>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.meditationTypeCard, { backgroundColor: COLORS.focusColor }]}
            onPress={() => openMeditationSelection()}
            activeOpacity={0.8}
          >
            <View style={styles.meditationTypeContent}>
              <View style={styles.meditationTypeIconContainer}>
                <Ionicons name="bulb-outline" size={28} color={COLORS.white} />
              </View>
              <View style={styles.meditationTypeTextContainer}>
                <Text style={styles.meditationTypeTitle}>Focus Meditation</Text>
                <Text style={styles.meditationTypeDescription}>Improve concentration and clarity</Text>
              </View>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.meditationTypeCard, { backgroundColor: COLORS.sleepColor }]}
            onPress={() => openMeditationSelection()}
            activeOpacity={0.8}
          >
            <View style={styles.meditationTypeContent}>
              <View style={styles.meditationTypeIconContainer}>
                <Ionicons name="moon-outline" size={28} color={COLORS.white} />
              </View>
              <View style={styles.meditationTypeTextContainer}>
                <Text style={styles.meditationTypeTitle}>Sleep Meditation</Text>
                <Text style={styles.meditationTypeDescription}>Improve sleep quality and relaxation</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
      
      {/* Tab Bar - Simplified for demo */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} activeOpacity={0.7}>
          <Ionicons name="home" size={26} color={COLORS.primary} />
          <Text style={[styles.tabLabel, { color: COLORS.primary }]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.tabItem} 
          activeOpacity={0.7}
          onPress={openMeditationSelection}
        >
          <MaterialCommunityIcons name="meditation" size={26} color={COLORS.neutralMedium} />
          <Text style={styles.tabLabel}>Meditate</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.tabItem} 
          activeOpacity={0.7}
          onPress={openWardrobe}
        >
          <Ionicons name="person" size={26} color={COLORS.neutralMedium} />
          <Text style={styles.tabLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Navigation configurations
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Splash" component={SplashScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="Home" component={HomeScreen} />
    </MainStack.Navigator>
  );
};

// Main App Component
export default function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simulate authentication state check
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsAuthenticated(mockAuth.isAuthenticated);
      setIsInitializing(false);
    };

    checkAuth();

    // Set up an interval to check auth state every second (for demo purposes)
    const interval = setInterval(() => {
      setIsAuthenticated(mockAuth.isAuthenticated);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  // Shared styles
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.screenHorizontal,
  },
  
  // Splash Screen styles
  splashContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  zenniLogo: {
    width: 180, 
    height: 180,
    marginBottom: SPACING.m,
  },
  
  // Loading Container
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  
  // Zenni Image Styles
  zenniImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.l,
    marginBottom: SPACING.m,
  },
  zenniImage: {
    width: 180,
    height: 180,
  },
  zenniImageContainerSmall: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.s,
  },
  zenniBottomContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xl,
    position: 'relative',
  },
  zenniImageSmall: {
    width: 120,
    height: 120,
  },
  miniZenniContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.m,
  },
  miniZenniImage: {
    width: 80,
    height: 80,
  },
  
  // Auth screens shared styles
  centeredContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  formContainer: {
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingVertical: SPACING.l,
  },
  screenTitle: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.heading1,
    fontWeight: FONTS.semiBold,
    color: COLORS.neutralDark,
    marginBottom: SPACING.s,
    textAlign: 'center',
  },
  screenSubtitle: {
    fontFamily: FONTS.secondary,
    fontSize: FONTS.regular_size,
    color: COLORS.neutralMedium,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius,
    marginBottom: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  inputIcon: {
    padding: SPACING.s,
    paddingLeft: SPACING.m,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.s,
    fontFamily: FONTS.secondary,
    fontSize: FONTS.base,
    color: COLORS.neutralDark,
    height: SIZES.inputHeight,
  },
  passwordToggle: {
    padding: SPACING.m,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusMedium,
    paddingVertical: SPACING.m,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.m,
    height: SIZES.buttonMediumHeight,
    ...SHADOWS.medium,
  },
  buttonDisabled: {
    backgroundColor: COLORS.primaryLight,
    opacity: 0.7,
  },
  buttonText: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.regular_size,
    fontWeight: FONTS.semiBold,
    color: COLORS.white,
  },
  footerTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  footerText: {
    fontFamily: FONTS.secondary,
    fontSize: FONTS.base,
    color: COLORS.neutralMedium,
  },
  footerLink: {
    fontFamily: FONTS.secondary,
    fontSize: FONTS.base,
    fontWeight: FONTS.semiBold,
    color: COLORS.primary,
  },
  
  // Back button
  backButton: {
    position: 'absolute',
    top: SPACING.m,
    left: SPACING.m,
    zIndex: 10,
    padding: SPACING.xs,
  },
  
  // Home Screen styles
  homeContent: {
    flexGrow: 1,
    padding: SPACING.screenHorizontal,
    paddingBottom: 70, // For tab bar space
  },
  
  // Profile Section
  profileSection: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMedium,
    overflow: 'hidden',
    marginBottom: SPACING.m,
    ...SHADOWS.medium,
  },
  profileHeader: {
    flexDirection: 'row',
    padding: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: SPACING.m,
  },
  username: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.xlarge,
    fontWeight: FONTS.semiBold,
    color: COLORS.neutralDark,
    marginBottom: SPACING.xs,
  },
  levelContainer: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: SIZES.radiusSmall,
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xxs,
    alignSelf: 'flex-start',
    marginBottom: SPACING.xs,
  },
  levelText: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.small,
    fontWeight: FONTS.semiBold,
    color: COLORS.white,
  },
  
  // XP Bar
  xpBarContainer: {
    marginTop: SPACING.xs,
  },
  xpBarBackground: {
    height: 8,
    backgroundColor: COLORS.backgroundDark,
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  xpText: {
    fontFamily: FONTS.secondary,
    fontSize: FONTS.tiny,
    color: COLORS.neutralMedium,
    marginTop: 2,
  },
  
  // Stats Row
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: SPACING.m,
    backgroundColor: COLORS.backgroundLight,
  },
  statItem: {
    alignItems: 'center',
  },
  statIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
    ...SHADOWS.small,
  },
  statValue: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.large,
    fontWeight: FONTS.bold,
    color: COLORS.neutralDark,
  },
  statLabel: {
    fontFamily: FONTS.secondary,
    fontSize: FONTS.small,
    color: COLORS.neutralMedium,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },
  
  // Main Feature Card (Meditation)
  mainFeatureCard: {
    marginVertical: SPACING.m,
    borderRadius: SIZES.radiusMedium,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  mainFeatureButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.m,
  },
  mainFeatureContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainFeatureIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  mainFeatureTextContainer: {
    flex: 1,
  },
  mainFeatureTitle: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.xlarge,
    fontWeight: FONTS.semiBold,
    color: COLORS.white,
    marginBottom: 2,
  },
  mainFeatureSubtitle: {
    fontFamily: FONTS.secondary,
    fontSize: FONTS.small,
    color: 'rgba(255,255,255,0.8)',
  },
  
  // Feature Tiles
  featureTileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.l,
  },
  featureTile: {
    width: '30%',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMedium,
    padding: SPACING.m,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  featureTileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  featureTileText: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.small,
    fontWeight: FONTS.medium,
    color: COLORS.neutralDark,
    textAlign: 'center',
  },
  
  // Section Title
  sectionTitle: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.large,
    fontWeight: FONTS.semiBold,
    color: COLORS.neutralDark,
    marginBottom: SPACING.m,
  },
  
  // Meditation Type Cards
  meditationTypeCard: {
    borderRadius: SIZES.radiusMedium,
    marginBottom: SPACING.m,
    ...SHADOWS.small,
  },
  meditationTypeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
  },
  meditationTypeIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  meditationTypeTextContainer: {
    flex: 1,
  },
  meditationTypeTitle: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.large,
    fontWeight: FONTS.semiBold,
    color: COLORS.white,
    marginBottom: 2,
  },
  meditationTypeDescription: {
    fontFamily: FONTS.secondary,
    fontSize: FONTS.small,
    color: 'rgba(255,255,255,0.8)',
  },
  
  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.s,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...SHADOWS.medium,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs,
  },
  tabLabel: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.tiny,
    marginTop: 2,
    color: COLORS.neutralMedium,
    fontWeight: FONTS.medium,
  },
  // Below are the styles for the premium app redesign
});