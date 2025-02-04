import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

interface User {
    name: string;
    email: string;
    _id: string
    role: 'user' | 'manager' | 'admin'
    image?: string;
}

interface AuthState {
    _user: User | null;
    _token: string | null;
    isAuth: boolean;
    getUser: () => User | null;
    getToken: () => string | null;
    login: (user: User, token: string) => void;
    logout: () => void;
}

const isTokenValid = (token: string | null): boolean => {
    if (!token) return false;
    try {
        const decoded = jwtDecode<{ exp: number }>(token);
        console.log(decoded)
        console.log(decoded.exp * 1000 > Date.now())
        return decoded.exp * 1000 > Date.now();
    } catch {
        return false;
    }
};

export const useAuthStore = create(
    persist<AuthState>(
        (set, get) => ({
            _user: null,
            _token: null,
            isAuth: false,

            getUser: () => {
                const token = get()._token;
                if (!isTokenValid(token)) {
                    get().logout();
                    return null;
                }
                return get()._user;
            },
            getToken: () => {
                const token = get()._token;
                if (!isTokenValid(token)) {
                    get().logout();
                    return null;
                }
                return token;
            },

            login: (user, token) => {
                if (isTokenValid(token)) {
                    set({ _user: user, _token: token, isAuth: true });
                } else {
                    console.warn('Tentativa de login com token inválido ou expirado');
                    get().logout();
                }
            },
            logout: () => set({ _user: null, _token: null, isAuth: false }),
        }),
        {
            name: 'auth-storage',
        }
    )
);
