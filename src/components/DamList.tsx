import React, { useState } from 'react';
import { HydrologicalStation } from '../types/hydrology';
import { Flood2554ComparisonCard } from './Flood2554ComparisonCard';
import { CHAO_PHRAYA_FOUR_DAMS_2554 } from '../data/flood2554Data';
import { DamIcon } from './icons/DamIcon';
import { ThreeDayWaterSummaryBar } from './ThreeDayWaterSummaryBar';
import { 
  Search, 
  ArrowUpDown, 
  Droplet, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  ChevronRight,
  Filter,
  History,
  Info,
  MapPin,
  Star,
  CheckCircle2,
  X,
  FileCheck,
  Video
} from 'lucide-react';

interface DamListProps {
  stations: HydrologicalStation[];
  onSelectStation: (station: HydrologicalStation) => void;
  onOpenCctv?: (station: HydrologicalStation) => void;
}

const PROVINCE_TO_REGION: Record<string, string> = {
  // ภาคเหนือ
  'เชียงใหม่': 'north', 'ลำปาง': 'north', 'เชียงราย': 'north', 'สุโขทัย': 'north', 'ตาก': 'north', 
  'อุตรดิตถ์': 'north', 'พะเยา': 'north', 'แพร่': 'north', 'น่าน': 'north', 'ลำพูน': 'north', 'แม่ฮ่องสอน': 'north',
  // ภาคอีสาน
  'ขอนแก่น': 'northeast', 'สกลนคร': 'northeast', 'นครราชสีมา': 'northeast', 'อุดรธานี': 'northeast', 
  'บุรีรัมย์': 'northeast', 'ศรีสะเกษ': 'northeast', 'อุบลราชธานี': 'northeast', 'ชัยภูมิ': 'northeast', 
  'กาฬสินธุ์': 'northeast', 'อำนาจเจริญ': 'northeast', 'สุรินทร์': 'northeast', 'ร้อยเอ็ด': 'northeast', 'ยโสธร': 'northeast',
  // ภาคกลางและตะวันตก
  'ชัยนาท': 'central_west', 'สุพรรณบุรี': 'central_west', 'อุทัยธานี': 'central_west', 'ลพบุรี': 'central_west', 
  'สระบุรี': 'central_west', 'นครสวรรค์': 'central_west', 'เพชรบูรณ์': 'central_west', 'กาญจนบุรี': 'central_west', 
  'ราชบุรี': 'central_west', 'เพชรบุรี': 'central_west', 'ประจวบคีรีขันธ์': 'central_west', 'พิษณุโลก': 'central_west', 'พระนครศรีอยุธยา': 'central_west',
  // ภาคตะวันออก
  'ชลบุรี': 'east', 'ระยอง': 'east', 'จันทบุรี': 'east', 'ตราด': 'east', 'ฉะเชิงเทรา': 'east', 
  'ปราจีนบุรี': 'east', 'นครนายก': 'east', 'สระแก้ว': 'east',
  // ภาคใต้
  'สุราษฎร์ธานี': 'south', 'ยะลา': 'south', 'นครศรีธรรมราช': 'south', 'สงขลา': 'south', 
  'ภูเก็ต': 'south', 'กระบี่': 'south', 'พัทลุง': 'south', 'พังงา': 'south', 'ตรัง': 'south', 
  'สตูล': 'south', 'ปัตตานี': 'south', 'นราธิวาส': 'south', 'ชุมพร': 'south', 'ระนอง': 'south'
};

const REGION_LABELS: Record<string, string> = {
  all: 'ทุกภูมิภาคทั่วไทย',
  north: 'ภาคเหนือ',
  northeast: 'ภาคตะวันออกเฉียงเหนือ (อีสาน)',
  central_west: 'ภาคกลาง & ตะวันตก',
  east: 'ภาคตะวันออก (EEC & ชายฝั่ง)',
  south: 'ภาคใต้'
};

