// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// const speakers = [
//   {
//     name: "Théodore Schnyder",
//     role: "Expert E-commerce",
//     img: "https://via.placeholder.com/200x250?text=Th%C3%A9odore",
//     description: "Expert en e-commerce avec 10 ans d'expérience."
//   },
//   {
//     name: "Manuel Ravier",
//     role: "Investissement Immobilier",
//     img: "https://via.placeholder.com/200x250?text=Manuel",
//     description: "Spécialiste de l'immobilier locatif rentable."
//   },
//   {
//     name: "Mickael Zonta",
//     role: "Investissement Immobilier",
//     img: "https://via.placeholder.com/200x250?text=Mickael",
//     description: "Conseiller en stratégie immobilière."
//   },
//   {
//     name: "Oussama Ammar",
//     role: "Entrepreneuriat",
//     img: "https://via.placeholder.com/200x250?text=Oussama",
//     description: "Serial entrepreneur et investisseur."
//   }
// ];

// export function SpeakerCarousel() {
//   const [index, setIndex] = useState(0);

//   const next = () => setIndex((prev) => (prev + 1) % speakers.length);
//   const prev = () => setIndex((prev) => (prev - 1 + speakers.length) % speakers.length);

//   return (
//     <div className="relative w-full max-w-6xl mx-auto py-10 bg-[#0a0134] text-white">
//       <div className="flex items-center justify-center gap-6 overflow-hidden">
//         <button onClick={prev} className="bg-white/10 p-2 rounded-full hover:bg-white/20">
//           <ChevronLeft size={24} />
//         </button>

//         {speakers.slice(index, index + 4).map((speaker, i) => (
//           <div
//             key={i}
//             className="relative group w-[220px] h-[300px] rounded-xl overflow-hidden bg-gradient-to-b from-[#11033f] to-[#0a0134]"
//           >
//             <img
//               src={speaker.img}
//               alt={speaker.name}
//               className="w-full h-full object-cover group-hover:blur-sm transition duration-500"
//             />
//             <div className="absolute bottom-4 left-4 z-10">
//               <h2 className="font-semibold text-lg">{speaker.name}</h2>
//               <p className="text-sm text-[#8a87ae]">{speaker.role}</p>
//             </div>
//             <motion.div
//               initial={{ y: 50, opacity: 0 }}
//               whileHover={{ y: 0, opacity: 1 }}
//               transition={{ duration: 0.5 }}
//               className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 text-sm text-white hidden group-hover:block"
//             >
//               {speaker.description}
//             </motion.div>
//           </div>
//         ))}

//         <button onClick={next} className="bg-white/10 p-2 rounded-full hover:bg-white/20">
//           <ChevronRight size={24} />
//         </button>
//       </div>

//       {/* Progress Bar */}
//       <div className="mt-6 px-20">
//         <div className="h-1 bg-white/10 rounded-full">
//           <div
//             className="h-1 bg-white rounded-full transition-all duration-500"
//             style={{ width: `${((index + 1) / speakers.length) * 100}%` }}
//           ></div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const speakers = [
  {
    name: "Théodore Schnyder",
    role: "Expert E-commerce",
    img: "https://via.placeholder.com/200x250?text=Th%C3%A9odore",
    description: "Expert en e-commerce avec 10 ans d'expérience."
  },
  {
    name: "Manuel Ravier",
    role: "Investissement Immobilier",
    img: "https://via.placeholder.com/200x250?text=Manuel",
    description: "Spécialiste de l'immobilier locatif rentable."
  },
  {
    name: "Mickael Zonta",
    role: "Investissement Immobilier",
    img: "https://via.placeholder.com/200x250?text=Mickael",
    description: "Conseiller en stratégie immobilière."
  },
  {
    name: "Oussama Ammar",
    role: "Entrepreneuriat",
    img: "https://via.placeholder.com/200x250?text=Oussama",
    description: "Serial entrepreneur et investisseur."
  }
];

export function SpeakerCarousel() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % speakers.length);
  const prev = () => setIndex((prev) => (prev - 1 + speakers.length) % speakers.length);

  return (
    <div className="relative w-full max-w-6xl mx-auto py-10 login-background text-white">
      <div className="flex items-center justify-center gap-6 overflow-hidden">
        <button onClick={prev} className="bg-white/10 p-2 rounded-full hover:bg-white/20">
          <ChevronLeft size={24} />
        </button>

        {speakers.slice(index, index + 4).map((speaker, i) => (
          <div
            key={i}
            className="relative group w-[220px] h-[300px] rounded-xl overflow-hidden login-background"
          >
            <img
              src={speaker.img}
              alt={speaker.name}
              className="w-full h-full object-cover transition-all duration-500 group-hover:blur-sm"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
            <div className="absolute bottom-4 left-4 z-10">
              <h2 className="font-semibold text-lg">{speaker.name}</h2>
              <p className="text-sm text-[#8a87ae]">{speaker.role}</p>
            </div>
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 100, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center p-6 text-sm text-white bg-black/10 backdrop-blur-sm"
            >
              <p className="text-center">{speaker.description}</p>
            </motion.div>
          </div>
        ))}

        <button onClick={next} className="bg-white/10 p-2 rounded-full hover:bg-white/20">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-6 px-20">
        <div className="h-1 bg-white/10 rounded-full">
          <div
            className="h-1 bg-white rounded-full transition-all duration-500"
            style={{ width: `${((index + 1) / speakers.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}