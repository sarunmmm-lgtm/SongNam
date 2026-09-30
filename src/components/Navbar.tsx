import React, { useEffect, useState } from 'react';
import { DamIcon } from './icons/DamIcon';
import { 
  Waves, 
  Sliders, 
  Clock,
  Compass,
  Share2,
  FileText,
  Sun
} from 'lucide-react';
import { HydrologicalStation } from '../types/hydrology';

export type ActiveTab = 'map' | 'dams' | 'canals' | 'simulator';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  stations: HydrologicalStation[];
  onOpenLocationSearch: () => void;
  onOpenShare?: () => void;
  onOpenMarineTide?: () => void;
  onOpenDailyReport?: () => void;
  onOpenWeather?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  stations,
  onOpenLocationSearch,
  onOpenShare,
  onOpenMarineTide,
  onOpenDailyReport,
  onOpenWeather,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('th-TH', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const criticalCount = stations.filter((s) => s.risk.alertLevel === 'critical').length;

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-black/5 text-[#1d1d1f] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      {/* Subtle Critical Water Alert Strip */}
      {criticalCount > 0 && (
        <div className="bg-rose-50/90 border-b border-rose-200/60 px-4 py-1.5 text-xs text-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span className="font-medium">เฝ้าระวังพิเศษ: พบสถานีระดับวิกฤต {criticalCount} แห่งที่มีความเสี่ยงน้ำล้นตลิ่ง</span>
          </div>
        </div>
      )}

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Title */}
        <div 
          onClick={() => onSelectTab('map')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-[#0071e3]/10 border border-[#0071e3]/20 flex items-center justify-center text-[#0071e3] transition-transform group-hover:scale-105">
            <Waves className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold text-[#1d1d1f] tracking-tight">
              ส่องน้ำ
            </span>
            <span className="text-xs text-[#86868b] font-normal hidden lg:inline">
              ระบบติดตามระดับน้ำและเขื่อนทั่วไทย
            </span>
          </div>
        </div>

        {/* Center: Desktop Navigation Tabs (Apple Segmented Control) */}
        <nav className="hidden md:flex items-center gap-1 bg-[#e8e8ed]/80 p-1 rounded-xl text-xs font-medium border border-black/5">
          <button
            onClick={() => onSelectTab('map')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'map'
                ? 'bg-white text-[#1d1d1f] shadow-sm font-semibold'
                : 'text-[#86868b] hover:text-[#1d1d1f]'
            }`}
          >
            แผนที่
          </button>
          <button
            onClick={() => onSelectTab('dams')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'dams'
                ? 'bg-white text-[#1d1d1f] shadow-sm font-semibold'
                : 'text-[#86868b] hover:text-[#1d1d1f]'
            }`}
          >
            <DamIcon className="w-3.5 h-3.5 text-[#0071e3]" />
            <span>เขื่อน & อ่างเก็บน้ำ</span>
          </button>
          <button
            onClick={() => onSelectTab('canals')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'canals'
                ? 'bg-white text-[#1d1d1f] shadow-sm font-semibold'
                : 'text-[#86868b] hover:text-[#1d1d1f]'
            }`}
          >
            ลำคลอง & สถานีแม่น้ำ
          </button>
          <button
            onClick={() => onSelectTab('simulator')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'simulator'
                ? 'bg-white text-[#1d1d1f] shadow-sm font-semibold'
                : 'text-[#86868b] hover:text-[#1d1d1f]'
            }`}
          >
            <Sliders className="w-3 h-3 text-[#0071e3]" />
            จำลองสถานการณ์
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 text-xs">
          {/* Check Impacting Dams */}
          <button
            onClick={onOpenLocationSearch}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-[#1d1d1f] border border-slate-200/80 shadow-sm flex items-center gap-1.5 transition-colors font-medium"
            title="ค้นหาว่าพื้นที่ของคุณได้รับผลกระทบจากเขื่อนไหน"
          >
            <Compass className="w-3.5 h-3.5 text-[#0071e3]" />
            <span className="hidden sm:inline">เช็คเขื่อนที่กระทบคุณ</span>
            <span className="sm:hidden">เช็คเขื่อน</span>
          </button>

          {/* Live Weather Forecast Button */}
          {onOpenWeather && (
            <button
              onClick={onOpenWeather}
              className="px-2.5 py-1.5 rounded-lg bg-blue-50/80 hover:bg-blue-100 text-[#0071e3] border border-blue-200/80 shadow-xs flex items-center gap-1.5 transition-colors font-medium"
              title="ตรวจสภาพอากาศ อุณหภูมิ และเรดาร์ฝนสด"
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden md:inline">สภาพอากาศ</span>
            </button>
          )}

          {/* Daily Situation Report Button */}
          {onOpenDailyReport && (
            <button
              onClick={onOpenDailyReport}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/80 shadow-sm flex items-center gap-1.5 transition-colors font-medium"
              title="ส่งออกรายงานสถานการณ์น้ำทางการประจำวัน (PDF & Excel CSV)"
            >
              <FileText className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">รายงานสรุป</span>
            </button>
          )}

          {/* Share */}
          {onOpenShare && (
            <button
              onClick={onOpenShare}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 shadow-sm flex items-center gap-1.5 transition-colors font-medium"
              title="แชร์ หรือเปิดใช้งานบนมือถือ"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">แชร์</span>
            </button>
          )}

          {/* Minimal Clock */}
          <div className="hidden lg:flex items-center gap-1 text-[#86868b] font-mono text-[11px] pl-2 border-l border-slate-200">
            <Clock className="w-3 h-3 text-[#86868b]" />
            <span>{timeStr || '12:00:00'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
