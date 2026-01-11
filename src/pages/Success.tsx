import React, { useEffect, useState } from 'react';
import { CheckCircle, Database, Shield, Download, Home, FileCheck, Clock, Lock, ExternalLink, Copy, Check } from "lucide-react";
import jsPDF from 'jspdf';
import { useNavigate } from "react-router-dom";
const Success = () => {
  const navigate = useNavigate();
  const [hash, setHash] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [copied, setCopied] = useState(false);
  const [submissionId, setSubmissionId] = useState('');
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Load form data from localStorage
    const storedData = localStorage.getItem('census_form_data');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setUserData(parsedData);
      setSubmissionId(parsedData.submissionId);
      setTimestamp(parsedData.timestamp);
    }

    // Generate mock blockchain hash
    const chars = '0123456789abcdef';
    let mockHash = '0x';
    for (let i = 0; i < 64; i++) {
      mockHash += chars[Math.floor(Math.random() * chars.length)];
    }
    setHash(mockHash);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReceipt = () => {
    const doc = new jsPDF();

    // Set up the PDF
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Government of India', 105, 20, { align: 'center' });
    doc.setFontSize(16);
    doc.text('Census Submission Receipt', 105, 35, { align: 'center' });

    // Add a line separator
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    // Submission Details
    doc.setFont('helvetica', 'bold');
    doc.text('Submission Details:', 20, 60);
    doc.setFont('helvetica', 'normal');
    doc.text(`Submission ID: ${submissionId}`, 20, 75);
    doc.text(`Blockchain Hash: ${hash.substring(0, 32)}...`, 20, 85);
    doc.text(`Timestamp: ${new Date(timestamp).toLocaleString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Kolkata'
    })} IST`, 20, 95);

    // Personal Information Section
    if (userData) {
      doc.setFont('helvetica', 'bold');
      doc.text('Personal Information:', 20, 115);
      doc.setFont('helvetica', 'normal');
      doc.text(`Name: ${userData.name}`, 20, 130);
      doc.text(`Age: ${userData.age} years`, 20, 140);
      doc.text(`Gender: ${userData.gender}`, 20, 150);
      doc.text(`Aadhar Number: ${userData.aadhar_number}`, 20, 160);

      // Address Section
      doc.setFont('helvetica', 'bold');
      doc.text('Address Information:', 20, 180);
      doc.setFont('helvetica', 'normal');
      doc.text(`Address: ${userData.address}`, 20, 195);
      doc.text(`State: ${userData.state}`, 20, 205);
      doc.text(`District: ${userData.district}`, 20, 215);

      // Socio-Economic Information
      doc.setFont('helvetica', 'bold');
      doc.text('Socio-Economic Details:', 20, 235);
      doc.setFont('helvetica', 'normal');
      doc.text(`Caste Category: ${userData.caste_category}`, 20, 250);
      doc.text(`Sub-Caste: ${userData.sub_caste || 'Not specified'}`, 20, 260);
      doc.text(`Occupation: ${userData.occupation}`, 20, 270);
      doc.text(`Annual Income: ${userData.income_range}`, 20, 280);
      doc.text(`Education Level: ${userData.education_level}`, 20, 290);
    }

    // Processing Status
    doc.setFont('helvetica', 'bold');
    doc.text('Processing Status:', 20, 310);
    doc.setFont('helvetica', 'normal');
    doc.text('✓ Data Encrypted with AES-256', 30, 325);
    doc.text('✓ Blockchain Verification Completed', 30, 335);
    doc.text('✓ Government Database Updated', 30, 345);
    doc.text('✓ Confirmation Generated', 30, 355);

    // Footer
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.text('This receipt confirms successful submission to the National Census System.', 20, 375);
    doc.text('Your data has been securely recorded and verified on the blockchain.', 20, 385);
    doc.text('For any queries, contact: support@census.gov.in', 20, 395);

    // Add official seal/watermark
    doc.setFontSize(8);
    doc.setTextColor(200, 200, 200);
    doc.text('OFFICIAL DOCUMENT - Government of India', 105, 410, { align: 'center' });

    // Save the PDF
    doc.save(`Census_Receipt_${submissionId}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50">
      {/* Top Bar */}
      <div className="bg-green-600 text-white py-2">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4" />
            <span className="font-medium">Submission Successful</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6 shadow-2xl animate-pulse-slow">
              <CheckCircle className="h-14 w-14 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
              Census Submitted Successfully!
            </h1>
            <p className="text-lg text-slate-600">
              Your data has been securely recorded and verified on the blockchain.
            </p>
          </div>

          {/* Main Details Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 border-2 border-green-100">
            {/* Status Banner */}
            <div className="bg-gradient-to-r from-green-600 to-green-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <FileCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Submission ID</p>
                    <p className="text-xl font-bold">{submissionId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="p-8 space-y-6">
              {/* Blockchain Hash */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Database className="h-4 w-4 text-blue-600" />
                  <span>Blockchain Transaction Hash</span>
                </div>
                <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-3">
                    <code className="text-xs font-mono text-slate-700 break-all flex-1">{hash}</code>
                    <button
                      onClick={copyToClipboard}
                      className="flex-shrink-0 p-2 hover:bg-slate-200 rounded-lg transition-colors"
                      title="Copy hash"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-slate-600" />
                      )}
                    </button>
                  </div>
                  <button className="mt-3 flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 font-medium">
                    <ExternalLink className="h-3 w-3" />
                    View on Blockchain Explorer
                  </button>
                </div>
              </div>

              {/* Timestamp */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span>Submission Timestamp</span>
                </div>
                <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-slate-800">
                    {new Date(timestamp).toLocaleString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      timeZone: 'Asia/Kolkata'
                    })} IST
                  </p>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Shield className="h-4 w-4 text-purple-600" />
                  <span>Processing Status</span>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Data Encrypted', status: 'completed', icon: Lock },
                    { label: 'Blockchain Verification', status: 'completed', icon: Database },
                    { label: 'Government Database Updated', status: 'completed', icon: FileCheck },
                    { label: 'Confirmation Generated', status: 'completed', icon: CheckCircle }
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <step.icon className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-700">{step.label}</p>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Security Info Card */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 mb-6 border-2 border-blue-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-3 text-lg">How Your Data is Protected</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Personal data encrypted with military-grade AES-256 encryption</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Only cryptographic hash stored on blockchain (not raw data)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Immutable blockchain record ensures no tampering or modification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Zero-knowledge proofs protect your identity during verification</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={downloadReceipt}
              className="px-6 py-4 bg-white border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
            >
              <Download className="h-5 w-5 group-hover:scale-110 transition-transform" />
              Download Receipt (PDF)
            </button>
            <button onClick={() => navigate('/written-policies')} className="px-6 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:from-green-500 hover:to-green-400 font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group">
              <FileCheck className="h-5 w-5 group-hover:scale-110 transition-transform" />
              View Written Policies
            </button>
            <button onClick={() => navigate('/')} className="px-6 py-4 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-xl hover:from-blue-800 hover:to-blue-700 font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group">
              <Home className="h-5 w-5 group-hover:scale-110 transition-transform" />
              Return to Home
            </button>
          </div>

          {/* Footer Note */}
          <div className="text-center">
            <p className="text-sm text-slate-600">
              Keep your submission ID <strong className="text-slate-800">{submissionId}</strong> for future reference.
              <br />
              For queries, contact census support at <span className="text-blue-600">support@census.gov.in</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;