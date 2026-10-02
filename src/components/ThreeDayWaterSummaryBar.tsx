import React, { useState } from 'react';
import { 
  TrendingUp, 
  Droplets, 
  Calendar, 
  ExternalLink, 
  X, 
  ChevronRight, 
  ArrowUpRight, 
  Layers, 
  Info,
  Clock,
  Sparkles
} from 'lucide-react';
import { THREE_DAY_NATIONAL_SUMMARY, HII_REPORT_SOURCE_URL } from '../data/damTelemetryHii';

interface ThreeDayWaterSummaryBarProps {
  className?: string;
}

export const ThreeDayWaterSummaryBar: React.FC<ThreeDayWaterSummaryBarProps> = ({ className = '' }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const today = THREE_DAY_NATIONAL_SUMMARY[0]; // 1 ต.ค. 2569
  const yesterday = THREE_DAY_NATIONAL_SUMMARY[1]; // 30 ก.ย. 2569
  const twoDaysAgo = THREE_DAY_NATIONAL_SUMMARY[2]; // 29 ก.ย. 2569

  const diffFromYesterday = today.netChangeMcm; // +399
  const diffFromYesterdayPct = today.netChangePercent; // +0.70%
  const threeDaysAccum = today.totalStorageMcm - twoDaysAgo.totalStorageMcm; // +1,063

  return (
    <>
      {/* Mini Bar / Badge: Compact, Elegant Apple-style floating badge */}
      <div 
        onClick={() => setIsOpenModal(true)}
        className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white border border-slate-700/80 shadow-md backdrop-blur-md cursor-pointer transition-all hover:scale-[1.02] text-xs ${className}`}
        title="คลิกเพื่อดูสรุปเปรียบเทียบปริมาณน้ำในเขื่อนย้อนหลัง 3 วัน (ข้อมูลทางการ HII)"
      >
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>

        <span className="text-slate-400 font-medium hidden sm:inline">น้ำเขื่อนรวมทั้งประเทศ:</span>

        <div className="flex items-center gap-1.5 font-mono">
          <span className="text-slate-300">เมื่อวาน {yesterday.totalStorageMcm.toLocaleString()}</span>
          <span className="text-slate-500">➔</span>
          <span className="font-bold text-white">วันนี้ {today.totalStorageMcm.toLocaleString()} ล้าน ม.³</span>
          <span className="text-slate-400">({today.storagePercent}%)</span>
        </div>

        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">
          <TrendingUp className="w-3 h-3" />
          <span>+{diffFromYesterday.toLocaleString()} ล้าน ม.³</span>
        </span>

        <span className="text-[10px] text-cyan-400 font-semibold hidden md:inline-flex items-center gap-0.5 hover:underline">
          <span>ดูแนวโน้ม 3 วัน</span>
          <ChevronRight className="w-3 h-3" />
        </span>
      </div>

      {/* Expanded Modal: 3-Day Water Trend Report */}
      {isOpenModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpenModal(false);
          }}
        >
          <div className="bg-slate-900 border border-slate-700/90 rounded-3xl max-w-2xl w-full p-4 sm:p-6 text-white shadow-2xl relative overflow-hidden">
            {/* Background ambient glow */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                      รายงานทางการ สสน. (HII) / RID
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      เขื่อนขนาดใหญ่ 36 แห่ง
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                    เปรียบเทียบปริมาณน้ำในเขื่อนทั้งประเทศ ย้อนหลัง 3 วัน
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setIsOpenModal(false)}
                className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main 3-Day Trend Grid */}
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {THREE_DAY_NATIONAL_SUMMARY.map((day, idx) => {
                  const isToday = idx === 0;
                  const isYesterday = idx === 1;

                  return (
                    <div 
                      key={day.date}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                        isToday 
                          ? 'bg-gradient-to-b from-blue-950/80 to-slate-900 border-cyan-500/50 shadow-lg ring-1 ring-cyan-500/30' 
                          : isYesterday
                            ? 'bg-slate-900/90 border-slate-700/80'
                            : 'bg-slate-950/80 border-slate-800/80'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs">
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                            isToday ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {day.dateLabel}
                          </span>
                          <span className="text-slate-400 font-mono text-[11px]">{day.thaiDate}</span>
                        </div>

                        <div className="mt-2.5">
                          <div className="text-[10px] text-slate-400">ปริมาตรน้ำในเขื่อนรวม</div>
                          <div className="text-xl font-extrabold text-white font-mono mt-0.5">
                            {day.totalStorageMcm.toLocaleString()} <span className="text-xs font-normal text-slate-400">ล้าน ม.³</span>
                          </div>
                          <div className="text-xs font-bold text-cyan-400 font-mono">
                            {day.storagePercent}% <span className="text-[10px] font-normal text-slate-400">ของความจุ 70,838 ล้าน ม.³</span>
                          </div>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] space-y-1">
                          <div className="flex items-center justify-between text-slate-300">
                            <span className="text-slate-400">น้ำไหลเข้าวันนี้:</span>
                            <span className="font-mono text-emerald-400">+{day.inflowTodayMcm.toLocaleString()} ล้าน ม.³</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-300">
                            <span className="text-slate-400">ระบายออกวันนี้:</span>
                            <span className="font-mono text-blue-400">{day.outflowTodayMcm.toLocaleString()} ล้าน ม.³</span>
                          </div>
                        </div>
                      </div>

                      {/* Net daily change badge */}
                      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 text-[10px]">
                          {isToday ? 'เทียบกับเมื่อวาน' : isYesterday ? 'เทียบวันก่อนหน้า' : 'ฐานข้อมูล'}
                        </span>
                        {day.netChangeMcm > 0 ? (
                          <span className="font-bold text-emerald-400 font-mono flex items-center gap-0.5">
                            <span>+{day.netChangeMcm.toLocaleString()} ล้าน ม.³</span>
                            <span>(+{day.netChangePercent}%)</span>
                          </span>
                        ) : (
                          <span className="text-slate-500 font-mono">-</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 3-day Growth Summary Bar */}
              <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-slate-200">
                    สรุปรวม 3 วัน ปริมาตรน้ำในเขื่อนหลักเพิ่มขึ้นสะสม <b className="text-white">+{threeDaysAccum.toLocaleString()} ล้าน ลบ.ม.</b> จากฝนตกชุกทางตอนบน
                  </span>
                </div>
                <div className="font-mono text-cyan-300 font-bold shrink-0">
                  (56,543 ➔ 57,606 ล้าน ม.³)
                </div>
              </div>

              {/* Top 5 Dams with Largest Inflow Today */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>5 เขื่อนที่น้ำไหลเข้ามากที่สุดในวันนี้ (1 ต.ค. 2569)</span>
                  <span className="text-[10px] text-slate-500">ล้าน ลบ.ม./วัน</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs text-center font-mono">
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 truncate">ศรีนครินทร์</div>
                    <div className="text-sm font-bold text-emerald-400 mt-0.5">+136.08</div>
                    <div className="text-[10px] text-slate-400">น้ำ 94%</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 truncate">ภูมิพล</div>
                    <div className="text-sm font-bold text-emerald-400 mt-0.5">+105.16</div>
                    <div className="text-[10px] text-slate-400">น้ำ 66%</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 truncate">วชิราลงกรณ</div>
                    <div className="text-sm font-bold text-emerald-400 mt-0.5">+99.20</div>
                    <div className="text-[10px] text-slate-400">น้ำ 99%</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 truncate">ป่าสักชลสิทธิ์</div>
                    <div className="text-sm font-bold text-rose-400 mt-0.5">+35.88</div>
                    <div className="text-[10px] text-rose-300">น้ำ 109% (ล้น)</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
                    <div className="text-[10px] text-slate-400 truncate">อุบลรัตน์</div>
                    <div className="text-sm font-bold text-emerald-400 mt-0.5">+27.85</div>
                    <div className="text-[10px] text-slate-400">น้ำ 52%</div>
                  </div>
                </div>
              </div>

              {/* Source attribution link */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 border-t border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-cyan-400" />
                  <span>ข้อมูลตรงตามรายงาน: <b>rid_bigcm_raw.php</b> กรมชลประทาน & สสน. (HII)</span>
                </div>
                <a
                  href={HII_REPORT_SOURCE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 font-mono text-[11px]"
                >
                  <span>เปิดหน้ารายงานต้นฉบับ สสน.</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
