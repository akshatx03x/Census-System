import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Mail, Lock, ArrowLeft } from "lucide-react";
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
      toast({ title: "Login Failed", description: authError.message, variant: "destructive" });
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
        toast({ title: "Welcome Admin!", description: "Redirecting to dashboard..." });
        navigate("/admin/dashboard");
      } else {
        await supabase.auth.signOut();
        toast({ title: "Access Denied", description: "You do not have admin privileges.", variant: "destructive" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      <nav className="container mx-auto px-4 py-4">
        <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-govt-lg animate-fade-in">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-accent" />
            </div>
            <CardTitle className="font-heading text-2xl">Admin Portal</CardTitle>
            <CardDescription>Access the government analytics dashboard</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@gov.in"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isSubmitting}>
                {isSubmitting ? "Authenticating..." : "Access Dashboard"}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Admin access is restricted to authorized government personnel only.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
