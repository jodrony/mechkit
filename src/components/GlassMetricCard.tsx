import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export interface GlassMetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
  deltaType?: 'positive' | 'neutral' | 'accent' | 'negative';
  description?: string;
  icon: React.ElementType;
  sparkline?: number[];
  progress?: number;
  onClick?: () => void;
  className?: string;
  actionIcon?: React.ElementType;
  customAccessory?: React.ReactNode;
}

export const GlassMetricCard: React.FC<GlassMetricCardProps> = ({
  label,
  value,
  unit,
  delta,
  deltaType = 'positive',
  description,
  icon: Icon,
  sparkline,
  progress,
  onClick,
  className = '',
  actionIcon: ActionIcon = ArrowUpRight,
  customAccessory,
}) => {
  const getDeltaBadgeClass = () => {
    switch (deltaType) {
      case 'positive':
        return 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20';
      case 'accent':
        return 'bg-cyan-400/10 text-cyan-300 border-cyan-400/20';
      case 'negative':
        return 'bg-rose-400/10 text-rose-400 border-rose-400/20';
      case 'neutral':
      default:
        return 'bg-white/[0.04] text-slate-300 border-white/[0.08]';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/40 backdrop-blur-xl p-4 shadow-sm shadow-black/20 hover:border-white/20 hover:bg-slate-900/60 hover:-translate-y-0.5 transition-all duration-300 ${
        onClick ? 'cursor-pointer active:scale-[0.99]' : ''
      } ${className}`}
    >
      {/* 21st.dev Atmospheric Radial Backlight & Top Specular Sheen */}
      <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-white/[0.02] blur-xl pointer-events-none group-hover:bg-emerald-400/[0.06] transition-colors duration-500" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between h-full space-y-3">
        {/* Header: Icon + Label + Delta Badge / Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-300 group-hover:text-white transition-colors shrink-0">
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium tracking-tight text-slate-300 font-sans">
              {label}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {delta && (
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-3xs font-mono border backdrop-blur-xs ${getDeltaBadgeClass()}`}
              >
                {delta}
              </span>
            )}
            {onClick && ActionIcon && (
              <ActionIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            )}
          </div>
        </div>

        {/* Center: Large Metric Value + Unit / Custom Accessory */}
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-semibold text-white tabular-nums tracking-tight">
              {value}
            </span>
            {unit && <span className="text-2xs text-slate-400 font-sans">{unit}</span>}
          </div>

          {customAccessory && <div className="shrink-0">{customAccessory}</div>}
        </div>

        {/* Footer: Description or Progress Bar */}
        {(description || typeof progress === 'number' || sparkline) && (
          <div className="space-y-1.5 pt-0.5">
            {typeof progress === 'number' && (
              <div className="w-full h-1 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400/80 to-emerald-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                />
              </div>
            )}

            {sparkline && sparkline.length > 0 && (
              <div className="flex items-end gap-1 h-3 py-0.5">
                {sparkline.map((val, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-white/[0.1] group-hover:bg-emerald-400/40 rounded-xs transition-colors"
                    style={{ height: `${Math.min(100, Math.max(15, val))}%` }}
                  />
                ))}
              </div>
            )}

            {description && (
              <p className="text-2xs text-slate-400 font-sans line-clamp-1">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlassMetricCard;
