import React, { useState, useEffect } from "react";
import { Form, Input, Button, Alert, Card, Typography } from "antd";
import {
  LockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { superAdminAuthService } from "@/services/auth/super-admin-auth.service";

const { Title, Text } = Typography;

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

const ResetPasswordPage: React.FC = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    // Ambil token dan email dari query params
    if (router.isReady) {
      const { token: tokenParam, email: emailParam } = router.query;

      if (typeof tokenParam === "string") {
        setToken(tokenParam);
      }

      if (typeof emailParam === "string") {
        setEmail(emailParam);
      }

      // Redirect jika tidak ada token atau email
      if (!tokenParam || !emailParam) {
        setError(
          "Token atau email tidak valid. Silakan request ulang link reset password.",
        );
      }
    }
  }, [router.isReady, router.query]);

  const handleSubmit = async (values: ResetPasswordForm) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (!token) {
        setError(
          "Token tidak valid. Silakan request ulang link reset password.",
        );
        return;
      }

      const response = await superAdminAuthService.resetPassword({
        password: values.password,
        token: token,
        email: email,
        password_confirmation: values.confirmPassword,
      });

      if (response.success) {
        setSuccess(
          "Password berhasil direset! Anda akan diarahkan ke halaman login.",
        );

        // Redirect ke login setelah 3 detik
        setTimeout(() => {
          router.push("/super-admin-auth");
        }, 3000);
      } else {
        setError(response.message || "Terjadi kesalahan saat reset password");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Terjadi kesalahan saat reset password",
      );
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error("Password wajib diisi"));
    }
    if (value.length < 8) {
      return Promise.reject(new Error("Password minimal 8 karakter"));
    }
    if (!/[A-Z]/.test(value)) {
      return Promise.reject(new Error("Password harus mengandung huruf besar"));
    }
    if (!/[a-z]/.test(value)) {
      return Promise.reject(new Error("Password harus mengandung huruf kecil"));
    }
    if (!/\d/.test(value)) {
      return Promise.reject(new Error("Password harus mengandung angka"));
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
      return Promise.reject(
        new Error("Password harus mengandung symbol (!@#$%^&*)"),
      );
    }
    return Promise.resolve();
  };

  const validateConfirmPassword = (_: any, value: string) => {
    const password = form.getFieldValue("password");
    if (!value) {
      return Promise.reject(new Error("Konfirmasi password wajib diisi"));
    }
    if (value !== password) {
      return Promise.reject(new Error("Konfirmasi password tidak sama"));
    }
    return Promise.resolve();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden">
          {/* Header dengan Logo */}
          <div className="text-center py-8 px-6 bg-white">
            <div className="flex justify-center mb-6">
              <Image
                src="/images/logo-color.png"
                alt="Logo Smart School"
                width={120}
                height={40}
                className="object-contain"
              />
            </div>
            <Title level={3} className="text-gray-800 mb-2 font-bold">
              Reset Password Super Admin
            </Title>
            {email && (
              <Text className="text-gray-600 text-sm">
                Reset password untuk: <strong>{email}</strong>
              </Text>
            )}
          </div>

          {/* Content Area */}
          <div className="px-6 pb-8">
            {/* Error Alert */}
            {error && (
              <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                closable
                onClose={() => setError("")}
                className="mb-4 rounded-lg"
              />
            )}

            {/* Success Alert */}
            {success && (
              <Alert
                message="Berhasil"
                description={success}
                type="success"
                showIcon
                className="mb-4 rounded-lg"
              />
            )}

            {/* Form - hanya tampil jika ada token dan belum success */}
            {token && !success && (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="space-y-4"
              >
                <Form.Item
                  name="password"
                  label="Password Baru"
                  rules={[{ validator: validatePassword }]}
                  hasFeedback
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Masukkan password baru"
                    size="large"
                    disabled={loading}
                    className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500"
                    iconRender={(visible) =>
                      visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                    }
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label="Konfirmasi Password Baru"
                  rules={[{ validator: validateConfirmPassword }]}
                  hasFeedback
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Konfirmasi password baru"
                    size="large"
                    disabled={loading}
                    className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500"
                    iconRender={(visible) =>
                      visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                    }
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    size="large"
                    block
                    className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 rounded-lg h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {loading ? "Mereset Password..." : "Reset Password"}
                  </Button>
                </Form.Item>
              </Form>
            )}

            {/* Back to Login */}
            <div className="text-center mt-6">
              <Link href="/super-admin-auth">
                <Button
                  type="text"
                  className="text-gray-600 hover:text-blue-600 border-0 p-0 h-auto font-medium hover:bg-transparent"
                >
                  Kembali ke Login
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
