// Re-export from new stores location for backward compatibility
// TODO: Update all imports to use '@/stores' directly, then remove this file
export { useAuthStore, useAuthModal, AUTH_KEY as authKey } from '../../stores/authStore';