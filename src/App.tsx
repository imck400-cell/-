/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sparkles, Copy, Share2, Moon, Sun, X, Loader2, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getQuranInsight } from './services/geminiService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [bannerInsight, setBannerInsight] = useState<string | null>(null);
  const [bannerLoading, setBannerLoading] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const insight = await getQuranInsight(query);
      setResult(insight || null);
    } catch (error) {
      console.error(error);
      setResult("عذراً، حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const handleDiscover = async () => {
    setLoading(true);
    try {
      const insight = await getQuranInsight('', true);
      setResult(insight || null);
    } catch (error) {
      console.error(error);
      setResult("عذراً، حدث خطأ أثناء جلب البيانات.");
    } finally {
      setLoading(false);
    }
  };

  const handleBannerClick = async () => {
    setShowBannerModal(true);
    if (!bannerInsight) {
      setBannerLoading(true);
      try {
        const insight = await getQuranInsight('إشراقة قرآنية لليوم', true);
        setBannerInsight(insight || null);
      } catch (error) {
        console.error(error);
      } finally {
        setBannerLoading(false);
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('تم النسخ إلى الحافظة');
  };

  const shareToWhatsApp = (text: string) => {
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-emerald-950 text-slate-100 relative overflow-x-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Islamic Background Overlay (Matches the user's image vibe) */}
        <div className="absolute inset-0 islamic-bg-overlay" />
        
        {/* Islamic Pattern Overlay */}
        <div className="absolute inset-0 islamic-pattern" />
        
        {/* Subtle Quran Image Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl opacity-[0.05]">
          <img 
            src="https://images.unsplash.com/photo-1584281723358-461f7555829e?auto=format&fit=crop&q=80&w=1000" 
            alt="Quran Background" 
            className="w-full h-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Floating Emojis/Icons */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] right-[10%] text-4xl opacity-30"
        >
          📖
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[20%] left-[15%] text-5xl opacity-30"
        >
          🕌
        </motion.div>
        <motion.div 
          animate={{ y: [0, -15, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[40%] left-[5%] text-3xl opacity-30"
        >
          ✨
        </motion.div>
        <motion.div 
          animate={{ y: [0, 25, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-[10%] right-[20%] text-4xl opacity-30"
        >
          🌙
        </motion.div>
      </div>

      {/* Transparent Banner */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-40 px-4 pt-4 pointer-events-none"
      >
        <div 
          onClick={handleBannerClick}
          className="max-w-2xl mx-auto bg-emerald-900/40 backdrop-blur-md border border-gold-500/20 rounded-full px-6 py-2 flex items-center justify-between cursor-pointer pointer-events-auto hover:bg-emerald-800/60 transition-all shadow-lg"
        >
          <span className="text-gold-300 font-medium text-sm sm:text-base">
            ✨ إشراقة قرآنية اليوم: تأمل في آيات الله
          </span>
          <Sparkles className="w-4 h-4 text-gold-400" />
        </div>
      </motion.div>

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-12 relative z-10">
        {/* Header */}
        <header className="text-center mb-12">
          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl sm:text-5xl font-bold text-gold-400 mb-2 quran-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          >
            رفيقك مع كتاب الله
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gold-200/80 font-medium"
          >
            إعداد الأستاذ القدير: صالح الرفاعي
          </motion.p>
          
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="mt-4 p-2 rounded-full bg-emerald-900/50 border border-gold-500/30 shadow-md hover:scale-110 transition-transform"
          >
            {isDarkMode ? <Sun className="text-gold-400" /> : <Moon className="text-gold-400" />}
          </button>
        </header>

        {/* Search Section */}
        <section className="mb-12">
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن آية، سورة، أو لفظة قرآنية..."
              className="w-full px-6 py-4 pr-14 rounded-2xl bg-emerald-900/40 backdrop-blur-sm border-2 border-gold-500/20 focus:border-gold-400 outline-none shadow-2xl text-lg transition-all text-white placeholder:text-gold-200/40"
            />
            <button 
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gold-400 hover:text-gold-200 transition-colors"
            >
              <Search className="w-6 h-6" />
            </button>
          </form>

          <div className="flex justify-center mt-6">
            <button
              onClick={handleDiscover}
              disabled={loading}
              className="btn-gold flex items-center gap-2 px-8 py-3 rounded-xl"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles className="w-5 h-5" />}
              اكتشف المزيد ✨
            </button>
          </div>
        </section>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <Loader2 className="w-12 h-12 text-gold-400 animate-spin mb-4" />
              <p className="text-gold-300 font-medium animate-pulse">جاري استخراج الأسرار البيانية...</p>
            </motion.div>
          )}

          {result && !loading && (
            <motion.div
              key="result"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-emerald-900/40 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-gold-500/20 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full -mr-16 -mt-16" />
              
              <div className="flex justify-end gap-3 mb-6 sticky top-0 bg-emerald-950/80 backdrop-blur-sm py-2 z-10 rounded-xl px-2">
                <button 
                  onClick={() => copyToClipboard(result)}
                  className="p-2 rounded-lg bg-emerald-800/50 text-gold-300 hover:bg-gold-500 hover:text-emerald-950 transition-colors"
                  title="نسخ"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => shareToWhatsApp(result)}
                  className="p-2 rounded-lg bg-emerald-800/50 text-gold-300 hover:bg-emerald-600 hover:text-white transition-colors"
                  title="مشاركة عبر واتساب"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="markdown-body prose prose-invert max-w-none prose-headings:text-gold-400 prose-strong:text-gold-300 prose-p:text-slate-200">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Banner Modal */}
      <AnimatePresence>
        {showBannerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-emerald-900 border border-gold-500/30 w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl p-8 relative shadow-2xl"
            >
              <button 
                onClick={() => setShowBannerModal(false)}
                className="absolute top-4 left-4 p-2 rounded-full hover:bg-emerald-800 text-gold-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-3 mb-6 text-gold-400">
                <BookOpen className="w-8 h-8" />
                <h2 className="text-2xl font-bold">إشراقة قرآنية</h2>
              </div>

              {bannerLoading ? (
                <div className="flex flex-col items-center py-12">
                  <Loader2 className="w-10 h-10 text-gold-400 animate-spin mb-4" />
                  <p className="text-gold-200">جاري التحميل...</p>
                </div>
              ) : (
                <div className="markdown-body prose prose-invert max-w-none">
                  <ReactMarkdown>{bannerInsight || ''}</ReactMarkdown>
                  <div className="mt-8 flex justify-center gap-4">
                    <button 
                      onClick={() => bannerInsight && copyToClipboard(bannerInsight)}
                      className="flex items-center gap-2 px-6 py-2 bg-emerald-800 text-gold-300 rounded-lg hover:bg-gold-500 hover:text-emerald-950 transition-colors"
                    >
                      <Copy className="w-4 h-4" /> نسخ الفائدة
                    </button>
                    <button 
                      onClick={() => bannerInsight && shareToWhatsApp(bannerInsight)}
                      className="flex items-center gap-2 px-6 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                      <Share2 className="w-4 h-4" /> مشاركة
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="text-center py-8 text-gold-500/40 text-sm relative z-10">
        <p>© {new Date().getFullYear()} رفيقك مع كتاب الله - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
}
