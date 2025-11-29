import { useState } from "react";
import { useRouter } from "next/router";
import AuthService from "@/services/auth";
import Head from "next/head";
import Image from "next/image";

export default function MaintenancePage() {
  const router = useRouter();
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      const response = await AuthService.healthCheck();
      const responseFinance = await AuthService.healthCheckKeuangan();
      if (
        response?.status.toLowerCase() === "ok" &&
        responseFinance?.status.toLowerCase() === "ok"
      ) {
        router.push("/");
      }
    } catch (error) {
      console.error("Retry failed:", error);
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <>
      <Head>
        <title>Maintenance - Smart School</title>
        <meta name="description" content="System under maintenance" />
      </Head>
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        {/* Main content */}
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 border border-gray-200">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="relative w-48 h-16">
                <Image
                  src="/images/logo-color.png"
                  alt="Smart School Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="bg-blue-100 rounded-full p-6">
                  <svg
                    className="w-16 h-16 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900">
              Sistem Sedang Maintenance
            </h1>

            {/* Description */}
            <p className="text-center text-gray-600 text-lg mb-8 leading-relaxed">
              Kami sedang melakukan pemeliharaan sistem untuk meningkatkan
              kualitas layanan. Mohon maaf atas ketidaknyamanannya.
            </p>

            {/* Status indicator */}
            <div className="bg-blue-50 rounded-2xl p-6 mb-8 border border-blue-100">
              <div className="flex items-center justify-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce animation-delay-200"></div>
                  <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce animation-delay-400"></div>
                </div>
                <span className="text-gray-700 font-medium">
                  Sedang dalam proses pemeliharaan
                </span>
              </div>
            </div>

            {/* Retry button */}
            <div className="flex justify-center">
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <span className="flex items-center space-x-2">
                  {isRetrying ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Memeriksa...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      <span>Coba Lagi</span>
                    </>
                  )}
                </span>
              </button>
            </div>

            {/* Additional info */}
            <p className="text-center text-gray-500 text-sm mt-8">
              Jika masalah berlanjut, silakan hubungi administrator sistem
            </p>
          </div>
        </div>

        {/* Custom animations */}
        <style jsx>{`
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }

          .animate-blob {
            animation: blob 7s infinite;
          }

          .animation-delay-2000 {
            animation-delay: 2s;
          }

          .animation-delay-4000 {
            animation-delay: 4s;
          }

          .animation-delay-200 {
            animation-delay: 0.2s;
          }

          .animation-delay-400 {
            animation-delay: 0.4s;
          }
        `}</style>
      </div>
    </>
  );
}
