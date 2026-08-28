import React from 'react';

const SkeletonCard = ({ type = 'default' }) => {
  if (type === 'department') {
    return (
      <div className="bg-white rounded-xl shadow-soft border border-slate-100 p-5 animate-pulse">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 bg-slate-200 rounded"></div>
          <div className="h-5 bg-slate-200 rounded w-3/4"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-2/3"></div>
        </div>
        <div className="mt-3 flex justify-between">
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        </div>
        <div className="mt-2 h-2 bg-slate-200 rounded w-full"></div>
      </div>
    );
  }

  if (type === 'announcement') {
    return (
      <div className="bg-white rounded-xl shadow-soft border border-slate-100 p-5 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-2/3"></div>
        </div>
        <div className="mt-3 h-3 bg-slate-200 rounded w-1/4"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-soft border border-slate-100 p-5 animate-pulse">
      <div className="h-6 bg-slate-200 rounded w-1/2 mb-3"></div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded w-full"></div>
        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;