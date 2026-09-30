import React, { useState } from 'react';
import { HydrologicalStation, SimulationParams } from '../types/hydrology';
import { simulateScenarioOnStation } from '../utils/floodEngine';
import { 
  Sliders, 
  CloudRain, 
  ArrowUpCircle, 
  Waves, 
  RotateCcw, 
  ShieldAlert, 
  Zap, 
  Play
} from 'lucide-react';

interface FloodSimulatorProps {
  stations: HydrologicalStation[];
  onApplySimulatedStations: (simulated: HydrologicalStation[]) => void;
  onSelectStation: (station: HydrologicalStation) => void;
}

export const FloodSimulator: React.FC<FloodSimulatorProps> = ({
  stations,
  onApplySimulatedStations,
  onSelectStation,
}) => {
  const [params, setParams] = useState<SimulationParams>({
    rainfallIncreaseMm: 0,
    damDischargeMultiplier: 1.0,
    seaTideElevationM: 0,
  });

  // Calculate simulated stations
  const simulatedStations = stations.map((st) => simulateScenarioOnStation(st, params));

  const criticalOriginal = stations.filter((s) => s.risk.alertLevel === 'critical').length;
  const criticalSimulated = simulatedStations.filter((s) => s.risk.alertLevel === 'critical').length;

  const warningOriginal = stations.filter((s) => s.risk.alertLevel === 'warning').length;
  const warningSimulated = simulatedStations.filter((s) => s.risk.alertLevel === 'warning').length;

  // Maximum inundation
  const maxInundationCm = Math.max(...simulatedStations.map((s) => s.risk.inundationDepthCm));

  // Find newly overflowing stations
  const overflowingStations = simulatedStations.filter((s) => s.risk.freeboardMeters <= 0);

  const applyPreset = (preset: 'normal' | 'storm_north' | 'bkk_tide' | 'heavy_discharge') => {
    if (preset === 'normal') {
      setParams({ rainfallIncreaseMm: 0, damDischargeMultiplier: 1.0, seaTideElevationM: 0 });
    } else if (preset === 'storm_north') {
      setParams({ rainfallIncreaseMm: 120, damDischargeMultiplier: 1.8, seaTideElevationM: 0.3 });
    } else if (preset === 'bkk_tide') {
      setParams({ rainfallIncreaseMm: 80, damDischargeMultiplier: 1.2, seaTideElevationM: 1.2 });
    } else if (preset === 'heavy_discharge') {
      setParams({ rainfallIncreaseMm: 60, damDischargeMultiplier: 2.2, seaTideElevationM: 0.8 });
    }
  };

  const handleApplyToMap = () => {
    onApplySimulatedStations(simulatedStations);
  };

  return (
    <div className="space-y-4 text-[#1d1d1f]">
      {/* Intro Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0071e3]/10 border border-[#0071e3]/20 flex items-center justify-center text-[#0071e3] shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-[#1d1d1f] tracking-tight">
                แบบจำลองคำนวณการเกิดน้ำท่วม (Flood Simulation Engine)
              </h2>
              <p className="text-xs text-[#86868b]">
                จำลองปริมาณฝนสะสม อัตราการระบายน้ำจากเขื่อน และอิทธิพลน้ำทะเลหนุน
              </p>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => applyPreset('normal')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 transition-colors font-medium border border-slate-200/60"
            >
              <RotateCcw className="w-3.5 h-3.5" /> รีเซ็ต
            </button>
            <button
              onClick={() => applyPreset('storm_north')}
              className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-medium transition-colors"
            >
              🌀 พายุเข้าตอนบน (+120 มม.)
            </button>
            <button
              onClick={() => applyPreset('bkk_tide')}
              className="px-2.5 py-1.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 font-medium transition-colors"
            >
              🌊 ฝนตกหนัก + น้ำทะเลหนุน
            </button>
            <button
              onClick={() => applyPreset('heavy_discharge')}
              className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-medium transition-colors"
            >
              🚨 เร่งระบายเขื่อน 2.2 เท่า
            </button>
          </div>
        </div>
      </div>

      {/* Control Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Slider 1: Rainfall */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                <CloudRain className="w-4 h-4 text-[#0071e3]" /> ฝนตกสะสมเพิ่มขึ้น
              </span>
              <span className="text-sm font-bold text-[#0071e3]">+{params.rainfallIncreaseMm} มม.</span>
            </div>
            <p className="text-[11px] text-[#86868b] mb-3">
              จำลองปริมาณฝนตกลงในลุ่มน้ำในรอบ 24 ชั่วโมง
            </p>
          </div>

          <div>
            <input
              type="range"
              min="0"
              max="200"
              step="10"
              value={params.rainfallIncreaseMm}
              onChange={(e) =>
                setParams({ ...params, rainfallIncreaseMm: Number(e.target.value) })
              }
              className="w-full accent-[#0071e3] cursor-pointer h-1.5 bg-slate-100 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-[#86868b] mt-1 font-mono">
              <span>0 มม.</span>
              <span>100 มม.</span>
              <span>200 มม.</span>
            </div>
          </div>
        </div>

        {/* Slider 2: Dam Discharge Multiplier */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                <ArrowUpCircle className="w-4 h-4 text-[#0071e3]" /> อัตราการระบายน้ำจากเขื่อน
              </span>
              <span className="text-sm font-bold text-[#0071e3]">{params.damDischargeMultiplier.toFixed(1)}x</span>
            </div>
            <p className="text-[11px] text-[#86868b] mb-3">
              การเพิ่มอัตราการระบายน้ำลงสู่แม่น้ำสายหลัก
            </p>
          </div>

          <div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={params.damDischargeMultiplier}
              onChange={(e) =>
                setParams({ ...params, damDischargeMultiplier: Number(e.target.value) })
              }
              className="w-full accent-[#0071e3] cursor-pointer h-1.5 bg-slate-100 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-[#86868b] mt-1 font-mono">
              <span>0.5 เท่า</span>
              <span>1.0 เท่า</span>
              <span>2.5 เท่า</span>
            </div>
          </div>
        </div>

        {/* Slider 3: Sea Tide Elevation */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                <Waves className="w-4 h-4 text-[#0071e3]" /> อิทธิพลน้ำทะเลหนุน
              </span>
              <span className="text-sm font-bold text-[#0071e3]">+{params.seaTideElevationM.toFixed(2)} ม.</span>
            </div>
            <p className="text-[11px] text-[#86868b] mb-3">
              จำลองระดับน้ำทะเลหนุนสูงบริเวณอ่าวไทย
            </p>
          </div>

          <div>
            <input
              type="range"
              min="0"
              max="1.5"
              step="0.1"
              value={params.seaTideElevationM}
              onChange={(e) =>
                setParams({ ...params, seaTideElevationM: Number(e.target.value) })
              }
              className="w-full accent-[#0071e3] cursor-pointer h-1.5 bg-slate-100 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-[#86868b] mt-1 font-mono">
              <span>0.0 ม.</span>
              <span>+0.8 ม.</span>
              <span>+1.5 ม.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Calculation Result Summary */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-semibold text-[#1d1d1f] flex items-center gap-2 tracking-tight">
              <Zap className="w-4 h-4 text-amber-500" /> ผลการคำนวณและประเมินผลกระทบ
            </h3>
            <p className="text-xs text-[#86868b]">
              สถานการณ์จำลองเปรียบเทียบกับสภาวะปัจจุบัน
            </p>
          </div>

          <button
            onClick={handleApplyToMap}
            className="px-4 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-white" /> แสดงผลบนแผนที่
          </button>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Critical points change */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
            <div className="text-xs text-[#86868b]">จุดวิกฤต (น้ำล้น/เต็ม)</div>
            <div className="text-2xl font-bold text-rose-700 mt-1 flex items-baseline gap-2">
              {criticalSimulated}
              <span className="text-xs font-normal text-slate-500">
                (เดิม {criticalOriginal})
              </span>
            </div>
            <div className="text-[11px] text-rose-600 mt-0.5 font-medium">
              {criticalSimulated > criticalOriginal ? `+${criticalSimulated - criticalOriginal} จุดเสี่ยงใหม่` : 'เท่าเดิม'}
            </div>
          </div>

          {/* Warning points change */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
            <div className="text-xs text-[#86868b]">จุดเตือนภัย (80-90%)</div>
            <div className="text-2xl font-bold text-amber-700 mt-1 flex items-baseline gap-2">
              {warningSimulated}
              <span className="text-xs font-normal text-slate-500">
                (เดิม {warningOriginal})
              </span>
            </div>
            <div className="text-[11px] text-amber-700 mt-0.5">
              พื้นที่เฝ้าระวังใกล้ชิด
            </div>
          </div>

          {/* Max Inundation Depth */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
            <div className="text-xs text-[#86868b]">ระดับน้ำท่วมขังสูงสุด</div>
            <div className="text-2xl font-bold text-[#0071e3] mt-1">
              {maxInundationCm > 0 ? `${maxInundationCm} ซม.` : '0 ซม.'}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {maxInundationCm > 50 ? '⚠️ ท่วมระดับเอว' : maxInundationCm > 20 ? '⚠️ ท่วมผิวจราจร' : 'ปลอดภัย'}
            </div>
          </div>

          {/* Total Overflowing Stations */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
            <div className="text-xs text-[#86868b]">สถานีที่น้ำล้นตลิ่ง</div>
            <div className="text-2xl font-bold text-rose-700 mt-1">
              {overflowingStations.length} แห่ง
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              ต้องวางแนวกระสอบทราย
            </div>
          </div>
        </div>

        {/* Overflowing Stations List in this simulation */}
        {overflowingStations.length > 0 && (
          <div className="pt-3 border-t border-slate-100">
            <div className="text-xs font-semibold text-rose-700 mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              สถานีและพื้นที่ที่น้ำล้นตลิ่งในสถานการณ์จำลองนี้:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {overflowingStations.map((st) => (
                <div
                  key={st.id}
                  onClick={() => onSelectStation(st)}
                  className="bg-rose-50/70 border border-rose-200 hover:border-rose-300 rounded-xl p-3 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-semibold text-slate-900">{st.name}</div>
                    <div className="text-[11px] text-rose-700">
                      ล้น +{Math.abs(st.risk.freeboardMeters)} ม. | ท่วม ~{st.risk.inundationDepthCm} ซม.
                    </div>
                  </div>
                  <span className="text-xs text-rose-700 font-medium">ดูข้อมูล &gt;</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
