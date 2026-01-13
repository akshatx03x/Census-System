import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, signupSchema, emailSchema } from "@/lib/authValidation";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading, signIn, signUp, resetPassword } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user && !loading) {
      navigate("/census");
    }
  }, [user, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const result = loginSchema.safeParse(loginData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    const { error } = await signIn(loginData.email, loginData.password);
    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Login Failed",
        description: error.message === "Invalid login credentials" 
          ? "Invalid email or password. Please try again."
          : error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Welcome back!", description: "Identity verified. Redirecting..." });
      navigate("/census");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = emailSchema.safeParse(forgotEmail);
    if (!result.success) {
      setErrors({ forgotEmail: result.error.errors[0].message });
      return;
    }

    setIsSubmitting(true);
    const { error } = await resetPassword(forgotEmail);
    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setResetEmailSent(true);
      toast({
        title: "Reset Link Dispatched",
        description: "Please check your official inbox.",
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = signupSchema.safeParse(signupData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    const { error } = await signUp(signupData.email, signupData.password);
    setIsSubmitting(false);

    if (error) {
      if (error.message.includes("already registered")) {
        toast({
          title: "Profile Exists",
          description: "This email is already registered in our database.",
          variant: "destructive",
        });
      } else {
        toast({ title: "Registration Failed", description: error.message, variant: "destructive" });
      }
    } else {
      toast({ title: "Account Initialized", description: "You may now proceed to census submission." });
      navigate("/census");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] text-slate-400">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
        <div className="text-xs font-bold tracking-[0.2em] uppercase">Securing Session...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <nav className="container mx-auto px-6 py-6 relative z-10 flex justify-between items-center">
        <Link to="/" className="group inline-flex items-center gap-2 text-slate-400 hover:text-white transition-all text-sm font-medium">
          <div className="p-2 rounded-full bg-slate-900 border border-slate-800 group-hover:border-slate-700 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </div>
          Exit to Home
        </Link>
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
          <Shield className="w-3 h-3 text-emerald-500" />
          SSL Secure Connection
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-[440px]">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold mb-4 tracking-widest uppercase">
              <Sparkles className="w-3 h-3" /> Citizen Enrollment Portal
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Access Your Profile</h1>
          </div>

          <Card className="bg-slate-900/40 backdrop-blur-xl border-slate-800/60 shadow-2xl overflow-hidden border-t-emerald-500/50 border-t-2">
            <CardContent className="p-8">
              {/* Prototype Alert */}
              <div className="mb-8 p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-1 shrink-0 animate-pulse" />
                <span><strong className="text-amber-500 uppercase">Sandbox Mode:</strong> Use any valid email format to simulate the registration process. No sensitive data is captured.</span>
              </div>

              {showForgotPassword ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetEmailSent(false);
                      setForgotEmail("");
                      setErrors({});
                    }}
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-400 uppercase tracking-wider transition-colors"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Return to authentication
                  </button>

                  {resetEmailSent ? (
                    <div className="text-center space-y-6 py-4">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-bold text-white text-lg">Dispatch Successful</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          We've sent a secure reset link to <br /><span className="text-white font-mono">{forgotEmail}</span>
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-white"
                        onClick={() => {
                          setShowForgotPassword(false);
                          setResetEmailSent(false);
                          setForgotEmail("");
                        }}
                      >
                        Back to Login
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleForgotPassword} className="space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="forgot-email" className="text-xs uppercase tracking-widest text-slate-500 font-bold">Email Recovery</Label>
                        <div className="relative group">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                          <Input
                            id="forgot-email"
                            type="email"
                            placeholder="Enter registered email"
                            className="pl-10 bg-slate-950/50 border-slate-800 text-slate-200 focus:border-emerald-500/50 focus:ring-emerald-500/10 h-11"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                          />
                        </div>
                        {errors.forgotEmail && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wide">{errors.forgotEmail}</p>}
                      </div>
                      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11" disabled={isSubmitting}>
                        {isSubmitting ? "Processing..." : "Issue Reset Link"}
                        {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                      </Button>
                    </form>
                  )}
                </div>
              ) : (
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-950/50 border border-slate-800 p-1">
                    <TabsTrigger value="login" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-xs font-bold uppercase tracking-widest transition-all">Login</TabsTrigger>
                    <TabsTrigger value="signup" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-xs font-bold uppercase tracking-widest transition-all">Register</TabsTrigger>
                  </TabsList>

                <TabsContent value="login" className="animate-in fade-in-50 duration-500">
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-3">
                      <Label htmlFor="login-email" className="text-xs uppercase tracking-widest text-slate-500 font-bold">Identity</Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="citizen@gov.in"
                          className="pl-10 bg-slate-950/50 border-slate-800 text-slate-200 focus:border-emerald-500/50 focus:ring-emerald-500/10 h-11"
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        />
                      </div>
                      {errors.email && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wide">{errors.email}</p>}
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="login-password" className="text-xs uppercase tracking-widest text-slate-500 font-bold">Secret Key</Label>
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                          className="text-[10px] text-emerald-500 hover:text-emerald-400 font-bold uppercase tracking-tighter transition-colors"
                        >
                          Lost Access?
                        </button>
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10 bg-slate-950/50 border-slate-800 text-slate-200 focus:border-emerald-500/50 focus:ring-emerald-500/10 h-11"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wide">{errors.password}</p>}
                    </div>

                    
                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 shadow-lg shadow-emerald-600/20" disabled={isSubmitting}>
                      {isSubmitting ? "Verifying..." : "Authorize Login"}
                    </Button>
                    <Button type="button" className="w-full bg-blue-800 hover:bg-slate-600 text-gray-300 font-bold h-11 mb-3 shadow-lg" >
                      Login with Mobile Number
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="animate-in fade-in-50 duration-500">
                  <form onSubmit={handleSignup} className="space-y-5">
                    <div className="space-y-3">
                      <Label htmlFor="signup-email" className="text-xs uppercase tracking-widest text-slate-500 font-bold">Email Address</Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="name@email.com"
                          className="pl-10 bg-slate-950/50 border-slate-800 text-slate-200 focus:border-emerald-500/50 focus:ring-emerald-500/10 h-11"
                          value={signupData.email}
                          onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        />
                      </div>
                      {errors.email && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wide">{errors.email}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-5">
                      <div className="space-y-3">
                        <Label htmlFor="signup-password" className="text-xs uppercase tracking-widest text-slate-500 font-bold">Create Password</Label>
                        <div className="relative group">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                          <Input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Min. 8 characters"
                            className="pl-10 pr-10 bg-slate-950/50 border-slate-800 text-slate-200 focus:border-emerald-500/50 focus:ring-emerald-500/10 h-11"
                            value={signupData.password}
                            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="confirm-password" className="text-xs uppercase tracking-widest text-slate-500 font-bold">Verify Password</Label>
                        <div className="relative group">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                          <Input
                            id="confirm-password"
                            type="password"
                            placeholder="Repeat password"
                            className="pl-10 bg-slate-950/50 border-slate-800 text-slate-200 focus:border-emerald-500/50 focus:ring-emerald-500/10 h-11"
                            value={signupData.confirmPassword}
                            onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                    {errors.password && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wide">{errors.password}</p>}
                    {errors.confirmPassword && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wide">{errors.confirmPassword}</p>}

                    <Button type="button" className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold h-11 mb-3 shadow-lg" disabled>
                      Register with Mobile Number
                    </Button>
                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 shadow-lg shadow-emerald-600/20" disabled={isSubmitting}>
                      {isSubmitting ? "Initializing Profile..." : "Complete Enrollment"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
              )}
            </CardContent>
          </Card>
          
          <div className="mt-8 text-center">
            <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em] font-bold">
              Ministry of Home Affairs • Digital Infrastructure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;