import React, { useState } from 'react';
import { HydrologicalStation } from '../types/hydrology';
import { 
  Search, 
  CloudRain, 
  TrendingUp, 
  ChevronRight,
  Video,
  Droplet
} from 'lucide-react';

interface CanalListProps {
  stations: HydrologicalStation[];
  onSelectStation: (station: HydrologicalStation) => void;
  onOpenCctv?: (station: HydrologicalStation) => void;
}

export const CanalList: React.FC<CanalListProps> = ({
  stations,
  onSelectStation,
  onOpenCctv,
}) => {
  const canals = stations.filter((s) => s.type === 'canal' || s.type === 'river_station');

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'all' | 'cctv_rivers' | 'bkk_canals' | 'chaophraya' | 'regional'>('all');

  const filtered = canals.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.province.toLowerCase().includes(search.toLowerCase()) ||
      item.district.toLowerCase().includes(search.toLowerCase());

    let matchCategory = true;
    if (category === 'cctv_rivers') {
      matchCategory = Boolean(item.cctv?.enabled);
    } else if (category === 'bkk_canals') {
      matchCategory = item.type === 'canal' || item.province === 'กรุงเทพมหานคร' || item.province === 'นนทบุรี';
    } else if (category === 'chaophraya') {
      matchCategory = item.basin.includes('เจ้าพระยา');
    } else if (category === 'regional') {
      matchCategory = item.province !== 'กรุงเทพมหานคร' && item.province !== 'นนทบุรี' && item.province !== 'ปทุมธานี';
    }

    return matchSearch && matchCategory;
  });

  const cctvRiverCount = canals.filter((c) => c.cctv?.enabled).length;
  const criticalCount = canals.filter((c) => c.risk.alertLevel === 'critical').length;
  const warningCount = canals.filter((c) => c.risk.alertLevel === 'warning').length;

  return (
    <div className="space-y-4">
      {/* Top Header Summary Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <div>
          <h2 className="text-base font-semibold text-[#1d1d1f] tracking-tight">
            สถานีโทรมาตรลำคลองและแม่น้ำสายหลัก
          </h2>
          <p className="text-xs text-[#86868b]">
            ตรวจวัดระดับน้ำ อัตราการไหล และกล้อง CCTV เรียลไทม์ · {canals.length} สถานี
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#86868b]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            วิกฤต {criticalCount}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            เตือนภัย {warningCount}
          </span>
          <span className="flex items-center gap-1.5 text-rose-600 font-semibold">
            <Video className="w-3.5 h-3.5" />
            กล้องสด {cctvRiverCount} จุด
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="ค้นหาชื่อคลอง แม่น้ำ หรือจังหวัด..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100/90 border border-slate-200/80 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0071e3]"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto text-xs pb-0.5 md:pb-0">
          <button
            onClick={() => setCategory('all')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              category === 'all'
                ? 'bg-slate-100 text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ทั้งหมด ({canals.length})
          </button>

          <button
            onClick={() => setCategory(category === 'cctv_rivers' ? 'all' : 'cctv_rivers')}
            className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              category === 'cctv_rivers'
                ? 'bg-rose-600 text-white shadow-sm font-bold ring-2 ring-rose-400'
                : 'text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <Video className="w-3.5 h-3.5" />
            <span>กล้องแม่น้ำ ({cctvRiverCount})</span>
          </button>

          <button
            onClick={() => setCategory('chaophraya')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              category === 'chaophraya'
                ? 'bg-slate-100 text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ลุ่มน้ำเจ้าพระยา
          </button>
          <button
            onClick={() => setCategory('bkk_canals')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              category === 'bkk_canals'
                ? 'bg-slate-100 text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            คลอง กทม.และปริมณฑล
          </button>
          <button
            onClick={() => setCategory('regional')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              category === 'regional'
                ? 'bg-slate-100 text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ภูมิภาค (ปิง, มูล, ยม, วัง, น่าน, ชี, ตาปี)
          </button>
        </div>
      </div>

      {/* Grid of Canal / River Sensor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filtered.map((item) => {
          const isCritical = item.risk.alertLevel === 'critical';
          const isWarning = item.risk.alertLevel === 'warning';
          const isWatch = item.risk.alertLevel === 'watch';

          const freeboard = item.risk.freeboardMeters;
          const isOverflowing = freeboard <= 0;

          const statusColor = isCritical ? 'text-rose-700' : isWarning ? 'text-amber-700' : isWatch ? 'text-yellow-800' : 'text-slate-600';
          const statusText = isCritical ? 'วิกฤติน้ำล้น' : isWarning ? 'เตือนภัย' : isWatch ? 'เฝ้าระวัง' : 'ปกติ';

          return (
            <div
              key={item.id}
              className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${
                        item.type === 'river_station' 
                          ? 'bg-blue-50 text-[#0071e3] border-blue-200' 
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {item.type === 'river_station' ? 'แม่น้ำสายหลัก' : 'ลำคลอง'}
                      </span>
                      {item.cctv?.enabled && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                          CCTV สด
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-[#1d1d1f] text-sm leading-snug tracking-tight truncate">
                      {item.name}
                    </h3>
                    <div className="text-xs text-[#86868b] mt-0.5 truncate">
                      {item.district}, จ.{item.province} · {item.basin}
                    </div>
                  </div>

                  <span className={`text-xs font-medium flex items-center gap-1.5 shrink-0 ${statusColor}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isCritical ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : isWatch ? 'bg-yellow-400' : 'bg-emerald-500'}`}></span>
                    {statusText}
                  </span>
                </div>

                {/* Key Gauge Metric */}
                <div className="my-2.5 py-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-[#86868b] mb-1.5">
                    <span>ระดับน้ำเทียบตลิ่ง</span>
                    <span className="font-semibold text-[#1d1d1f]">
                      {isOverflowing ? `ล้นตลิ่ง +${Math.abs(freeboard)} ม.` : `ต่ำกว่าตลิ่ง ${freeboard} ม.`}
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOverflowing ? 'bg-rose-500' : freeboard < 0.3 ? 'bg-amber-500' : 'bg-[#0071e3]'
                      }`}
                      style={{
                        width: `${Math.min(100, Math.max(10, item.telemetry.storagePercent))}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Flow metrics */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#86868b] bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <div>
                    ระดับน้ำ: <b className="text-[#1d1d1f]">+{item.telemetry.currentLevelMsl}</b> ม.รทก.
                  </div>
                  <div className="text-right">
                    อัตราไหล: <b className="text-[#1d1d1f]">{item.telemetry.inflowRateCms.toLocaleString()}</b> ลบ.ม./วิ
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                {item.cctv?.enabled && onOpenCctv ? (
                  <button
                    onClick={() => onOpenCctv(item)}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs border border-rose-200/80 flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="ส่องภาพกล้อง CCTV สดประจำสถานีนี้"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                    <Video className="w-3.5 h-3.5 text-rose-600" />
                    <span>ส่องกล้องสด</span>
                  </button>
                ) : (
                  <span className="text-[#86868b] text-[11px]">สถานีวัดระดับน้ำ</span>
                )}

                <button
                  onClick={() => onSelectStation(item)}
                  className="text-xs text-[#0071e3] hover:text-[#0077ed] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>รายละเอียด</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center text-slate-500 space-y-2">
          <p className="text-sm font-medium">ไม่พบสถานีคลองหรือแม่น้ำที่ตรงกับเงื่อนไขการค้นหา</p>
          <button
            onClick={() => {
              setSearch('');
              setCategory('all');
            }}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg transition-colors font-medium cursor-pointer"
          >
            ล้างตัวกรองทั้งหมด
          </button>
        </div>
      )}
    </div>
  );
};
