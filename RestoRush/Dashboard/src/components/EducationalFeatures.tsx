import { motion } from "framer-motion";
import { Wifi, StarHalfIcon, User } from "lucide-react";

const features = [
  {
    icon: <Wifi size={32} />,
    title: "100% Digitale",
    description:
      "Nos formations sont 100% en ligne et conçues pour être suivies à votre rythme et depuis chez vous. De plus vos accès sont illimités et valables à vie.",
  },
  {
    icon: <StarHalfIcon size={32} />,
    title: "Étape par étape",
    description:
      "Chaque formation offre une marche à suivre étape par étape, développée pour vous donner les stratégies nécessaires afin d'atteindre vos objectifs.",
  },
  {
    icon: <User size={32} />,
    title: "Un coaching personnalisé!",
    description:
      "Vous aurez la possibilité d'avoir accès à un accompagnement personnalisé de la part de nos coachs, pour atteindre vos objectifs lors des étapes de votre parcours. Mais n'oubliez pas ; vos résultats dépendent avant tout de vos efforts!",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: [0.48, 0.15, 0.25, 0.96],
    },
  }),
  hover: {
    y: -8,
    transition: {
      duration: 0.3,
      ease: [0.48, 0.15, 0.25, 0.96],
    },
  },
};

export const EducationalFeatures = () => {
  return (
    <div className="login-background text-white py-16 px-4 md:px-20">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.48, 0.15, 0.25, 0.96] }}
        className="text-4xl md:text-5xl font-bold text-center mb-16 tracking-tight"
      >
        Accessible et éducatif
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            custom={index}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            variants={cardVariants}
            className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 p-8 rounded-2xl h-[340px] flex flex-col items-center text-center group"
          >
            <motion.div 
              className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 w-16 h-16 flex items-center justify-center rounded-xl mb-6 text-indigo-300 group-hover:text-indigo-200 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {feature.icon}
            </motion.div>
            
            <h3 className="font-bold text-xl mb-4 text-white/90 group-hover:text-white transition-colors duration-300">
              {feature.title}
            </h3>
            
            <p className="text-base text-white/70 group-hover:text-white/80 transition-colors duration-300 leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="flex justify-center mt-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-8 py-3 rounded-full hover:shadow-lg hover:shadow-indigo-500/25 transform hover:-translate-y-1 transition-all duration-300">
          Nos formations
        </button>
      </motion.div>
    </div>
  );
};