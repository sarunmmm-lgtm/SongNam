import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  ExternalLink, 
  RefreshCw, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Radio, 
  Activity, 
  Droplets,
  Clock,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { HydrologicalStation } from '../types/hydrology';

interface ChaoPhrayaEmergencyBannerProps {
  onSelectStation?: (stationId: string) => void;
  onRefreshLive?: () => void;
  isRefreshing?: boolean;
  lastSyncTime?: string;
}

export const RID_HYDRO_5H_URL = 'https://hyd-app-db.rid.go.th/hydro5h.html';

export const ChaoPhrayaEmergencyBanner: React.FC<ChaoPhrayaEmergencyBannerProps> = ({
  onSelectStation,
  onRefreshLive,
  isRefreshing = false,
  lastSyncTime = 'เมื่อสักครู่',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [countdown, setCountdown] = useState(30);

  // Auto sync countdown simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 30));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-rose-950 via-red-950 to-slate-950 border-b border-rose-600/40 text-white shadow-md relative overflow-hidden transition-all">
      {/* Red accent bar on top */}
      <div className="h-0.5 bg-gradient-to-r from-red-500 via-amber-400 to-rose-500 animate-pulse"></div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Left: Emergency Status */}
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="flex h-3 w-3 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white font-extrabold text-[11px] tracking-wide uppercase shrink-0 shadow-xs flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" />
                <span>เตือนภัยน้ำหลากวิกฤต</span>
              </span>

              <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
                เขื่อนเจ้าพระยา (ชัยนาท) ปรับเพิ่มการระบายน้ำเป็น{' '}
                <span className="text-amber-300 font-extrabold font-mono underline decoration-amber-400 decoration-2 underline-offset-2">
                  2,500 ลบ.ม./วินาที
                </span>
              </span>

              <span className="text-[11px] text-rose-200/90 hidden md:inline">
                (ข้อมูลกรมชลประทาน RID Hydro 5H · ระดับน้ำท้ายเขื่อน +15.93 ม. ชิดตลิ่ง)
              </span>
            </div>
          </div>

          {/* Right: Actions & Live sync badge */}
          <div className="flex items-center gap-2 shrink-0 text-xs">
            {/* Live Auto-sync indicator */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700/80 text-[11px] text-slate-300 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-emerald-300 font-semibold">Live Auto-Sync</span>
              <span className="text-slate-400">({countdown}s)</span>
            </div>

            {/* Manual Refresh Now Button */}
            {onRefreshLive && (
              <button
                onClick={onRefreshLive}
                disabled={isRefreshing}
                className="px-2.5 py-1 rounded-lg bg-rose-900/80 hover:bg-rose-800 text-white border border-rose-500/50 flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer active:scale-95 disabled:opacity-50"
                title="กดเพื่อดึงข้อมูลสถานะน้ำล่าสุดทันที"
              >
                <RefreshCw className={`w-3 h-3 text-amber-300 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">อัปเดตสดทันที</span>
                <span className="sm:hidden">อัปเดต</span>
              </button>
            )}

            {/* Jump to Chao Phraya Dam */}
            {onSelectStation && (
              <button
                onClick={() => onSelectStation('dam-chaophraya')}
                className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1 text-[11px] transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <span>ดูจุดตรวจวัดเขื่อนเจ้าพระยา</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}

            {/* Expand / Collapse Details Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title={isExpanded ? 'ย่อรายละเอียด' : 'ดูรายละเอียดเพิ่มเติม'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expandable Emergency Details Panel */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-rose-800/60 grid grid-cols-1 md:grid-cols-4 gap-2.5 text-xs animate-in fade-in duration-200">
            {/* Metric 1 */}
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-rose-500/30 font-mono">
              <div className="text-[10px] text-rose-300 font-sans">อัตราการระบายน้ำ (Outflow)</div>
              <div className="text-lg font-extrabold text-amber-400 mt-0.5">2,500 <span className="text-xs font-normal text-slate-400">ลบ.ม./วินาที</span></div>
              <div className="text-[10px] text-slate-400 font-sans">216.0 ล้าน ลบ.ม./วัน (เกณฑ์วิกฤต)</div>
            </div>

            {/* Metric 2 */}
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-rose-500/30 font-mono">
              <div className="text-[10px] text-rose-300 font-sans">ระดับน้ำเหนือเขื่อน (สรรพยา)</div>
              <div className="text-lg font-extrabold text-cyan-300 mt-0.5">+17.77 <span className="text-xs font-normal text-slate-400">ม. รทก.</span></div>
              <div className="text-[10px] text-slate-400 font-sans">ระดับคันกั้นน้ำ +17.80 ม. (เหลือ 3 ซม.)</div>
            </div>

            {/* Metric 3 */}
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-rose-500/30 font-mono">
              <div className="text-[10px] text-rose-300 font-sans">ระดับน้ำท้ายเขื่อน (Downstream)</div>
              <div className="text-lg font-extrabold text-rose-400 mt-0.5">+15.93 <span className="text-xs font-normal text-slate-400">ม. รทก.</span></div>
              <div className="text-[10px] text-rose-300 font-sans font-bold">เตือนล้นตลิ่งชุมชนริมน้ำนอกคัน</div>
            </div>

            {/* Metric 4 */}
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-rose-500/30 flex flex-col justify-between">
              <div>
                <div className="text-[10px] text-rose-300 font-sans">11 จังหวัดเฝ้าระวังน้ำเอ่อล้น</div>
                <div className="text-[11px] text-slate-200 mt-1 font-sans">
                  อุทัยธานี, ชัยนาท, สิงห์บุรี, อ่างทอง, สุพรรณบุรี, อยุธยา, ลพบุรี, ปทุมธานี, นนทบุรี, กทม., สมุทรปราการ
                </div>
              </div>
              <div className="mt-2 pt-1 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">อัปเดต: {lastSyncTime}</span>
                <a
                  href={RID_HYDRO_5H_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 text-[10px] font-mono"
                >
                  <span>RID Hydro 5H</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
