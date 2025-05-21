import React from 'react';
import { motion } from 'framer-motion';

const testimonial1 = "testimonial1.jpg";
const testimonial2 = "testimonial2.jpg";
const testimonial3 = "testimonial3.jpg";
const testimonial4 = "testimonial4.png";

const imageVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.8, ease: "easeOut" }
  })
};

export function TestimonialsSection() {
  const images = [testimonial1, testimonial2, testimonial3, testimonial4];

  return (
    <div className="flex items-center justify-center min-h-screen login-background px-4 mt-20 mb-20 relative">
      <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-12 sm:p-20 text-center max-w-6xl w-full relative overflow-hidden">
        <h1 className="text-2xl sm:text-4xl font-bold text-white">
          Ils ont atteint leurs <span className="text-[#5F65FF]">objectifs</span>
        </h1>

        {/* Trustpilot rating line */}
        <div className="flex items-center justify-center gap-3 text-white text-sm sm:text-base mt-6">
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

        {/* Image grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-12">
          {images.map((src, i) => (
            <motion.div
              key={src}
              className={`rounded-xl overflow-hidden ${
                i % 2 === 0 ? "row-span-2 h-88 w-full" : "h-64"
              }`}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={imageVariants}
            >
              <img
                src={src}
                alt={`testimonial-${i + 1}`}
                className="object-cover w-full h-full"
              />
            </motion.div>
          ))}
        </div>

        {/* Blur & CTA Overlay */}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#0B0E25] via-[#0B0E25]/80 to-transparent flex flex-col items-center justify-end pt-10 pb-6 z-10">
          <button className="bg-[#5F65FF] hover:bg-[#474CFF] text-white font-semibold px-6 py-2 rounded-full shadow-lg transition-all duration-300">
            Afficher plus de témoignages
          </button>
          <p className="text-white/70 text-sm mt-3">
            Tous ces résultats ne sont pas des promesses de gains
          </p>
        </div>
      </div>
    </div>
  );
}
