export type StationType = 'dam' | 'reservoir' | 'canal' | 'river_station';

export type AlertLevel = 'normal' | 'watch' | 'warning' | 'critical';

export interface WaterTelemetry {
  currentLevelMsl: number; // เมตร รทก. (m MSL)
  bankLevelMsl: number; // ระดับตลิ่ง (m MSL)
  storageCapacityMcm: number; // ความจุเก็บกัก (ล้าน ลบ.ม. หรือ ลบ.ม.)
  currentStorageMcm: number; // ปริมาตรน้ำปัจจุบัน (ล้าน ลบ.ม.)
  storagePercent: number; // เปอร์เซ็นต์ความจุ (%)
  inflowRateCms: number; // น้ำไหลเข้า (ลบ.ม./วินาที)
  outflowRateCms: number; // น้ำระบายออก (ลบ.ม./วินาที)
  rainfall24hMm: number; // ฝนสะสม 24 ชม. (มม.)
  flowVelocityMs?: number; // ความเร็วกระแสน้ำ (ม./วินาที)
  lastUpdated: string; // ISO หรือ formatted time
}

export interface FloodRiskAssessment {
  riskScore: number; // 0 - 100
  alertLevel: AlertLevel;
  overflowRiskPercent: number; // % โอกาสน้ำล้น
  freeboardMeters: number; // ระดับน้ำต่ำกว่าตลิ่ง (ม.) - ติดลบถ้าล้น
  estimatedHoursToOverflow: number | null; // เวลาคาดการณ์น้ำล้น (ชม.) หรือ null ถ้าปลอดภัย
  inundationDepthCm: number; // ระดับน้ำท่วมขังที่คาดการณ์ (ซม.)
  impactedAreaRadiusKm: number; // รัศมีผลกระทบ (กม.)
  affectedSubdistricts: string[]; // ตำบล/แขวงที่เสี่ยง
  recommendedActions: string[]; // ข้อแนะนำ
}

export interface Flood2554Benchmark {
  year: number; // 2554 (2011)
  peakStorageMcm: number; // ปริมาตรน้ำสูงสุดในปี 2554 (ล้าน ลบ.ม.)
  peakStoragePercent: number; // % ปริมาณน้ำเทียบความจุเก็บกักปกติ (เช่น 99.9%, 136.2%)
  peakOutflowCms?: number; // อัตราการระบายน้ำสูงสุดปี 54 (ลบ.ม./วินาที)
  peakDateThai: string; // เช่น "ต.ค. 2554"
  spillwayOverflow: boolean; // มีน้ำล้นทางระบายน้ำฉุกเฉิน / สปิลเวย์หรือไม่
  historicalContext: string; // บริบทสถานการณ์จริงปี 2554
}

export interface HydrologicalStation {
  id: string;
  name: string;
  nameEn: string;
  code: string;
  type: StationType;
  basin: string; // ลุ่มน้ำ เช่น ลุ่มน้ำเจ้าพระยา, ลุ่มน้ำปิง, ลุ่มน้ำโขง ฯลฯ
  province: string;
  district: string;
  subdistrict: string;
  lat: number;
  lng: number;
  isMajorDam35?: boolean; // 1 ใน 35 อ่างเก็บน้ำ/เขื่อนขนาดใหญ่ของประเทศไทย (กฟผ. 10 แห่ง + ชลประทาน 25 แห่ง)
  operator?: 'RID' | 'EGAT' | 'DWR' | 'BMA'; // หน่วยงานผู้ดูแล (กฟผ., กรมชลประทาน ฯลฯ)
  telemetry: WaterTelemetry;
  risk: FloodRiskAssessment;
  history24h: { time: string; levelMsl: number; percent: number; rainfall: number }[];
  benchmark2554?: Flood2554Benchmark;
}

export interface SimulationParams {
  rainfallIncreaseMm: number; // +มม.
  damDischargeMultiplier: number; // 0.5x - 2.5x
  seaTideElevationM: number; // 0 - 1.5 m
}
