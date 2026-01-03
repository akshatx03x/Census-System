import { Link } from "react-router-dom";
import { Shield, Lock, Database, Eye, Server, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-heading text-4xl font-bold mb-4">Privacy & Security</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your data privacy is our top priority. Learn how we protect your personal information.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-success" />
              </div>
              <CardTitle>End-to-End Encryption</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              All census data is encrypted using AES-256 encryption before storage. Your personal information is never stored in plain text.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>Blockchain Verification</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              A cryptographic hash of your submission is stored on an immutable blockchain ledger, ensuring tamper-proof record keeping.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Minimal Data Collection</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Aadhaar and PAN numbers are used only for verification and are never stored. We collect only essential census information.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mb-4">
                <Server className="h-6 w-6 text-warning" />
              </div>
              <CardTitle>Secure Infrastructure</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Our servers are hosted in government-certified data centers with 24/7 monitoring and strict access controls.
            </CardContent>
          </Card>
        </div>

        <Card className="bg-primary text-primary-foreground">
          <CardContent className="py-8 text-center">
            <h2 className="font-heading text-2xl font-bold mb-4">Your Rights</h2>
            <p className="mb-6 text-primary-foreground/80">
              You have the right to access, correct, or request deletion of your census data at any time.
            </p>
            <Link to="/auth">
              <Button variant="secondary">Submit Your Census</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Privacy;
