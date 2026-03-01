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
    <div className="min-h-screen transition-colors duration-300 bg-slate-50 dark:bg-slate-950">
      {/* Transparent Banner */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-40 px-4 pt-4 pointer-events-none"
      >
        <div 
          onClick={handleBannerClick}
          className="max-w-2xl mx-auto bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/20 dark:border-slate-700/30 rounded-full px-6 py-2 flex items-center justify-between cursor-pointer pointer-events-auto hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all shadow-sm"
        >
          <span className="text-emerald-800 dark:text-emerald-300 font-medium text-sm sm:text-base">
            ✨ إشراقة قرآنية اليوم: تأمل في آيات الله
          </span>
          <Sparkles className="w-4 h-4 text-gold-500" />
        </div>
      </motion.div>

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <header className="text-center mb-12">
          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl sm:text-5xl font-bold text-emerald-900 dark:text-emerald-400 mb-2 quran-text"
          >
            رفيقك مع كتاب الله
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 dark:text-slate-400 font-medium"
          >
            إعداد الأستاذ القدير: صالح الرفاعي
          </motion.p>
          
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="mt-4 p-2 rounded-full bg-white dark:bg-slate-800 shadow-md hover:scale-110 transition-transform"
          >
            {isDarkMode ? <Sun className="text-gold-400" /> : <Moon className="text-emerald-800" />}
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
              className="w-full px-6 py-4 pr-14 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-100 dark:border-emerald-900/30 focus:border-emerald-500 dark:focus:border-emerald-500 outline-none shadow-lg text-lg transition-all"
            />
            <button 
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-emerald-600 hover:text-emerald-800 transition-colors"
            >
              <Search className="w-6 h-6" />
            </button>
          </form>

          <div className="flex justify-center mt-6">
            <button
              onClick={handleDiscover}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white rounded-xl font-bold shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles className="w-5 h-5 text-gold-400" />}
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
              <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
              <p className="text-emerald-800 dark:text-emerald-400 font-medium animate-pulse">جاري استخراج الأسرار البيانية...</p>
            </motion.div>
          )}

          {result && !loading && (
            <motion.div
              key="result"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-emerald-50 dark:border-emerald-900/20 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16" />
              
              <div className="flex justify-end gap-3 mb-6 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm py-2 z-10">
                <button 
                  onClick={() => copyToClipboard(result)}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                  title="نسخ"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => shareToWhatsApp(result)}
                  className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors"
                  title="مشاركة عبر واتساب"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="markdown-body prose dark:prose-invert max-w-none">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Banner Modal */}
      <AnimatePresence>
        {showBannerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl p-8 relative shadow-2xl"
            >
              <button 
                onClick={() => setShowBannerModal(false)}
                className="absolute top-4 left-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-3 mb-6 text-emerald-800 dark:text-emerald-400">
                <BookOpen className="w-8 h-8" />
                <h2 className="text-2xl font-bold">إشراقة قرآنية</h2>
              </div>

              {bannerLoading ? (
                <div className="flex flex-col items-center py-12">
                  <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
                  <p>جاري التحميل...</p>
                </div>
              ) : (
                <div className="markdown-body">
                  <ReactMarkdown>{bannerInsight || ''}</ReactMarkdown>
                  <div className="mt-8 flex justify-center gap-4">
                    <button 
                      onClick={() => bannerInsight && copyToClipboard(bannerInsight)}
                      className="flex items-center gap-2 px-6 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                      <Copy className="w-4 h-4" /> نسخ الفائدة
                    </button>
                    <button 
                      onClick={() => bannerInsight && shareToWhatsApp(bannerInsight)}
                      className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
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

      <footer className="text-center py-8 text-slate-500 dark:text-slate-600 text-sm">
        <p>© {new Date().getFullYear()} رفيقك مع كتاب الله - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
}
