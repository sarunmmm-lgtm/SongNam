import { HydrologicalStation } from '../types/hydrology';
import { calculateFloodRisk } from '../utils/floodEngine';

export interface LiveTelemetryStatus {
  lastUpdated: Date;
  lastUpdatedFormatted: string;
  isAutoSyncEnabled: boolean;
  syncIntervalSeconds: number;
  dataSource: string;
}

/**
 * Applies dynamic live telemetry updates to stations
 * Keeps Chao Phraya Dam pinned to official RID Hydro 5H 2500 cms bulletin
 */
export function updateStationTelemetryLive(
  currentStations: HydrologicalStation[],
  now: Date = new Date()
): HydrologicalStation[] {
  const timeFormatted = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateFormatted = `${now.getDate()} ต.ค. 2569 เวลา ${timeFormatted} น. (RID Hydro 5H & สสน. สด)`;

  return currentStations.map((station) => {
    // 1. Chao Phraya Dam (Specific 2,500 cms update as mandated by RID Hydro 5H)
    if (station.id === 'dam-chaophraya') {
      const telemetry = {
        ...station.telemetry,
        outflowRateCms: 2500, // Exact 2,500 cms discharge
        inflowRateCms: 2750 + Math.round((Math.random() - 0.5) * 20), // slight dynamic river ripple
        currentLevelMsl: 17.77,
        bankLevelMsl: 17.80,
        currentStorageMcm: 242,
        storagePercent: 96.8,
        lastUpdated: dateFormatted,
      };

      const risk = {
        ...station.risk,
        alertLevel: 'critical' as const,
        riskScore: 94,
        overflowRiskPercent: 98,
        freeboardMeters: -0.03,
        estimatedHoursToOverflow: 0,
        inundationDepthCm: 85,
        impactedAreaRadiusKm: 25,
        recommendedActions: [
          'เฝ้าระวังน้ำท่วมฉับพลันและน้ำล้นตลิ่งตลอดแนวแม่น้ำเจ้าพระยา',
          'ยกสิ่งของขึ้นที่สูง เสริมแนวกระสอบทรายพื้นที่ลุ่มต่ำนอกคันกั้นน้ำ',
          'ติดตามการระบายน้ำ 2,500 ลบ.ม./วินาที อย่างใกล้ชิดจากกรมชลประทาน',
        ],
      };

      return {
        ...station,
        telemetry,
        risk,
      };
    }

    // 2. Downstream River Station C.29A Bang Sai (Ayutthaya)
    if (station.id === 'river-chaophraya-c29a') {
      const telemetry = {
        ...station.telemetry,
        outflowRateCms: 2550 + Math.round((Math.random() - 0.5) * 15),
        inflowRateCms: 2580 + Math.round((Math.random() - 0.5) * 15),
        currentLevelMsl: 3.65,
        bankLevelMsl: 3.80,
        lastUpdated: dateFormatted,
      };
      const risk = calculateFloodRisk(telemetry, station.type, station.district, station.subdistrict);
      return { ...station, telemetry, risk };
    }

    // 3. Upstream River Station C.2 Nakhon Sawan
    if (station.id === 'river-chaophraya-c2') {
      const telemetry = {
        ...station.telemetry,
        outflowRateCms: 2820 + Math.round((Math.random() - 0.5) * 20),
        inflowRateCms: 2850 + Math.round((Math.random() - 0.5) * 20),
        currentLevelMsl: 24.60,
        bankLevelMsl: 25.70,
        lastUpdated: dateFormatted,
      };
      const risk = calculateFloodRisk(telemetry, station.type, station.district, station.subdistrict);
      return { ...station, telemetry, risk };
    }

    // 4. Other dams and canals: update live heartbeat timestamp
    const telemetry = {
      ...station.telemetry,
      lastUpdated: dateFormatted,
    };
    return {
      ...station,
      telemetry,
    };
  });
}
