import React, { useState, useEffect } from 'react';
import { HydrologicalStation } from '../types/hydrology';
import { 
  X, 
  RefreshCw, 
  Maximize2, 
  Minimize2, 
  Droplet, 
  Camera, 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  Info,
  CheckCircle2,
  ZoomIn,
  Download
} from 'lucide-react';
import { DamIcon } from './icons/DamIcon';
import { EGAT_DAMS, EGAT_PORTAL_URL, findEgatDam, EgatDamInfo } from '../data/egatCctvData';

interface LiveCctvModalProps {
  station: HydrologicalStation | null;
  allStations: HydrologicalStation[];
  onClose: () => void;
  onSelectStation: (st: HydrologicalStation) => void;
}

export const LiveCctvModal: React.FC<LiveCctvModalProps> = ({
  station,
  allStations,
  onClose,
  onSelectStation,
}) => {
  // หาเขื่อน กฟผ. เริ่มต้นจาก station ที่เลือก หรือเลือกเขื่อนภูมิพลเป็นค่าเริ่มต้น
  const initialEgatDam = station ? findEgatDam(station.id) || EGAT_DAMS[0] : EGAT_DAMS[0];
  const [selectedDamCode, setSelectedDamCode] = useState<string>(initialEgatDam.damCode);
  const [refreshKey, setRefreshKey] = useState<number>(Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [expandedImage, setExpandedImage] = useState<{ url: string; title: string; desc: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'egat' | 'other'>('egat');
  const [lastUpdatedText, setLastUpdatedText] = useState<string>('');

  // Update selected dam when prop station changes
  useEffect(() => {
    if (station) {
      const match = findEgatDam(station.id);
      if (match) {
        setSelectedDamCode(match.damCode);
        setActiveTab('egat');
      } else if (station.type === 'dam' || station.type === 'reservoir') {
        setActiveTab('other');
      }
    }
  }, [station?.id]);

  // Set formatted current time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const yr = now.getFullYear();
      const mo = String(now.getMonth() + 1).padStart(2, '0');
      const da = String(now.getDate()).padStart(2, '0');
      const hr = String(now.getHours()).padStart(2, '0');
      const mi = String(now.getMinutes()).padStart(2, '0');
      const se = String(now.getSeconds()).padStart(2, '0');
      setLastUpdatedText(`${da}/${mo}/${yr} ${hr}:${mi}:${se} น.`);
    };
    updateTime();
  }, [refreshKey]);

  const currentEgatDam: EgatDamInfo = EGAT_DAMS.find((d) => d.damCode === selectedDamCode) || EGAT_DAMS[0];

  // หาข้อมูลสถานีเชื่อมโยงในระบบ (ถ้ามี)
  const matchedStation = allStations.find(
    (s) => s.id === currentEgatDam.stationId || s.name.includes(currentEgatDam.name)
  );

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setRefreshKey(Date.now());
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // กรองรายชื่อเขื่อนตามช่องค้นหา
  const filteredEgatDams = EGAT_DAMS.filter(
    (d) =>
      searchQuery === '' ||
      d.name.includes(searchQuery) ||
      d.province.includes(searchQuery) ||
      d.basin.includes(searchQuery) ||
      d.damCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // รายชื่อเขื่อนอื่นๆ (เช่น เขื่อนชลประทาน)
  const otherDams = allStations.filter(
    (s) => (s.type === 'dam' || s.type === 'reservoir') && !findEgatDam(s.id)
  );

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className={`bg-slate-900 border border-slate-700/80 rounded-3xl w-full flex flex-col shadow-2xl overflow-hidden transition-all duration-300 ${
          isFullscreen 
            ? 'fixed inset-2 sm:inset-4 max-w-none max-h-none z-50' 
            : 'max-w-6xl max-h-[94vh]'
        }`}
      >
        {/* Top Header Bar */}
        <div className="px-4 py-3 sm:px-6 sm:py-3.5 bg-slate-950/95 border-b border-slate-800 flex items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 tracking-wide uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  ภาพกล้อง CCTV ล่าสุด
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  กฟผ. (CCTV Real Time)
                </span>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <span className="text-xs text-cyan-400 font-mono hidden md:inline">
                  {currentEgatDam.name} ({currentEgatDam.damCode})
                </span>
              </div>
              <h3 className="font-bold text-sm sm:text-base text-white truncate flex items-center gap-2 mt-0.5">
                <span>ภาพถ่ายระดับน้ำล่าสุดจากกล้อง CCTV แต่ละเขื่อน</span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleManualRefresh}
              title="ดึงภาพล่าสุดจากระบบ กฟผ. ทันที"
              className="px-3 py-1.5 text-xs text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700/80 transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">รีเฟรชภาพล่าสุด</span>
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'ย่อหน้าต่าง' : 'ขยายเต็มจอ'}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors hidden sm:inline-flex cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              title="ปิดหน้าต่าง"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Source Link & Info Subheader */}
        <div className="px-4 sm:px-6 py-2 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400">ดึงข้อมูลจริงจาก:</span>
            <a
              href={EGAT_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-cyan-300 hover:text-cyan-200 hover:underline flex items-center gap-1 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30"
            >
              <span>https://egatwater.egat.co.th/RealTimeCCTV</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>อัปเดตภาพเมื่อ: {lastUpdatedText}</span>
          </div>
        </div>

        {/* Category Switcher: 10 EGAT Dams vs Other Irrigation Dams */}
        <div className="px-3 sm:px-6 py-2 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-2 overflow-x-auto text-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('egat')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'egat'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900'
              }`}
            >
              <DamIcon className="w-3.5 h-3.5" />
              <span>เขื่อน กฟผ. ที่มีภาพกล้อง RealTime (10 เขื่อนหลัก)</span>
            </button>

            <button
              onClick={() => setActiveTab('other')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'other'
                  ? 'bg-blue-600 text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900'
              }`}
            >
              <Droplet className="w-3.5 h-3.5 text-blue-400" />
              <span>เขื่อนชลประทานอื่นๆ (RID SWOC)</span>
            </button>
          </div>

          <a
            href={EGAT_PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-semibold shrink-0"
          >
            <span>เปิดหน้า RealTimeCCTV บนเว็บ กฟผ.</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Main Content Body */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0 bg-slate-950">
          
          {/* Left Column: Camera Images Grid */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-5 text-white">
            {activeTab === 'egat' ? (
              <div className="space-y-4">
                {/* Dam Title & Telemetry Header */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/50 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
                        รหัส กฟผ.: {currentEgatDam.damCode}
                      </span>
                      <span className="text-xs text-slate-400">
                        จ.{currentEgatDam.province} · {currentEgatDam.basin}
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold text-white mt-1 flex items-center gap-2">
                      <DamIcon className="w-5 h-5 text-amber-400" />
                      <span>{currentEgatDam.name}</span>
                    </h3>
                  </div>

                  {matchedStation && (
                    <div className="flex items-center gap-3 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400">ระดับน้ำตรวจวัด</div>
                        <div className="text-sm font-bold text-cyan-300 font-mono">
                          +{matchedStation.telemetry.currentLevelMsl.toFixed(2)} ม.
                        </div>
                      </div>
                      <div className="border-l border-slate-800 pl-3">
                        <div className="text-[10px] text-slate-400">กักเก็บ</div>
                        <div className="text-sm font-bold text-amber-400 font-mono">
                          {matchedStation.telemetry.storagePercent}%
                        </div>
                      </div>
                      {matchedStation.telemetry.diffYesterdayMcm !== undefined && (
                        <div className="border-l border-slate-800 pl-3">
                          <div className="text-[10px] text-slate-400">เทียบเมื่อวาน</div>
                          <div className={`text-sm font-bold font-mono ${
                            matchedStation.telemetry.diffYesterdayMcm > 0 ? 'text-emerald-400' : 'text-blue-400'
                          }`}>
                            {matchedStation.telemetry.diffYesterdayMcm > 0 ? `+${matchedStation.telemetry.diffYesterdayMcm}` : matchedStation.telemetry.diffYesterdayMcm} ล้าน ม.³
                          </div>
                        </div>
                      )}
                      <div className="border-l border-slate-800 pl-3">
                        <div className="text-[10px] text-slate-400">ระบายออก</div>
                        <div className="text-sm font-bold text-blue-400 font-mono">
                          {matchedStation.telemetry.outflowRateCms.toLocaleString()} ลบ.ม./วิ
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4 Cameras Grid for Current Dam */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentEgatDam.cameras.map((cam) => {
                    const imageUrlWithCacheBuster = `${cam.directUrl}?t=${refreshKey}`;
                    return (
                      <div
                        key={cam.camNumber}
                        className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 flex flex-col shadow-lg group hover:border-slate-700 transition-colors"
                      >
                        {/* Image Header */}
                        <div className="px-3.5 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                            <span className="font-bold text-slate-200 truncate">
                              {cam.name} : {cam.description.split('(')[0]}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">
                            {currentEgatDam.damCode}/{cam.camNumber}.jpg
                          </span>
                        </div>

                        {/* Camera Image */}
                        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                          <img
                            src={imageUrlWithCacheBuster}
                            alt={`${currentEgatDam.name} - ${cam.name}`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              // If image fails to load, fallback to styled error placeholder
                              const target = e.currentTarget;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                const errorDiv = document.createElement('div');
                                errorDiv.className = 'p-6 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2';
                                errorDiv.innerHTML = `<span>⚠️ กล้องมุมนี้กำลังปิดปรับปรุงสัญญาณ</span><span class="text-[10px] font-mono text-slate-500">${cam.directUrl}</span>`;
                                parent.appendChild(errorDiv);
                              }
                            }}
                          />

                          {/* Quick Expand Button on Hover */}
                          <div 
                            onClick={() => setExpandedImage({
                              url: imageUrlWithCacheBuster,
                              title: `${currentEgatDam.name} - ${cam.name}`,
                              desc: cam.description
                            })}
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <span className="px-3 py-1.5 rounded-xl bg-slate-900/90 text-white text-xs font-semibold flex items-center gap-1.5 border border-white/20 shadow-lg">
                              <ZoomIn className="w-4 h-4 text-cyan-400" />
                              <span>คลิกเพื่อดูภาพขยายใหญ่</span>
                            </span>
                          </div>

                          {/* Corner Timestamp Tag */}
                          <div className="absolute bottom-2 left-2 pointer-events-none px-2 py-0.5 rounded bg-black/75 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-cyan-500/30">
                            EGAT CCTV · {currentEgatDam.damCode}
                          </div>
                        </div>

                        {/* Image Footer with Direct Open */}
                        <div className="px-3.5 py-2 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs">
                          <span className="text-[11px] text-slate-400 truncate">
                            {cam.description}
                          </span>
                          <a
                            href={cam.directUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 text-[11px] flex items-center gap-1 font-medium hover:underline shrink-0"
                            title="เปิดไฟล์ภาพต้นทางความละเอียดเต็มจากเซิร์ฟเวอร์ กฟผ."
                          >
                            <span>เปิดภาพต้นฉบับ</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer notes */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    ระบบดึงภาพ Snapshot จากกล้องวงจรปิดของ กฟผ. ผ่านเครือข่ายความมั่นคงของศูนย์บริหารจัดการน้ำอัจฉริยะ โดยภาพในเซิร์ฟเวอร์ กฟผ. จะอัปเดตทุกๆ 1 นาที ประชาชนสามารถกดปุ่ม <b>"รีเฟรชภาพล่าสุด"</b> เพื่อดึงภาพใหม่ล่าสุดได้ตลอดเวลา
                  </div>
                </div>
              </div>
            ) : (
              /* Other Dams (RID Irrigation Dams) */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/40 text-xs text-blue-200">
                  <h4 className="text-base font-bold text-white flex items-center gap-2 mb-1">
                    <ShieldCheck className="w-5 h-5 text-cyan-400" />
                    <span>ข้อมูลเขื่อนของกรมชลประทาน (RID SWOC)</span>
                  </h4>
                  <p>
                    ระบบ <b>RealTimeCCTV ของ กฟผ. (egatwater.egat.co.th)</b> จะให้บริการเฉพาะเขื่อนขนาดใหญ่ของการไฟฟ้าฝ่ายผลิต 10 แห่ง สำหรับเขื่อนชลประทาน (เช่น เขื่อนเจ้าพระยา, เขื่อนป่าสักชลสิทธิ์, เขื่อนขุนด่านปราการชล ฯลฯ) ท่านสามารถตรวจสอบระดับน้ำและสถานะบานระบายน้ำได้ผ่าน <b>ศูนย์ปฏิบัติการน้ำอัจฉริยะ กรมชลประทาน (RID SWOC)</b>:
                  </p>

                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <a
                      href="http://wmsc.rid.go.th/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-xl font-bold flex items-center gap-1.5 shadow transition-colors"
                    >
                      <span>เปิดระบบ RID SWOC (กรมชลประทาน)</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href="http://water.rid.go.th/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
                    >
                      <span>เปิดระบบโทรมาตร water.rid.go.th</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* List of RID Dams */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {otherDams.slice(0, 15).map((dam) => (
                    <div
                      key={dam.id}
                      onClick={() => {
                        onSelectStation(dam);
                      }}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white truncate">{dam.name}</span>
                        <span className="text-amber-400 font-mono">{dam.telemetry.storagePercent}%</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                        จ.{dam.province} · {dam.basin}
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-cyan-400 flex items-center justify-between">
                        <span>กรมชลประทาน (RID)</span>
                        <span>ดูโทรมาตร ›</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: 10 EGAT Dams Selector Sidebar */}
          <div className="w-full lg:w-80 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col max-h-72 lg:max-h-none overflow-hidden shrink-0">
            {/* Sidebar Header & Search */}
            <div className="p-3 border-b border-slate-800 bg-slate-950/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  <span>เขื่อน กฟผ. ทั้งหมด (10 แห่ง)</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  Online 100%
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อเขื่อน กฟผ...."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-800/90 border border-slate-700/60 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Dam List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {filteredEgatDams.map((dam) => {
                const isSelected = dam.damCode === selectedDamCode && activeTab === 'egat';
                return (
                  <div
                    key={dam.damCode}
                    onClick={() => {
                      setSelectedDamCode(dam.damCode);
                      setActiveTab('egat');
                      // Find matched station in allStations
                      const matched = allStations.find((s) => s.id === dam.stationId);
                      if (matched) onSelectStation(matched);
                    }}
                    className={`p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-3 border ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400/80 text-white shadow-md'
                        : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border-slate-800/80'
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                      isSelected ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-amber-400'
                    }`}>
                      <DamIcon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs truncate text-white">
                          {dam.name}
                        </span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {dam.damCode}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        จ.{dam.province} · {dam.basin}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5">
                        <span className="text-cyan-400 font-mono">
                          {dam.cameras.length} มุมกล้อง
                        </span>
                        <span className="text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          ภาพสด
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredEgatDams.length === 0 && (
                <div className="p-4 text-center text-xs text-slate-500">
                  ไม่พบเขื่อนที่ตรงกับคำค้นหา
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lightbox Modal for Full Image Zoom */}
        {expandedImage && (
          <div 
            className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-3 animate-in fade-in"
            onClick={() => setExpandedImage(null)}
          >
            <div className="relative max-w-5xl w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
              <div className="w-full flex items-center justify-between text-white mb-2 px-2">
                <div>
                  <h4 className="font-bold text-base">{expandedImage.title}</h4>
                  <p className="text-xs text-slate-400">{expandedImage.desc}</p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={expandedImage.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors"
                    title="เปิดไฟล์ภาพเต็มในแท็บใหม่"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setExpandedImage(null)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-700 bg-black shadow-2xl max-h-[82vh] flex items-center justify-center">
                <img
                  src={expandedImage.url}
                  alt={expandedImage.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[80vh] w-auto object-contain"
                />
              </div>

              <div className="mt-2 text-xs text-slate-400 text-center">
                แหล่งภาพ: egatwater.egat.co.th/RealTimeCCTV (คลิกพื้นที่ว่างเพื่อปิด)
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
