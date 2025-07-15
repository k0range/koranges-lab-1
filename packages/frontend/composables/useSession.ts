import api from '@/api'
import type { InferResponseType } from 'hono/client'

type User = {
  id: string;
  name: string;
  email: string;
  image: string;
  explicitlySetProfile: boolean;
}

let _pendingPromise: Promise<User | null> | null = null;

export const useSession = () => {
  const user = useState<User | null>('user', () => null);

  const loadFromStorage = () => {
    if (process.client) {
      const json = localStorage.getItem('user');
      if (json) {
        try {
          user.value = JSON.parse(json);
        } catch {
          user.value = null;
        }
      }
    }
  };

  const saveToStorage = (data: User | null) => {
    if (process.client) {
      if (data) {
        localStorage.setItem('user', JSON.stringify(data));
      } else {
        localStorage.removeItem('user');
      }
    }
  };

  const refreshSession = async (): Promise<User | null> => {
    try {
      const res = await (await api.me.$get()).json() as User
      user.value = res;
      saveToStorage(res);
      return res;
    } catch {
      user.value = null;
      saveToStorage(null);
      return null;
    }
  };

  const getUser = async (): Promise<User | null> => {
    if (user.value !== null) return user.value;
    if (_pendingPromise) return _pendingPromise; // 多重fetch防止

    _pendingPromise = (async () => {
      loadFromStorage();
      if (user.value !== null) {
        return user.value;
      }
      const refreshed = await refreshSession();
      _pendingPromise = null;
      return refreshed;
    })();

    return _pendingPromise;
  };

  return {
    user: readonly(user), // リアクティブにしたい場合
    getUser,
    refreshSession,
  };
};
