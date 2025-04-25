import { useUserStore } from '../store/userStore';

export default function useSubscription() {
  const isPlus = useUserStore((s) => s.isPlus);
  return { isPlus };
} 