import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({
  title,
  value,
  icon: Icon,
  color = 'primary',
  trend,
  trendValue,
  onClick,
  subtitle,
}) => {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    amber: 'bg-amber-50 text-amber-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    slate: 'bg-slate-100 text-slate-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    rose: 'bg-rose-50 text-rose-600',
  };

  return (
    <Card
      className={cn(
        'border-slate-200 shadow-soft hover:shadow-hover transition-all duration-300 hover:-translate-y-0.5',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-navy-500 font-medium mb-1">{title}</p>
            <p className="text-2xl font-bold text-navy-900 tracking-tight">
              {value?.toLocaleString() || 0}
            </p>
            {subtitle && <p className="text-xs text-navy-400 mt-1">{subtitle}</p>}
          </div>
          <div className={cn('p-3 rounded-xl shadow-lg', colorClasses[color])}>
            {Icon && <Icon className="h-5 w-5" />}
          </div>
        </div>
        {trend !== undefined && (
          <div className="mt-3 flex items-center gap-1.5 text-xs">
            {trend > 0 ? (
              <TrendingUp className="h-3.5 w-3.5 text-green-600" />
            ) : trend < 0 ? (
              <TrendingDown className="h-3.5 w-3.5 text-red-600" />
            ) : null}
            <span className={trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-navy-400'}>
              {trend > 0 ? '+' : ''}{trendValue || 0}% dari periode sebelumnya
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;