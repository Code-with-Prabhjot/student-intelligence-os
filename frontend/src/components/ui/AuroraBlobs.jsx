import React, { useEffect, useRef } from 'react';

/**
 * AuroraBlobs — Animated aurora-like gradient blob background
 * Pure CSS/canvas, no external dependencies
 */
export default function AuroraBlobs({ className = '' }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {/* Blob 1 - Blue */}
      <div
        className="absolute rounded-full opacity-30 dark:opacity-20 blur-3xl"
        style={{
          width: '40%',
          height: '40%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.7) 0%, transparent 70%)',
          top: '-10%',
          left: '-5%',
          animation: 'blob-drift-1 12s ease-in-out infinite',
        }}
      />
      {/* Blob 2 - Violet */}
      <div
        className="absolute rounded-full opacity-25 dark:opacity-15 blur-3xl"
        style={{
          width: '35%',
          height: '35%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.7) 0%, transparent 70%)',
          top: '20%',
          right: '-5%',
          animation: 'blob-drift-2 15s ease-in-out infinite',
        }}
      />
      {/* Blob 3 - Emerald */}
      <div
        className="absolute rounded-full opacity-20 dark:opacity-10 blur-3xl"
        style={{
          width: '30%',
          height: '30%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.6) 0%, transparent 70%)',
          bottom: '0%',
          left: '30%',
          animation: 'blob-drift-3 18s ease-in-out infinite',
        }}
      />
    </div>
  );
}
