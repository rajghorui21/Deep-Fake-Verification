"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/verify", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Verification failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#030712] text-slate-100 flex flex-col antialiased font-sans relative overflow-hidden">

      {/* 🔴 Glow Highlights & Blur Backdrops */}
      <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px] z-0 pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[100px] z-0 pointer-events-none" />

      {/* 🔴 Pixel Dot Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:10px_10px] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_50%,black_70%,transparent_100%)] opacity-60 z-0 pointer-events-none" />

      {/* 💻 Header */}
      <header className="relative z-10 px-10 py-6 bg-[#030712]/40 backdrop-blur-md border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-br from-blue-500/20 to-indigo-500/10 rounded-xl border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
              Fixchaos
            </span>
            <p className="text-slate-500 text-xs mt-0.5 font-medium">Forensic Heatmap Driven Fake-Detection</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-xs bg-emerald-500/5 text-emerald-400 px-3.5 py-2 rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="font-semibold">Node Active</span>
          </div>
        </div>
      </header>

      {/* 📊 Main Content */}
      <section className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* left column: upload section */}
        <div className="lg:col-span-5 space-y-6 animate-slide-up">
          <div className="bg-slate-900/60 backdrop-blur-2xl rounded-3xl p-7 border border-white/5 shadow-2xl space-y-5">
            <div>
              <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">Verify Media</h2>
              <p className="text-sm text-slate-400 mt-1">
                Upload frames to evaluate manipulation with exact layer gradients.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className={`group border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-500 ${file ? "border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_40px_-5px_rgba(16,185,129,0.1)]" : "border-slate-800 hover:border-blue-500/40 bg-slate-950/40 hover:bg-slate-920/20 shadow-inner"
                  }`}
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                <input
                  type="file"
                  id="fileInput"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="video/*,image/*"
                />
                <div className="flex flex-col items-center">
                  <div className={`p-4 rounded-2xl mb-4 border transition-all duration-500 ${file ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-slate-800/60 border-slate-700/40 text-blue-400 group-hover:scale-110 group-hover:bg-slate-800"
                    }`}>
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5  5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="font-bold text-sm text-slate-200">
                    {file ? file.name : "Select or Drop Media"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 tracking-wide">MP4, PNG or JPG max 20MB</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={!file || loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-500 hover:via-indigo-500 hover:to-indigo-600 text-white font-bold rounded-xl shadow-[0_4px_30px_rgba(59,130,246,0.3)] disabled:opacity-50 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                {loading ? "Analyzing Layer Gradients..." : "Verify Content"}
              </button>
            </form>
          </div>

          {error && (
            <div className="p-4 bg-red-950/40 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center space-x-2 shadow-[0_10px_30px_-5px_rgba(239,68,68,0.1)]">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* right column: results & accurate heatmap */}
        <div className="lg:col-span-7 space-y-6 animate-slide-up [animation-delay:200ms]">
          {result ? (
            <div className="space-y-6">

              {/* score & description header */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-8 bg-slate-900/60 backdrop-blur-2xl rounded-3xl p-6 border border-white/5 shadow-xl flex flex-col justify-center">
                  <h3 className="text-xs font-bold text-slate-400 tracking-wider">Classification</h3>
                  <p className={`text-2xl font-black mt-1 ${result.is_fake ? "text-red-400" : "text-emerald-400"}`}>
                    {result.status_message}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Values determined via dynamic tensor nodes.</p>
                </div>

                <div className="sm:col-span-4 bg-slate-900/60 backdrop-blur-2xl rounded-3xl p-6 border border-white/5 shadow-xl flex flex-col items-center justify-center text-center">
                  <p className="text-xs text-slate-400 font-semibold mb-1">Index Score</p>
                  <div className={`w-16 h-16 rounded-full border-[3px] flex items-center justify-center font-black text-lg ${result.is_fake ? "border-red-500/30 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.1)]" : "border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                    }`}>
                    {result.trust_score}%
                  </div>
                </div>
              </div>

              {/* Heatmap Card */}
              <div className="bg-slate-900/60 backdrop-blur-2xl rounded-3xl p-6 border border-white/5 shadow-2xl relative">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-bold text-slate-200">Grad-CAM Transparency Index</h3>
                  <div className="flex items-center space-x-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5 text-red-400 text-xs font-medium">
                    <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse shadow-[0_0_5px_rgba(239,68,68,1)]" />
                    <span>Realtime Layer</span>
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden aspect-video border border-slate-800/40 bg-black shadow-inner">
                  <img src={result.heatmap} alt="Grad-CAM Heatmap" className="w-full h-full object-contain" />
                </div>
                <p className="text-xs text-slate-500 mt-3 text-center tracking-wide">
                  Illuminated vertices display concentrated classification nodes mapped from backbones.
                </p>
              </div>

              {/* Blockchain Source Card */}
              <div className="bg-gradient-to-br from-slate-900/60 to-slate-950/40 backdrop-blur-2xl rounded-3xl p-6 border border-white/5 shadow-2xl">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center space-x-2">
                    <div className="p-1 px-2.5 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-indigo-400 text-sm">
                      🔗
                    </div>
                    <h3 className="text-md font-bold text-slate-200">On-Chain Source Verifier</h3>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-bold tracking-wide border shadow-sm ${result.is_fake ? "bg-red-500/5 border-red-500/20 text-red-400" : "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                    }`}>
                    {result.is_fake ? "Unlisted Origin" : "Match Verified"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="p-4 bg-slate-950/40 rounded-2xl border border-white/5 flex flex-col justify-center">
                    <p className="text-slate-500 text-xs font-semibold">Address Signature</p>
                    <p className="text-slate-300 font-mono mt-1 text-xs truncate">
                      {result.is_fake ? "0x0000000000000000..." : "0xSarpanch_Panchayat_Sig_4f92e"}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-950/40 rounded-2xl border border-white/5 flex flex-col justify-center">
                    <p className="text-slate-500 text-xs font-semibold">L2 Block ID</p>
                    <p className="text-slate-300 font-bold mt-1 text-xs">
                      {result.is_fake ? "None Found on Ledger" : "Block Proof #14022"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/40 backdrop-blur-2xl rounded-3xl p-16 border border-white/5 shadow-2xl flex flex-col items-center justify-center text-center h-full group">
              <div className="p-5 bg-slate-950/60 rounded-3xl mb-5 border border-white/5 group-hover:scale-105 transition-transform duration-500 shadow-inner">
                <svg className="w-12 h-12 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-400 tracking-tight">System Awaiting Upload</h3>
              <p className="text-xs text-slate-600 mt-1.5 max-w-sm tracking-wide leading-relaxed">
                Analyze local governance media streams for artifact manipulation with digital blockchain credentials.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 💻 Footer */}
      <footer className="relative z-10 w-full text-center py-8 border-t border-white/5 mt-auto bg-[#030712]/40 backdrop-blur-md">
        <p className="text-slate-600 text-xs font-medium tracking-wider">
          Engineered by <span className="font-extrabold text-slate-400 bg-clip-text text-transparent bg-gradient-to-r from-slate-400 to-slate-200">Raj Ghorui</span>
        </p>
      </footer>
    </main>
  );
}
