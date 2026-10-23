import React from 'react';

export default function Loading() {
  return (
    <div className="layout">
      <div className="side hidden md:block">
        <div className="animate-pulse space-y-3">
          <div className="h-8 bg-surface-2 rounded-lg w-3/4" />
          <div className="h-8 bg-surface-2 rounded-lg w-1/2" />
          <div className="h-8 bg-surface-2 rounded-lg w-2/3" />
        </div>
      </div>

      <div className="main">
        <div className="card p-8 animate-pulse flex flex-col gap-4">
          <div className="h-6 bg-surface-2 rounded-md w-1/3" />
          <div className="h-4 bg-surface-2 rounded-md w-2/3" />
          <div className="h-24 bg-surface-2 rounded-lg w-full mt-4" />
        </div>

        <div className="feed animate-pulse divide-y divide-line">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 flex gap-4">
              <div className="w-14 h-14 bg-surface-2 rounded-lg flex-none" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-surface-2 rounded w-1/4" />
                <div className="h-5 bg-surface-2 rounded w-3/4" />
                <div className="h-3 bg-surface-2 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="right hidden lg:block">
        <div className="card p-6 animate-pulse space-y-4">
          <div className="h-5 bg-surface-2 rounded w-1/2" />
          <div className="h-16 bg-surface-2 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
