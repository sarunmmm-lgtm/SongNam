import React from 'react';
import { HydrologicalStation } from '../types/hydrology';
import { Flood2554ComparisonCard } from './Flood2554ComparisonCard';
import { DamIcon } from './icons/DamIcon';
import { 
  X, 
  Droplet, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  ShieldAlert, 
  Sparkles,
  Gauge,
  Video,
  Maximize2
} from 'lucide-react';

interface StationDetailModalProps {
  station: HydrologicalStation;
  onClose: () => void;
  onRequestAiAnalysis: (station: HydrologicalStation) => void;
  onOpenCctv?: (station: HydrologicalStation) => void;
}

export const StationDetailModal: React.FC<StationDetailModalProps> = ({
  station,
  onClose,
  onRequestAiAnalysis,
  onOpenCctv,
}) => {
  const { telemetry, risk } = station;
  const isCritical = risk.alertLevel === 'critical';
  const isWarning = risk.alertLevel === 'warning';
  const isWatch = risk.alertLevel === 'watch';

  const statusColor = isCritical 
    ? 'text-rose-700' 
    : isWarning 
    ? 'text-amber-700' 
    : isWatch 
    ? 'text-yellow-800' 
    : 'text-emerald-700';

  const statusLabel = isCritical
    ? 'วิกฤติน้ำล้นตลิ่ง / เกินความจุ'
    : isWarning
    ? 'เตือนภัยน้ำท่วม / ระบายน้ำสูง'
    : isWatch
    ? 'เฝ้าระวังระดับน้ำเพิ่มสูง'
    : 'สภาวะปกติ';

  // SVG Chart bounds
  const history = station.history24h || [];
  const maxLvl = Math.max(...history.map((h) => h.levelMsl), telemetry.bankLevelMsl);
  const minLvl = Math.min(...history.map((h) => h.levelMsl)) * 0.98;
  const chartHeight = 110;
  const chartWidth = 360;

  const points = history.map((pt, idx) => {
    const x = (idx / (history.length - 1)) * chartWidth;
    const y = chartHeight - ((pt.levelMsl - minLvl) / (maxLvl - minLvl || 1)) * (chartHeight - 20) - 10;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-2xl bg-white border border-slate-200/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#1d1d1f]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-white flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#86868b] mb-1">
              <span className={`font-semibold flex items-center gap-1.5 ${statusColor}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isCritical ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : isWatch ? 'bg-yellow-400' : 'bg-emerald-500'}`}></span>
                {statusLabel}
              </span>
              <span>·</span>
              <span>รหัส {station.code}</span>
              <span>·</span>
              <span>{station.type === 'dam' ? 'เขื่อน' : station.type === 'reservoir' ? 'อ่างเก็บน้ำ' : station.type === 'canal' ? 'คลองระบายน้ำ' : 'สถานีแม่น้ำ'}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-[#1d1d1f] tracking-tight flex items-center gap-2">
              {station.type === 'dam' && (
                <DamIcon className="w-5 h-5 text-[#0071e3] shrink-0" />
              )}
              <span>{station.name}</span>
            </h2>
            <p className="text-xs text-[#86868b] mt-0.5">
              {station.subdistrict ? `ต.${station.subdistrict} ` : ''}อ.{station.district} จ.{station.province} · {station.basin}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Main Visual & Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
            {/* Water Column Gauge (5 cols) */}
            <div className="md:col-span-5 bg-slate-50 border border-slate-200/60 rounded-xl p-3.5 flex flex-col items-center justify-between">
              <div className="w-full flex items-center justify-between text-xs text-[#86868b] mb-2">
                <span className="font-medium flex items-center gap-1 text-slate-700">
                  <Gauge className="w-3.5 h-3.5 text-[#0071e3]" /> ระดับน้ำเทียบความจุ
                </span>
                <span className="text-[11px] text-[#86868b]">{telemetry.lastUpdated}</span>
              </div>

              {/* Water Tower Container */}
              <div className="relative w-32 h-44 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-end p-0.5 my-1 shadow-inner">
                {/* Bank line */}
                <div className="absolute top-3 left-0 right-0 border-b border-dashed border-rose-500 z-20 flex justify-between px-2 text-[9px] text-rose-600 font-medium bg-white/80">
                  <span>ตลิ่ง</span>
                  <span>{telemetry.bankLevelMsl} ม.</span>
                </div>

                {/* Animated Rising Water Column */}
                <div
                  className={`w-full rounded-lg relative transition-all duration-700 flex flex-col justify-end p-2 text-center text-white ${
                    telemetry.storagePercent > 90
                      ? 'bg-rose-500'
                      : telemetry.storagePercent > 80
                      ? 'bg-amber-500'
                      : 'bg-[#0071e3]'
                  }`}
                  style={{ height: `${Math.min(100, Math.max(14, telemetry.storagePercent))}%` }}
                >
                  <div className="text-xl font-bold">{telemetry.storagePercent}%</div>
                  <div className="text-[10px] text-white/90">{telemetry.currentLevelMsl} ม.รทก.</div>
                </div>
              </div>

              <div className="mt-2 text-center text-xs text-[#86868b]">
                ความจุ: <b className="text-slate-800 font-medium">{telemetry.storageCapacityMcm.toLocaleString()}</b> {station.type === 'dam' || station.type === 'reservoir' ? 'ล้าน ลบ.ม.' : 'ลบ.ม.'}
              </div>
            </div>

            {/* Quick Metrics Grid (7 cols) */}
            <div className="md:col-span-7 grid grid-cols-2 gap-2.5">
              {/* Current Storage */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-[#86868b]">
                  <span>ปริมาตรน้ำ</span>
                  <Droplet className="w-3.5 h-3.5 text-[#0071e3]" />
                </div>
                <div className="mt-1">
                  <div className="text-lg font-bold text-[#1d1d1f]">
                    {telemetry.currentStorageMcm.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-[#86868b]">
                    {station.type === 'dam' || station.type === 'reservoir' ? 'ล้าน ลบ.ม.' : 'ลบ.ม.'}
                  </div>
                </div>
              </div>

              {/* Freeboard (Bank Margin) */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-[#86868b]">
                  <span>ระยะเทียบตลิ่ง</span>
                  <ShieldAlert className={`w-3.5 h-3.5 ${risk.freeboardMeters <= 0 ? 'text-rose-600' : 'text-emerald-600'}`} />
                </div>
                <div className="mt-1">
                  <div className={`text-lg font-bold ${risk.freeboardMeters <= 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {risk.freeboardMeters <= 0 ? `+${Math.abs(risk.freeboardMeters)} ม. (ล้น)` : `${risk.freeboardMeters} ม.`}
                  </div>
                  <div className="text-[11px] text-[#86868b]">
                    ระดับตลิ่ง: {telemetry.bankLevelMsl} ม.รทก.
                  </div>
                </div>
              </div>

              {/* Inflow Rate */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-[#86868b]">
                  <span>น้ำไหลเข้า</span>
                  <ArrowDownCircle className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="mt-1">
                  <div className="text-lg font-bold text-[#1d1d1f]">
                    {telemetry.inflowRateCms.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-[#86868b]">ลบ.ม./วินาที (cms)</div>
                </div>
              </div>

              {/* Outflow Rate */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-[#86868b]">
                  <span>น้ำระบายออก</span>
                  <ArrowUpCircle className="w-3.5 h-3.5 text-[#0071e3]" />
                </div>
                <div className="mt-1">
                  <div className="text-lg font-bold text-[#1d1d1f]">
                    {telemetry.outflowRateCms.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-[#86868b]">ลบ.ม./วินาที (cms)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Yesterday Comparison (HII Raw Telemetry) */}
          {telemetry.diffYesterdayMcm !== undefined && (
            <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-3.5 text-xs font-mono">
              <div className="flex items-center justify-between font-sans text-xs font-bold text-blue-900 mb-2">
                <span>📊 เปรียบเทียบปริมาตรน้ำกับเมื่อวาน (รายงานทางการ สสน. HII)</span>
                <span className="text-[10px] text-blue-600 font-normal">อัปเดต 1 ต.ค. 2569</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-800">
                <div className="bg-white p-2.5 rounded-xl border border-blue-100">
                  <div className="text-[10px] text-slate-400">เมื่อวาน</div>
                  <div className="text-sm font-bold text-slate-700 mt-0.5">
                    {telemetry.storageYesterdayMcm?.toLocaleString()} ล้าน ม.³
                  </div>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-blue-100">
                  <div className="text-[10px] text-slate-400">วันนี้</div>
                  <div className="text-sm font-bold text-blue-600 mt-0.5">
                    {telemetry.currentStorageMcm?.toLocaleString()} ล้าน ม.³
                  </div>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-blue-100">
                  <div className="text-[10px] text-slate-400">ผลต่างสุทธิ</div>
                  <div className={`text-sm font-bold mt-0.5 ${telemetry.diffYesterdayMcm > 0 ? 'text-emerald-600' : 'text-blue-600'}`}>
                    {telemetry.diffYesterdayMcm > 0 ? `+${telemetry.diffYesterdayMcm}` : telemetry.diffYesterdayMcm} ล้าน ม.³
                  </div>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-blue-100">
                  <div className="text-[10px] text-slate-400">อัตราเปลี่ยนแปลง</div>
                  <div className={`text-sm font-bold mt-0.5 ${telemetry.diffYesterdayPercent && telemetry.diffYesterdayPercent > 0 ? 'text-emerald-600' : 'text-blue-600'}`}>
                    {telemetry.diffYesterdayPercent && telemetry.diffYesterdayPercent > 0 ? `+${telemetry.diffYesterdayPercent}%` : `${telemetry.diffYesterdayPercent}%`}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2554 Flood Comparison Section */}
          <Flood2554ComparisonCard station={station} />

          {/* 24h Trend Chart */}
          <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-xs text-[#86868b] mb-2">
              <span className="font-medium text-slate-700">แนวโน้มระดับน้ำย้อนหลัง 24 ชั่วโมง</span>
              <span>หน่วย: ม. รทก.</span>
            </div>

            <div className="w-full overflow-x-auto pb-1">
              <div className="min-w-[320px] h-28 relative">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                  <line x1="0" y1={chartHeight - 10} x2={chartWidth} y2={chartHeight - 10} stroke="#e2e8f0" />
                  <polyline
                    fill="none"
                    stroke="#0071e3"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                  />
                  {history.map((pt, idx) => {
                    const x = (idx / (history.length - 1)) * chartWidth;
                    const y = chartHeight - ((pt.levelMsl - minLvl) / (maxLvl - minLvl || 1)) * (chartHeight - 20) - 10;
                    return (
                      <g key={idx}>
                        <circle cx={x} cy={y} r="3" fill="#0071e3" stroke="#ffffff" strokeWidth="1.5" />
                        <text x={x} y={y - 6} fill="#475569" fontSize="8" textAnchor="middle" fontWeight="500">
                          {pt.levelMsl}
                        </text>
                        <text x={x} y={chartHeight + 4} fill="#94a3b8" fontSize="8" textAnchor="middle">
                          {pt.time}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-white flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onRequestAiAnalysis(station)}
              className="px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0071e3] border border-blue-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0071e3]" />
              AI วิเคราะห์มวลน้ำ
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
