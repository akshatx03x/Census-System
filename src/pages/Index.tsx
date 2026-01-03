import React, { useState, useEffect } from 'react';
import { Shield, Database, Brain, Lock, Users, ChevronRight, CheckCircle, FileText, Globe, Sparkles, Zap, Award, TrendingUp, Eye, ArrowRight } from "lucide-react";

const Index = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(249,115,22,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(34,197,94,0.1),transparent_50%)]"></div>
      </div>

      {/* Top Bar */}
      <div className="relative bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 text-white py-2 shadow-lg">
        <div className="container mx-auto px-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4 animate-fade-in">
            <span className="hover:text-orange-100 cursor-pointer transition-colors">Screen Reader Access</span>
            <span className="hover:text-orange-100 cursor-pointer transition-colors">Skip to Main Content</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-white/20 rounded-full hover:bg-white/30 cursor-pointer transition-all">English</span>
            <span className="px-3 py-1 hover:bg-white/20 rounded-full cursor-pointer transition-all">हिन्दी</span>
            <span className="flex items-center gap-1 px-3 py-1 hover:bg-white/20 rounded-full cursor-pointer transition-all">
              <Globe className="h-3 w-3" /> More
            </span>
          </div>
        </div>
      </div>

      {/* Header Navigation */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-slate-950/95 backdrop-blur-xl shadow-2xl' : 'bg-transparent'}`}>
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-xl">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white tracking-tight">Census India</h1>
                  <p className="text-xs text-blue-300">Government of India</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2.5 border-2 border-blue-400 text-blue-300 rounded-lg hover:bg-blue-400 hover:text-white font-medium text-sm transition-all duration-300 transform hover:scale-105">
                Citizen Login
              </button>
              <button className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 font-medium text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                Admin Portal
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500/20 to-blue-500/20 backdrop-blur-xl border border-white/10 text-sm mb-8 shadow-xl animate-fade-in">
              <Sparkles className="h-4 w-4 text-orange-400 animate-pulse" />
              <span className="text-white font-medium">Secure & Transparent Census System</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight animate-fade-in">
              <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 bg-clip-text text-transparent">
                Technology-Enabled
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-orange-300 to-orange-400 bg-clip-text text-transparent">
                Secure Census
              </span>
              <br />
              <span className="text-white">Management System</span>
            </h1>
            
            <p className="text-xl text-blue-200 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in" style={{animationDelay: '0.2s'}}>
              Empowering inclusive governance through blockchain-verified data collection, 
              AI-powered analytics, and privacy-first design for building a more equitable India.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{animationDelay: '0.4s'}}>
              <button className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-bold text-base transition-all duration-300 shadow-2xl hover:shadow-orange-500/50 transform hover:scale-105 flex items-center justify-center gap-2">
                Start Census Submission 
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-white/40 text-white rounded-xl font-bold text-base transition-all duration-300">
                Learn About Privacy
              </button>
            </div>

            {/* Floating Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 animate-fade-in" style={{animationDelay: '0.6s'}}>
              {[
                { value: "100%", label: "Secure", icon: Shield },
                { value: "256-bit", label: "Encrypted", icon: Lock },
                { value: "AI", label: "Powered", icon: Brain },
                { value: "Blockchain", label: "Verified", icon: Database }
              ].map((stat, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group">
                  <stat.icon className="h-8 w-8 mx-auto mb-2 text-orange-400 group-hover:scale-110 transition-transform" />
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-blue-300 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/10 text-sm mb-6">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-white font-medium">Cutting-Edge Technology</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              How the System Works
            </h2>
            <p className="text-blue-200 max-w-2xl mx-auto text-lg">
              Our system combines cutting-edge technology to ensure data security, transparency, and actionable insights.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Database,
                title: "Blockchain Verification",
                desc: "Every submission is cryptographically hashed and recorded on an immutable distributed ledger, ensuring tamper-proof data integrity.",
                gradient: "from-blue-500 to-cyan-500",
                bgGradient: "from-blue-500/10 to-cyan-500/10"
              },
              {
                icon: Brain,
                title: "AI-Powered Analytics",
                desc: "Real-time machine learning algorithms help policymakers identify socio-economic trends and make data-driven decisions.",
                gradient: "from-orange-500 to-red-500",
                bgGradient: "from-orange-500/10 to-red-500/10"
              },
              {
                icon: Lock,
                title: "Privacy-First Design",
                desc: "End-to-end AES-256 encryption and minimal data retention protocols ensure your personal information remains protected.",
                gradient: "from-green-500 to-emerald-500",
                bgGradient: "from-green-500/10 to-emerald-500/10"
              }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105 animate-fade-in"
                style={{animationDelay: `${i * 0.1}s`}}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <div className="relative">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-blue-200 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-12 border border-white/20 shadow-2xl">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 text-sm font-medium mb-6">
                    <Award className="h-4 w-4 text-green-400" />
                    <span className="text-green-300">Data Protection Certified</span>
                  </div>
                  <h2 className="text-4xl font-black text-white mb-6">Your Data, Your Rights</h2>
                  <p className="text-blue-200 mb-8 leading-relaxed text-lg">
                    We adhere to the highest international standards of data protection. Aadhaar and PAN are used solely 
                    for verification purposes and are never stored in our systems.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Lock, text: "End-to-end Encryption", color: "blue" },
                      { icon: Database, text: "Blockchain Verified", color: "purple" },
                      { icon: Shield, text: "GDPR Compliant", color: "green" },
                      { icon: Eye, text: "Full Transparency", color: "orange" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                          <item.icon className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-sm font-medium text-white">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-blue-500/30 rounded-2xl blur-2xl"></div>
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-12 text-center border border-white/20 shadow-xl">
                    <TrendingUp className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                    <div className="text-7xl font-black bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent mb-3">100%</div>
                    <div className="text-lg font-bold text-white mb-2">Data Transparency</div>
                    <div className="text-sm text-blue-300">Verified & Auditable</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 to-blue-500/30 rounded-3xl blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-12 border border-white/20">
                <Sparkles className="h-12 w-12 text-orange-400 mx-auto mb-6 animate-pulse" />
                <h2 className="text-4xl font-black text-white mb-6">Ready to Get Started?</h2>
                <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto">
                  Join millions of citizens contributing to India's most secure and transparent census system.
                </p>
                <button className="group px-10 py-5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-orange-500/50 transform hover:scale-105 inline-flex items-center gap-3">
                  Submit Your Census Now
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prototype Notice */}
      <section className="relative py-6 border-t border-amber-500/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-amber-300">
            <strong className="font-bold">Prototype Notice:</strong> This is a demonstration system. No real Aadhaar or PAN data is collected or stored.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-slate-950 border-t border-white/10 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-xl text-white">Census India</span>
              </div>
              <p className="text-sm text-blue-300">Government of India Initiative</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-3 text-sm text-blue-300">
                <li className="hover:text-orange-400 cursor-pointer transition-colors">Citizen Portal</li>
                <li className="hover:text-orange-400 cursor-pointer transition-colors">Admin Login</li>
                <li className="hover:text-orange-400 cursor-pointer transition-colors">Help & Support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Legal</h4>
              <ul className="space-y-3 text-sm text-blue-300">
                <li className="hover:text-orange-400 cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-orange-400 cursor-pointer transition-colors">Terms of Service</li>
                <li className="hover:text-orange-400 cursor-pointer transition-colors">Data Protection</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Contact</h4>
              <ul className="space-y-3 text-sm text-blue-300">
                <li>Email: census@gov.in</li>
                <li>Helpline: 1800-XXX-XXXX</li>
                <li>Mon-Fri: 9 AM - 6 PM IST</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-blue-300">
            <p>© 2024 Census Management System. All rights reserved.</p>
            <p className="flex items-center gap-2">
              Powered by <span className="text-orange-400 font-semibold">Government of India</span>
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Index;