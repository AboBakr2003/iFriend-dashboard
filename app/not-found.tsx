"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function NotFound() {25
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { permissions, isAuthenticated } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGoBack = () => {
    // If user is authenticated, go to their first accessible page
    if (isAuthenticated && permissions.length > 0) {
      router.back();
    } else {
      // If not authenticated, go to sign-in
      router.push("/sign-in");
    }
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-natural via-natural to-[#E8F1FF] flex items-center justify-center p-6 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-blue/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-blue/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-primary-blue/5 to-transparent rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      {/* Main Content */}
      <div className={`relative z-10 text-center max-w-2xl mx-auto transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        {/* 404 Number with Gradient */}
        <div className="relative mb-8">
          <h1 className="text-[150px] 2xl:text-[200px] font-bold leading-none bg-gradient-to-br from-primary-blue via-primary-blue-hover to-dark-blue bg-clip-text text-transparent drop-shadow-2xl animate-fade-in">
            404
          </h1>
          <div className="absolute inset-0 blur-3xl bg-gradient-to-br from-primary-blue/20 via-primary-blue-hover/20 to-dark-blue/20 -z-10 animate-pulse"></div>
        </div>

        {/* Error Message */}
        <div className="space-y-4 mb-12">
          <h2 className="text-3xl 2xl:text-4xl font-bold text-dark-blue animate-slide-up">
            Page Not Found
          </h2>
          <p className="2xl:text-lg text-natural-text max-w-md mx-auto animate-slide-up delay-200">
            Oops! The page you're looking for seems to have wandered off.
            Let's get you back on track.
          </p>
        </div>

        {/* Illustration */}
        <div className="relative animate-float">
          <div className="w-40 h-40 2xl:w-64 2xl:h-64 mx-auto relative">
            {/* Friendly Robot/Character Illustration using CSS */}
            <div className="absolute inset-0">
              {/* Robot Head */}
              <div className="absolute top-5 2xl:top-8 left-1/2 -translate-x-1/2 w-20 h-20 2xl:w-32 2xl:h-32 bg-white rounded-2xl 2xl:rounded-3xl shadow-2xl border-2 2xl:border-4 border-primary-blue/20">
                {/* Eyes */}
                <div className="absolute top-6 2xl:top-10 left-4 2xl:left-6 w-4 h-4 2xl:w-6 2xl:h-6 bg-primary-blue rounded-full animate-blink"></div>
                <div className="absolute top-6 2xl:top-10 right-4 2xl:right-6 w-4 h-4 2xl:w-6 2xl:h-6 bg-primary-blue rounded-full animate-blink delay-100"></div>
                {/* Antenna */}
                <div className="absolute -top-5 2xl:-top-8 left-1/2 -translate-x-1/2 w-0.5 2xl:w-1 h-5 2xl:h-8 bg-primary-blue"></div>
                <div className="absolute -top-7 2xl:-top-12 left-1/2 -translate-x-1/2 w-3 h-3 2xl:w-4 2xl:h-4 bg-primary-blue rounded-full animate-pulse"></div>
                {/* Mouth - Sad face */}
                <div className="absolute bottom-5 2xl:bottom-8 left-1/2 -translate-x-1/2 w-10 h-5 2xl:w-16 2xl:h-8 border-b-2 2xl:border-b-4 border-primary-blue/30 rounded-b-full"></div>
              </div>

              {/* Floating Particles */}
              <div className="absolute top-2 2xl:top-4 left-5 2xl:left-8 w-1.5 h-1.5 2xl:w-2 2xl:h-2 bg-primary-blue rounded-full animate-float-particle"></div>
              <div className="absolute top-8 2xl:top-12 right-8 2xl:right-12 w-2 h-2 2xl:w-3 2xl:h-3 bg-primary-blue-hover rounded-full animate-float-particle delay-500"></div>
              <div className="absolute bottom-5 2xl:bottom-8 left-10 2xl:left-16 w-1.5 h-1.5 2xl:w-2 2xl:h-2 bg-dark-blue/40 rounded-full animate-float-particle delay-1000"></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <Button
          onClick={handleGoBack}
          variant="outline"
          className="border-2 border-primary-blue text-primary-blue px-8 py-6 text-lg font-semibold rounded-xl group hover:bg-primary-blue hover:text-white transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-lg"
        >
          <ArrowLeft className="w-5! h-5! group-hover:-translate-x-2 transition-all duration-300" />
          Go Back
        </Button>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-particle {
          0%, 100% {
            transform: translate(0, 0);
            opacity: 0.3;
          }
          50% {
            transform: translate(10px, -20px);
            opacity: 1;
          }
        }

        @keyframes blink {
          0%, 90%, 100% {
            opacity: 1;
          }
          95% {
            opacity: 0;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-particle {
          animation: float-particle 4s ease-in-out infinite;
        }

        .animate-blink {
          animation: blink 4s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }

        .delay-500 {
          animation-delay: 0.5s;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
