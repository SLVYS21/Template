import React, { useState } from "react";
import { Menu, X, Star } from "lucide-react";
import { Mission } from "../components/Mission";
import { Progress } from "../components/Progress";
import { Formations } from "../components/Formations";
import { EducationalFeatures } from "../components/EducationalFeatures";
import { ExpertsSection } from "../components/ExpertsSection";
import { SpeakerCarousel } from "../components/SpeakerCarousel";
import { TestimonialsSection } from "../components/Testimonial";
import { OfferSection } from "../components/OfferSection";
import { Footer } from "../components/Footer";

export function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen login-background">
      {/* Navigation */}
      <nav className="fixed w-full px-6 py-4 flex items-center justify-between login-background backdrop-blur-md z-50">
        <div className="text-white text-2xl font-bold">Ecom AFRICA Pro</div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 text-white/90">
          <a href="#" className="hover:text-white">
            Nos formations
          </a>
          <a href="#" className="hover:text-white">
            Nos experts
          </a>
          <a href="#" className="hover:text-white">
            Nos contenus gratuits
          </a>
          <a href="#" className="hover:text-white">
            À propos
          </a>
          <a href="#" className="hover:text-white">
            Recrutement
          </a>
        </div>

        {/* Login Button (Desktop) */}
        <button
          className="hidden md:block px-6 py-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition"
          onClick={() => (window.location.href = "/login")}
        >
          Se connecter
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-mindeo md:hidden">
            <div className="flex flex-col space-y-4 p-6">
              <a href="#" className="text-white/90 hover:text-white">
                Nos formations
              </a>
              <a href="#" className="text-white/90 hover:text-white">
                Nos experts
              </a>
              <a href="#" className="text-white/90 hover:text-white">
                Nos contenus gratuits
              </a>
              <a href="#" className="text-white/90 hover:text-white">
                À propos
              </a>
              <a href="#" className="text-white/90 hover:text-white">
                Recrutement
              </a>
              <button className="px-6 py-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition w-full"
                onClick={() => (window.location.href = "/login")}>
                Se connecter
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative">
        {/* Background Circle */}
        {/* <div className="circlePosition w-[590px] h-[400px] bg-[#fb7979] rounded-[100%] absolute z-0 top-[50%] left-[20%] translate-x-[-40%] translate-y-[-40%] blur-[90px]"></div> */}

        {/* Hero Section */}
        <div className="container relative z-10 mx-auto px-6 pt-32 pb-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-white leading-tight mb-6">
              Le Programme Nº1 en E-Commerce en AFRIQUE
            </h1>

            <div className="flex items-left justify-left gap-3 text-white text-sm sm:text-base mt-6 mb-6">
              <span className="font-semibold">Excellent</span>
              <span className="text-white/70">4.5 sur 5</span>
              <span className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-green-500"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z" />
                </svg>
                <span className="font-semibold">Trustpilot</span>
              </span>
            </div>

            <p className="text-white/80 text-lg mb-8">
              Ecom Africa Pro est le seul et unique programme dont vous aurez
              besoin pour mettre en place et réussir votre activité de vente en
              ligne en Afrique.
            </p>

            <button className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
              Explorer les formations
            </button>
          </div>

          {/* Logo Display */}
          <div className="bg-black/80 rounded-3xl p-20 flex items-center justify-center">
            <div className="text-white text-6xl font-bold">Ecom Pro</div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <Mission />

      {/* Progress Section */}
      <Progress />

      {/* Formations Section */}
      <Formations />
      {/* Educational Features Section */}
      <EducationalFeatures />

      {/* Experts Section */}
      <ExpertsSection />
      {/* Speaker Carousel */}
      <SpeakerCarousel />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Offer Section */}
      <OfferSection />

      {/* Footer */}
      <Footer />

      {/* Back to Top Button */}
    </div>
  );
}