export const DamList: React.FC<DamListProps> = ({
  stations,
  onSelectStation,
  onOpenCctv,
}) => {
  const dams = stations.filter((s) => s.type === 'dam' || s.type === 'reservoir');

  const [search, setSearch] = useState('');
  const [filterKind, setFilterKind] = useState<'all' | 'major35' | 'dam' | 'reservoir' | 'cctv'>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedBasin, setSelectedBasin] = useState('all');
  const [sortBy, setSortBy] = useState<'percent_desc' | 'percent_asc' | 'capacity_desc' | 'risk_2554' | 'buffer_2554'>('percent_desc');
  const [show2554Comparison, setShow2554Comparison] = useState<boolean>(true);
  const [filterChaoPhrayaOnly, setFilterChaoPhrayaOnly] = useState<boolean>(false);
  const [showChecklistModal, setShowChecklistModal] = useState<boolean>(false);

  // Collect unique basins
  const basins = Array.from(new Set(dams.map((d) => d.basin)));

  // Aggregate stats
  const totalCapacity = dams.reduce((acc, d) => acc + d.telemetry.storageCapacityMcm, 0);
  const totalCurrent = dams.reduce((acc, d) => acc + d.telemetry.currentStorageMcm, 0);
  const avgPercent = Number(((totalCurrent / totalCapacity) * 100).toFixed(1));
  const totalInflow = dams.reduce((acc, d) => acc + d.telemetry.inflowRateCms, 0);
  const totalOutflow = dams.reduce((acc, d) => acc + d.telemetry.outflowRateCms, 0);

  // 35 Major Dams
  const major35Dams = dams.filter((d) => d.isMajorDam35);
  const egatDams = major35Dams.filter((d) => d.operator === 'EGAT');
  const ridDams = major35Dams.filter((d) => d.operator === 'RID');

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
      d.province.toLowerCase().includes(search.toLowerCase()) ||
      d.district.toLowerCase().includes(search.toLowerCase());
    
    const matchKind = 
      filterKind === 'all' 
        ? true 
        : filterKind === 'major35'
        ? d.isMajorDam35 === true
        : filterKind === 'cctv'
        ? Boolean(d.cctv?.enabled)
        : d.type === filterKind;

    const matchBasin = selectedBasin === 'all' || d.basin === selectedBasin;
    const itemRegion = PROVINCE_TO_REGION[d.province] || 'central_west';
    const matchRegion = selectedRegion === 'all' || itemRegion === selectedRegion;
    const matchChaoPhraya = !filterChaoPhrayaOnly || chaoPhrayaFourDamIds.includes(d.id);

    return matchSearch && matchKind && matchBasin && matchRegion && matchChaoPhraya;
  }).sort((a, b) => {
    if (sortBy === 'percent_desc') return b.telemetry.storagePercent - a.telemetry.storagePercent;
    if (sortBy === 'percent_asc') return a.telemetry.storagePercent - b.telemetry.storagePercent;
    if (sortBy === 'capacity_desc') return b.telemetry.storageCapacityMcm - a.telemetry.storageCapacityMcm;
    if (sortBy === 'risk_2554') {
      const aGap = a.benchmark2554 ? a.telemetry.storagePercent - a.benchmark2554.peakStoragePercent : -999;
      const bGap = b.benchmark2554 ? b.telemetry.storagePercent - b.benchmark2554.peakStoragePercent : -999;
      return bGap - aGap;
    }
    if (sortBy === 'buffer_2554') {
      const aBuffer = a.benchmark2554 ? Math.max(0, a.benchmark2554.peakStorageMcm - a.telemetry.currentStorageMcm) : 0;
      const bBuffer = b.benchmark2554 ? Math.max(0, b.benchmark2554.peakStorageMcm - b.telemetry.currentStorageMcm) : 0;
      return bBuffer - aBuffer;
    }
    return 0;
  });

  return (
    <div className="space-y-4">
      {/* 2554 Mega Flood Chao Phraya 4 Key Dams Benchmark Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-blue-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                <History className="w-3 h-3 text-rose-400" />
                จุดอ้างอิงประวัติศาสตร์: มหาอุทกภัยปี 2554
              </span>
              <button
                onClick={() => setShowChecklistModal(true)}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <CheckCircle2 className="w-3 h-3 text-amber-400" />
                <span>ครบ 35 เขื่อนขนาดใหญ่ของประเทศ (กดตรวจสอบรายชื่อ)</span>
              </button>
            </div>
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-white flex items-center gap-2">
              <DamIcon className="w-5 h-5 text-blue-300 shrink-0" />
              <span>สถานะ 4 เขื่อนหลักลุ่มน้ำเจ้าพระยา เทียบปี 2554</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              ในปี 2554 เขื่อนภูมิพล สิริกิติ์ แควน้อย และป่าสัก มีน้ำกักเก็บรวมถึง{' '}
              <b className="text-rose-300 font-semibold">{fourDams2554Peak.toLocaleString()} ล้าน ลบ.ม. (101.4%)</b>{' '}
              จนน้ำล้นสปิลเวย์ ปัจจุบันทั้ง 4 เขื่อนมีน้ำรวม {fourDamsCurrent.toLocaleString()} ล้าน ลบ.ม. ({fourDamsPercent}%)
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center min-w-[130px]">
              <div className="text-[10px] text-slate-300">พื้นที่รับน้ำที่เหลือ</div>
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

      {/* 3-Day Water Trend Ribbon Bar */}
      <div className="flex items-center justify-between">
        <ThreeDayWaterSummaryBar />
        <span className="text-[11px] text-[#86868b] font-mono hidden sm:inline">
          รายงานสถานภาพน้ำเขื่อน สสน. (HII) & กรมชลประทาน
        </span>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total Storage */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-[#86868b] flex items-center justify-between">
            <span>น้ำในเขื่อนและอ่างรวม</span>
            <DamIcon className="w-4 h-4 text-[#0071e3]" />
          </div>
          <div className="text-2xl font-semibold text-[#1d1d1f] mt-1.5 tracking-tight">
            {totalCurrent.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#86868b] mt-0.5">
            ความจุ {totalCapacity.toLocaleString()} ล้าน ลบ.ม. ({dams.length} แห่ง)
          </div>
        </div>

        {/* Avg Percent */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-[#86868b] flex items-center justify-between">
            <span>ระดับน้ำเฉลี่ยทั้งประเทศ</span>
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
          <div className="text-2xl font-semibold text-emerald-600 mt-1.5 tracking-tight">
            {totalInflow.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#86868b] mt-0.5">
            ลูกบาศก์เมตร / วินาที
          </div>
        </div>

        {/* Total Outflow */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
          <div className="text-xs text-[#86868b] flex items-center justify-between">
            <span>น้ำระบายออกรวม</span>
            <ArrowUpCircle className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-2xl font-semibold text-blue-600 mt-1.5 tracking-tight">
            {totalOutflow.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#86868b] mt-0.5">
            ลูกบาศก์เมตร / วินาที
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-sm space-y-3">
        {/* Row 1: Search & Type Tabs */}
        <div className="flex flex-col lg:flex-row gap-2.5 items-center justify-between">
          <div className="relative w-full lg:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="ค้นหาชื่อเขื่อน อ่างเก็บน้ำ อำเภอ หรือจังหวัด..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100/90 border border-slate-200/80 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0071e3]"
            />
          </div>

          {/* Type Segmented Buttons: All vs 35 Major Dams vs Dams vs Reservoirs */}
          <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setFilterKind('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filterKind === 'all'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ทั้งหมด ({dams.length})
            </button>
            <button
              onClick={() => setFilterKind('major35')}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                filterKind === 'major35'
                  ? 'bg-amber-500 text-white shadow-sm font-semibold'
                  : 'text-amber-800 hover:text-amber-900 bg-amber-50/60'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>35 เขื่อนขนาดใหญ่ ({major35Dams.length})</span>
            </button>
            <button
              onClick={() => setFilterKind('dam')}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                filterKind === 'dam'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold text-[#0071e3]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <DamIcon className="w-3.5 h-3.5 text-[#0071e3]" />
              <span>เขื่อนหลัก ({dams.filter(d => d.type === 'dam').length})</span>
            </button>
            <button
              onClick={() => setFilterKind('reservoir')}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                filterKind === 'reservoir'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold text-cyan-700'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Droplet className="w-3.5 h-3.5 text-cyan-600" />
              <span>อ่างเก็บน้ำ ({dams.filter(d => d.type === 'reservoir').length})</span>
            </button>
            <button
              onClick={() => setFilterKind(filterKind === 'cctv' ? 'all' : 'cctv')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                filterKind === 'cctv'
                  ? 'bg-rose-600 text-white shadow-sm font-bold ring-2 ring-rose-400'
                  : 'text-rose-700 bg-rose-50/90 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <Video className="w-3.5 h-3.5" />
              <span>กล้อง CCTV สด ({dams.filter(d => d.cctv?.enabled).length})</span>
            </button>
          </div>
        </div>

        {/* Row 2: Region, Basin, and Sort Options */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          {/* Region Dropdown */}
          <div className="flex items-center gap-1 bg-slate-100/80 px-2.5 py-1.5 rounded-lg border border-slate-200/80 text-xs">
            <MapPin className="w-3 h-3 text-slate-500" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-transparent text-slate-700 focus:outline-none cursor-pointer text-xs font-medium"
            >
              <option value="all">ทุกภูมิภาคทั่วไทย ({dams.length})</option>
              <option value="north">ภาคเหนือ</option>
              <option value="northeast">ภาคอีสาน (ตะวันออกเฉียงเหนือ)</option>
              <option value="central_west">ภาคกลาง & ตะวันตก</option>
              <option value="east">ภาคตะวันออก (EEC & ชายฝั่ง)</option>
              <option value="south">ภาคใต้</option>
            </select>
          </div>

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

          {/* Quick Checklist Button */}
          <button
            onClick={() => setShowChecklistModal(true)}
            className="px-2.5 py-1.5 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 text-xs font-medium flex items-center gap-1.5 hover:bg-amber-100 transition-colors"
          >
            <FileCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>ตรวจเช็คบัญชี 35 เขื่อนหลัก</span>
          </button>

          <span className="ml-auto text-xs text-slate-500">
            แสดงผล <b>{filtered.length}</b> จาก {dams.length} แห่ง
          </span>
        </div>
      </div>

      {/* Grid of Dam & Reservoir Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filtered.map((dam) => {
          const isCritical = dam.risk.alertLevel === 'critical';
          const isWarning = dam.risk.alertLevel === 'warning';
          const isWatch = dam.risk.alertLevel === 'watch';

          const statusColor = isCritical
            ? 'text-rose-700 bg-rose-50 border-rose-200'
            : isWarning
            ? 'text-amber-700 bg-amber-50 border-amber-200'
            : isWatch
            ? 'text-yellow-800 bg-yellow-50 border-yellow-200'
            : 'text-emerald-700 bg-emerald-50 border-emerald-200';

          const statusText = isCritical
            ? 'วิกฤต'
            : isWarning
            ? 'เตือนภัย'
            : isWatch
            ? 'เฝ้าระวัง'
            : 'ปกติ';

          const barColor = isCritical
            ? 'bg-rose-500'
            : isWarning
            ? 'bg-amber-500'
            : isWatch
            ? 'bg-yellow-400'
            : 'bg-[#0071e3]';

          const isReservoir = dam.type === 'reservoir';

          return (
            <div
              key={dam.id}
              onClick={() => onSelectStation(dam)}
              className="group bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl border ${isReservoir ? 'bg-cyan-50 border-cyan-100 text-cyan-600' : 'bg-slate-50 border-slate-200/80 text-[#0071e3]'}`}>
                      {isReservoir ? (
                        <Droplet className="w-5 h-5 text-cyan-600" />
                      ) : (
                        <DamIcon className="w-5 h-5 text-[#0071e3]" />
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {dam.isMajorDam35 && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                            35 เขื่อนหลัก ({dam.operator === 'EGAT' ? 'กฟผ.' : 'ชลประทาน'})
                          </span>
                        )}
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${
                          isReservoir 
                            ? 'bg-cyan-50 text-cyan-700 border-cyan-200' 
                            : 'bg-blue-50 text-[#0071e3] border-blue-200'
                        }`}>
                          {isReservoir ? 'อ่างเก็บน้ำ' : 'เขื่อนหลัก'}
                        </span>
                        <span className="text-[11px] text-[#86868b]">{dam.province}</span>
                      </div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-[#0071e3] transition-colors tracking-tight text-sm mt-0.5">
                        {dam.name}
                      </h3>
                      <div className="text-[11px] text-[#86868b] flex items-center gap-1">
                        <span>{dam.basin}</span>
                        <span>•</span>
                        <span>อ.{dam.district}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColor} shrink-0`}>
                    {statusText}
                  </span>
                </div>

                {/* Storage & Percentage Bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="text-[#86868b]">ปริมาณน้ำกักเก็บ</span>
                    <span className="font-bold text-slate-900 text-base">
                      {dam.telemetry.storagePercent}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${Math.min(100, dam.telemetry.storagePercent)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-[#86868b] pt-0.5">
                    <span>
                      {dam.telemetry.currentStorageMcm.toLocaleString()} ล้าน ลบ.ม.
                    </span>
                    <span>
                      เต็มความจุ {dam.telemetry.storageCapacityMcm.toLocaleString()}
                    </span>
                  </div>

                  {dam.telemetry.diffYesterdayMcm !== undefined && (
                    <div className="flex items-center justify-between text-[11px] pt-1.5 mt-1 border-t border-slate-100 font-mono">
                      <span className="text-slate-500">
                        เมื่อวาน: {dam.telemetry.storageYesterdayMcm?.toLocaleString()} ล้าน ม.³
                      </span>
                      <span className={`font-semibold ${
                        dam.telemetry.diffYesterdayMcm > 0 
                          ? 'text-emerald-600' 
                          : dam.telemetry.diffYesterdayMcm < 0 
                            ? 'text-blue-600' 
                            : 'text-slate-500'
                      }`}>
                        {dam.telemetry.diffYesterdayMcm > 0 ? `+${dam.telemetry.diffYesterdayMcm}` : dam.telemetry.diffYesterdayMcm} ล้าน ม.³ ({dam.telemetry.diffYesterdayPercent && dam.telemetry.diffYesterdayPercent > 0 ? `+${dam.telemetry.diffYesterdayPercent}%` : `${dam.telemetry.diffYesterdayPercent}%`})
                      </span>
                    </div>
                  )}
                </div>

                {/* 2554 Mega Flood Benchmark Comparison Mini Card */}
                {show2554Comparison && (
                  <div className="mt-3">
                    <Flood2554ComparisonCard station={dam} compact={true} />
                  </div>
                )}

                {/* Telemetry Flow Rates */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="bg-slate-50 rounded-xl p-2">
                    <div className="text-[#86868b] text-[10px] flex items-center gap-1">
                      <ArrowDownCircle className="w-3 h-3 text-emerald-600" />
                      น้ำไหลเข้า
                    </div>
                    <div className="font-semibold text-slate-800 mt-0.5">
                      {dam.telemetry.inflowRateCms.toLocaleString()} <span className="text-[10px] font-normal text-slate-500">ลบ.ม./วิ</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-2">
                    <div className="text-[#86868b] text-[10px] flex items-center gap-1">
                      <ArrowUpCircle className="w-3 h-3 text-blue-600" />
                      น้ำระบายออก
                    </div>
                    <div className="font-semibold text-slate-800 mt-0.5">
                      {dam.telemetry.outflowRateCms.toLocaleString()} <span className="text-[10px] font-normal text-slate-500">ลบ.ม./วิ</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                {dam.cctv?.enabled && onOpenCctv ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenCctv(dam);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold border border-rose-200/80 flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="ส่องภาพกล้อง CCTV สดประจำเขื่อนนี้"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                    <Video className="w-3.5 h-3.5 text-rose-600" />
                    <span>ส่องกล้องสด ({dam.cctv.cameras.length} มุม)</span>
                  </button>
                ) : (
                  <span className="text-[#86868b] text-[11px]">สถานีโทรมาตรทางการ</span>
                )}

                <span className="text-[#0071e3] font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>ดูรายละเอียด</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center text-slate-500 space-y-2">
          <p className="text-sm font-medium">ไม่พบเขื่อนหรืออ่างเก็บน้ำที่ตรงกับเงื่อนไขการค้นหา</p>
          <button
            onClick={() => {
              setSearch('');
              setFilterKind('all');
              setSelectedRegion('all');
              setSelectedBasin('all');
              setFilterChaoPhrayaOnly(false);
            }}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg transition-colors font-medium"
          >
            ล้างตัวกรองทั้งหมด
          </button>
        </div>
      )}

      {/* 35 Major Dams Checklist Modal */}
      {showChecklistModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    บัญชีทางการ (Official 35 Large Dams)
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    (กฟผ. 10 แห่ง + กรมชลประทาน 25 แห่ง)
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>รายชื่อ 35 อ่างเก็บน้ำ / เขื่อนขนาดใหญ่ของประเทศไทย</span>
                  <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md text-xs font-semibold">
                    ครบ 35/35 แห่ง (100%)
                  </span>
                </h3>
              </div>
              <button
                onClick={() => setShowChecklistModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Table grouped by regions */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 text-xs text-blue-900 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  นี่คือรายชื่อ <b>35 เขื่อนและอ่างเก็บน้ำขนาดใหญ่ระดับประเทศ</b> ที่กรมชลประทาน (RID) และการไฟฟ้าฝ่ายผลิตแห่งประเทศไทย (กฟผ.) ใช้เป็นเกณฑ์ติดตามสถานการณ์น้ำท่วม-น้ำแล้งประจำวันของประเทศไทย คุณสามารถคลิกที่แต่ละแห่งเพื่อเปิดดูข้อมูลและแบบจำลองน้ำได้ทันที
                </div>
              </div>

              {/* Group by Region */}
              {['north', 'northeast', 'central_west', 'east', 'south'].map((regionKey) => {
                const regionDams = major35Dams.filter((d) => (PROVINCE_TO_REGION[d.province] || 'central_west') === regionKey);
                if (regionDams.length === 0) return null;

                return (
                  <div key={regionKey} className="space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                      <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#0071e3]" />
                        <span>{REGION_LABELS[regionKey]}</span>
                        <span className="text-xs font-normal text-slate-500">
                          ({regionDams.length} แห่ง)
                        </span>
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {regionDams.map((dam, idx) => (
                        <div
                          key={dam.id}
                          onClick={() => {
                            setShowChecklistModal(false);
                            onSelectStation(dam);
                          }}
                          className="bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 rounded-xl p-3 cursor-pointer transition-all flex items-center justify-between group"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-xs text-slate-900 group-hover:text-[#0071e3] transition-colors">
                                {dam.name}
                              </span>
                              <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                dam.operator === 'EGAT' 
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                                  : 'bg-blue-100 text-blue-800 border border-blue-200'
                              }`}>
                                {dam.operator === 'EGAT' ? 'กฟผ.' : 'ชลประทาน'}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500">
                              จ.{dam.province} • {dam.basin}
                            </div>
                            <div className="text-[11px] text-slate-600 font-medium">
                              ความจุ {dam.telemetry.storageCapacityMcm.toLocaleString()} ล้าน ลบ.ม.
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="font-bold text-sm text-slate-900">
                              {dam.telemetry.storagePercent}%
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {dam.telemetry.currentStorageMcm.toLocaleString()} ม.ลบ.ม.
                            </div>
                            <span className={`inline-block px-1.5 py-0.2 rounded-full text-[9px] font-medium mt-1 ${
                              dam.risk.alertLevel === 'critical'
                                ? 'bg-rose-100 text-rose-700'
                                : dam.risk.alertLevel === 'warning'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              {dam.risk.alertLevel === 'critical' ? 'วิกฤต' : dam.risk.alertLevel === 'warning' ? 'เตือนภัย' : 'ปกติ'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                รวมทั้งหมด 35 แห่ง (กฟผ. 10 แห่ง + กรมชลประทาน 25 แห่ง)
              </span>
              <button
                onClick={() => {
                  setShowChecklistModal(false);
                  setFilterKind('major35');
                }}
                className="px-4 py-2 bg-[#0071e3] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
              >
                กรองดูเฉพาะ 35 เขื่อนนี้บนหน้าเว็บ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
