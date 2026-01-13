import { Link } from "react-router-dom";
import { FileText, ArrowLeft, Shield, CheckCircle, Scale, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const WrittenPolicies = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link to="/success" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Success Page
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-heading text-4xl font-bold mb-4">Official Census Policies</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Review the regulatory framework and government mandates governing data collection for all citizens, including General Category provisions.
          </p>
        </div>

        <div className="space-y-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <Scale className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>General Category & EWS Policy</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p className="mb-4">
                In accordance with the 103rd Constitutional Amendment, data for the General Category (Unreserved) is processed to identify eligibility for Economically Weaker Section (EWS) benefits.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Income Verification:</strong> Collection of gross annual household income (below ₹8 lakh limit).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Asset Mapping:</strong> Voluntary declaration of agricultural land (under 5 acres) or residential flats (under 1000 sq ft).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Exclusion Principle:</strong> General category data ensures benefits reach those not covered under SC, ST, or OBC (Central List) schemes.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-success" />
              </div>
              <CardTitle>Data Collection Policy</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p className="mb-4">
                We collect essential information required for census purposes. Personal identifiers like Aadhaar and PAN numbers are used solely for verification and are not stored permanently.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Name, age, gender, and address information</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Socio-economic details for statistical analysis</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                <Landmark className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Constitutional Compliance</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p className="mb-4">
                All data is processed under the <strong>Census Act, 1948</strong> and the <strong>Registration of Births and Deaths Act, 1969</strong>.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Confidentiality:</strong> Under Section 15 of the Census Act, individual data is not admissible as evidence in a court of law.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Equality:</strong> Data ensures equitable distribution of resources regardless of caste, creed, or category.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Existing: Data Security Policy */}
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-warning" />
              </div>
              <CardTitle>Data Security Policy</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p className="mb-4">
                Multiple layers of security protect your data throughout its lifecycle, from collection to storage and analysis.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>AES-256 encryption for data at rest and in transit</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Blockchain verification for tamper-proof records</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Link to="/success">
            <Button variant="outline" size="lg">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Success Page
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default WrittenPolicies;