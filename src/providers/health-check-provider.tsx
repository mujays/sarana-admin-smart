import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import AuthService from "@/services/auth";

type THealthCheckProvider = {
  children: ReactNode;
};

export const HealthCheckProvider = ({ children }: THealthCheckProvider) => {
  const router = useRouter();
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      // Skip health check on maintenance page to avoid infinite loop
      if (router.pathname === "/maintenance") {
        setIsHealthy(true);
        setIsChecking(false);
        return;
      }

      try {
        setIsChecking(true);
        const response = await AuthService.healthCheck();
        if (response?.status.toLowerCase() === "ok") {
          setIsHealthy(true);
        } else {
          setIsHealthy(false);
          router.push("/maintenance");
        }
      } catch (error) {
        console.error("Health check failed:", error);
        setIsHealthy(false);
        router.push("/maintenance");
      } finally {
        setIsChecking(false);
      }
    };

    checkHealth();
  }, [router]);

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Memeriksa sistem...</p>
        </div>
      </div>
    );
  }

  // Only render children if healthy
  if (isHealthy) {
    return <>{children}</>;
  }

  // Return null if not healthy (router will handle redirect)
  return null;
};
