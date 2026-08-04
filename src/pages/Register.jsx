import AuthLayout from "../components/auth/AuthLayout";
import RegisterForm from "../components/auth/RegisterForm";

export default function Register() {
  return (
    <AuthLayout
      title="Create Your Account 🚀"
      subtitle="Join ResumeForge AI and start building professional ATS-friendly resumes in minutes."
    >
      <RegisterForm />
    </AuthLayout>
  );
}