import { AlertLevel, FloodRiskAssessment, HydrologicalStation, SimulationParams, WaterTelemetry } from '../types/hydrology';

export function calculateFloodRisk(
  telemetry: WaterTelemetry,
  type: 'dam' | 'reservoir' | 'canal' | 'river_station',
  district: string,
  subdistrict: string
): FloodRiskAssessment {
  const freeboardMeters = Number((telemetry.bankLevelMsl - telemetry.currentLevelMsl).toFixed(2));
  
  // Rate of rise per hour (approximate based on net flow and rainfall)
  const netFlowCms = telemetry.inflowRateCms - telemetry.outflowRateCms;
  const rainFactor = telemetry.rainfall24hMm / 100; // runoff contributor
  
  let riskScore = 0;
  
  if (type === 'dam' || type === 'reservoir') {
    // For dams: based mostly on storage percentage & incoming flow
    if (telemetry.storagePercent >= 95) riskScore = 95;
    else if (telemetry.storagePercent >= 85) riskScore = 80 + (telemetry.storagePercent - 85) * 1.5;
    else if (telemetry.storagePercent >= 75) riskScore = 65 + (telemetry.storagePercent - 75) * 1.5;
    else if (telemetry.storagePercent >= 60) riskScore = 40 + (telemetry.storagePercent - 60) * 1.6;
    else riskScore = (telemetry.storagePercent / 60) * 40;

    // Rain factor booster
    if (telemetry.rainfall24hMm > 100) riskScore += 10;
    else if (telemetry.rainfall24hMm > 50) riskScore += 5;
  } else {
    // For canals & river stations: based on freeboard to bank level & water velocity
    if (freeboardMeters <= 0) {
      // Over bank
      riskScore = 95 + Math.min(5, Math.abs(freeboardMeters) * 5);
    } else if (freeboardMeters <= 0.3) {
      riskScore = 85 + ((0.3 - freeboardMeters) / 0.3) * 10;
    } else if (freeboardMeters <= 0.8) {
      riskScore = 70 + ((0.8 - freeboardMeters) / 0.5) * 15;
    } else if (freeboardMeters <= 1.5) {
      riskScore = 50 + ((1.5 - freeboardMeters) / 0.7) * 20;
    } else {
      riskScore = Math.max(10, 50 - (freeboardMeters - 1.5) * 15);
    }

    // Boost with heavy rainfall and net flow
    if (telemetry.rainfall24hMm > 80) riskScore += 12;
    else if (telemetry.rainfall24hMm > 40) riskScore += 6;

    if (netFlowCms > 100) riskScore += 8;
  }

  riskScore = Math.min(100, Math.max(5, Math.round(riskScore)));

  // Alert Level
  let alertLevel: AlertLevel = 'normal';
  if (riskScore >= 90) alertLevel = 'critical';
  else if (riskScore >= 75) alertLevel = 'warning';
  else if (riskScore >= 60) alertLevel = 'watch';
  else alertLevel = 'normal';

  // Hours to overflow
  let estimatedHoursToOverflow: number | null = null;
  if (freeboardMeters <= 0) {
    estimatedHoursToOverflow = 0; // Already overflowing
  } else if (alertLevel === 'critical' || alertLevel === 'warning') {
    // Simulated rise rate: 0.05 to 0.25 m/h depending on rain and inflow
    const riseRateMh = Math.max(0.04, 0.05 + (telemetry.rainfall24hMm / 300) * 0.15 + (netFlowCms > 0 ? (netFlowCms / 1000) * 0.1 : 0));
    estimatedHoursToOverflow = Number((freeboardMeters / riseRateMh).toFixed(1));
    if (estimatedHoursToOverflow > 48) estimatedHoursToOverflow = null;
  }

  // Predicted inundation depth (cm)
  let inundationDepthCm = 0;
  if (freeboardMeters <= 0) {
    inundationDepthCm = Math.round(Math.abs(freeboardMeters) * 100 + 15);
  } else if (freeboardMeters < 0.25 && telemetry.rainfall24hMm > 60) {
    inundationDepthCm = Math.round((0.25 - freeboardMeters) * 100);
  }

  // Impacted radius (km)
  let impactedAreaRadiusKm = 0.5;
  if (type === 'dam') {
    impactedAreaRadiusKm = alertLevel === 'critical' ? 25 : alertLevel === 'warning' ? 12 : 5;
  } else {
    impactedAreaRadiusKm = alertLevel === 'critical' ? 4.5 : alertLevel === 'warning' ? 2.5 : 1.2;
  }

  // Affected subdistricts
  const affectedSubdistricts: string[] = [subdistrict, `พื้นที่ริมน้ำ อ.${district}`];
  if (alertLevel === 'critical' || alertLevel === 'warning') {
    affectedSubdistricts.push(`ชุมชนริมตลิ่ง อ.${district}`, `พื้นที่ลุ่มต่ำใกล้เคียง`);
  }

  // Recommended actions
  const recommendedActions: string[] = [];
  if (alertLevel === 'critical') {
    recommendedActions.push('🚨 ยกของมีค่าขึ้นที่สูงทันที');
    recommendedActions.push('⚠️ เตรียมอพยพผู้สูงอายุและเด็กไปยังจุดปลอดภัย');
    recommendedActions.push('🔌 ตัดสะพานไฟในจุดที่น้ำเริ่มท่วมถึง');
    recommendedActions.push('📱 ติดตามประกาศจากกรมป้องกันและบรรเทาสาธารณภัยอย่างใกล้ชิด');
  } else if (alertLevel === 'warning') {
    recommendedActions.push('⚠️ วางแนวกระสอบทรายป้องกันตลิ่ง');
    recommendedActions.push('🚗 เคลื่อนย้ายยานพาหนะไปยังพื้นที่ดอน');
    recommendedActions.push('📦 เตรียมเสบียง ยารักษาโรค และไฟฉาย');
    recommendedActions.push('🔔 เปิดการแจ้งเตือน LINE เพื่อรับรายงานระดับน้ำทุกชั่วโมง');
  } else if (alertLevel === 'watch') {
    recommendedActions.push('👀 เฝ้าระวังระดับน้ำและปริมาณฝนสะสมอย่างสม่ำเสมอ');
    recommendedActions.push('🧹 ตรวจสอบและกำจัดขยะอุดตันท่อระบายน้ำ');
    recommendedActions.push('⚡ ตรวจสอบความพร้อมของปั๊มสูบน้ำ');
  } else {
    recommendedActions.push('✅ ระดับน้ำอยู่ในเกณฑ์ปลอดภัย ควบคุมได้ตามปกติ');
    recommendedActions.push('📊 ตรวจสอบเครื่องมือวัดระดับน้ำเป็นประจำ');
  }

  const overflowRiskPercent = Math.min(100, Math.round(riskScore * 0.95));

  return {
    riskScore,
    alertLevel,
    overflowRiskPercent,
    freeboardMeters,
    estimatedHoursToOverflow,
    inundationDepthCm,
    impactedAreaRadiusKm,
    affectedSubdistricts,
    recommendedActions,
  };
}

