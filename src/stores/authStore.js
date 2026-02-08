import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

export const AUTH_KEY = `${process.env.EXPO_PUBLIC_PROJECT_GROUP_ID}-jwt`;

/**
 * This store manages the authentication state of the application.
 */
export const useAuthStore = create((set) => ({
    isReady: false,
    auth: null,
    setAuth: (auth) => {
        if (auth) {
            SecureStore.setItemAsync(AUTH_KEY, JSON.stringify(auth));
        } else {
            SecureStore.deleteItemAsync(AUTH_KEY);
        }
        set({ auth });
    },
}));

/**
 * This store manages the state of the authentication modal.
 */
export const useAuthModal = create((set) => ({
    isOpen: false,
    mode: 'signup',
    open: (options) => set({ isOpen: true, mode: options?.mode || 'signup' }),
    close: () => set({ isOpen: false }),
}));

// ============================================
// Selector Hooks - Use these for optimal re-renders
// ============================================

/** @returns {boolean} Whether auth initialization is complete */
export const useIsAuthReady = () => useAuthStore((state) => state.isReady);

/** @returns {object|null} The current auth object */
export const useAuthData = () => useAuthStore((state) => state.auth);

/** @returns {boolean|null} Whether user is authenticated (null if not ready) */
export const useIsAuthenticated = () => useAuthStore((state) =>
    state.isReady ? !!state.auth : null
);

/** @returns {Function} The setAuth action */
export const useSetAuth = () => useAuthStore((state) => state.setAuth);

/** @returns {boolean} Whether the auth modal is open */
export const useIsAuthModalOpen = () => useAuthModal((state) => state.isOpen);

/** @returns {'signin'|'signup'} The current auth modal mode */
export const useAuthModalMode = () => useAuthModal((state) => state.mode);
