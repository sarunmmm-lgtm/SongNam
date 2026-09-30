import React, { useState } from 'react';
import { 
  X, 
  Waves, 
  Droplet, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  Activity,
  Compass,
  ArrowUpRight,
  TrendingUp,
  MapPin
} from 'lucide-react';

interface MarineTideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MarineTideModal: React.FC<MarineTideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedStationIndex, setSelectedStationIndex] = useState(0);

  if (!isOpen) return null;

  const todayStr = new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'full',
  }).format(new Date());

  const tideStations = [
    {
      id: 'pom-phrachul',
      name: 'ป้อมพระจุลจอมเกล้า (ปากอ่าวไทย)',
      province: 'สมุทรปราการ',
      location: 'ปากแม่น้ำเจ้าพระยา ต.แหลมฟ้าผ่า',
      currentTideMsl: 1.48,
      status: 'warning',
      statusText: 'เฝ้าระวังน้ำทะเลหนุนสูง',
      maxTideMsl: 1.62,
      maxTideTime: '19:40 น.',
      lowTideMsl: 0.35,
      lowTideTime: '13:15 น.',
      morningPeakMsl: 1.38,
      morningPeakTime: '08:20 น.',
      embankmentHeightMsl: 2.20,
      safetyMarginM: 0.58,
      description: 'ด่านหน้าอิทธิพลน้ำทะเลหนุนจากอ่าวไทย ระดับน้ำหนุนสูงสุดช่วงค่ำ อาจส่งผลให้น้ำดันขึ้นแม่น้ำเจ้าพระยา',
      hourlyTide: [
        { time: '00:00', height: 0.9 },
        { time: '04:00', height: 1.1 },
        { time: '08:00', height: 1.38 },
        { time: '12:00', height: 0.5 },
        { time: '16:00', height: 0.8 },
        { time: '20:00', height: 1.62 },
        { time: '23:00', height: 1.2 },
      ]
    },
    {
      id: 'phra-phuttha-yodfa',
      name: 'สะพานพระพุทธยอดฟ้า (สะพานพุทธ)',
      province: 'กรุงเทพมหานคร',
      location: 'เขตพระนคร - เขตคลองสาน',
      currentTideMsl: 1.22,
      status: 'normal',
      statusText: 'ระดับปกติ ปลอดภัยจากแนวคันกั้นน้ำ',
      maxTideMsl: 1.35,
      maxTideTime: '20:25 น.',
      lowTideMsl: 0.45,
      lowTideTime: '14:10 น.',
      morningPeakMsl: 1.20,
      morningPeakTime: '09:05 น.',
      embankmentHeightMsl: 2.80,
      safetyMarginM: 1.45,
      description: 'แนวคันกั้นน้ำ กทม. มีความสูง 2.80 - 3.00 ม.รทก. ระดับน้ำทะเลหนุนยังต่ำกว่าแนวคันกั้นน้ำ 1.45 เมตร ชุมชนริมแม่น้ำนอกแนวคันกั้นน้ำควรเฝ้าระวัง',
      hourlyTide: [
        { time: '00:00', height: 0.8 },
        { time: '04:00', height: 0.95 },
        { time: '08:00', height: 1.20 },
        { time: '12:00', height: 0.6 },
        { time: '16:00', height: 0.75 },
        { time: '20:00', height: 1.35 },
        { time: '23:00', height: 1.0 },
      ]
    },
    {
      id: 'samlae-salinity',
      name: 'สถานีสูบน้ำสำแล (เฝ้าระวังความเค็มน้ำประปา)',
      province: 'ปทุมธานี',
      location: 'การประปานครหลวง อ.เมืองปทุมธานี',
      currentTideMsl: 0.85,
      status: 'safe',
      statusText: 'ความเค็มอยู่ในเกณฑ์มาตรฐานปลอดภัย',
      maxTideMsl: 0.92,
      maxTideTime: '21:10 น.',
      salinityGPerL: 0.14,
      salinityStandardLimit: 0.25,
      salinityAgriLimit: 0.50,
      safetyMarginM: 1.65,
      description: 'ตรวจวัดลิ่มความเค็มรุกตัวจากอ่าวไทยเพื่อความปลอดภัยของน้ำประปา กทม.และปริมณฑล ค่าความเค็ม 0.14 กรัม/ลิตร (เกณฑ์ผลิตน้ำประปาปกติไม่เกิน 0.25 กรัม/ลิตร)',
      hourlyTide: [
        { time: '00:00', height: 0.7 },
        { time: '04:00', height: 0.78 },
        { time: '08:00', height: 0.86 },
        { time: '12:00', height: 0.72 },
        { time: '16:00', height: 0.75 },
        { time: '20:00', height: 0.92 },
        { time: '23:00', height: 0.8 },
      ]
    },
    {
      id: 'c29a-bangsai',
      name: 'สถานี C.29A บางไทร (จุดคุมน้ำหลากเข้า กทม.)',
      province: 'พระนครศรีอยุธยา',
      location: 'อ.บางไทร รอยต่อปทุมธานี',
      currentTideMsl: 2.10,
      status: 'normal',
      statusText: 'อัตราการไหลยังต่ำกว่าเกณฑ์วิกฤต',
      maxTideMsl: 2.15,
      maxTideTime: '20:00 น.',
      dischargeCms: 1650,
      warningDischargeCms: 2500,
      safetyMarginM: 0.95,
      description: 'สถานีวัดปริมาณน้ำไหลผ่านรวมจากแม่น้ำเจ้าพระยาและแม่น้ำป่าสัก ก่อนเข้าสู่ กทม. ปัจจุบันไหล 1,650 ลบ.ม./วินาที (ยังรองรับได้ถึง 2,500 ลบ.ม./วินาที ก่อนเริ่มส่งผลกระทบ กทม.)',
      hourlyTide: [
        { time: '00:00', height: 1.95 },
        { time: '04:00', height: 2.00 },
        { time: '08:00', height: 2.05 },
        { time: '12:00', height: 2.02 },
        { time: '16:00', height: 2.08 },
        { time: '20:00', height: 2.12 },
        { time: '23:00', height: 2.05 },
      ]
    }
  ];

  const currentSt = tideStations[selectedStationIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white border border-slate-200/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-[#1d1d1f]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0071e3]/10 border border-[#0071e3]/20 flex items-center justify-center text-[#0071e3]">
              <Waves className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#1d1d1f] tracking-tight">
                ตารางเวลาน้ำทะเลหนุน & ตรวจวัดความเค็ม
              </h2>
              <p className="text-xs text-[#86868b]">
                ข้อมูลการคาดการณ์จากกรมอุทกศาสตร์ กองทัพเรือ และ กทม. · {todayStr}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Station Segmented Tabs */}
        <div className="px-4 sm:px-6 pt-3 pb-1 border-b border-slate-100 bg-slate-50/50 flex gap-1.5 overflow-x-auto">
          {tideStations.map((st, idx) => (
            <button
              key={st.id}
              onClick={() => setSelectedStationIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedStationIndex === idx
                  ? 'bg-white text-[#0071e3] shadow-sm border border-slate-200/80 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              {st.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* Active Station Summary Card */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0071e3]" /> {currentSt.location} · จ.{currentSt.province}
                </div>
                <h3 className="text-base font-bold text-[#1d1d1f] mt-0.5">
                  {currentSt.name}
                </h3>
              </div>

              <span className={`self-start sm:self-auto px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 ${
                currentSt.status === 'warning'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  currentSt.status === 'warning' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                }`} />
                {currentSt.statusText}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
              {currentSt.description}
            </p>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
                <div className="text-[11px] text-[#86868b]">ระดับน้ำปัจจุบัน</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">
                  +{currentSt.currentTideMsl.toFixed(2)} <span className="text-[10px] font-normal text-slate-500">ม.รทก.</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100">
                <div className="text-[11px] text-blue-700">หนุนสูงสุดช่วงค่ำ</div>
                <div className="text-base font-bold text-blue-900 mt-0.5">
                  +{currentSt.maxTideMsl.toFixed(2)} <span className="text-[10px] font-normal text-blue-700">ม.</span>
                </div>
                <div className="text-[10px] text-blue-600 mt-0.5 flex items-center gap-1 font-mono">
                  <Clock className="w-2.5 h-2.5" /> {currentSt.maxTideTime}
                </div>
              </div>

              {currentSt.salinityGPerL !== undefined ? (
                <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100">
                  <div className="text-[11px] text-emerald-700">ค่าความเค็มน้ำดิบ</div>
                  <div className="text-base font-bold text-emerald-900 mt-0.5">
                    {currentSt.salinityGPerL} <span className="text-[10px] font-normal text-emerald-700">g/L</span>
                  </div>
                  <div className="text-[10px] text-emerald-700 mt-0.5">
                    เกณฑ์ กปน. &lt; 0.25 g/L
                  </div>
                </div>
              ) : currentSt.dischargeCms !== undefined ? (
                <div className="p-2.5 rounded-lg bg-cyan-50/60 border border-cyan-100">
                  <div className="text-[11px] text-cyan-800">อัตราการระบายน้ำ</div>
                  <div className="text-base font-bold text-cyan-950 mt-0.5">
                    {currentSt.dischargeCms.toLocaleString()} <span className="text-[10px] font-normal text-cyan-700">cms</span>
                  </div>
                  <div className="text-[10px] text-cyan-700 mt-0.5">
                    เกณฑ์เตือน 2,500 cms
                  </div>
                </div>
              ) : (
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
                  <div className="text-[11px] text-[#86868b]">หนุนช่วงเช้า</div>
                  <div className="text-base font-bold text-slate-800 mt-0.5">
                    +{currentSt.morningPeakMsl?.toFixed(2)} <span className="text-[10px] font-normal text-slate-500">ม.</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                    {currentSt.morningPeakTime}
                  </div>
                </div>
              )}

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
                <div className="text-[11px] text-[#86868b]">ระยะต่ำกว่าคันกั้นน้ำ</div>
                <div className="text-base font-bold text-emerald-700 mt-0.5">
                  {currentSt.safetyMarginM} <span className="text-[10px] font-normal text-emerald-600">ม.</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {currentSt.safetyMarginM > 1 ? 'อยู่ในเกณฑ์ปลอดภัย' : 'ใกล้ขอบคันกั้นน้ำ'}
                </div>
              </div>
            </div>
          </div>

          {/* 24h Hourly Tide Curve Preview */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#0071e3]" /> กราฟคาดการณ์ระดับน้ำทะเลหนุนตลอด 24 ชั่วโมง
              </span>
              <span className="text-[11px] text-[#86868b]">หน่วย: เมตร รทก.</span>
            </div>

            <div className="flex items-end justify-between gap-2 h-24 pt-3 pb-1 border-b border-slate-200">
              {currentSt.hourlyTide.map((point, i) => {
                const maxVal = 2.4;
                const heightPercent = Math.min(100, Math.max(15, (point.height / maxVal) * 100));
                const isPeak = point.height === currentSt.maxTideMsl || point.height >= 1.5;

                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                    <span className="text-[10px] font-mono text-slate-500 group-hover:text-[#0071e3] transition-colors">
                      {point.height.toFixed(2)}
                    </span>
                    <div 
                      className={`w-full max-w-[28px] rounded-t-md transition-all ${
                        isPeak ? 'bg-blue-600 shadow-sm' : 'bg-slate-300 group-hover:bg-blue-400'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[9px] font-mono text-slate-400 mt-1">
                      {point.time}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-blue-600 inline-block" /> ช่วงเวลาหนุนสูงสุด (High Tide Peak)
              </span>
              <span>คำนวณตามดาราศาสตร์และอุทกศาสตร์</span>
            </div>
          </div>

          {/* Guidelines for Riverfront Communities */}
          <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200/60 text-xs space-y-1.5 text-blue-950">
            <div className="font-semibold flex items-center gap-1.5 text-[#0071e3]">
              <ShieldCheck className="w-4 h-4" /> คำแนะนำสำหรับชุมชนริมแม่น้ำเจ้าพระยา:
            </div>
            <ul className="text-[11px] text-slate-600 space-y-1 pl-4 list-disc">
              <li>บ้านเรือนที่อยู่นอกแนวคันกั้นน้ำ ให้ยกของมีค่าขึ้นที่สูงก่อนช่วงเวลา <b>18:30 - 21:00 น.</b></li>
              <li>ตรวจสอบปลั๊กไฟและสะพานไฟในชั้นล่างให้ปลอดภัย</li>
              <li>ผู้ใช้น้ำประปา กทม. และ นนทบุรี สามารถใช้น้ำได้ตามปกติ ลิ่มความเค็มยังไม่ส่งผลกระทบต่อรสชาติ</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-100 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
