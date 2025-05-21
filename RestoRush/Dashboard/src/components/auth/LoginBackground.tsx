import React from "react";
import { Package, ShoppingCart, CreditCard, TrendingUp, Smartphone } from "lucide-react";

const LoginBackground: React.FC = () => {
  return (
    <div className="absolute w-full h-full overflow-hidden login-background">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 text-white animate-float">
          <Package size={48} />
        </div>
        <div className="absolute top-2/3 left-1/5 text-white animate-float animate-delay-200">
          <ShoppingCart size={64} />
        </div>
        <div className="absolute top-1/3 right-1/4 text-white animate-float animate-delay-300">
          <CreditCard size={56} />
        </div>
        <div className="absolute bottom-1/4 right-1/3 text-white animate-float animate-delay-100">
          <TrendingUp size={48} />
        </div>
        <div className="absolute bottom-1/3 left-1/3 text-white animate-float animate-delay-400">
          <Smartphone size={40} />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40"></div>
    </div>
  );
};

export default LoginBackground;