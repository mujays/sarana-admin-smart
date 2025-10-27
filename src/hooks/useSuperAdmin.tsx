import { useEffect } from "react";
import { useSuperAdminStore } from "@/stores/super-admin";

export const useSuperAdmin = () => {
  const {
    isSuperAdmin,
    superAdminToken,
    superAdminEmail,
    setSuperAdmin,
    clearSuperAdmin,
    toggleSuperAdminMode,
    checkSuperAdminStatus,
  } = useSuperAdminStore();

  // Check status on hook initialization
  useEffect(() => {
    checkSuperAdminStatus();
  }, [checkSuperAdminStatus]);

  const loginAsSuperAdmin = (token: string, email: string) => {
    setSuperAdmin(token, email);
  };

  const logoutSuperAdmin = () => {
    clearSuperAdmin();
  };

  const switchToSuperAdmin = () => {
    // Switch to super admin mode if token available
    toggleSuperAdminMode(true);
  };

  const switchToNormalAdmin = () => {
    // Switch back to normal admin without clearing the super admin token
    // This maintains the session but changes the current mode
    toggleSuperAdminMode(false);
  };

  return {
    isSuperAdmin,
    superAdminToken,
    superAdminEmail,
    loginAsSuperAdmin,
    logoutSuperAdmin,
    switchToSuperAdmin,
    switchToNormalAdmin,
    checkSuperAdminStatus,
  };
};
