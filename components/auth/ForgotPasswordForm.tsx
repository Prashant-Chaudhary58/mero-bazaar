"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const ForgotPasswordForm = () => {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2 | 3>(1);

    // Form State
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [resetToken, setResetToken] = useState("");

    // UI State
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError(null);
        if (!phone || phone.length < 10) {
            setServerError("Please enter a valid phone number.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:5001/api/v1/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone }),
            });

            const result = await response.json();

            if (!response.ok) {
                setServerError(result.error || "Failed to send OTP.");
                return;
            }

            toast.success("OTP sent to your phone! (Check console in dev mode)");
            setStep(2);
        } catch (err) {
            setServerError("Something went wrong. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError(null);
        if (!otp || otp.length < 4) {
            setServerError("Please enter a valid OTP.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:5001/api/v1/auth/verify-otp-reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone, otp }),
            });

            const result = await response.json();

            if (!response.ok) {
                setServerError(result.error || "Invalid OTP.");
                return;
            }

            // Save the reset token returned by the server
            setResetToken(result.data.resetToken);
            toast.success("OTP Verified! Please enter a new password.");
            setStep(3);
        } catch (err) {
            setServerError("Something went wrong. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError(null);
        if (!newPassword || newPassword.length < 6) {
            setServerError("Password must be at least 6 characters.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:5001/api/v1/auth/reset-password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // Required to receive the new JWT cookie
                body: JSON.stringify({ resetToken, password: newPassword }),
            });

            const result = await response.json();

            if (!response.ok) {
                setServerError(result.error || "Failed to reset password.");
                return;
            }

            toast.success("Password reset successfully! You are now logged in.");

            // Store user in localStorage for frontend state
            if (result.data) {
                localStorage.setItem('user', JSON.stringify(result.data));
            }

            router.push("/"); // Redirect to Dashboard
        } catch (err) {
            setServerError("Something went wrong. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-4">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
                {step === 1 ? "Forgot Password" : step === 2 ? "Verify OTP" : "New Password"}
            </h2>
            <p className="text-sm text-gray-600 mb-6">
                {step === 1
                    ? "Enter your registered phone number to receive an OTP."
                    : step === 2
                        ? `Enter the OTP sent to ${phone}.`
                        : "Create a new strong password for your account."
                }
            </p>

            {serverError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                    {serverError}
                </div>
            )}

            {/* STEP 1: PHONE NUMBER */}
            {step === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-5">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="border rounded-md p-2.5 outline-none transition w-full text-black border-gray-300 focus:border-[#4B7321]"
                            placeholder="98XXXXXXXX"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-2.5 rounded-md font-semibold text-white transition-colors mt-2 ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#4B7321] hover:bg-[#3d5d1a]"
                            }`}
                    >
                        {isLoading ? "Sending OTP..." : "Send OTP"}
                    </button>

                    <div className="text-center mt-4">
                        <Link href="/auth/login" className="text-sm text-[#4B7321] hover:underline">
                            Back to Login
                        </Link>
                    </div>
                </form>
            )}

            {/* STEP 2: VERIFY OTP */}
            {step === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">6-Digit OTP</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="border rounded-md p-2.5 outline-none transition w-full text-black border-gray-300 tracking-widest font-mono text-center focus:border-[#4B7321]"
                            placeholder="••••••"
                            maxLength={6}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-2.5 rounded-md font-semibold text-white transition-colors mt-2 ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#4B7321] hover:bg-[#3d5d1a]"
                            }`}
                    >
                        {isLoading ? "Verifying..." : "Verify OTP"}
                    </button>
                    <div className="text-center mt-4">
                        <button type="button" onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-gray-800 underline">
                            Change Phone Number
                        </button>
                    </div>
                </form>
            )}

            {/* STEP 3: NEW PASSWORD */}
            {step === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-5">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="border rounded-md p-2.5 outline-none transition w-full text-black border-gray-300 focus:border-[#4B7321]"
                            placeholder="••••••••"
                            minLength={6}
                            required
                        />
                        <p className="text-xs text-gray-500">Must be at least 6 characters long.</p>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-2.5 rounded-md font-semibold text-white transition-colors mt-2 ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#4B7321] hover:bg-[#3d5d1a]"
                            }`}
                    >
                        {isLoading ? "Resetting..." : "Reset Password & Login"}
                    </button>
                </form>
            )}
        </div>
    );
};
