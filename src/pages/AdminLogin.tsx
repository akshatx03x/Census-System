import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Mail, Lock, ArrowLeft, Fingerprint, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading, signIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const checkAdmin = async () => {
      if (user && !loading) {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .single();

        if (data) {
          navigate("/admin/dashboard");
        }
      }
    };
    checkAdmin();
  }, [user, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { data: authData, error: authError } = await signIn(email, password);
    
    if (authError) {
      setIsSubmitting(false);
      toast({ title: "Authentication Failed", description: authError.message, variant: "destructive" });
      return;
    }

    if (authData.user) {
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", authData.user.id)
        .eq("role", "admin")
        .single();

      setIsSubmitting(false);

      if (roleData) {
        toast({ title: "Identity Verified", description: "Accessing administrative secure layer..." });
        navigate("/admin/dashboard");
      } else {
        await supabase.auth.signOut();
        toast({ title: "Access Denied", description: "Insufficient clearance level.", variant: "destructive" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <nav className="container mx-auto px-6 py-6 relative z-10">
        <Link 
          to="/" 
          className="group inline-flex items-center gap-2 text-slate-400 hover:text-white transition-all text-sm font-medium"
        >
          <div className="p-2 rounded-full bg-slate-900 border border-slate-800 group-hover:border-slate-700 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </div>
          Exit to Public Portal
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          {/* Top Branding for Admin */}
          <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-6 shadow-xl shadow-emerald-500/5">
              <ShieldCheck className="h-8 w-8 text-emerald-500" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Administrative Access</h1>
            <p className="text-slate-500 text-sm mt-2">Level-4 Authorization Required</p>
          </div>

          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            {/* Security Pulse Line */}
            <div className="h-0.5 w-full bg-slate-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-emerald-500/50 animate-progress origin-left" />
            </div>

            <CardHeader className="space-y-1 pb-8">
              <CardTitle className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-emerald-500" />
                Secure Login
              </CardTitle>
              <CardDescription className="text-slate-500">
                Enter your government-issued credentials
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                    Official Email
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@gov.in"
                      className="pl-10 bg-slate-950/50 border-slate-800 text-slate-200 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-all h-11"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                      Password
                    </Label>
                    <button type="button" className="text-[10px] text-emerald-500 hover:text-emerald-400 font-bold uppercase tracking-tighter">
                      Reset Access
                    </button>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 bg-slate-950/50 border-slate-800 text-slate-200 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-all h-11"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.98]" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Authenticating...
                    </span>
                  ) : (
                    "Authorize Session"
                  )}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-800/50 flex items-start gap-3">
                <Shield className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
                <p className="text-[10px] leading-relaxed text-slate-500 uppercase tracking-wider font-medium">
                  Notice: All login attempts are logged with IP and Timestamp. Unauthorized access is punishable under the Information Technology Act.
                </p>
              </div>
            </CardContent>
          </Card>

          <p className="text-center mt-8 text-xs text-slate-600 font-medium tracking-wide uppercase">
            National Informatics Centre Portal
          </p>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        .animate-progress {
          animation: progress 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;