import React, { useState, useEffect } from 'react';
import { 
  X, 
  CloudRain, 
  Wind, 
  Droplet, 
  Thermometer, 
  MapPin, 
  RefreshCw, 
  Sun, 
  CloudLightning,
  Calendar,
  Layers
} from 'lucide-react';
import { BasinWeather, REGIONAL_WEATHER_MOCK, fetchLiveWeatherForCoords } from '../services/weatherService';

interface WeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WeatherModal: React.FC<WeatherModalProps> = ({ isOpen, onClose }) => {
  const [selectedBasinIndex, setSelectedBasinIndex] = useState(0);
  const [basins, setBasins] = useState<BasinWeather[]>(REGIONAL_WEATHER_MOCK);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setIsLoading(true);
    fetchLiveWeatherForCoords(13.75, 100.5, 'กรุงเทพมหานคร')
      .then((liveBkk) => {
        setBasins((prev) => {
          const updated = [...prev];
          updated[0] = liveBkk;
          return updated;
        });
      })
      .finally(() => setIsLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const current = basins[selectedBasinIndex] || basins[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/45 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white border border-slate-200/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-[#1d1d1f]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0071e3]">
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-semibold text-[#1d1d1f] tracking-tight">
                  สภาพอากาศและฝนสะสมทุกลุ่มน้ำ
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0071e3] border border-blue-200 text-[10px] font-bold">
                  LIVE
                </span>
              </div>
              <p className="text-xs text-[#86868b]">
                โทรมาตรตรวจวัดสภาพอากาศ ปริมาณฝน และลมกระโชกแรง · อัปเดตล่าสุด
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

        {/* Basin Selector Tabs */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-50/80 border-b border-slate-100 flex gap-1.5 overflow-x-auto text-xs">
          {basins.map((b, idx) => (
            <button
              key={b.basinId}
              onClick={() => setSelectedBasinIndex(idx)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedBasinIndex === idx
                  ? 'bg-white text-[#0071e3] border border-slate-200/90 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{b.icon}</span>
              <span>{b.basinName.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* Main Weather Hero Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50/60 via-white to-slate-50 border border-blue-100/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-[#0071e3] font-semibold">
                <MapPin className="w-3.5 h-3.5" /> {current.province}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                {current.tempC}°C
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1.5">
                <span className="text-base">{current.icon}</span>
                <span>{current.condition}</span>
              </p>
            </div>

            {/* Quick telemetry blocks */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="text-[10px] text-slate-500">โอกาสเกิดฝน</div>
                <div className="text-sm font-bold text-blue-600 mt-0.5">
                  {current.rainProbabilityPercent}%
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="text-[10px] text-slate-500">ความชื้น</div>
                <div className="text-sm font-bold text-slate-800 mt-0.5">
                  {current.humidityPercent}%
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="text-[10px] text-slate-500">ความเร็วลม</div>
                <div className="text-sm font-bold text-slate-800 mt-0.5">
                  {current.windSpeedKmh} <span className="text-[9px] font-normal text-slate-400">km/h</span>
                </div>
              </div>
            </div>
          </div>

          {/* 24-Hour Forecast Curve */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#0071e3]" /> คาดการณ์อุณหภูมิและโอกาสฝนตกตลอด 24 ชั่วโมง
              </span>
              <span className="text-[11px] text-[#86868b]">{current.updatedAt}</span>
            </div>

            <div className="grid grid-cols-6 gap-2 text-center pt-2">
              {current.forecast24h.map((fc, i) => (
                <div key={i} className="p-2 rounded-lg bg-white border border-slate-200/60 shadow-2xs flex flex-col items-center gap-1">
                  <span className="text-[10px] font-mono text-slate-400">{fc.hour}</span>
                  <span className="text-xs font-bold text-slate-800">{fc.tempC}°</span>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-1">
                    <div 
                      className={`h-full ${fc.rainProb > 70 ? 'bg-rose-500' : fc.rainProb > 40 ? 'bg-blue-500' : 'bg-emerald-400'}`}
                      style={{ width: `${fc.rainProb}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-blue-600 font-medium">{fc.rainProb}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Warning banner */}
          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/60 text-xs text-blue-900 flex items-start gap-2.5">
            <span className="text-base">⛈️</span>
            <div>
              <span className="font-bold">คำแนะนำสำหรับลุ่มน้ำที่มีปริมาณฝนสะสมสูง:</span>
              <p className="text-[11px] text-blue-800 mt-0.5 leading-relaxed">
                ในพื้นที่ลุ่มน้ำป่าสักและลุ่มน้ำมูล มีฝนตกสะสมเกิน 60 มม. ใน 24 ชั่วโมงที่ผ่านมา อาจส่งผลให้ระดับน้ำในคลองและแม่น้ำสายย่อยยกตัวสูงขึ้นในอีก 6-12 ชั่วโมงข้างหน้า
              </p>
            </div>
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
