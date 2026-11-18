import React from 'react';
import { motion } from 'framer-motion';

const METRICS = [
  {
    brand: 'Gladchemistry',
    label: 'Organic Purity',
    percent: 100,
    color: '#16A34A',
    track: '#DCFCE7',
    detail: 'Botanical & skin-safe',
  },
  {
    brand: 'Felis be Glad',
    label: 'Scent Longevity',
    percent: 94,
    color: '#D97706',
    track: '#FEF3C7',
    detail: '12+ weeks diffuser life',
  },
  {
    brand: 'Bubbles Detergents',
    label: 'Cleaning Efficacy',
    percent: 99,
    color: '#0284C7',
    track: '#E0F2FE',
    detail: '99.9% germ elimination',
  },
];

export const QualityRings: React.FC = () => {
  return (
    <section className="px-4">
      <div className="mx-auto max-w-7xl ui-card rounded-[2.25rem] p-6 sm:p-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              Performance &amp; Purity
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 mt-1">
              Formulation Benchmarks
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-sm">
            Every batch across our 3 brands is tested for purity, longevity, and surface safety.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {METRICS.map((m, idx) => {
            const radius = 38;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (m.percent / 100) * circumference;

            return (
              <motion.div
                key={m.brand}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
                className="rounded-3xl bg-white/90 border border-slate-100 p-5 flex items-center gap-5 shadow-sm"
              >
                <div className="relative h-24 w-24 shrink-0 flex items-center justify-center">
                  <svg className="h-24 w-24 -rotate-90" viewBox="0 0 96 96">
                    <circle
                      cx="48"
                      cy="48"
                      r={radius}
                      fill="none"
                      stroke={m.track}
                      strokeWidth="8"
                    />
                    <motion.circle
                      cx="48"
                      cy="48"
                      r={radius}
                      fill="none"
                      stroke={m.color}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      whileInView={{ strokeDashoffset: offset }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 + idx * 0.1 }}
                    />
                  </svg>
                  <span className="absolute font-display font-extrabold text-lg text-slate-900">
                    {m.percent}%
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {m.brand}
                  </span>
                  <h3 className="font-display font-bold text-lg text-slate-900">{m.label}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{m.detail}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
