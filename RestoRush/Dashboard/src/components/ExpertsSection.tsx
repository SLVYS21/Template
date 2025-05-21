import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const items = [
  {
    icon: "▶️", // Replace with an SVG/icon component if needed
    label: "Contenu exclusif",
    src: "https://img.icons8.com/parakeet-line/48/FFFFFF/play.png",
    alt: "play",
  },
  {
    icon: "💬",
    label: "FAQs en live",
    src: "https://img.icons8.com/parakeet-line/48/FFFFFF/faq.png",
    alt: "faq",
  },
  {
    icon: "🎤",
    label: "Interviews",
    src: "https://img.icons8.com/fluency-systems-regular/48/FFFFFF/microphone--v1.png",
    alt: "microphone--v1",
  },
];

export const ExpertsSection = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="login-background text-white py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold">
          Rencontrez nos <span className="text-blue-400">experts</span><br />francophones
        </h2>
      </motion.div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-12">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 + index * 0.2, duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <div className="w-12 h-12 rounded-md flex items-center justify-center justify bg-white/5 backdrop-blur-sm shadow-lg text-2xl">
              {/* {item.icon} */}
                <img src={item.src} alt={item.alt} className="w-8 h-8" />
            </div>
            <p className="mt-2 text-sm text-white">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
