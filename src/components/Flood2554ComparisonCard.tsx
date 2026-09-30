import React from 'react';
import { HydrologicalStation } from '../types/hydrology';
import { compareWith2554Benchmark } from '../data/flood2554Data';
import { 
  History, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Droplet,
  Info
} from 'lucide-react';

interface Flood2554ComparisonCardProps {
  station: HydrologicalStation;
  compact?: boolean;
}

export const Flood2554ComparisonCard: React.FC<Flood2554ComparisonCardProps> = ({
  station,
  compact = false,
}) => {
  const comparison = compareWith2554Benchmark(
    station.id,
    station.telemetry.currentStorageMcm,
    station.telemetry.storagePercent,
    station.telemetry.outflowRateCms
  );

  if (!comparison.hasBenchmark || !comparison.benchmark) {
    return null;
  }

  const { benchmark, severityLevel, verdictText, storageGapPercent, remainingBufferMcm } = comparison;

  const severityStyles = {
    safe: {
      bg: 'bg-emerald-50/80',
      border: 'border-emerald-200/80',
      text: 'text-emerald-800',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      icon: ShieldCheck,
      iconColor: 'text-emerald-600',
    },
    moderate: {
      bg: 'bg-amber-50/80',
      border: 'border-amber-200/80',
      text: 'text-amber-800',
      badgeBg: 'bg-amber-100 text-amber-800',
      icon: Info,
      iconColor: 'text-amber-600',
    },
    high: {
      bg: 'bg-orange-50/80',
      border: 'border-orange-200/80',
      text: 'text-orange-900',
      badgeBg: 'bg-orange-100 text-orange-900',
      icon: AlertTriangle,
      iconColor: 'text-orange-600',
    },
    critical: {
      bg: 'bg-rose-50/80',
      border: 'border-rose-200/80',
      text: 'text-rose-900',
      badgeBg: 'bg-rose-100 text-rose-900',
      icon: AlertTriangle,
      iconColor: 'text-rose-600',
    },
  }[severityLevel];

  const SeverityIcon = severityStyles.icon;

  if (compact) {
    return (
      <div className="mt-2.5 pt-2.5 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
            <History className="w-3.5 h-3.5 text-[#0071e3]" />
            <span>เทียบน้ำท่วมใหญ่ปี 2554</span>
          </div>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${severityStyles.badgeBg}`}>
            {storageGapPercent > 0 ? `+${storageGapPercent}%` : `${storageGapPercent}%`}
          </span>
        </div>

        {/* Comparison mini progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-[#86868b]">
            <span>ปัจจุบัน: {station.telemetry.storagePercent}%</span>
            <span className="text-rose-700 font-medium">ปี 54 พีค: {benchmark.peakStoragePercent}%</span>
          </div>
          <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            {/* 2554 mark background */}
            <div
              className="absolute top-0 bottom-0 bg-rose-200/70"
              style={{ width: `${Math.min(100, benchmark.peakStoragePercent)}%` }}
            />
            {/* Current water level bar */}
            <div
              className={`absolute top-0 bottom-0 rounded-full transition-all duration-500 ${
                severityLevel === 'critical' ? 'bg-rose-600' : severityLevel === 'high' ? 'bg-orange-500' : 'bg-[#0071e3]'
              }`}
              style={{ width: `${Math.min(100, station.telemetry.storagePercent)}%` }}
            />
          </div>
          <div className="text-[10px] text-[#86868b] flex justify-between pt-0.5">
            <span>มีช่องว่างรับน้ำได้อีก</span>
            <span className="font-semibold text-slate-700">{remainingBufferMcm.toLocaleString()} ล้าน ลบ.ม.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-blue-100 flex items-center justify-center text-[#0071e3]">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#1d1d1f] tracking-tight flex items-center gap-1.5">
              ข้อมูลเปรียบเทียบมหาอุทกภัยปี 2554
              <span className="text-[10px] font-normal px-2 py-0.5 bg-blue-100/70 text-blue-800 rounded-full">
                เกณฑ์ประวัติศาสตร์
              </span>
            </h4>
            <p className="text-[11px] text-[#86868b]">
              เปรียบเทียบกับช่วงที่เขื่อนเต็มความจุและเกิดน้ำท่วมใหญ่ที่สุดในรอบ 50 ปี
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 ${severityStyles.badgeBg}`}>
            <SeverityIcon className="w-3.5 h-3.5" />
            {severityLevel === 'safe'
              ? 'ปลอดภัยกว่าปี 54 มาก'
              : severityLevel === 'moderate'
              ? 'เฝ้าระวังปานกลาง'
              : severityLevel === 'high'
              ? 'ใกล้ระดับปี 54'
              : 'วิกฤตเทียบเท่าปี 54'}
          </span>
        </div>
      </div>

      {/* Side-by-side Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
        {/* Current State */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#86868b] mb-1">
            <span className="font-medium text-slate-700">สถานะปัจจุบัน</span>
            <span className="text-[10px] text-emerald-600 font-medium">เรียลไทม์</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#1d1d1f]">
              {station.telemetry.storagePercent}%
            </span>
            <span className="text-xs text-[#86868b]">
              ({station.telemetry.currentStorageMcm.toLocaleString()} ล้าน ลบ.ม.)
            </span>
          </div>
          <div className="mt-2 text-xs text-[#86868b] flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <ArrowUpCircle className="w-3 h-3 text-[#0071e3]" /> ระบายน้ำ:
            </span>
            <span className="font-semibold text-slate-800">
              {station.telemetry.outflowRateCms.toLocaleString()} cms
            </span>
          </div>
        </div>

        {/* 2554 Peak State */}
        <div className="bg-white border border-rose-200/80 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between text-xs text-rose-800 mb-1">
            <span className="font-semibold">จุดพีคน้ำท่วมใหญ่ปี 2554</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-rose-100 text-rose-800 rounded">
              {benchmark.peakDateThai}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-700">
              {benchmark.peakStoragePercent}%
            </span>
            <span className="text-xs text-[#86868b]">
              ({benchmark.peakStorageMcm.toLocaleString()} ล้าน ลบ.ม.)
            </span>
          </div>
          <div className="mt-2 text-xs text-[#86868b] flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <ArrowUpCircle className="w-3 h-3 text-rose-600" /> ระบายน้ำพีคปี 54:
            </span>
            <span className="font-semibold text-rose-700">
              {benchmark.peakOutflowCms ? `${benchmark.peakOutflowCms.toLocaleString()} cms` : 'เต็มกำลัง'}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Comparative Bars */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 my-3">
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="font-medium text-slate-700">เปรียบเทียบระดับน้ำในเขื่อน</span>
          <span className="text-xs font-semibold text-[#0071e3]">
            {storageGapPercent < 0 ? `ต่ำกว่าปี 54 อยู่ ${Math.abs(storageGapPercent)}%` : `สูงกว่าปี 54 +${storageGapPercent}%`}
          </span>
        </div>

        {/* Bar 1: Current */}
        <div className="space-y-1 mb-2.5">
          <div className="flex justify-between text-[11px] text-[#86868b]">
            <span>ปริมาณน้ำปัจจุบัน</span>
            <span className="font-medium text-slate-800">{station.telemetry.storagePercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0071e3] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, station.telemetry.storagePercent)}%` }}
            />
          </div>
        </div>

        {/* Bar 2: 2554 Peak */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-rose-700">
            <span className="font-medium">ปริมาณน้ำสูงสุดปี 2554 (จุดวิกฤต)</span>
            <span className="font-bold">{benchmark.peakStoragePercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, benchmark.peakStoragePercent)}%` }}
            />
          </div>
        </div>

        {/* Difference note */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
          <div className="text-[#86868b] flex items-center gap-1">
            <Droplet className="w-3.5 h-3.5 text-[#0071e3]" />
            <span>ช่องว่างที่ยังสามารถรองรับน้ำได้ก่อนจะแตะระดับปี 54:</span>
          </div>
          <span className="font-bold text-emerald-700">
            {remainingBufferMcm.toLocaleString()} ล้าน ลบ.ม.
          </span>
        </div>
      </div>

      {/* Historical Context Narrative */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-xs space-y-1.5 text-slate-700">
        <div className="font-medium text-slate-900 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          บันทึกเหตุการณ์จริงเมื่อปี 2554 ของ{station.name}:
        </div>
        <p className="text-[12px] leading-relaxed text-[#555] pl-3 border-l-2 border-slate-300">
          {benchmark.historicalContext}
        </p>
      </div>

      {/* Verdict / Assessment */}
      <div className={`mt-3 p-3 rounded-xl border flex items-start gap-2 text-xs ${severityStyles.bg} ${severityStyles.border} ${severityStyles.text}`}>
        <SeverityIcon className={`w-4 h-4 shrink-0 mt-0.5 ${severityStyles.iconColor}`} />
        <div>
          <span className="font-semibold">ข้อสรุปการประเมินเทียบปี 2554: </span>
          <span>{verdictText}</span>
        </div>
      </div>
    </div>
  );
};
