import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { User, Lock, LogIn } from "lucide-react";
import ForgotPasswordDialog from "./ForgotPasswordDialog";
import { useAuth } from "../../context/AuthContext";

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes only - in a real app you would validate credentials against a backend
      if (email === "bryansambieni19@gmail.com" && password === "password") {
        toast({
          title: "Success",
          description: "Welcome to your admin dashboard!",
        });
        const fakeUser = {
          id: "123",
          name: "Bryan Sambieni",
          email,
          token : "123"
        };
        login(fakeUser);
        navigate("/dashboard");
        // Here you would redirect to the dashboard
      } else {
        toast({
          title: "Invalid credentials",
          description: "Please check your email and password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 w-full animate-fade-in">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-white/90">
            Email
          </Label>
          <div className="relative">
            <div className="absolute left-3 top-3 text-muted-foreground">
              <User size={16} />
            </div>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              className="pl-10 bg-white/10 border-white/20 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-white/90">
            Password
          </Label>
          <div className="relative">
            <div className="absolute left-3 top-3 text-muted-foreground">
              <Lock size={16} />
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-10 bg-white/10 border-white/20 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" className="data-[state=checked]:bg-gray-400 data-[state=checked]:border-gray-400" />
            <Label htmlFor="remember" className="text-sm text-white/80">
              Remember me
            </Label>
          </div>
          <button 
            type="button" 
            onClick={() => setForgotPasswordOpen(true)}
            className="text-sm font-medium text-gray-900 hover:text-gray-950 transition-colors"
          >
            Forgot password?
          </button>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-white hover:bg-white/90 text-primary font-semibold flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </div>
          ) : (
            <>
              <LogIn size={18} className="mr-2" />
              Sign In
            </>
          )}
        </Button>
      </form>
      
      <ForgotPasswordDialog 
        isOpen={forgotPasswordOpen} 
        onClose={() => setForgotPasswordOpen(false)}
      />
    </>
  );
};

export default LoginForm;