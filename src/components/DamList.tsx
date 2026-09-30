import React, { useState } from 'react';
import { HydrologicalStation } from '../types/hydrology';
import { Flood2554ComparisonCard } from './Flood2554ComparisonCard';
import { CHAO_PHRAYA_FOUR_DAMS_2554 } from '../data/flood2554Data';
import { DamIcon } from './icons/DamIcon';
import { 
  Search, 
  ArrowUpDown, 
  Droplet, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  ChevronRight,
  Filter,
  History,
  Info
} from 'lucide-react';

interface DamListProps {
  stations: HydrologicalStation[];
  onSelectStation: (station: HydrologicalStation) => void;
}

export const DamList: React.FC<DamListProps> = ({
  stations,
  onSelectStation,
}) => {
  const dams = stations.filter((s) => s.type === 'dam' || s.type === 'reservoir');

  const [search, setSearch] = useState('');
  const [selectedBasin, setSelectedBasin] = useState('all');
  const [sortBy, setSortBy] = useState<'percent_desc' | 'percent_asc' | 'capacity_desc' | 'risk_2554' | 'buffer_2554'>('percent_desc');
  const [show2554Comparison, setShow2554Comparison] = useState<boolean>(true);
  const [filterChaoPhrayaOnly, setFilterChaoPhrayaOnly] = useState<boolean>(false);

  // Collect unique basins
  const basins = Array.from(new Set(dams.map((d) => d.basin)));

  // Aggregate stats
  const totalCapacity = dams.reduce((acc, d) => acc + d.telemetry.storageCapacityMcm, 0);
  const totalCurrent = dams.reduce((acc, d) => acc + d.telemetry.currentStorageMcm, 0);
  const avgPercent = Number(((totalCurrent / totalCapacity) * 100).toFixed(1));
  const totalInflow = dams.reduce((acc, d) => acc + d.telemetry.inflowRateCms, 0);
  const totalOutflow = dams.reduce((acc, d) => acc + d.telemetry.outflowRateCms, 0);

  // 4 Key Chao Phraya Dams Calculation (Bhumibol, Sirikit, Kwai Noi, Pasak)
  const chaoPhrayaFourDamIds = ['dam-bhumibol', 'dam-sirikit', 'dam-kwainoi', 'dam-pasak'];
  const fourDams = dams.filter((d) => chaoPhrayaFourDamIds.includes(d.id));
  const fourDamsCurrent = fourDams.reduce((acc, d) => acc + d.telemetry.currentStorageMcm, 0);
  const fourDamsCapacity = fourDams.reduce((acc, d) => acc + d.telemetry.storageCapacityMcm, 0) || 24871;
  const fourDamsPercent = Number(((fourDamsCurrent / fourDamsCapacity) * 100).toFixed(1));
  const fourDams2554Peak = CHAO_PHRAYA_FOUR_DAMS_2554.peakStorage2554Mcm;
  const fourDamsRemainingBuffer = Math.max(0, fourDams2554Peak - fourDamsCurrent);
  const fourDamsGapPercent = Number((fourDamsPercent - CHAO_PHRAYA_FOUR_DAMS_2554.peakPercent2554).toFixed(1));

  // Filter & Sort
  const filtered = dams.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.province.toLowerCase().includes(search.toLowerCase());
    const matchBasin = selectedBasin === 'all' || d.basin === selectedBasin;
    const matchChaoPhraya = !filterChaoPhrayaOnly || chaoPhrayaFourDamIds.includes(d.id);
    return matchSearch && matchBasin && matchChaoPhraya;
  }).sort((a, b) => {
    if (sortBy === 'percent_desc') return b.telemetry.storagePercent - a.telemetry.storagePercent;
    if (sortBy === 'percent_asc') return a.telemetry.storagePercent - b.telemetry.storagePercent;
    if (sortBy === 'capacity_desc') return b.telemetry.storageCapacityMcm - a.telemetry.storageCapacityMcm;
    if (sortBy === 'risk_2554') {
      const aGap = a.benchmark2554 ? a.telemetry.storagePercent - a.benchmark2554.peakStoragePercent : -999;
      const bGap = b.benchmark2554 ? b.telemetry.storagePercent - b.benchmark2554.peakStoragePercent : -999;
      return bGap - aGap; // Closest to 2554 first
    }
    if (sortBy === 'buffer_2554') {
      const aBuffer = a.benchmark2554 ? Math.max(0, a.benchmark2554.peakStorageMcm - a.telemetry.currentStorageMcm) : 0;
      const bBuffer = b.benchmark2554 ? Math.max(0, b.benchmark2554.peakStorageMcm - b.telemetry.currentStorageMcm) : 0;
      return bBuffer - aBuffer; // Largest buffer first
    }
    return 0;
  });

  return (
    <div className="space-y-4">
      {/* 2554 Mega Flood Chao Phraya 4 Key Dams Benchmark Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-blue-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                <History className="w-3 h-3 text-rose-400" />
                จุดอ้างอิงประวัติศาสตร์: มหาอุทกภัยปี 2554
              </span>
              <span className="text-[11px] text-slate-300">
                (ปีที่เขื่อนเต็มความจุจนน้ำท่วมใหญ่)
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-white flex items-center gap-2">
              <DamIcon className="w-5 h-5 text-blue-300 shrink-0" />
              <span>สถานะ 4 เขื่อนหลักลุ่มน้ำเจ้าพระยา เทียบปี 2554</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              ในปี 2554 เขื่อนภูมิพล สิริกิติ์ แควน้อย และป่าสัก มีน้ำกักเก็บรวมถึง{' '}
              <b className="text-rose-300">25,227 ล้าน ลบ.ม. (101.4% ล้นความจุ)</b> ทำให้น้ำล้นสปิลเวย์ต่อเนื่อง
              ปัจจุบันทั้ง 4 เขื่อนมีน้ำรวม <b className="text-blue-300">{fourDamsCurrent.toLocaleString()} ล้าน ลบ.ม. ({fourDamsPercent}%)</b>
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center min-w-[130px]">
              <div className="text-[10px] text-slate-300">ช่องว่างรับน้ำเหลืออีก</div>
              <div className="text-lg sm:text-xl font-bold text-emerald-400 mt-0.5">
                {fourDamsRemainingBuffer.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400">ล้าน ลบ.ม. ก่อนเท่าปี 54</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center min-w-[130px]">
              <div className="text-[10px] text-slate-300">ส่วนต่างจากปี 54</div>
              <div className="text-lg sm:text-xl font-bold text-blue-300 mt-0.5">
                {fourDamsGapPercent}%
              </div>
              <div className="text-[10px] text-emerald-400 font-medium">ยังปลอดภัยกว่ามาก</div>
            </div>
          </div>
        </div>

        {/* Dual Progress Bar for the 4 Dams */}
        <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
          <div className="flex justify-between text-xs text-slate-300">
            <span>ระดับน้ำ 4 เขื่อนหลัก: ปัจจุบัน {fourDamsPercent}% vs ปี 2554 พีค 101.4%</span>
            <span className="text-emerald-300 font-medium">
              เหลือช่องว่างอีก {((fourDamsRemainingBuffer / fourDamsCapacity) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden">
            {/* 2554 full line */}
            <div className="absolute top-0 bottom-0 left-0 bg-rose-500/40 w-full" />
            {/* Current water */}
            <div
              className="absolute top-0 bottom-0 left-0 bg-[#0071e3] rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, fourDamsPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total Storage */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-[#86868b] flex items-center justify-between">
            <span>น้ำในเขื่อนรวม</span>
            <DamIcon className="w-4 h-4 text-[#0071e3]" />
          </div>
          <div className="text-2xl font-semibold text-[#1d1d1f] mt-1.5 tracking-tight">
            {totalCurrent.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#86868b] mt-0.5">
            ความจุ {totalCapacity.toLocaleString()} ล้าน ลบ.ม.
          </div>
        </div>

        {/* Avg Percent */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-[#86868b] flex items-center justify-between">
            <span>ระดับน้ำเฉลี่ย</span>
            <span className={`w-2 h-2 rounded-full ${avgPercent > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
          </div>
          <div className="text-2xl font-semibold text-[#1d1d1f] mt-1.5 tracking-tight">
            {avgPercent}%
          </div>
          <div className="text-[11px] text-[#86868b] mt-0.5">
            {dams.filter(d => d.risk.alertLevel === 'critical' || d.risk.alertLevel === 'warning').length} แห่งเกินเกณฑ์เฝ้าระวัง
          </div>
        </div>

        {/* Total Inflow */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-[#86868b] flex items-center justify-between">
            <span>น้ำไหลเข้ารวม</span>
            <ArrowDownCircle className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-semibold text-[#1d1d1f] mt-1.5 tracking-tight">
            {totalInflow.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#86868b] mt-0.5">ลบ.ม./วินาที (cms)</div>
        </div>

        {/* Total Outflow */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-[#86868b] flex items-center justify-between">
            <span>น้ำระบายออกรวม</span>
            <ArrowUpCircle className="w-3.5 h-3.5 text-[#0071e3]" />
          </div>
          <div className="text-2xl font-semibold text-[#1d1d1f] mt-1.5 tracking-tight">
            {totalOutflow.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#86868b] mt-0.5">ลบ.ม./วินาที (cms)</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-sm flex flex-col sm:flex-row gap-2.5 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="ค้นหาชื่อเขื่อน อ่างเก็บน้ำ หรือจังหวัด..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100/90 border border-slate-200/80 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0071e3]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {/* Toggle 2554 Mode */}
          <button
            onClick={() => setShow2554Comparison(!show2554Comparison)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              show2554Comparison
                ? 'bg-blue-50 text-[#0071e3] border-blue-200'
                : 'bg-slate-100 text-slate-600 border-slate-200/80 hover:bg-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>{show2554Comparison ? 'ซ่อนเทียบปี 54' : 'แสดงเทียบปี 54'}</span>
          </button>

          {/* Quick filter 4 Chao Phraya Dams */}
          <button
            onClick={() => setFilterChaoPhrayaOnly(!filterChaoPhrayaOnly)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              filterChaoPhrayaOnly
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-slate-100 text-slate-600 border-slate-200/80 hover:bg-slate-200'
            }`}
          >
            <DamIcon className="w-3.5 h-3.5 text-amber-700" />
            <span>4 เขื่อนหลักเจ้าพระยา</span>
          </button>

          {/* Basin Filter */}
          <div className="flex items-center gap-1 bg-slate-100/80 px-2.5 py-1.5 rounded-lg border border-slate-200/80 text-xs">
            <Filter className="w-3 h-3 text-slate-500" />
            <select
              value={selectedBasin}
              onChange={(e) => setSelectedBasin(e.target.value)}
              className="bg-transparent text-slate-700 focus:outline-none cursor-pointer text-xs"
            >
              <option value="all">ทุกลุ่มน้ำ ({dams.length})</option>
              {basins.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1 bg-slate-100/80 px-2.5 py-1.5 rounded-lg border border-slate-200/80 text-xs">
            <ArrowUpDown className="w-3 h-3 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-700 focus:outline-none cursor-pointer text-xs"
            >
              <option value="percent_desc">ปริมาณน้ำมากสุด (% สูง)</option>
              <option value="percent_asc">ปริมาณน้ำน้อยสุด (% ต่ำ)</option>
              <option value="capacity_desc">ความจุเก็บกักมากสุด</option>
              <option value="risk_2554">ใกล้เคียงวิกฤตปี 2554 ที่สุด</option>
              <option value="buffer_2554">ช่องว่างรับน้ำห่างจากปี 54 มากสุด</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Dam Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filtered.map((dam) => {
          const isCritical = dam.risk.alertLevel === 'critical';
          const isWarning = dam.risk.alertLevel === 'warning';
          const isWatch = dam.risk.alertLevel === 'watch';

          const statusColor = isCritical ? 'text-rose-700' : isWarning ? 'text-amber-700' : isWatch ? 'text-yellow-800' : 'text-slate-600';
          const statusText = isCritical ? 'วิกฤต' : isWarning ? 'เตือนภัย' : isWatch ? 'เฝ้าระวัง' : 'ปกติ';

          return (
            <div
              key={dam.id}
              className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-4.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-semibold text-[#1d1d1f] text-sm tracking-tight flex items-center gap-1.5">
                      <DamIcon className="w-4 h-4 text-[#0071e3] shrink-0" />
                      <span>{dam.name}</span>
                      {chaoPhrayaFourDamIds.includes(dam.id) && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-blue-50 text-[#0071e3] border border-blue-200 rounded font-medium">
                          4 เขื่อนหลัก
                        </span>
                      )}
                    </h3>
                    <div className="text-xs text-[#86868b] mt-0.5">
                      จ.{dam.province} · {dam.basin}
                    </div>
                  </div>

                  <span className={`text-xs font-medium flex items-center gap-1.5 ${statusColor}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isCritical ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : isWatch ? 'bg-yellow-400' : 'bg-emerald-500'}`}></span>
                    {statusText}
                  </span>
                </div>

                {/* Current Progress Bar */}
                <div className="my-2.5">
                  <div className="flex justify-between items-baseline text-xs mb-1">
                    <span className="text-[#86868b]">ปริมาณน้ำปัจจุบัน</span>
                    <span className="font-semibold text-[#1d1d1f]">
                      {dam.telemetry.storagePercent}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCritical ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : isWatch ? 'bg-yellow-400' : 'bg-[#0071e3]'
                      }`}
                      style={{ width: `${Math.min(100, dam.telemetry.storagePercent)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-[#86868b] mt-1">
                    <span>{dam.telemetry.currentStorageMcm.toLocaleString()} ล้าน ลบ.ม.</span>
                    <span>เต็มความจุ {dam.telemetry.storageCapacityMcm.toLocaleString()}</span>
                  </div>
                </div>

                {/* Inflow vs Outflow */}
                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-t border-slate-100 text-[#86868b]">
                  <div>
                    <span className="text-[11px] block">น้ำไหลเข้า:</span>
                    <span className="font-medium text-[#1d1d1f]">{dam.telemetry.inflowRateCms.toLocaleString()} cms</span>
                  </div>
                  <div>
                    <span className="text-[11px] block">น้ำระบายออก:</span>
                    <span className="font-medium text-[#1d1d1f]">{dam.telemetry.outflowRateCms.toLocaleString()} cms</span>
                  </div>
                </div>

                {/* Compact 2554 Comparison Box */}
                {show2554Comparison && (
                  <Flood2554ComparisonCard station={dam} compact={true} />
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2.5 mt-2.5 border-t border-slate-100">
                <button
                  onClick={() => onSelectStation(dam)}
                  className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  ดูรายละเอียด & ประวัติปี 54 <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
