'use client';

import React, { useState } from 'react';
import { X, Terminal, Copy, Check, Play, RefreshCw } from 'lucide-react';

interface ApiInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentQuery: string;
}

export function ApiInspectorModal({
  isOpen,
  onClose,
  currentQuery,
}: ApiInspectorModalProps) {
  const [testQuery, setTestQuery] = useState(currentQuery || 'naruto');
  const [isLoading, setIsLoading] = useState(false);
  const [responseJson, setResponseJson] = useState<any>(null);
  const [durationMs, setDurationMs] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  if (!isOpen) return null;

  const targetUrl = `https://api.kangwifi.eu.org/search/ik21?query=${encodeURIComponent(testQuery)}`;
  const curlString = `curl -X 'GET' \\\n  '${targetUrl}' \\\n  -H 'accept: */*'`;

  const runTest = async () => {
    setIsLoading(true);
    const start = performance.now();
    try {
      const res = await fetch(`/api/movies?query=${encodeURIComponent(testQuery)}`);
      const data = await res.json();
      const end = performance.now();
      setDurationMs(Math.round(end - start));
      setResponseJson(data);
    } catch (e: any) {
      setResponseJson({ error: e.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlString);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleCopyJson = () => {
    if (responseJson) {
      navigator.clipboard.writeText(JSON.stringify(responseJson, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-3xl rounded-2xl bg-[#0C0E16] border border-white/15 shadow-2xl text-zinc-100 flex flex-col my-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              IK21 API Live Inspector
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Endpoint description */}
          <div className="space-y-1.5">
            <div className="text-zinc-400 font-medium">Target Remote Endpoint:</div>
            <div className="p-2.5 rounded-lg bg-black/60 border border-white/10 font-mono text-[11px] text-amber-300 break-all select-all">
              {targetUrl}
            </div>
          </div>

          {/* Curl Command Snippet */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-zinc-400 font-medium">
              <span>cURL Command:</span>
              <button
                onClick={handleCopyCurl}
                className="flex items-center gap-1 text-zinc-300 hover:text-white cursor-pointer"
              >
                {copiedCurl ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copiedCurl ? 'Copied' : 'Copy cURL'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-black/80 border border-white/10 font-mono text-[11px] text-zinc-300 overflow-x-auto">
              {curlString}
            </pre>
          </div>

          {/* Test query controls */}
          <div className="flex gap-2">
            <input
              type="text"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              placeholder="Enter search query..."
              className="flex-1 px-3 py-2 bg-black/60 border border-white/15 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-red-500"
            />
            <button
              onClick={runTest}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 font-semibold text-white rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-current" />}
              <span>Execute Request</span>
            </button>
          </div>

          {/* Response Payload */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-zinc-400 font-medium">
              <div className="flex items-center gap-2">
                <span>Response Payload:</span>
                {durationMs !== null && (
                  <span className="text-emerald-400 font-mono font-semibold">
                    {durationMs}ms · 200 OK
                  </span>
                )}
              </div>
              {responseJson && (
                <button
                  onClick={handleCopyJson}
                  className="flex items-center gap-1 text-zinc-300 hover:text-white cursor-pointer"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
              )}
            </div>

            <pre className="p-4 rounded-xl bg-black/90 border border-white/10 font-mono text-[11px] text-emerald-300/90 overflow-x-auto max-h-72 leading-relaxed scrollbar-thin">
              {responseJson ? JSON.stringify(responseJson, null, 2) : '// Click "Execute Request" above to test live endpoint'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
