"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, Loader2, Scan, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { analyzeResume } from "@/lib/actions/resume-checks";
import { extractTextFromFile } from "@/lib/ats/client-parser";
import type { AtsResult } from "@/lib/ats/engine";
import { AtsResults } from "@/components/ats/ats-results";

const SCAN_STEPS = [
  { label: "Extracting text from document" },
  { label: "Parsing contact information" },
  { label: "Identifying section headers" },
  { label: "Scanning for action verbs" },
  { label: "Analyzing quantifiable results" },
  { label: "Evaluating resume length & format" },
  { label: "Comparing against job description" },
  { label: "Calculating ATS compatibility score" },
];

export function AtsForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<AtsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [showScanLine, setShowScanLine] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setScanStep(0);
    setShowScanLine(true);

    const scanTimer = startScanAnimation();

    try {
      const text = await extractTextFromFile(file, file.name);

      if (!text.trim()) {
        clearInterval(scanTimer);
        setLoading(false);
        setShowScanLine(false);
        setError("Could not extract any text from the file.");
        return;
      }

      await new Promise((r) => setTimeout(r, 1000));

      const formData = new FormData();
      formData.append("text", text);
      formData.append("filename", file.name);
      if (jobDescription.trim()) {
        formData.append("jobDescription", jobDescription.trim());
      }

      const res = await analyzeResume(formData);

      clearInterval(scanTimer);
      setLoading(false);
      setShowScanLine(false);

      if ("error" in res) {
        setError(res.error);
      } else {
        setResult(res.result);
        router.refresh();
      }
    } catch {
      clearInterval(scanTimer);
      setLoading(false);
      setShowScanLine(false);
      setError("Something went wrong. Please try again.");
    }
  };

  const startScanAnimation = () => {
    let step = 0;
    const timer = setInterval(() => {
      step++;
      if (step < SCAN_STEPS.length) {
        setScanStep(step);
      } else {
        clearInterval(timer);
      }
    }, 450);
    return timer;
  };

  const handleReset = () => {
    // ponytail: file input is uncontrolled — resetting state clears the controlled fields
    setFile(null);
    setResult(null);
    setError(null);
    setJobDescription("");
    setScanStep(0);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File upload — scanner bed */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1.5">
            Upload Resume
          </label>
          <div className="relative scanner-bed">
            <span className="corner-bl" />
            <span className="corner-br" />
            <label
              className={cn(
                "flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-md cursor-pointer transition-colors",
                file
                  ? "border-primary bg-primary/5"
                  : "border-white/20 hover:border-primary/50 hover:bg-white/5"
              )}
            >
              {file ? (
                <>
                  <FileText className="w-8 h-8 text-primary" />
                  <span className="text-sm text-white/80">{file.name}</span>
                  <span className="text-xs text-white/40">
                    {(file.size / 1024).toFixed(0)} KB
                  </span>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-white/40" />
                  <span className="text-sm text-white/60">
                    Drop a file or click to browse
                  </span>
                  <span className="text-xs text-white/40">
                    PDF, DOCX, or TXT
                  </span>
                </>
              )}
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
        </div>

        {/* Optional job description */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1.5">
            Job Description{" "}
            <span className="text-white/40 font-normal">(optional)</span>
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste a job description for keyword matching..."
            rows={3}
            className="w-full px-3 py-2 text-sm bg-surface border-2 border-white/20 rounded-md text-white placeholder:text-white/30 focus:outline-none focus:border-primary resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!file || loading}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-md border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Analyze Resume
              </>
            )}
          </button>

          {result && (
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-sm text-white/60 hover:text-white border-2 border-white/20 rounded-md hover:border-white/40 transition-colors"
            >
              Check Another
            </button>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-md px-3 py-2">
            {error}
          </p>
        )}
      </form>

      {/* Scanning overlay — terminal green palette */}
      {loading && (
        <div className="relative border-2 border-[#00ff88]/20 rounded-md bg-black/40 p-4 space-y-2.5 overflow-hidden">
          {/* Scan line sweep */}
          {showScanLine && <div className="scan-line" />}

          <div className="flex items-center gap-2 mb-2 relative z-10">
            <Scan className="w-4 h-4 text-[#00ff88] animate-pulse" />
            <span className="text-xs font-semibold text-[#00ff88] uppercase tracking-widest">
              Deep Analysis in Progress
            </span>
          </div>
          {SCAN_STEPS.map((step, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-2 text-sm transition-all duration-300 relative z-10",
                i < scanStep
                  ? "text-[#00ff88]"
                  : i === scanStep
                    ? "text-white/80"
                    : "text-white/15"
              )}
            >
              {i < scanStep ? (
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" stroke="#00ff88" />
              ) : i === scanStep ? (
                <Loader2 className="w-3.5 h-3.5 shrink-0 animate-spin text-[#00ff88]" />
              ) : (
                <div className="w-3.5 h-3.5 shrink-0 rounded-full border border-white/20" />
              )}
              <span>{step.label}</span>
              {i === scanStep && (
                <span className="text-[10px] text-[#00ff88]/60 animate-pulse ml-auto font-mono">
                  scanning...
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {result && <AtsResults result={result} />}
    </div>
  );
}
