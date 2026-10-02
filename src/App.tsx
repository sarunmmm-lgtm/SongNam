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
import { LiveCctvModal } from './components/LiveCctvModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ThreeDayWaterSummaryBar } from './components/ThreeDayWaterSummaryBar';

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
  const [isCctvModalOpen, setIsCctvModalOpen] = useState(false);
  const [cctvStation, setCctvStation] = useState<HydrologicalStation | null>(null);

  const handleOpenCctv = (station?: HydrologicalStation) => {
    setCctvStation(station || null);
    setIsCctvModalOpen(true);
  };

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
        onOpenCctv={() => handleOpenCctv()}
      />

      {/* 3-Day Water Trend Ribbon Bar (เมื่อวาน vs วันนี้ vs 2 วันก่อน จาก สสน. HII / RID) */}
      <div className="bg-slate-950 text-white px-3 sm:px-6 py-2 border-b border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3 flex-wrap">
          <ThreeDayWaterSummaryBar />
          <div className="text-[11px] text-slate-400 font-mono hidden md:flex items-center gap-1.5 shrink-0">
            <span>ฐานข้อมูลตรงตาม: rid_bigcm_raw.php (สสน. / กรมชลประทาน)</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className={activeTab === 'map' ? 'space-y-3 block' : 'hidden'}>
          {/* Section Header */}
          <div className="pb-0.5">
            <h1 className="text-lg sm:text-xl font-semibold text-[#1d1d1f] tracking-tight">
              แผนที่สถานการณ์น้ำทั่วประเทศ
            </h1>
            <p className="text-xs text-[#86868b]">
              ระดับน้ำในเขื่อน อ่างเก็บน้ำ ลำคลอง และเรดาร์ตรวจฝนสดแบบเรียลไทม์ · {stations.length} จุดตรวจวัด
            </p>
          </div>

          {/* Interactive Map Component with its unified floating toolbar */}

          <InteractiveMap
            stations={stations}
            selectedStation={selectedStation}
            onSelectStation={setSelectedStation}
            onOpenLocationSearch={() => setIsLocationSearchOpen(true)}
            onOpenMarineTide={() => setIsMarineTideOpen(true)}
            onOpenDailyReport={() => setIsDailyReportOpen(true)}
            onOpenWeather={() => setIsWeatherModalOpen(true)}
            onOpenCctv={handleOpenCctv}
          />
        </div>

        {activeTab === 'dams' && (
          <DamList
            stations={stations}
            onSelectStation={setSelectedStation}
            onOpenCctv={handleOpenCctv}
          />
        )}

        {activeTab === 'canals' && (
          <CanalList
            stations={stations}
            onSelectStation={setSelectedStation}
            onOpenCctv={handleOpenCctv}
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

      {/* Live CCTV Viewer Modal (Dams & Major Rivers Only) */}
      {isCctvModalOpen && (
        <LiveCctvModal
          station={cctvStation}
          allStations={stations}
          onClose={() => setIsCctvModalOpen(false)}
          onSelectStation={(st) => {
            setCctvStation(st);
          }}
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

      {/* Mobile Sticky Bottom Navigation (Sleek Modern Floating Dock) */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenCctv={() => handleOpenCctv()}
      />
    </div>
  );
}
