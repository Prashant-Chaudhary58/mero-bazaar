import { ForgotPasswordForm } from "../../../components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
    return (
        <main className="flex min-h-screen items-center justify-center p-6 bg-white">
            <div className="flex flex-col md:flex-row gap-12 items-center bg-slate-50 p-12 rounded-2xl shadow-sm">
                <div className="hidden md:block">
                    <img src="/images/logo.jpg" alt="Mero Baazar" width={350} />
                </div>
                <ForgotPasswordForm />
            </div>
        </main>
    );
}
