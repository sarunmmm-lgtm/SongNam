import React, { useState } from 'react';
import { HydrologicalStation } from '../types/hydrology';
import { findLocationImpact, LocationImpactReport } from '../utils/locationImpactEngine';
import { 
  Search, 
  MapPin, 
  Clock, 
  Droplet, 
  ArrowRight, 
  Compass, 
  X, 
  Waves
} from 'lucide-react';

interface LocationImpactSearchModalProps {
  allStations: HydrologicalStation[];
  isOpen: boolean;
  onClose: () => void;
  onSelectStation: (station: HydrologicalStation) => void;
}

export const LocationImpactSearchModal: React.FC<LocationImpactSearchModalProps> = ({
  allStations,
  isOpen,
  onClose,
  onSelectStation,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [report, setReport] = useState<LocationImpactReport | null>(null);

  if (!isOpen) return null;

  const handleSearch = (query: string) => {
    setSearchInput(query);
    const result = findLocationImpact(query, allStations);
    setReport(result);
  };

  const handleQuickTagClick = (tag: string) => {
    handleSearch(tag);
  };

  const quickTags = [
    { label: 'อยุธยา / บางบาล', query: 'อยุธยา' },
    { label: 'รังสิต / ปทุมธานี', query: 'รังสิต' },
    { label: 'กทม. / ดอนเมือง', query: 'ดอนเมือง' },
    { label: 'นนทบุรี / ปากเกร็ด', query: 'นนทบุรี' },
    { label: 'สิงห์บุรี / อ่างทอง', query: 'สิงห์บุรี' },
    { label: 'ชัยนาท', query: 'ชัยนาท' },
    { label: 'ขอนแก่น / อุบลฯ', query: 'อุบลราชธานี' },
    { label: 'เชียงใหม่', query: 'เชียงใหม่' },
    { label: 'กาญจนบุรี', query: 'กาญจนบุรี' },
    { label: 'สุราษฎร์ธานี', query: 'สุราษฎร์ธานี' },
    { label: 'นครนายก', query: 'นครนายก' },
    { label: 'ลพบุรี / สระบุรี', query: 'ลพบุรี' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white border border-slate-200/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#1d1d1f]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-white flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0071e3]/10 border border-[#0071e3]/20 flex items-center justify-center text-[#0071e3] shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-[#1d1d1f] tracking-tight">
                เช็คเขื่อนที่ส่งผลกระทบต่อพื้นที่ของคุณ
              </h2>
              <p className="text-xs text-[#86868b]">
                วิเคราะห์เส้นทางน้ำต้นน้ำ-ท้ายน้ำ และเวลาที่น้ำเดินทางถึง
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Search Box */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="พิมพ์ชื่ออำเภอหรือจังหวัด (เช่น อยุธยา, รังสิต, นนทบุรี, โคราช)..."
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100/90 border border-slate-200/80 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0071e3]"
              />
            </div>

            {/* Quick Suggestions */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-[#86868b] text-[11px] shrink-0">ตัวอย่าง:</span>
              {quickTags.map((tag) => (
                <button
                  key={tag.query}
                  onClick={() => handleQuickTagClick(tag.query)}
                  className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/60 text-[11px] whitespace-nowrap transition-colors"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Analysis Result */}
          {report && (
            <div className="space-y-3 pt-1">
              {/* Summary Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-[#86868b] mb-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#0071e3]" />
                      <span>ผลการวิเคราะห์สำหรับ:</span>
                      <span className="font-semibold text-[#1d1d1f]">{report.matchedName}</span>
                      <span>({report.province})</span>
                    </div>
                    <div className="text-xs text-slate-700 font-medium">
                      {report.basin} · {report.headline}
                    </div>
                  </div>

                  <span className="text-xs text-[#86868b]">
                    ระดับความเสี่ยง: <b className="text-[#1d1d1f] font-semibold">{report.overallThreatLevel === 'critical' ? 'วิกฤต' : report.overallThreatLevel === 'warning' ? 'เตือนภัย' : report.overallThreatLevel === 'watch' ? 'เฝ้าระวัง' : 'ปกติ'}</b>
                  </span>
                </div>

                <p className="text-xs text-[#86868b] mt-2 leading-relaxed">
                  {report.explanation}
                </p>
              </div>

              {/* Impaction Dams List */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Waves className="w-3.5 h-3.5 text-[#0071e3]" />
                    เขื่อนและแหล่งน้ำต้นน้ำที่ส่งผลกระทบ:
                  </span>
                  <span className="text-[#86868b] font-normal">
                    {report.impactingSources.length} แหล่งน้ำ
                  </span>
                </div>

                <div className="space-y-2">
                  {report.impactingSources.map((src) => {
                    const st = allStations.find((s) => s.id === src.stationId);

                    return (
                      <div
                        key={src.stationId}
                        className="bg-white border border-slate-200/80 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 transition-colors hover:border-slate-300 shadow-xs"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-[#1d1d1f] text-xs hover:text-[#0071e3] cursor-pointer" onClick={() => { if (st) { onSelectStation(st); onClose(); } }}>
                              {src.stationName}
                            </span>
                            <span className="text-[10px] text-[#86868b]">
                              · {src.role === 'primary' ? 'แหล่งน้ำหลัก' : src.role === 'regulator' ? 'แหล่งหน่วงน้ำ' : 'เซนเซอร์ตรวจวัด'}
                            </span>
                          </div>

                          <div className="text-xs text-[#86868b] space-y-0.5">
                            <div>เส้นทาง: <span className="text-slate-700 font-medium">{src.riverRoute}</span></div>
                            <div className="flex items-center gap-1 text-[#0071e3]">
                              <Clock className="w-3 h-3" />
                              <span>น้ำเดินทางถึง: <b>{src.waterTravelTimeHours}</b></span>
                            </div>
                            <div className="text-[11px] text-slate-500">{src.impactDescription}</div>
                          </div>
                        </div>

                        {st && (
                          <button
                            onClick={() => {
                              onSelectStation(st);
                              onClose();
                            }}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 shrink-0"
                          >
                            ดูระดับน้ำ <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Local Sensors */}
              {report.localTelemeteringSensors.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1.5">
                  <div className="text-xs text-[#86868b] flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5 text-[#0071e3]" />
                    สถานีโทรมาตร/คลองในพื้นที่ที่ควรดูควบคู่กัน:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {report.localTelemeteringSensors.map((sensorId) => {
                      const sensorStation = allStations.find((s) => s.id === sensorId);
                      if (!sensorStation) return null;
                      return (
                        <button
                          key={sensorId}
                          onClick={() => {
                            onSelectStation(sensorStation);
                            onClose();
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200/80 text-xs text-slate-700 flex items-center gap-1 transition-colors shadow-xs"
                        >
                          <span>{sensorStation.name}</span>
                          <span className="text-[10px] text-[#0071e3] font-semibold">({sensorStation.telemetry.storagePercent}%)</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
