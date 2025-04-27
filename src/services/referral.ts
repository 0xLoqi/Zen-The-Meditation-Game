// import dynamicLinks from '@react-native-firebase/dynamic-links';
// TODO: Replace dynamic links functionality with expo-linking or Firebase JS SDK if needed.
import { useGameStore } from '../store';
import { useUserStore } from '../store/userStore';

// Generate a dynamic referral link for a user
export async function generateLink(userId: string) {
  // TODO: Replace with expo-linking or Firebase JS SDK
  // const link = await dynamicLinks().buildShortLink({
  //   link: `https://zen.app/?ref=${userId}`,
  //   domainUriPrefix: 'https://zenapp.page.link',
  //   android: { packageName: 'com.zen.app' },
  //   ios: { bundleId: 'com.zen.app' },
  // });
  // return link;
  return `https://zen.app/?ref=${userId}`;
}

// Handle initial link on app start
export async function handleInitialLink() {
  // TODO: Replace with expo-linking or Firebase JS SDK
  // const initialLink = await dynamicLinks().getInitialLink();
  // if (initialLink && initialLink.url) {
  //   const url = new URL(initialLink.url);
  //   const ref = url.searchParams.get('ref');
  //   const myUid = useUserStore.getState().userData?.id;
  //   if (ref && myUid && ref !== myUid) {
  //     // Reward both users (minimal: add 50 tokens to each)
  //     // You would call your backend or Firestore here
  //     // For demo, just log and set a flag
  //     useGameStore.setState((state) => ({
  //       progress: { ...state.progress, tokens: (state.progress.tokens || 0) + 50 },
  //     }));
  //     // TODO: Call backend to reward referrer as well
  //     // Show toast or modal for success
  //     console.log('Referral success: rewarded both users');
  //   }
  // }
} 