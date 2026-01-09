import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Shield, ArrowLeft, ArrowRight, Check, LogOut } from "lucide-react";
import { indianStates, getDistrictsByState } from "@/data/indianStates";

const steps = ["Personal", "Location", "Caste", "Socio-Economic", "Review"];

const Census = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    aadharNumber: "",
    address: "",
    panNumber: "",
    aadharImageUrl: "",
    panImageUrl: "",
    state: "",
    district: "",
    casteCategory: "",
    subCaste: "",
    occupation: "",
    incomeRange: "",
    educationLevel: "",
  });

  const [aadharImageFile, setAadharImageFile] = useState<File | null>(null);
  const [panImageFile, setPanImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "state") {
      setFormData((prev) => ({ ...prev, district: "" }));
    }
  };

  const districts = formData.state ? getDistrictsByState(formData.state) : [];

  const canProceed = () => {
    switch (currentStep) {
      case 0: return formData.name && formData.age && formData.gender && formData.aadharNumber.length === 12 && formData.address && formData.panNumber.length === 10;
      case 1: return formData.state && formData.district;
      case 2: return formData.casteCategory;
      case 3: return formData.occupation && formData.incomeRange && formData.educationLevel;
      case 4: return confirmed;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in to submit.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);

    console.log("User ID:", user.id);
    console.log("User authenticated:", !!user);

    const selectedState = indianStates.find(s => s.code === formData.state);
    const selectedDistrict = districts.find(d => d.code === formData.district);

    const submissionData = {
      user_id: user.id,
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      aadhar_number: formData.aadharNumber,
      address: formData.address,
      pan_number: formData.panNumber,
      aadhar_image_url: formData.aadharImageUrl,
      pan_image_url: formData.panImageUrl,
      state: selectedState?.name || formData.state,
      district: selectedDistrict?.name || formData.district,
      caste_category: formData.casteCategory as any,
      sub_caste: formData.subCaste || null,
      occupation: formData.occupation,
      income_range: formData.incomeRange as any,
      education_level: formData.educationLevel as any,
    };

    console.log("Submission data:", submissionData);

    const { data, error } = await supabase.from("census_submissions").insert(submissionData);

    console.log("Supabase response:", { data, error });

    setIsSubmitting(false);

    if (error) {
      console.error("Submission error:", error);
      toast({ title: "Submission Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Census Submitted!", description: "Your data has been recorded on the blockchain." });
      navigate("/success");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-heading font-bold">Census Portal</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            {steps.map((step, i) => (
              <span key={step} className={i <= currentStep ? "text-primary font-medium" : "text-muted-foreground"}>
                {step}
              </span>
            ))}
          </div>
          <Progress value={(currentStep / (steps.length - 1)) * 100} className="h-2" />
        </div>

        <Card className="shadow-govt animate-fade-in">
          <CardHeader>
            <CardTitle className="font-heading">Step {currentStep + 1}: {steps[currentStep]} Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 0 && (
              <>
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input placeholder="Enter your full name" value={formData.name} onChange={(e) => updateField("name", e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Age</Label>
                    <Input type="number" min="1" max="120" placeholder="Age" value={formData.age} onChange={(e) => updateField("age", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select value={formData.gender} onValueChange={(v) => updateField("gender", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Aadhar Card Number (12 digits)</Label>
                  <Input
                    type="text"
                    placeholder="Enter 12-digit Aadhar number"
                    value={formData.aadharNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 12);
                      updateField("aadharNumber", value);
                    }}
                    maxLength={12}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input placeholder="Enter your full address" value={formData.address} onChange={(e) => updateField("address", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>PAN Card Number (10 characters)</Label>
                  <Input
                    type="text"
                    placeholder="Enter 10-character PAN number"
                    value={formData.panNumber}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
                      updateField("panNumber", value);
                    }}
                    maxLength={10}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Aadhar Card Image</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setAadharImageFile(file);
                          // Upload to Supabase storage
                          const uploadFile = async () => {
                            const fileExt = file.name.split('.').pop();
                            const fileName = `${user?.id}_aadhar.${fileExt}`;
                            const { data, error } = await supabase.storage
                              .from('documents')
                              .upload(fileName, file);
                            if (error) {
                              toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
                            } else {
                              const { data: { publicUrl } } = supabase.storage
                                .from('documents')
                                .getPublicUrl(fileName);
                              updateField("aadharImageUrl", publicUrl);
                            }
                          };
                          uploadFile();
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>PAN Card Image</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPanImageFile(file);
                          // Upload to Supabase storage
                          const uploadFile = async () => {
                            const fileExt = file.name.split('.').pop();
                            const fileName = `${user?.id}_pan.${fileExt}`;
                            const { data, error } = await supabase.storage
                              .from('documents')
                              .upload(fileName, file);
                            if (error) {
                              toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
                            } else {
                              const { data: { publicUrl } } = supabase.storage
                                .from('documents')
                                .getPublicUrl(fileName);
                              updateField("panImageUrl", publicUrl);
                            }
                          };
                          uploadFile();
                        }
                      }}
                    />
                  </div>
                </div>
              </>
            )}

            {currentStep === 1 && (
              <>
                <div className="space-y-2">
                  <Label>State / UT</Label>
                  <Select value={formData.state} onValueChange={(v) => updateField("state", v)}>
                    <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                    <SelectContent>
                      {indianStates.map((s) => (
                        <SelectItem key={s.code} value={s.code}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>District</Label>
                  <Select value={formData.district} onValueChange={(v) => updateField("district", v)} disabled={!formData.state}>
                    <SelectTrigger><SelectValue placeholder="Select District" /></SelectTrigger>
                    <SelectContent>
                      {districts.map((d) => (
                        <SelectItem key={d.code} value={d.code}>{d.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="space-y-2">
                  <Label>Caste Category</Label>
                  <Select value={formData.casteCategory} onValueChange={(v) => updateField("casteCategory", v)}>
                    <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SC">Scheduled Caste (SC)</SelectItem>
                      <SelectItem value="ST">Scheduled Tribe (ST)</SelectItem>
                      <SelectItem value="OBC">Other Backward Class (OBC)</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sub-caste (Optional)</Label>
                  <Input placeholder="Enter sub-caste if applicable" value={formData.subCaste} onChange={(e) => updateField("subCaste", e.target.value)} />
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <div className="space-y-2">
                  <Label>Occupation</Label>
                  <Input placeholder="e.g., Teacher, Farmer, Engineer" value={formData.occupation} onChange={(e) => updateField("occupation", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Annual Income</Label>
                  <Select value={formData.incomeRange} onValueChange={(v) => updateField("incomeRange", v)}>
                    <SelectTrigger><SelectValue placeholder="Select Range" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Below 1 Lakh">Below ₹1 Lakh</SelectItem>
                      <SelectItem value="1-3 Lakhs">₹1 - 3 Lakhs</SelectItem>
                      <SelectItem value="3-5 Lakhs">₹3 - 5 Lakhs</SelectItem>
                      <SelectItem value="5-10 Lakhs">₹5 - 10 Lakhs</SelectItem>
                      <SelectItem value="10-25 Lakhs">₹10 - 25 Lakhs</SelectItem>
                      <SelectItem value="Above 25 Lakhs">Above ₹25 Lakhs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Education Level</Label>
                  <Select value={formData.educationLevel} onValueChange={(v) => updateField("educationLevel", v)}>
                    <SelectTrigger><SelectValue placeholder="Select Level" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="No formal education">No formal education</SelectItem>
                      <SelectItem value="Primary (1-5)">Primary (1-5)</SelectItem>
                      <SelectItem value="Middle (6-8)">Middle (6-8)</SelectItem>
                      <SelectItem value="Secondary (9-10)">Secondary (9-10)</SelectItem>
                      <SelectItem value="Higher Secondary (11-12)">Higher Secondary (11-12)</SelectItem>
                      <SelectItem value="Graduate">Graduate</SelectItem>
                      <SelectItem value="Post Graduate">Post Graduate</SelectItem>
                      <SelectItem value="Doctorate">Doctorate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="bg-secondary/50 rounded-lg p-4 space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Name:</span><span className="font-medium">{formData.name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Age:</span><span>{formData.age}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Gender:</span><span>{formData.gender}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Aadhar Number:</span><span>{formData.aadharNumber}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Address:</span><span>{formData.address}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">PAN Number:</span><span>{formData.panNumber}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">State:</span><span>{indianStates.find(s => s.code === formData.state)?.name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">District:</span><span>{districts.find(d => d.code === formData.district)?.name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Caste Category:</span><span>{formData.casteCategory}</span></div>
                  {formData.subCaste && <div className="flex justify-between"><span className="text-muted-foreground">Sub-caste:</span><span>{formData.subCaste}</span></div>}
                  <div className="flex justify-between"><span className="text-muted-foreground">Occupation:</span><span>{formData.occupation}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Income:</span><span>{formData.incomeRange}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Education:</span><span>{formData.educationLevel}</span></div>
                </div>
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <Checkbox id="confirm" checked={confirmed} onCheckedChange={(c) => setConfirmed(!!c)} />
                  <label htmlFor="confirm" className="text-sm leading-relaxed cursor-pointer">
                    I confirm that all information provided is accurate to the best of my knowledge. I understand this data will be securely stored and used for census purposes.
                  </label>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep((s) => s - 1)} disabled={currentStep === 0}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Previous
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button onClick={() => setCurrentStep((s) => s + 1)} disabled={!canProceed()}>
                  Next <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={!canProceed() || isSubmitting} className="bg-success hover:bg-success/90">
                  {isSubmitting ? "Submitting..." : <><Check className="h-4 w-4 mr-2" /> Submit Census</>}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Census;
