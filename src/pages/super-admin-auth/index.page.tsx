import React, { useState, useRef, useEffect } from "react";
import { Input, Alert, Card, Space, message } from "antd";
import {
  Loader2Icon,
  ShieldIcon,
  MailIcon,
  KeyIcon,
  RefreshCw,
  LockIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/button";
import { Form } from "@/components/form";
import { Title } from "@/components/title";
import { Paragraph } from "@/components/paragraph";
import Image from "next/image";
import { useRouter } from "next/router";
import { superAdminAuthService } from "@/services/auth/super-admin-auth.service";
import Cookies from "js-cookie";
import styles from "./styles.module.css";
import { toast } from "sonner";
import { useSuperAdmin } from "@/hooks/useSuperAdmin";

interface EmailFormData {
  email: string;
  password: string;
  captchaAnswer: string;
}

interface OTPFormData {
  otp: string;
}

interface MathCaptcha {
  question: string;
  answer: number;
}

type AuthStep = "email" | "otp";

function SuperAdminAuth() {
  const router = useRouter();
  const { loginAsSuperAdmin } = useSuperAdmin();
  const [currentStep, setCurrentStep] = useState<AuthStep>("email");
  const [email, setEmail] = useState("");
  const [adminSuperId, setAdminSuperId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailForm] = Form.useForm();
  const [otpForm] = Form.useForm();
  const [mathCaptcha, setMathCaptcha] = useState<MathCaptcha>({
    question: "",
    answer: 0,
  });

  const generateMathCaptcha = (): MathCaptcha => {
    const operations = ["+", "-", "*"];
    const operation = operations[Math.floor(Math.random() * operations.length)];

    let num1: number, num2: number, answer: number, question: string;

    switch (operation) {
      case "+":
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        answer = num1 + num2;
        question = `${num1} + ${num2}`;
        break;
      case "-":
        num1 = Math.floor(Math.random() * 20) + 10; // Ensure positive result
        num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
        answer = num1 - num2;
        question = `${num1} - ${num2}`;
        break;
      case "*":
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        answer = num1 * num2;
        question = `${num1} × ${num2}`;
        break;
      default:
        num1 = 5;
        num2 = 3;
        answer = 8;
        question = `5 + 3`;
    }

    return { question, answer };
  };
  console.log(adminSuperId);

  useEffect(() => {
    setMathCaptcha(generateMathCaptcha());
  }, []);

  const handleEmailSubmit = async (values: EmailFormData) => {
    const userAnswer = parseInt(values.captchaAnswer);
    if (isNaN(userAnswer) || userAnswer !== mathCaptcha.answer) {
      setError("Jawaban CAPTCHA salah. Silakan coba lagi.");
      setMathCaptcha(generateMathCaptcha());
      emailForm.setFieldValue("captchaAnswer", "");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await superAdminAuthService.sendOTP({
        email: values.email,
        password: values.password,
      });

      if (response.success) {
        setAdminSuperId(response.data?.admin_super_id || null);
        setEmail(values.email);
        setCurrentStep("otp");
        toast.success("Kode OTP telah dikirim ke email Anda");
        setMathCaptcha(generateMathCaptcha());
        emailForm.setFieldValue("captchaAnswer", "");
      } else {
        setError(
          response.message ||
            "Email atau password tidak valid. Silakan hubungi administrator.",
        );
      }
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      if (error.response?.status === 404) {
        setError(
          "Email tidak terdaftar sebagai Super Admin. Silakan hubungi administrator.",
        );
      } else if (error.response?.status === 401) {
        setError("Password salah. Silakan periksa kembali password Anda.");
      } else if (error.response?.status === 429) {
        setError(
          "Terlalu banyak percobaan. Silakan coba lagi dalam beberapa menit.",
        );
      } else {
        setError(
          "Terjadi kesalahan pada sistem. Silakan coba lagi atau hubungi administrator.",
        );
      }
      // Generate new CAPTCHA on error
      setMathCaptcha(generateMathCaptcha());
      emailForm.setFieldValue("captchaAnswer", "");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCaptcha = () => {
    setMathCaptcha(generateMathCaptcha());
    emailForm.setFieldValue("captchaAnswer", "");
    setError(""); // Clear any existing errors
  };

  const handleOTPSubmit = async (values: OTPFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await superAdminAuthService.verifyOTP({
        admin_super_id: adminSuperId!,
        otp: values.otp,
      });

      if (response.success) {
        if (response.data?.token) {
          // Use Zustand store to manage super admin state
          loginAsSuperAdmin(response.data.token, email);
        }
        toast.success("Login berhasil sebagai Super Admin!");

        // Check if there's a redirect parameter
        const redirectTo = router.query.redirect as string;
        router.push(redirectTo || "/home");
      } else {
        setError(
          response.message ||
            "Kode OTP tidak valid atau sudah kedaluwarsa. Silakan coba lagi.",
        );
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      if (error.response?.status === 400) {
        setError(
          "Kode OTP tidak valid atau sudah kedaluwarsa. Silakan coba lagi.",
        );
      } else if (error.response?.status === 429) {
        setError(
          "Terlalu banyak percobaan OTP yang salah. Silakan kirim ulang OTP.",
        );
      } else {
        setError(
          "Terjadi kesalahan pada sistem. Silakan coba lagi atau hubungi administrator.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await superAdminAuthService.verifyOTP({
        admin_super_id: adminSuperId!,
        otp: emailForm.getFieldValue("otp"),
      });

      if (response.success) {
        setError(""); // Clear any existing error
        toast.success("Kode OTP baru telah dikirim ke email Anda");
      } else {
        setError(
          response.message || "Gagal mengirim ulang OTP. Silakan coba lagi.",
        );
      }
    } catch (error: any) {
      console.error("Error resending OTP:", error);
      setError("Gagal mengirim ulang OTP. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailStep = () => (
    <Card className={styles["super-admin-card"]}>
      <div className={styles["logo-container"]}>
        <Image
          src="/images/logo-color.png"
          alt="Logo Smart School"
          width={80}
          height={80}
          className="object-contain"
        />
      </div>
      <div className="text-center mb-6">
        <Title level={2} className="mb-2 text-gray-800">
          Super Admin Access
        </Title>
        <Paragraph className="text-gray-600">
          Masukkan email dan password Super Admin untuk mendapatkan kode
          verifikasi
        </Paragraph>
      </div>

      {error && (
        <Alert
          message="Peringatan"
          description={error}
          type="error"
          showIcon
          className="mb-4"
          closable
          onClose={() => setError("")}
        />
      )}

      <Form form={emailForm} onFinish={handleEmailSubmit}>
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Email wajib diisi" },
            { type: "email", message: "Format email tidak valid" },
          ]}
        >
          <Input
            prefix={<MailIcon className="w-4 h-4 text-gray-400" />}
            placeholder="Masukkan email Super Admin"
            size="large"
            disabled={isLoading}
            autoComplete="username"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Password wajib diisi" },
            { min: 6, message: "Password minimal 6 karakter" },
            { max: 50, message: "Password maksimal 50 karakter" },
          ]}
        >
          <Input.Password
            prefix={<LockIcon className="w-4 h-4 text-gray-400" />}
            placeholder="Masukkan password Super Admin"
            size="large"
            disabled={isLoading}
            autoComplete="current-password"
          />
        </Form.Item>

        {/* Math CAPTCHA Section */}
        <div className={styles["captcha-container"]}>
          <div className="w-full">
            <p className="pb-1 font-medium text-gray-700">
              Verifikasi Keamanan
            </p>
            <div className={styles["math-captcha"]}>
              <div className={styles["math-question"]}>
                <span>{mathCaptcha.question}</span>
                <span className="text-gray-500 mx-2">=</span>
                <span className="text-blue-600">?</span>
              </div>
              <Form.Item
                name="captchaAnswer"
                className="mb-0 flex-1"
                rules={[
                  { required: true, message: "Jawaban CAPTCHA wajib diisi" },
                  { pattern: /^\d+$/, message: "Masukkan angka saja" },
                ]}
              >
                <Input
                  placeholder="Jawaban"
                  size="large"
                  disabled={isLoading}
                  className={styles["math-answer-input"]}
                />
              </Form.Item>
              <Button
                type="default"
                onClick={refreshCaptcha}
                icon={<RefreshCw className="w-4 h-4" />}
                disabled={isLoading}
                title="Refresh CAPTCHA"
                className={styles["captcha-refresh-btn"]}
              />
            </div>
          </div>
        </div>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700"
          icon={
            isLoading ? (
              <Loader2Icon className="w-4 h-4" />
            ) : (
              <ShieldIcon className="w-4 h-4" />
            )
          }
        >
          {isLoading ? "Mengirim Kode..." : "Kirim Kode Verifikasi"}
        </Button>
      </Form>

      {/* Link Lupa Password */}
      <div className="text-center mt-4">
        <Link
          href="/super-admin-auth/lupa-password"
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Lupa Password?
        </Link>
      </div>

      <div className={styles["warning-text"]}>
        <Paragraph className="text-xs">
          ⚠️ Hanya Super Admin yang memiliki akses ke halaman ini.
          <br />
          Penyalahgunaan akan dilaporkan kepada administrator sistem.
        </Paragraph>
      </div>
    </Card>
  );

  const renderOTPStep = () => (
    <Card className={styles["super-admin-card"]}>
      <div className={styles["logo-container"]}>
        <Image
          src="/images/logo-color.png"
          alt="Logo SARANA"
          width={80}
          height={80}
          className="object-contain"
        />
      </div>
      <div className="text-center mb-6">
        <Title level={2} className="mb-2 text-gray-800">
          Verifikasi Kode OTP
        </Title>
        <Paragraph className="text-gray-600">
          Masukkan kode verifikasi yang telah dikirim ke
        </Paragraph>
        <Paragraph className="font-semibold text-blue-600">{email}</Paragraph>
      </div>

      {error && (
        <Alert
          message="Peringatan"
          description={error}
          type="error"
          showIcon
          className="mb-4"
          closable
          onClose={() => setError("")}
        />
      )}

      <Form form={otpForm} onFinish={handleOTPSubmit}>
        <Form.Item
          name="otp"
          rules={[
            { required: true, message: "Kode OTP wajib diisi" },
            { len: 6, message: "Kode OTP harus 6 digit" },
          ]}
        >
          <Input
            prefix={<KeyIcon className="w-4 h-4 text-gray-400" />}
            placeholder="Masukkan 6 digit kode OTP"
            size="large"
            maxLength={6}
            disabled={isLoading}
            className={styles["otp-input"]}
          />
        </Form.Item>

        <Space direction="vertical" className="w-full">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700"
            icon={
              isLoading ? (
                <Loader2Icon className="w-4 h-4" />
              ) : (
                <ShieldIcon className="w-4 h-4" />
              )
            }
          >
            {isLoading ? "Memverifikasi..." : "Verifikasi & Masuk"}
          </Button>

          <Button
            type="link"
            onClick={handleResendOTP}
            disabled={isLoading}
            className="w-full"
          >
            Kirim Ulang Kode OTP
          </Button>

          <Button
            type="text"
            onClick={() => {
              setCurrentStep("email");
              setError("");
              otpForm.resetFields();
            }}
            disabled={isLoading}
            className="w-full text-gray-500"
          >
            Kembali ke Email
          </Button>
        </Space>
      </Form>

      <div className={styles["warning-text"]}>
        <Paragraph className="text-xs">
          ⚠️ Jangan bagikan kode OTP kepada siapapun.
          <br />
          Kode akan kedaluwarsa dalam 5 menit.
        </Paragraph>
      </div>
    </Card>
  );

  return (
    <div className={styles["super-admin-auth-container"]}>
      <div className="w-full max-w-md">
        {currentStep === "email" ? renderEmailStep() : renderOTPStep()}
      </div>
    </div>
  );
}

export default SuperAdminAuth;
