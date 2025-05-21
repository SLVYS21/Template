import React from "react";
import { ShoppingBag } from "lucide-react";

const BrandLogo: React.FC = () => {
  return (
    <div className="flex items-center justify-center animate-fade-in">
      <ShoppingBag className="h-8 w-8 text-white mr-2" />
      <span className="text-white font-bold text-2xl">EcomAfricaPro</span>
    </div>
  );
};

export default BrandLogo;