export function simulateScenarioOnStation(
  station: HydrologicalStation,
  params: SimulationParams
): HydrologicalStation {
  const rainBonus = params.rainfallIncreaseMm;
  const dischargeFactor = params.damDischargeMultiplier;
  const tideElevation = params.seaTideElevationM;

  const current = station.telemetry;
  const isDam = station.type === 'dam' || station.type === 'reservoir';
  const isLowerChaoPhraya = station.basin.includes('เจ้าพระยา') || station.province === 'กรุงเทพมหานคร' || station.province === 'นนทบุรี' || station.province === 'สมุทรปราการ';

  let newRainfall = current.rainfall24hMm + rainBonus;
  let newInflow = current.inflowRateCms * (1 + rainBonus / 120);
  let newOutflow = isDam ? current.outflowRateCms * dischargeFactor : current.outflowRateCms;
  
  let newCurrentLevelMsl = current.currentLevelMsl;
  let newCurrentStorageMcm = current.currentStorageMcm;
  let newStoragePercent = current.storagePercent;

  if (isDam) {
    const netFlowCms = newInflow - newOutflow;
    // 1 cms for 24h = ~0.0864 MCM
    const deltaMcm = (netFlowCms * 0.0864 * 0.5);
    newCurrentStorageMcm = Math.min(current.storageCapacityMcm * 1.15, Math.max(current.storageCapacityMcm * 0.1, current.currentStorageMcm + deltaMcm));
    newStoragePercent = Number(((newCurrentStorageMcm / current.storageCapacityMcm) * 100).toFixed(1));
    const storageRatio = newStoragePercent / current.storagePercent;
    newCurrentLevelMsl = Number((current.currentLevelMsl * (0.95 + 0.05 * storageRatio)).toFixed(2));
  } else {
    // Canals / river stations
    let deltaLevelM = (rainBonus / 300) * 0.8;
    if (dischargeFactor > 1.0) {
      deltaLevelM += (dischargeFactor - 1.0) * 0.7; // discharge from dams hits rivers
    }
    if (isLowerChaoPhraya && tideElevation > 0) {
      deltaLevelM += tideElevation * 0.6; // tide pushes water back up
    }
    newCurrentLevelMsl = Number((current.currentLevelMsl + deltaLevelM).toFixed(2));
    const heightSpan = current.bankLevelMsl - (current.bankLevelMsl - 5);
    const fraction = (newCurrentLevelMsl - (current.bankLevelMsl - 5)) / heightSpan;
    newStoragePercent = Math.min(140, Math.max(10, Math.round(fraction * 100)));
  }

  const updatedTelemetry: WaterTelemetry = {
    ...current,
    currentLevelMsl: newCurrentLevelMsl,
    currentStorageMcm: Number(newCurrentStorageMcm.toFixed(1)),
    storagePercent: newStoragePercent,
    inflowRateCms: Math.round(newInflow),
    outflowRateCms: Math.round(newOutflow),
    rainfall24hMm: Math.round(newRainfall),
  };

  const newRisk = calculateFloodRisk(updatedTelemetry, station.type, station.district, station.subdistrict);

  return {
    ...station,
    telemetry: updatedTelemetry,
    risk: newRisk,
  };
}
