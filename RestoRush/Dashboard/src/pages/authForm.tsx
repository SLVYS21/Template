import React from "react";
import LoginBackground from "@/components/auth/LoginBackground";
import LoginForm from "@/components/auth/LoginForm";
import BrandLogo from "@/components/auth/BrandLogo";

const Login = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden">
      <LoginBackground />
      <div className="relative z-10 w-full max-w-md px-8 py-10">
        <div className="mb-8">
          <BrandLogo />
        </div>
        <div className="glass-card rounded-xl p-8 shadow-xl animate-slide-in">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white/90 mb-2 animate-fade-in">
              Welcome Back
            </h1>
            <p className="text-white/70 animate-fade-in animate-delay-100">
              Sign in to your admin dashboard
            </p>
          </div>
          <LoginForm />
          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm animate-fade-in animate-delay-300">
              For demo purposes, use: admin@example.com / password
            </p>
          </div>
        </div>
        <div className="mt-6 text-center text-white/50 text-xs animate-fade-in animate-delay-500">
          &copy; {new Date().getFullYear()} EcomAfricaPro. All rights reserved.
        </div>
      </div>
    </div>
  );
};
export default Login;