/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { INITIAL_STATIONS } from './data/mockStations';
import { HydrologicalStation } from './types/hydrology';
import { calculateFloodRisk } from './utils/floodEngine';
import { Navbar, ActiveTab } from './components/Navbar';
import { InteractiveMap } from './components/InteractiveMap';
import { DamList } from './components/DamList';
import { CanalList } from './components/CanalList';
import { FloodSimulator } from './components/FloodSimulator';
import { StationDetailModal } from './components/StationDetailModal';
import { AiFloodReportModal } from './components/AiFloodReportModal';
import { LocationImpactSearchModal } from './components/LocationImpactSearchModal';
import { ShareModal } from './components/ShareModal';
import { MarineTideModal } from './components/MarineTideModal';
import { DailyReportExportModal } from './components/DailyReportExportModal';
import { WeatherModal } from './components/WeatherModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { 
  Compass,
  Waves,
  FileText,
  Sun
} from 'lucide-react';

export default function App() {
  const [stations, setStations] = useState<HydrologicalStation[]>(INITIAL_STATIONS);
  const [activeTab, setActiveTab] = useState<ActiveTab>('map');
  const [selectedStation, setSelectedStation] = useState<HydrologicalStation | null>(null);
  const [aiStation, setAiStation] = useState<HydrologicalStation | null>(null);
  const [isLocationSearchOpen, setIsLocationSearchOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isMarineTideOpen, setIsMarineTideOpen] = useState(false);
  const [isDailyReportOpen, setIsDailyReportOpen] = useState(false);
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);

  // Live real-time telemetry fluctuation (Simulates live IoT streams)
  useEffect(() => {
    const interval = setInterval(() => {
      setStations((prev) =>
        prev.map((station) => {
          // slight telemetry change
          const jitterMsl = Number(((Math.random() - 0.48) * 0.02).toFixed(2));
          const newLevelMsl = Number((station.telemetry.currentLevelMsl + jitterMsl).toFixed(2));
          
          let newStoragePercent = station.telemetry.storagePercent;
          if (station.type === 'dam' || station.type === 'reservoir') {
            const netFlow = station.telemetry.inflowRateCms - station.telemetry.outflowRateCms;
            const deltaPct = netFlow > 0 ? 0.05 : -0.02;
            newStoragePercent = Math.min(100, Math.max(10, Number((newStoragePercent + deltaPct).toFixed(1))));
          } else {
            const heightSpan = station.telemetry.bankLevelMsl - (station.telemetry.bankLevelMsl - 5);
            newStoragePercent = Math.min(130, Math.max(15, Math.round(((newLevelMsl - (station.telemetry.bankLevelMsl - 5)) / heightSpan) * 100)));
          }

          const updatedTelemetry = {
            ...station.telemetry,
            currentLevelMsl: newLevelMsl,
            storagePercent: newStoragePercent,
            lastUpdated: 'เมื่อสักครู่',
          };

          const updatedRisk = calculateFloodRisk(
            updatedTelemetry,
            station.type,
            station.district,
            station.subdistrict
          );

          return {
            ...station,
            telemetry: updatedTelemetry,
            risk: updatedRisk,
          };
        })
      );
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  // Dispatch window resize when switching back to map tab so Leaflet recalibrates
  useEffect(() => {
    if (activeTab === 'map') {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 50);
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 300);
    }
  }, [activeTab]);

  const handleApplySimulatedStations = (simulated: HydrologicalStation[]) => {
    setStations(simulated);
    setActiveTab('map');
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex flex-col font-sans pb-20 md:pb-8 selection:bg-[#0071e3] selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        stations={stations}
        onOpenLocationSearch={() => setIsLocationSearchOpen(true)}
        onOpenShare={() => setIsShareModalOpen(true)}
        onOpenMarineTide={() => setIsMarineTideOpen(true)}
        onOpenDailyReport={() => setIsDailyReportOpen(true)}
        onOpenWeather={() => setIsWeatherModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className={activeTab === 'map' ? 'space-y-3 block' : 'hidden'}>
          {/* Section Header with quick actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-0.5">
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-[#1d1d1f] tracking-tight">
                แผนที่สถานการณ์น้ำทั่วประเทศ
              </h1>
              <p className="text-xs text-[#86868b]">
                ระดับน้ำในเขื่อน อ่างเก็บน้ำ ลำคลอง และเรดาร์ตรวจฝนสดแบบเรียลไทม์ · {stations.length} จุดตรวจวัด
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsWeatherModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-blue-50/80 hover:bg-blue-100 text-[#0071e3] border border-blue-200/80 shadow-xs text-xs flex items-center gap-1.5 transition-colors font-medium"
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>สภาพอากาศสด</span>
              </button>

              <button
                onClick={() => setIsMarineTideOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-blue-700 border border-slate-200/80 shadow-xs text-xs flex items-center gap-1.5 transition-colors font-medium"
              >
                <Waves className="w-3.5 h-3.5 text-blue-600" />
                <span>น้ำทะเลหนุน & ความเค็ม</span>
              </button>

              <button
                onClick={() => setIsDailyReportOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/80 shadow-xs text-xs flex items-center gap-1.5 transition-colors font-medium"
              >
                <FileText className="w-3.5 h-3.5 text-slate-600" />
                <span>ส่งออกรายงาน</span>
              </button>

              <button
                onClick={() => setIsLocationSearchOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-[#1d1d1f] border border-slate-200/80 shadow-xs text-xs flex items-center gap-1.5 transition-colors font-medium"
              >
                <Compass className="w-3.5 h-3.5 text-[#0071e3]" />
                <span>ตรวจเช็คเขื่อนที่กระทบคุณ</span>
              </button>
            </div>
          </div>

          <InteractiveMap
            stations={stations}
            selectedStation={selectedStation}
            onSelectStation={setSelectedStation}
            onOpenLocationSearch={() => setIsLocationSearchOpen(true)}
            onOpenMarineTide={() => setIsMarineTideOpen(true)}
            onOpenDailyReport={() => setIsDailyReportOpen(true)}
            onOpenWeather={() => setIsWeatherModalOpen(true)}
          />
        </div>

        {activeTab === 'dams' && (
          <DamList
            stations={stations}
            onSelectStation={setSelectedStation}
          />
        )}

        {activeTab === 'canals' && (
          <CanalList
            stations={stations}
            onSelectStation={setSelectedStation}
          />
        )}

        {activeTab === 'simulator' && (
          <FloodSimulator
            stations={stations}
            onApplySimulatedStations={handleApplySimulatedStations}
            onSelectStation={setSelectedStation}
          />
        )}
      </main>

      {/* Station Detail Modal */}
      {selectedStation && (
        <StationDetailModal
          station={selectedStation}
          onClose={() => setSelectedStation(null)}
          onRequestAiAnalysis={setAiStation}
        />
      )}

      {/* AI Flood Analysis Modal */}
      {aiStation && (
        <AiFloodReportModal
          station={aiStation}
          onClose={() => setAiStation(null)}
        />
      )}

      {/* Location Impact Search Modal */}
      <LocationImpactSearchModal
        allStations={stations}
        isOpen={isLocationSearchOpen}
        onClose={() => setIsLocationSearchOpen(false)}
        onSelectStation={setSelectedStation}
      />

      {/* Marine Tide & Salinity Modal */}
      <MarineTideModal
        isOpen={isMarineTideOpen}
        onClose={() => setIsMarineTideOpen(false)}
      />

      {/* Daily Situation Report Modal */}
      <DailyReportExportModal
        isOpen={isDailyReportOpen}
        onClose={() => setIsDailyReportOpen(false)}
        stations={stations}
      />

      {/* Live Weather Telemetry Modal */}
      <WeatherModal
        isOpen={isWeatherModalOpen}
        onClose={() => setIsWeatherModalOpen(false)}
      />

      {/* Share & Mobile Access Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        appUrl={
          typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')
            ? window.location.origin
            : 'https://ais-pre-xb3esz6u2o5uhvxrvx77nr-844636563226.asia-east1.run.app'
        }
      />

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />
    </div>
  );
}
