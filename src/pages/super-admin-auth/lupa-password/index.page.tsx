import React, { useState } from "react";
import { Form, Input, Button, Alert, Card, Typography } from "antd";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { superAdminAuthService } from "@/services/auth/super-admin-auth.service";

const { Title, Text } = Typography;

interface ForgotPasswordForm {
  email: string;
}

const ForgotPasswordPage: React.FC = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleSubmit = async (values: ForgotPasswordForm) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await superAdminAuthService.forgotPassword({
        email: values.email,
      });

      if (response.success) {
        setSuccess(
          `Link reset password telah dikirim ke email ${values.email}. Silakan cek inbox atau folder spam Anda.`,
        );
        form.resetFields();
      } else {
        setError(response.message || "Terjadi kesalahan saat mengirim email");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Terjadi kesalahan saat mengirim email",
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
              Lupa Password Super Admin
            </Title>
            <Text className="text-gray-600 text-sm">
              Masukkan email Anda untuk mendapatkan link reset password
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
                message="Email Terkirim"
                description={success}
                type="success"
                showIcon
                closable
                onClose={() => setSuccess("")}
                className="mb-4 rounded-lg"
              />
            )}

            {/* Form */}
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              className="space-y-4"
            >
              <Form.Item
                name="email"
                label="Email Admin Super"
                rules={[
                  { required: true, message: "Email wajib diisi" },
                  { type: "email", message: "Format email tidak valid" },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="Masukkan email admin super"
                  size="large"
                  disabled={loading}
                  className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500"
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
                  {loading ? "Mengirim Email..." : "Kirim Link Reset Password"}
                </Button>
              </Form.Item>
            </Form>

            {/* Back to Login */}
            <div className="text-center mt-6">
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
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
