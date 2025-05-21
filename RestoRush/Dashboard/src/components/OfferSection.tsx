import React from "react";

export const OfferSection = () => {
  return (
    <section className="w-full login-background py-16 px-6 text-center mb-20">
      <div className="max-w-5xl mx-auto">
        <p className="text-sm md:text-base text-gray-400 mb-2">
          Et pour vous permettre d'y accéder, on a une offre exceptionnelle pour vous
        </p>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-10">
          <span className="text-yellow-600">BÉNÉFICIEZ DE -70%</span> SUR LE PROGRAMME ECOM AFRICA PRO
        </h2>

        <div className="flex flex-col md:flex-row justify-center gap-6">
          {/* Card 1 */}
          <div className="bg-gray-100/5 backdrop-blur-md shadow-lg rounded-2xl p-6 w-full max-w-sm mx-auto">
            <div className="inline-block px-4 py-1 bg-yellow-600 text-white rounded-full text-xs font-semibold mb-4">
              ECOM AFRICA PRO
            </div>
            <hr className="border-gray-300 mb-6" />

            <p className="text-2xl font-bold text-yellow-600 mb-1">1x 200.000 FCFA</p>
            <p className="text-xl font-semibold text-yellow-600 mb-2">OU 300€</p>
            <p className="text-sm text-gray-700 line-through mb-6">657 000 FCFA</p>

            <button 
              onClick={() => window.location.href = "https://pay.moneroo.io/plink_7ygnuh67dmef"}
              className="w-full bg-yellow-600 text-white py-3 rounded-md font-semibold hover:bg-yellow-700 transition"
            >
             REJOINDRE LE PROGRAMME
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-gray-100/5 backdrop-blur-md shadow-lg rounded-2xl p-6 w-full max-w-sm mx-auto">
            <div className="inline-block px-4 py-1 bg-yellow-600 text-white rounded-full text-xs font-semibold mb-4">
              ECOM AFRICA PRO
            </div>
            <hr className="border-gray-300 mb-6" />

            <p className="text-2xl font-bold text-yellow-600 mb-1">4x 50.000 FCFA</p>
            <p className="text-xl font-semibold text-yellow-600 mb-2">ou 4x75€</p>
            <p className="text-sm text-gray-700 line-through mb-6">657 000 FCFA</p>

            <button className="w-full bg-yellow-600 text-white py-3 rounded-md font-semibold hover:bg-yellow-700 transition"
            onClick={() => window.location.href = "https://pay.moneroo.io/plink_yae3lzubytl3"}
            >
              REJOINDRE LE PROGRAMME
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
