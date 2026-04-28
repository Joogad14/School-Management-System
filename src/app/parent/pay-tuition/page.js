"use client";

import { Copy } from "lucide-react";
import { useState } from "react";

export default function PayTuitionPage() {
  const [copied, setCopied] = useState(false);

  const accountNumber = "1804985296";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 space-y-6">

      {/* HEADER */}
      <div className="bg-[#0a1f44] text-white p-5 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold">Pay Tuition</h1>
        <p className="text-sm opacity-80">
          School Payment & Fee Details
        </p>
      </div>

      {/* ATM CARD */}
      <div className="max-w-md mx-auto">

        <div className="bg-gradient-to-br from-[#0a1f44] to-blue-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">

          {/* CHIP DESIGN */}
          <div className="w-12 h-8 bg-yellow-400 rounded-md mb-6"></div>

          {/* SCHOOL NAME */}
          <p className="text-sm opacity-80">Dynamic Pillars International School</p>

          {/* ACCOUNT NUMBER */}
          <div className="mt-4">
            <p className="text-xs opacity-70">Account Number</p>

            <div className="flex items-center justify-between mt-1">
              <p className="text-xl font-bold tracking-widest">
                {accountNumber}
              </p>

              <button
                onClick={copyToClipboard}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition cursor-pointer"
              >
                <Copy size={18} />
              </button>
            </div>

            {copied && (
              <p className="text-green-300 text-xs mt-1">
                Account copied!
              </p>
            )}
          </div>

          {/* BANK NAME */}
          <div className="mt-6">
            <p className="text-xs opacity-70">Bank</p>
            <p className="font-semibold">Access Bank</p>
          </div>

        </div>
      </div>

      {/* INSTRUCTION */}
      <div className="bg-white p-5 rounded-2xl shadow max-w-2xl mx-auto text-sm text-gray-700 space-y-2">

        <p>
          - To know the exact tuition fee for your ward(s), kindly contact the school administration.
        </p>

        <p>
          - After making payment, ensure you upload your receipt for approval.
        </p>

        <p>
          - Only approved payments will reflect in your child’s record.
        </p>

      </div>

    </div>
  );
}