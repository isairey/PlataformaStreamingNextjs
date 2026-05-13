"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, ArrowRight, Check, Home } from "lucide-react";
import { motion } from "framer-motion";
import AuthLayout from "@/components/auth/auth-layout";
import ModernInput from "@/components/auth/modern-input";
import ModernButton from "@/components/auth/modern-button";
import ModernCheckbox from "@/components/auth/modern-checkbox";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [sendUpdates, setSendUpdates] = useState(false);

  // Password strength validation
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    Object.values(checks).forEach((check) => check && strength++);
    return { strength, checks };
  };

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (password !== confirmPassword) {
      setError("Password tidak sama");
      setLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError("Anda harus menyetujui syarat dan ketentuan");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Terjadi kesalahan");
      return;
    }

    router.push("/auth/signin?message=Account created successfully");
  };

  return (
    <div className="min-h-screen">
      <Link
        href="/"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
      >
        <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
          <Home className="w-5 h-5" />
        </div>
        <span className="hidden sm:inline font-medium">Back to Home</span>
      </Link>

      <AuthLayout
        title="Join Screenly"
        subtitle="Create your account and start watching amazing movies"
      >
        <form onSubmit={onSubmit} className="space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
            >
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          <div className="space-y-3">
            <ModernInput
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User size={20} />}
              required
            />

            <ModernInput
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={20} />}
              required
            />

            <div>
              <ModernInput
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock size={20} />}
                required
                minLength={6}
              />

              {/* Password Strength Indicator */}
              {password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-2 space-y-1.5"
                >
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          level <= passwordStrength.strength
                            ? passwordStrength.strength <= 2
                              ? "bg-red-500"
                              : passwordStrength.strength <= 3
                              ? "bg-yellow-500"
                              : "bg-green-500"
                            : "bg-gray-700"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-xs">
                    {Object.entries(passwordStrength.checks).map(
                      ([key, passed]) => (
                        <div
                          key={key}
                          className={`flex items-center gap-1 ${
                            passed ? "text-green-400" : "text-gray-500"
                          }`}
                        >
                          <Check
                            size={12}
                            className={passed ? "opacity-100" : "opacity-30"}
                          />
                          <span>
                            {key === "length" && "8+ chars"}
                            {key === "lowercase" && "Lower"}
                            {key === "uppercase" && "Upper"}
                            {key === "number" && "Number"}
                            {key === "special" && "Special"}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            <ModernInput
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<Lock size={20} />}
              error={
                confirmPassword && password !== confirmPassword
                  ? "Password tidak sama"
                  : undefined
              }
              required
            />
          </div>

          <div className="space-y-3">
            <ModernCheckbox
              id="accept-terms"
              checked={acceptTerms}
              onChange={setAcceptTerms}
              label={
                <>
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-netflix-red hover:text-netflix-red/80"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-netflix-red hover:text-netflix-red/80"
                  >
                    Privacy Policy
                  </Link>
                </>
              }
            />

            <ModernCheckbox
              id="send-updates"
              checked={sendUpdates}
              onChange={setSendUpdates}
              label="Send me updates about new movies and features"
            />
          </div>

          <ModernButton
            type="submit"
            loading={loading}
            className="w-full"
            size="lg"
            disabled={!acceptTerms}
            icon={!loading && <ArrowRight size={20} />}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </ModernButton>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-netflix-black text-gray-400">
                Or sign up with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <ModernButton variant="secondary" size="sm">
              <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </ModernButton>

            <ModernButton variant="secondary" size="sm">
              <svg
                className="w-4 h-4 mr-1.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </ModernButton>
          </div>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="text-netflix-red hover:text-netflix-red/80 font-medium transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </form>
      </AuthLayout>
    </div>
  );
}
