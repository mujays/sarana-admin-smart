import React, { useState } from "react";
import { Form, Input, Button, Alert, Card, Typography } from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { superAdminAuthService } from "@/services/auth/super-admin-auth.service";

const { Title, Text } = Typography;

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

const RegisterSuperAdminPage: React.FC = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Watch password field untuk real-time validation
  const password = Form.useWatch("password", form) || "";

  // Helper functions untuk mengecek password requirements
  const checkPasswordLength = (pass: string) => {
    if (!pass) return false;
    return pass.length >= 8;
  };

  const checkUpperCase = (pass: string) => {
    if (!pass) return false;
    return /[A-Z]/.test(pass);
  };

  const checkLowerCase = (pass: string) => {
    if (!pass) return false;
    return /[a-z]/.test(pass);
  };

  const checkNumber = (pass: string) => {
    if (!pass) return false;
    return /\d/.test(pass);
  };

  const checkSymbol = (pass: string) => {
    if (!pass) return false;
    const symbols = "!@#$%^&*()_+-=[]{}|;':\",./<>?";
    return symbols.split("").some((char) => pass.includes(char));
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

  const handleSubmit = async (values: RegisterForm) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await superAdminAuthService.registerSuperAdmin({
        name: values.name,
        email: values.email,
        password: values.password,
        password_confirmation: values.password_confirmation,
      });

      if (response.success) {
        setSuccess(
          "Registrasi berhasil! Anda akan diarahkan ke halaman login untuk melanjutkan proses verifikasi.",
        );
        form.resetFields();

        // Redirect ke login setelah 3 detik
        setTimeout(() => {
          router.push("/super-admin-auth");
        }, 3000);
      } else {
        setError(response.message || "Terjadi kesalahan saat registrasi");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Terjadi kesalahan saat registrasi",
      );
    } finally {
      setLoading(false);
    }
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
              Register Super Admin
            </Title>
            <Text className="text-gray-600 text-sm">
              Daftarkan akun Super Admin untuk akses penuh sistem
            </Text>
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
                message="Registrasi Berhasil"
                description={success}
                type="success"
                showIcon
                className="mb-4 rounded-lg"
              />
            )}

            {/* Form - hanya tampil jika belum success */}
            {!success && (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="space-y-4"
              >
                <Form.Item
                  name="name"
                  label="Nama Lengkap"
                  rules={[
                    { required: true, message: "Nama lengkap wajib diisi" },
                    { min: 3, message: "Nama minimal 3 karakter" },
                    { max: 50, message: "Nama maksimal 50 karakter" },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="text-gray-400" />}
                    placeholder="Masukkan nama lengkap"
                    size="large"
                    disabled={loading}
                    className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500"
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Email wajib diisi" },
                    { type: "email", message: "Format email tidak valid" },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined className="text-gray-400" />}
                    placeholder="Masukkan email"
                    size="large"
                    disabled={loading}
                    className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: "Password wajib diisi" },
                    { validator: validatePassword },
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Masukkan password"
                    size="large"
                    disabled={loading}
                    className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500"
                    iconRender={(visible) =>
                      visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                    }
                  />
                </Form.Item>

                <Form.Item
                  name="password_confirmation"
                  label="Konfirmasi Password"
                  rules={[
                    {
                      required: true,
                      message: "Konfirmasi password wajib diisi",
                    },
                    { validator: validateConfirmPassword },
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Konfirmasi password"
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
                    {loading ? "Mendaftarkan..." : "Daftar Super Admin"}
                  </Button>
                </Form.Item>
              </Form>
            )}

            {/* Navigation Links */}
            <div className="space-y-3 mt-6">
              {/* Back to Login */}
              <div className="text-center">
                <Link href="/super-admin-auth">
                  <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    className="text-gray-600 hover:text-blue-600 border-0 p-0 h-auto font-medium hover:bg-transparent"
                  >
                    Kembali ke Login
                  </Button>
                </Link>
              </div>

              {/* Login Link */}
              {!success && (
                <div className="text-center">
                  <Text className="text-gray-600 text-sm">
                    Sudah punya akun?{" "}
                    <Link
                      href="/super-admin-auth"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Login di sini
                    </Link>
                  </Text>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterSuperAdminPage;
