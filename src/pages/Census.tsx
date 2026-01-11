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
import { Shield, ArrowLeft, ArrowRight, Check, LogOut, Upload, Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { indianStates, getDistrictsByState } from "@/data/indianStates";

// Define the sub-caste options mapping
const subCasteOptions: Record<string, string[]> = {
  SC: ["Chamar", "Valmiki", "Pasi", "Dhobi", "Mahar", "Other SC"],
  ST: ["Gond", "Bhil", "Santhal", "Oraon", "Munda", "Other ST"],
  OBC: ["Yadav", "Kurmi", "Jat", "Gujjar", "Ahir", "Other OBC"],
  General: ["Brahmin", "Kshatriya", "Vaishya", "Kayastha", "Other General"],
};

const steps = ["Personal", "Aadhar Verification", "Location", "Caste", "Socio-Economic", "Review"];

const Census = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  

  // Aadhar verification states
  const [aadharVerified, setAadharVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'matched' | 'no_match' | 'error'>('idle');
  const [extractedAadharNumber, setExtractedAadharNumber] = useState<string>("");
  const [extractedName, setExtractedName] = useState<string>("");
  const [verificationMessage, setVerificationMessage] = useState<string>("");
  const [aadharMatch, setAadharMatch] = useState<boolean | null>(null);
  const [nameMatch, setNameMatch] = useState<boolean | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    aadharNumber: "",
    address: "",
    aadharImageUrl: "",
    state: "",
    district: "",
    casteCategory: "",
    subCaste: "",
    occupation: "",
    incomeRange: "",
    educationLevel: "",
  });

  const [aadharImageFile, setAadharImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // Reset District if State changes
      if (field === "state") {
        newData.district = "";
      }

      // Reset Sub-Caste if Caste Category changes
      if (field === "casteCategory") {
        newData.subCaste = "";
      }

      return newData;
    });
  };

  const districts = formData.state ? getDistrictsByState(formData.state) : [];

  // Get available sub-castes based on selected category
  const availableSubCastes = formData.casteCategory ? subCasteOptions[formData.casteCategory] || [] : [];

  // ML API URL - Use environment variable for production deployment
  // For local development: "http://localhost:7860/extract" (via proxy)
  // For production: Set VITE_ML_API_URL in .env file (e.g., https://your-hf-space.hf.space/extract)
  const ML_API_URL = import.meta.env.VITE_ML_API_URL || "/extract";

  const verifyAadharWithML = async () => {
    if (!aadharImageFile) {
      toast({
        title: "Image Required",
        description: "Please upload your Aadhar card image first.",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    setVerificationStatus('verifying');
    setVerificationMessage("Analyzing Aadhar image...");

    try {
      // Create FormData for ML API
      const formDataML = new FormData();
      formDataML.append('file', aadharImageFile);

      // Call ML API
      const response = await fetch(ML_API_URL, {
        method: 'POST',
        body: formDataML,
      });

      if (!response.ok) {
        throw new Error('ML API request failed');
      }

      const mlResult = await response.json();
      
      console.log("ML Extraction Result:", mlResult);

      // Extract details from ML response
      const extractedNum = mlResult['Aadhaar Number'] || "";
      const extractedNm = mlResult['Name'] || "";

      setExtractedAadharNumber(extractedNum);
      setExtractedName(extractedNm);

      // Check if extraction was successful
      if (extractedNum === "Not Found" || extractedNum === "") {
        setVerificationStatus('error');
        setVerificationMessage("Could not extract Aadhar details from image. Please try a clearer image.");
        setAadharVerified(false);
        toast({
          title: "Extraction Failed",
          description: "Could not read Aadhar details from the image.",
          variant: "destructive"
        });
        setIsVerifying(false);
        return;
      }


      // Compare extracted details with manual entry (NOT matching with database)
      const manualAadhar = formData.aadharNumber.replace(/\D/g, '');
      const extractedAadharClean = extractedNum.replace(/\D/g, '');
      
      // Check Aadhar number match (12 digits)
      const aadharMatchResult = manualAadhar === extractedAadharClean;
      setAadharMatch(aadharMatchResult);
      
      // Name comparison - lenient for ML extracted names
      const manualName = formData.name.toLowerCase().trim();
      const extractedNmClean = extractedNm.toLowerCase().trim();
      
      // Count matching words (at least one significant word must match)
      const manualNameWords = manualName.split(/\s+/).filter(w => w.length > 2);
      const extractedNameWords = extractedNmClean.split(/\s+/).filter(w => w.length > 2);
      
      const matchingWords = manualNameWords.filter(word => 
        extractedNameWords.some(extWord => 
          word.includes(extWord) || extWord.includes(word) ||
          (word.length > 3 && extWord.length > 3 && (word.substring(0, 4) === extWord.substring(0, 4)))
        )
      );
      
      // Match if: at least 50% of manual name words are found in extracted OR
      // extracted name starts with first word of manual name
      const firstWordMatch = manualNameWords.length > 0 && 
                             extractedNameWords.length > 0 && 
                             extractedNameWords[0].includes(manualNameWords[0].substring(0, Math.max(4, Math.floor(manualNameWords[0].length * 0.6))));
      
      const nameMatchResult = matchingWords.length >= Math.max(1, Math.ceil(manualNameWords.length * 0.5)) || firstWordMatch;
      setNameMatch(nameMatchResult);

      if (aadharMatchResult && nameMatchResult) {
        setVerificationStatus('matched');
        setVerificationMessage(`✓ Aadhar Matched: ${extractedNum} | ✓ Name Matched: ${extractedNm}`);
        setAadharVerified(true);
        toast({
          title: "Verification Successful",
          description: "Both Aadhar number and name matched.",
        });
      } else {
        let errorMsg = "";
        if (!aadharMatchResult) {
          errorMsg = `✗ Aadhar Mismatch | Entered: ${manualAadhar} | Extracted: ${extractedAadharClean}`;
        }
        if (!nameMatchResult) {
          errorMsg += errorMsg ? " | " : "";
          errorMsg += `✗ Name Mismatch | Entered: ${formData.name} | Extracted: ${extractedNm}`;
        }
        
        setVerificationStatus('no_match');
        setVerificationMessage(errorMsg);
        setAadharVerified(false);
        toast({
          title: "Verification Failed",
          description: errorMsg,
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error("Verification error:", error);
      setVerificationStatus('error');
      setVerificationMessage("Failed to connect to verification service. Please try again.");
      setAadharVerified(false);
      toast({
        title: "Verification Error",
        description: "Could not connect to the verification service. Make sure the ML server is running.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Auto-verify when Aadhar image is uploaded
  const handleAadharImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAadharImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        updateField("aadharImageUrl", dataUrl);
        localStorage.setItem(`aadhar_image_${user?.id}`, dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return formData.name && formData.age && formData.gender && formData.aadharNumber.length === 12 && formData.address && aadharImageFile;
      case 1: return aadharVerified; // Aadhar verification step - must be verified to proceed
      case 2: return formData.state && formData.district;
      case 3: return formData.casteCategory && formData.subCaste; // Required sub-caste selection
      case 4: return formData.occupation && formData.incomeRange && formData.educationLevel;
      case 5: return confirmed;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in to submit.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);

    const selectedState = indianStates.find(s => s.code === formData.state);
    const selectedDistrict = districts.find(d => d.code === formData.district);

    const submissionData = {
      user_id: user.id,
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      aadhar_number: formData.aadharNumber,
      address: formData.address,
      aadhar_image_url: formData.aadharImageUrl,
      state: selectedState?.name || formData.state,
      district: selectedDistrict?.name || formData.district,
      caste_category: formData.casteCategory as any,
      sub_caste: formData.subCaste || null,
      occupation: formData.occupation,
      income_range: formData.incomeRange as any,
      education_level: formData.educationLevel as any,
    };

    const { error } = await supabase.from("census_submissions").insert(submissionData);

    setIsSubmitting(false);

    if (error) {
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
                    <Input type="text" placeholder="Age" value={formData.age} onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
                      updateField("age", value);
                    }} />
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
                  <Label>Aadhar Card Image (Required for ML Verification)</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleAadharImageUpload}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload your Aadhar card image. This will be used for ML-based verification.
                  </p>
                  {/* Aadhar Verification Status Badge */}
                  <div className={`mt-2 rounded-lg p-3 text-center font-medium text-sm ${
                    aadharVerified 
                      ? 'bg-green-100 text-green-700 border border-green-300' 
                      : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                  }`}>
                    {aadharVerified ? (
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircle className="h-4 w-4" /> AADHAR VERIFIED ✓
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <AlertCircle className="h-4 w-4" /> AADHAR NOT VERIFIED - Complete Step 2
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Verify Your Aadhar</h3>
                  <p className="text-muted-foreground mb-4">
                    Your Aadhar details will be extracted using ML and matched with our database.
                  </p>
                </div>

                {/* Manual Entry Display */}
                <div className="bg-secondary/50 rounded-lg p-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name (Manual Entry):</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Aadhar Number (Manual Entry):</span>
                    <span className="font-medium">{formData.aadharNumber}</span>
                  </div>
                </div>

                {/* Extracted Details from ML with Match Status */}
                {(extractedAadharNumber || extractedName) && (
                  <div className="bg-blue-50 rounded-lg p-4 space-y-3 text-sm border border-blue-200">
                    <h4 className="font-medium text-blue-800 flex items-center gap-2">
                      <Upload className="h-4 w-4" /> ML Extracted Details
                    </h4>
                    
                    {/* Name with match status */}
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Extracted Name:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{extractedName || "Not found"}</span>
                        {nameMatch === true && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {nameMatch === false && <XCircle className="h-4 w-4 text-red-600" />}
                      </div>
                    </div>
                    
                    {/* Aadhar with match status */}
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Extracted Aadhar:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{extractedAadharNumber || "Not found"}</span>
                        {aadharMatch === true && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {aadharMatch === false && <XCircle className="h-4 w-4 text-red-600" />}
                      </div>
                    </div>
                  </div>
                )}

                {/* Verification Status */}
                {verificationStatus !== 'idle' && (
                  <div className={`rounded-lg p-4 space-y-3 text-sm border ${
                    verificationStatus === 'matched' ? 'bg-green-50 border-green-200' :
                    verificationStatus === 'no_match' ? 'bg-red-50 border-red-200' :
                    verificationStatus === 'error' ? 'bg-orange-50 border-orange-200' :
                    'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      {verificationStatus === 'matched' && <CheckCircle className="h-5 w-5 text-green-600" />}
                      {verificationStatus === 'no_match' && <XCircle className="h-5 w-5 text-red-600" />}
                      {verificationStatus === 'error' && <AlertCircle className="h-5 w-5 text-orange-600" />}
                      {verificationStatus === 'verifying' && <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />}
                      
                      <span className={`font-medium ${
                        verificationStatus === 'matched' ? 'text-green-800' :
                        verificationStatus === 'no_match' ? 'text-red-800' :
                        verificationStatus === 'error' ? 'text-orange-800' :
                        'text-blue-800'
                      }`}>
                        {verificationStatus === 'matched' && 'Verification Successful'}
                        {verificationStatus === 'no_match' && 'Verification Failed'}
                        {verificationStatus === 'error' && 'Verification Error'}
                        {verificationStatus === 'verifying' && 'Verifying...'}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{verificationMessage}</p>
                  </div>
                )}

                {/* Verify Button */}
                <Button
                  onClick={verifyAadharWithML}
                  className="w-full"
                  disabled={isVerifying || !aadharImageFile}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Verifying with ML...
                    </>
                  ) : aadharVerified ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Verified (Click to Re-verify)
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Verify Aadhar
                    </>
                  )}
                </Button>

                {/* Help text */}
                {!aadharImageFile && (
                  <p className="text-xs text-muted-foreground text-center">
                    Please upload your Aadhar image in Step 1 to enable verification.
                  </p>
                )}

                {aadharVerified && (
                  <div className="bg-green-600 text-white rounded-lg p-4 text-center font-bold text-lg flex items-center justify-center gap-2 shadow-lg">
                    <CheckCircle className="h-6 w-6" />
                    AADHAR VERIFIED ✓
                  </div>
                )}
              </div>
            )}

            {currentStep === 2 && (
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

            {currentStep === 3 && (
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
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sub-Caste</Label>
                  <Select value={formData.subCaste} onValueChange={(v) => updateField("subCaste", v)} disabled={!formData.casteCategory}>
                    <SelectTrigger><SelectValue placeholder="Select Sub-Caste" /></SelectTrigger>
                    <SelectContent>
                      {availableSubCastes.map((sub) => (
                        <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {currentStep === 4 && (
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

            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="bg-secondary/50 rounded-lg p-4 space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Name:</span><span className="font-medium">{formData.name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Age:</span><span>{formData.age}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Gender:</span><span>{formData.gender}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Aadhar:</span><span>{formData.aadharNumber}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">State:</span><span>{indianStates.find(s => s.code === formData.state)?.name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">District:</span><span>{districts.find(d => d.code === formData.district)?.name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Category:</span><span>{formData.casteCategory}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Sub-caste:</span><span>{formData.subCaste}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Occupation:</span><span>{formData.occupation}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Income:</span><span>{formData.incomeRange}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Education:</span><span>{formData.educationLevel}</span></div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-muted-foreground">Aadhar Verified:</span>
                    <span className={`font-medium ${aadharVerified ? 'text-green-600' : 'text-red-600'}`}>
                      {aadharVerified ? 'Yes ✓' : 'No ✗'}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <Checkbox id="confirm" checked={confirmed} onCheckedChange={(c) => setConfirmed(!!c)} />
                  <label htmlFor="confirm" className="text-sm leading-relaxed cursor-pointer">
                    I confirm that all information provided is accurate to the best of my knowledge.
                  </label>
                </div>
              </div>
            )}

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

