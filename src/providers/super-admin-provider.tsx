import React, { useEffect } from "react";
import { useSuperAdmin } from "@/hooks/useSuperAdmin";

interface SuperAdminProviderProps {
  children: React.ReactNode;
}

export const SuperAdminProvider: React.FC<SuperAdminProviderProps> = ({
  children,
}) => {
  const { checkSuperAdminStatus } = useSuperAdmin();

  useEffect(() => {
    // Initialize super admin status on app load
    checkSuperAdminStatus();
  }, [checkSuperAdminStatus]);

  return <>{children}</>;
};
