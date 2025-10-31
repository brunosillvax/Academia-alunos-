'use client';

import React from 'react';

export default function Skeleton({ className }: { className?: string }) {
  return <div className={`skeleton rounded-md ${className ?? ''}`} />;
}
