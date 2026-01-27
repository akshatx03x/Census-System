import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Shield, Database, Brain, Lock, Users, ChevronRight,
  Globe, Sparkles, Zap, Award, TrendingUp, BarChart3,
  Map, Fingerprint, Search, Menu, X
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-emerald-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>
      <div className="relative z-[60] bg-slate-950 border-b border-slate-800/50 py-1.5 px-4">
        <div className="container mx-auto flex justify-between items-center text-[10px] uppercase tracking-widest font-semibold text-slate-400">
          <div className="flex gap-6">
            <span
              className="hover:text-emerald-400 cursor-pointer transition-colors"
              onClick={() => window.open('https://www.mha.gov.in/en', '_blank')}
            >
              {t('Ministry of Home Affairs')}
            </span>
            <span
              className="hover:text-emerald-400 cursor-pointer transition-colors"
              onClick={() => window.open('https://www.digitalindia.gov.in/', '_blank')}
            >
              {t('Digital India')}
            </span>
          </div>
          <div className="flex gap-4 items-center">
            <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {t('Accessibility')}</span>
            <div className="h-3 w-px bg-slate-800" />
            <button
              onClick={() => changeLanguage('en')}
              className={`hover:text-emerald-400 transition-colors ${i18n.language === 'en' ? 'text-emerald-500' : ''}`}
            >
              {t('English')}
            </button>
            <button
              onClick={() => changeLanguage('hi')}
              className={`hover:text-emerald-400 transition-colors ${i18n.language === 'hi' ? 'text-emerald-500' : ''}`}
            >
              {t('हिन्दी')}
            </button>
          </div>
        </div>
      </div>

      <header className={`sticky top-0 z-50 transition-all duration-500 ${isScrolled ? 'py-3 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50' : 'py-6 bg-transparent'}`}>
        <nav className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Shield className="text-slate-950 w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white leading-none">{t('CENSUS INDIA')}</h1>
              <p className="text-[10px] text-emerald-500 font-bold tracking-[0.2em] uppercase">{t('National Portal')}</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            {['Statistics', 'Methodology', 'Privacy', 'Resources'].map((item) => (
              <a key={item} href="#" className="hover:text-white transition-colors relative group">
                {t(item)}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-emerald-500 transition-all group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/auth')}
              className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              {t('Citizen Login')}
            </button>
            <button
              onClick={() => navigate('/admin/login')}
              className="bg-white text-slate-950 px-5 py-2 rounded-full text-sm font-bold hover:bg-emerald-400 transition-all transform hover:scale-105 shadow-xl shadow-white/5"
            >
              {t('Admin Login')}
            </button>
          </div>
        </nav>
      </header>

      <main>
        <section className="pt-20 pb-32 px-6">
          <div className="container mx-auto">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-8 tracking-wide">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {t('2026 CENSUS PHASE II NOW ACTIVE')}
              </div>

              <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tight leading-[0.9]">
                {t('The Foundation of Governance.')}
              </h1>

              <p className="text-xl text-slate-400 max-w-2xl leading-relaxed mb-12">
                {t('A secure, cryptographic infrastructure for national data collection. Ensuring every citizen is counted, every voice is heard, and your privacy is mathematically guaranteed.')}
              </p>

              <div className="flex flex-wrap gap-6">
                <button onClick={()=> navigate('/auth')} className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold transition-all group">
                  {t('Begin Digital Submission')}
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={()=>navigate('/admin/login')} className="flex items-center gap-3 bg-slate-900 border border-slate-800 hover:border-slate-700 text-white px-8 py-4 rounded-xl font-bold transition-all">
                  <BarChart3 className="w-5 h-5 text-emerald-500" />
                  {t('View Public Metrics')}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-slate-950/50 relative">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
              
              <div className="md:col-span-8 bg-slate-900/40 border border-slate-800 p-10 rounded-[2rem] hover:border-emerald-500/30 transition-colors group">
                <div className="flex justify-between items-start mb-12">
                  <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                    <Brain className="text-emerald-500 w-8 h-8" />
                  </div>
                  <span className="text-[10px] font-black tracking-[0.2em] text-slate-500 group-hover:text-emerald-500 transition-colors">{t('PRECISION ANALYTICS')}</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">{t('AI-Driven Insights')}</h3>
                <p className="text-slate-400 text-lg max-w-xl">
                  {t('Leveraging advanced machine learning to predict demographic shifts and optimize resource distribution across 700+ districts.')}
                </p>
              </div>
              <div className="md:col-span-4 bg-gradient-to-b from-emerald-600 to-teal-700 p-10 rounded-[2rem] text-white">
                <Lock className="w-12 h-12 mb-8 opacity-50" />
                <h3 className="text-3xl font-bold mb-4 leading-tight">{t('Zero-Knowledge Architecture')}</h3>
                <p className="text-emerald-100 opacity-90">
                  {t('Your identity is verified via encrypted hashes. We never store raw biometrics or sensitive documents.')}
                </p>
                <div className="mt-8 pt-8 border-t border-white/10 text-xs font-mono uppercase tracking-widest opacity-60">
                  AES-256-GCM Protocol
                </div>
              </div>

              <div className="md:col-span-4 bg-slate-900/40 border border-slate-800 p-10 rounded-[2rem]">
                <Map className="text-blue-400 w-10 h-10 mb-6" />
                <h3 className="text-xl font-bold text-white mb-2">{t('Geospatial Integrity')}</h3>
                <p className="text-slate-400 text-sm">{t('Automated GIS tagging ensures data accuracy across rural and urban landscapes.')}</p>
              </div>

              <div className="md:col-span-8 bg-slate-900/40 border border-slate-800 p-10 rounded-[2rem] flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <Database className="text-amber-500 w-10 h-10 mb-6" />
                  <h3 className="text-xl font-bold text-white mb-2">{t('Immutable Ledger')}</h3>
                  <p className="text-slate-400 text-sm">{t('Publicly auditable hashing ensures that once your data is submitted, it cannot be tampered with by any authority.')}</p>
                </div>
                <div className="w-full md:w-48 h-32 bg-slate-800/50 rounded-xl border border-slate-700/50 flex flex-col items-center justify-center p-4">
                  <div className="text-2xl font-mono font-bold text-emerald-500">99.9%</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-tighter">{t('Uptime Reliability')}</div>
                </div>
              </div>

            </div>
          </div>
        </section>
        <section className="py-24">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <Fingerprint className="w-16 h-16 text-emerald-500 mx-auto mb-8 opacity-50" />
              <h2 className="text-4xl font-bold text-white mb-6">{t('Sovereignty Over Your Information')}</h2>
              <p className="text-slate-400 text-lg mb-12">
                {t('We implement the strictest "Privacy by Design" principles. Every piece of data is tokenized, meaning individual records are decoupled from identity markers during processing.')}
              </p>
              <div className="flex justify-center gap-12">
                <div>
                  <div className="text-3xl font-bold text-white">ISO 27001</div>
                  <div className="text-xs text-emerald-500 uppercase tracking-widest font-bold">{t('Certified')}</div>
                </div>
                <div className="w-px h-12 bg-slate-800" />
                <div>
                  <div className="text-3xl font-bold text-white">GDPR-I</div>
                  <div className="text-xs text-emerald-500 uppercase tracking-widest font-bold">{t('Compliant')}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 border-t border-slate-800 pt-20 pb-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="text-emerald-500 w-8 h-8" />
                <span className="text-xl font-bold text-white tracking-tight">{t('Census India 2026')}</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                {t('The Office of the Registrar General & Census Commissioner, India. Under the Ministry of Home Affairs, Government of India.')}
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 text-sm">{t('Services')}</h4>
              <ul className="text-slate-500 text-sm space-y-4">
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">{t('Citizen Login')}</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">{t('Admin Access')}</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">{t('Mobile Application')}</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 text-sm">{t('Legal')}</h4>
              <ul className="text-slate-500 text-sm space-y-4">
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">{t('Privacy Policy')}</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">{t('Data Standards')}</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">{t('Cyber Security')}</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 text-sm">{t('Support')}</h4>
              <ul className="text-slate-500 text-sm space-y-4">
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">{t('Help Desk')}</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">{t('Nodal Officers')}</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">{t('FAQs')}</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-600 text-xs">
              {t('© 2026 Registrar General of India. All Rights Reserved.')}
            </div>
            <div className="flex gap-6 text-[10px] font-bold text-slate-500 tracking-widest uppercase">
              <span>{t('National Informatics Centre')}</span>
              <span>{t('Digital India Initiative')}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;