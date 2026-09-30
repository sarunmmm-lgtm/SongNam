import React, { useState } from 'react';
import { HydrologicalStation } from '../types/hydrology';
import { 
  Search, 
  CloudRain, 
  TrendingUp, 
  ChevronRight
} from 'lucide-react';

interface CanalListProps {
  stations: HydrologicalStation[];
  onSelectStation: (station: HydrologicalStation) => void;
}

export const CanalList: React.FC<CanalListProps> = ({
  stations,
  onSelectStation,
}) => {
  const canals = stations.filter((s) => s.type === 'canal' || s.type === 'river_station');

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'all' | 'bkk_canals' | 'chaophraya' | 'regional'>('all');

  const filtered = canals.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.province.toLowerCase().includes(search.toLowerCase()) ||
      item.district.toLowerCase().includes(search.toLowerCase());

    let matchCategory = true;
    if (category === 'bkk_canals') {
      matchCategory = item.type === 'canal' || item.province === 'กรุงเทพมหานคร' || item.province === 'นนทบุรี';
    } else if (category === 'chaophraya') {
      matchCategory = item.basin.includes('เจ้าพระยา');
    } else if (category === 'regional') {
      matchCategory = item.province !== 'กรุงเทพมหานคร' && item.province !== 'นนทบุรี' && item.province !== 'ปทุมธานี';
    }

    return matchSearch && matchCategory;
  });

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
            ตรวจวัดระดับน้ำและอัตราการไหลแบบเรียลไทม์ · {canals.length} สถานี
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#86868b]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            วิกฤต/ล้นตลิ่ง: <b className="text-rose-700">{criticalCount}</b>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            เตือนภัย: <b className="text-amber-700">{warningCount}</b>
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-sm flex flex-col md:flex-row gap-2.5 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="ค้นหาชื่อคลอง หรืออำเภอ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100/90 border border-slate-200/80 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0071e3]"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto text-xs pb-0.5 md:pb-0">
          <button
            onClick={() => setCategory('all')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
              category === 'all'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ทั้งหมด ({canals.length})
          </button>
          <button
            onClick={() => setCategory('bkk_canals')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
              category === 'bkk_canals'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            คลอง กทม.และปริมณฑล
          </button>
          <button
            onClick={() => setCategory('chaophraya')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
              category === 'chaophraya'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ลุ่มน้ำเจ้าพระยา
          </button>
          <button
            onClick={() => setCategory('regional')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
              category === 'regional'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ภูมิภาค (ปิง, มูล, ยม, วัง)
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
              className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-4.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-semibold text-[#1d1d1f] text-sm leading-snug tracking-tight">
                      {item.name}
                    </h3>
                    <div className="text-xs text-[#86868b] mt-0.5">
                      {item.district}, จ.{item.province}
                    </div>
                  </div>

                  <span className={`text-xs font-medium flex items-center gap-1.5 shrink-0 ${statusColor}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isCritical ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : isWatch ? 'bg-yellow-400' : 'bg-emerald-500'}`}></span>
                    {statusText}
                  </span>
                </div>

                {/* Key Gauge Metric */}
                <div className="my-3 py-2 border-t border-slate-100">
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

                  <div className="flex justify-between text-[11px] text-[#86868b] mt-1">
                    <span>{item.telemetry.currentLevelMsl} ม.รทก.</span>
                    <span>ระดับตลิ่ง {item.telemetry.bankLevelMsl} ม.รทก.</span>
                  </div>
                </div>

                {/* Quick Telemetry Details */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-3 text-[#86868b]">
                  <div className="flex items-center gap-1.5">
                    <CloudRain className="w-3.5 h-3.5 text-slate-400" />
                    <span>ฝน 24ชม: <b className="text-slate-700 font-medium">{item.telemetry.rainfall24hMm} มม.</b></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                    <span>ความเร็ว: <b className="text-slate-700 font-medium">{item.telemetry.flowVelocityMs || 1.1} m/s</b></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => onSelectStation(item)}
                  className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  รายละเอียด <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
