import { Flood2554Benchmark } from '../types/hydrology';

/**
 * ข้อมูลสถิติมหาอุทกภัยปี 2554 (Great Flood of 2011 Benchmark)
 * บันทึกปริมาณน้ำกักเก็บสูงสุด อัตราการระบายน้ำ และเหตุการณ์จริงเมื่อปี 2554
 * แหล่งอ้างอิง: กรมชลประทาน, การไฟฟ้าฝ่ายผลิตแห่งประเทศไทย (กฟผ.), สถาบันสารสนเทศทรัพยากรน้ำ (สสน.)
 */
export const BENCHMARKS_2554: Record<string, Flood2554Benchmark> = {
  // 1. เขื่อนภูมิพล (Bhumibol Dam)
  'dam-bhumibol': {
    year: 2554,
    peakStorageMcm: 13456,
    peakStoragePercent: 99.9,
    peakOutflowCms: 1150, // ระบายน้ำสูงสุดเกือบ 100 ล้าน ลบ.ม./วัน
    peakDateThai: 'ตุลาคม 2554',
    spillwayOverflow: true,
    historicalContext:
      'ปริมาณน้ำแตะระดับสูงสุด 99.9% เกือบเต็มความจุ 100% กฟผ. ต้องเปิดทางระบายน้ำล้นฉุกเฉิน (Spillway) เต็มกำลังต่อเนื่อง ระบายน้ำสูงสุดวันละเกือบ 100 ล้าน ลบ.ม. มวลน้ำมหาศาลไหลบ่ารวมกับแม่น้ำน่านเข้าท่วมลุ่มน้ำเจ้าพระยาตอนล่าง',
  },

  // 2. เขื่อนสิริกิติ์ (Sirikit Dam)
  'dam-sirikit': {
    year: 2554,
    peakStorageMcm: 9503,
    peakStoragePercent: 99.9,
    peakOutflowCms: 810, // ระบายน้ำวันละ 65-75 ล้าน ลบ.ม.
    peakDateThai: 'ตุลาคม 2554',
    spillwayOverflow: true,
    historicalContext:
      'น้ำกักเก็บแตะ 99.9% จากอิทธิพลพายุหลายลูกต่อเนื่อง ต้องเร่งระบายน้ำผ่านสปิลเวย์วันละกว่า 65-75 ล้าน ลบ.ม. ส่งผลให้แม่น้ำน่านเอ่อล้นเข้าท่วมพิษณุโลกและพิจิตรอย่างรุนแรง',
  },

  // 3. เขื่อนป่าสักชลสิทธิ์ (Pasak Jolasid Dam)
  'dam-pasak': {
    year: 2554,
    peakStorageMcm: 1308,
    peakStoragePercent: 136.2, // เกินความจุปกติ (960 MCM) ไปถึง 136%
    peakOutflowCms: 1100,
    peakDateThai: 'ตุลาคม 2554',
    spillwayOverflow: true,
    historicalContext:
      'ปริมาณน้ำล้นเกินความจุกักเก็บปกติถึง 136.2% (กักเก็บ 1,308 ล้าน ลบ.ม. จากความจุปกติ 960 ล้าน ลบ.ม.) ต้องเปิดระบายน้ำฉุกเฉินสูงสุดถึง 1,100 ลบ.ม./วินาที มวลน้ำหลากท่วม อ.พัฒนานิคม จ.ลพบุรี พระนครศรีอยุธยา และสระบุรีอย่างหนัก',
  },

  // 4. เขื่อนเจ้าพระยา (Chao Phraya Barrage Dam)
  'dam-chaophraya': {
    year: 2554,
    peakStorageMcm: 250,
    peakStoragePercent: 100.0,
    peakOutflowCms: 3721, // ระบายน้ำวิกฤตสูงสุด
    peakDateThai: '14-16 ตุลาคม 2554',
    spillwayOverflow: true,
    historicalContext:
      'อัตราการระบายน้ำผ่านท้ายเขื่อนเจ้าพระยาพุ่งสูงเป็นประวัติการณ์ถึง 3,721 ลบ.ม./วินาที (เกณฑ์ตลิ่งรับได้ 2,840 ลบ.ม./วินาที) คันกั้นน้ำและทุ่งรับน้ำแตกหลายจุด น้ำทะลักเข้าท่วมเขตนิคมอุตสาหกรรมในอยุธยา ปทุมธานี และนนทบุรี',
  },

  // 5. เขื่อนแควน้อยบำรุงแดน (Kwai Noi Dam)
  'dam-kwainoi': {
    year: 2554,
    peakStorageMcm: 960,
    peakStoragePercent: 102.2,
    peakOutflowCms: 310,
    peakDateThai: 'ตุลาคม 2554',
    spillwayOverflow: true,
    historicalContext:
      'น้ำกักเก็บเกินความจุที่ 102.2% จากน้ำป่าเทือกเขาเพชรบูรณ์และพิษณุโลก จำเป็นต้องเร่งระบายน้ำลงสู่แม่น้ำแควน้อยสมทบแม่น้ำน่าน',
  },

  // 6. เขื่อนกิ่วลม (Kiew Lom Dam)
  'dam-kiewlom': {
    year: 2554,
    peakStorageMcm: 108,
    peakStoragePercent: 101.9,
    peakOutflowCms: 240,
    peakDateThai: 'กันยายน 2554',
    spillwayOverflow: true,
    historicalContext:
      'น้ำกักเก็บแตะ 101.9% ล้นความจุของอ่าง ต้องระบายน้ำลงสู่แม่น้ำวัง เกิดน้ำท่วมพื้นที่ อ.เมืองลำปาง',
  },

  // 7. เขื่อนแม่งัดสมบูรณ์ชล (Mae Ngat Dam)
  'dam-maengad': {
    year: 2554,
    peakStorageMcm: 268,
    peakStoragePercent: 101.1,
    peakOutflowCms: 85,
    peakDateThai: 'กันยายน 2554',
    spillwayOverflow: true,
    historicalContext:
      'รับน้ำจากเทือกเขาแม่แตงจนเกินความจุ 101.1% ในช่วงพายุนกเตนและไหหม่า',
  },

  // 8. เขื่อนแม่กวงอุดมธารา (Mae Kuang Dam)
  'dam-maekuang': {
    year: 2554,
    peakStorageMcm: 215,
    peakStoragePercent: 81.7,
    peakOutflowCms: 45,
    peakDateThai: 'กันยายน 2554',
    spillwayOverflow: false,
    historicalContext:
      'กักเก็บน้ำได้ 81.7% ชะลอน้ำหลากในลุ่มน้ำแม่กวงได้อย่างมีประสิทธิภาพ',
  },

  // 9. เขื่อนขุนด่านปราการชล (Khun Dan Prakan Chon Dam)
  'dam-khundan': {
    year: 2554,
    peakStorageMcm: 226,
    peakStoragePercent: 100.9,
    peakOutflowCms: 95,
    peakDateThai: 'ตุลาคม 2554',
    spillwayOverflow: true,
    historicalContext:
      'น้ำเต็มความจุ 100.9% น้ำล้นสปิลเวย์ขั้นบันไดต่อเนื่อง ระบายน้ำลงแม่น้ำนครนายก',
  },

  // 10. เขื่อนอุบลรัตน์ (Ubol Ratana Dam)
  'dam-ubolratana': {
    year: 2554,
    peakStorageMcm: 2980,
    peakStoragePercent: 122.6,
    peakOutflowCms: 750, // ระบายวันละ 65 ล้าน ลบ.ม.
    peakDateThai: 'ตุลาคม 2554',
    spillwayOverflow: true,
    historicalContext:
      'น้ำล้นความจุปกติถึง 122.6% (กักเก็บ 2,980 ล้าน ลบ.ม. จากความจุ 2,431 ล้าน ลบ.ม.) ต้องระบายน้ำวันละกว่า 65 ล้าน ลบ.ม. ส่งผลให้น้ำท่วมลุ่มน้ำชี จ.ขอนแก่น มหาสารคาม ร้อยเอ็ด และยโสธร',
  },

  // 11. เขื่อนลำปาว (Lam Pao Dam)
  'dam-lampaow': {
    year: 2554,
    peakStorageMcm: 1890,
    peakStoragePercent: 95.5,
    peakOutflowCms: 220,
    peakDateThai: 'ตุลาคม 2554',
    spillwayOverflow: false,
    historicalContext:
      'น้ำกักเก็บสูงถึง 95.5% ช่วยหน่วงน้ำมหาศาลไม่ให้หลากลงท่วมพื้นที่เกษตรในกาฬสินธุ์',
  },

  // 12. เขื่อนลำตะคอง (Lam Takhong Dam)
  'dam-lamtakhong': {
    year: 2554,
    peakStorageMcm: 320,
    peakStoragePercent: 101.9,
    peakOutflowCms: 60,
    peakDateThai: 'ตุลาคม 2554',
    spillwayOverflow: true,
    historicalContext:
      'น้ำเต็มความจุ 101.9% จากฝนตกหนักบริเวณเขาใหญ่ ต้องระบายน้ำลงสู่ลำตะคองเข้าเขตตัวเมืองนครราชสีมา',
  },

  // 13. เขื่อนลำพระเพลิง (Lam Phra Phloeng Dam)
  'dam-lamphraploeng': {
    year: 2554,
    peakStorageMcm: 165,
    peakStoragePercent: 106.5,
    peakOutflowCms: 85,
    peakDateThai: 'ตุลาคม 2554',
    spillwayOverflow: true,
    historicalContext:
      'น้ำล้นสปิลเวย์ 106.5% เอ่อล้นเข้าท่วมพื้นที่ อ.ปักธงชัย และ อ.โชคชัย จ.นครราชสีมา',
  },

  // 14. เขื่อนจุฬาภรณ์ (Chulabhorn Dam)
  'dam-chulabhorn': {
    year: 2554,
    peakStorageMcm: 168,
    peakStoragePercent: 102.4,
    peakOutflowCms: 45,
    peakDateThai: 'ตุลาคม 2554',
    spillwayOverflow: true,
    historicalContext:
      'น้ำล้นความจุ 102.4% ระบายน้ำลงลำน้ำพรมในเขต จ.ชัยภูมิ',
  },

  // 15. เขื่อนสิรินธร (Sirindhorn Dam)
  'dam-sirindhorn': {
    year: 2554,
    peakStorageMcm: 1890,
    peakStoragePercent: 96.1,
    peakOutflowCms: 260,
    peakDateThai: 'ตุลาคม 2554',
    spillwayOverflow: false,
    historicalContext:
      'เก็บกักน้ำได้ 96.1% ของความจุ ช่วยควบคุมระดับน้ำในลุ่มน้ำลำโดมน้อยและแม่น้ำมูล',
  },

  // 16. เขื่อนศรีนครินทร์ (Srinagarind Dam)
  'dam-srinagarind': {
    year: 2554,
    peakStorageMcm: 15200,
    peakStoragePercent: 85.7,
    peakOutflowCms: 180,
    peakDateThai: 'พฤศจิกายน 2554',
    spillwayOverflow: false,
    historicalContext:
      'อ่างเก็บน้ำขนาดใหญ่ที่สุดของไทย กักเก็บน้ำได้ถึง 85.7% และยังมีช่องว่างรับน้ำได้อีกกว่า 2,500 ล้าน ลบ.ม. ช่วยพยุงไม่ให้น้ำท่วมลุ่มน้ำแม่กลอง',
  },

  // 17. เขื่อนวชิราลงกรณ (Vajiralongkorn Dam)
  'dam-vajiralongkorn': {
    year: 2554,
    peakStorageMcm: 7900,
    peakStoragePercent: 89.2,
    peakOutflowCms: 140,
    peakDateThai: 'ตุลาคม 2554',
    spillwayOverflow: false,
    historicalContext:
      'กักเก็บน้ำ 89.2% รองรับมวลน้ำจากชายแดนภาคตะวันตกได้อย่างปลอดภัย',
  },

  // 18. เขื่อนแก่งกระจาน (Kaeng Krachan Dam)
  'dam-kaengkrachan': {
    year: 2554,
    peakStorageMcm: 720,
    peakStoragePercent: 101.4,
    peakOutflowCms: 190,
    peakDateThai: 'พฤศจิกายน 2554',
    spillwayOverflow: true,
    historicalContext:
      'น้ำล้นทางระบายน้ำล้นสปิลเวย์ 101.4% หลากลงสู่แม่น้ำเพชรบุรีและตัวเมืองเพชรบุรี',
  },

  // 19. เขื่อนปราณบุรี (Pran Buri Dam)
  'dam-pranburi': {
    year: 2554,
    peakStorageMcm: 380,
    peakStoragePercent: 85.0,
    peakOutflowCms: 90,
    peakDateThai: 'พฤศจิกายน 2554',
    spillwayOverflow: false,
    historicalContext:
      'เก็บกักน้ำ 85% ปริมาณน้ำฝนในพื้นที่ภาคใต้อยู่ในเกณฑ์บริหารจัดการได้',
  },

  // 20. เขื่อนกิ่วคอหมา (Kiew Kho Ma Dam)
  'dam-kiewkhoma': {
    year: 2554,
    peakStorageMcm: 172,
    peakStoragePercent: 101.2,
    peakOutflowCms: 110,
    peakDateThai: 'กันยายน 2554',
    spillwayOverflow: true,
    historicalContext:
      'น้ำเต็มความจุ 101.2% เปิดประตูระบายน้ำลงสู่แม่น้ำวัง จ.ลำปาง',
  },

  // 21. เขื่อนแม่มอก (Mae Mok Dam)
  'dam-maemok': {
    year: 2554,
    peakStorageMcm: 112,
    peakStoragePercent: 101.8,
    peakOutflowCms: 65,
    peakDateThai: 'กันยายน 2554',
    spillwayOverflow: true,
    historicalContext:
      'น้ำล้นสปิลเวย์ 101.8% มวลน้ำหลากท่วมทุ่งรับน้ำ อ.ทุ่งเสลี่ยม และ อ.สวรรคโลก จ.สุโขทัย',
  },

  // 22. เขื่อนทับเสลา (Thap Salao Dam)
  'dam-thapsalao': {
    year: 2554,
    peakStorageMcm: 164,
    peakStoragePercent: 102.5,
    peakOutflowCms: 95,
    peakDateThai: 'ตุลาคม 2554',
    spillwayOverflow: true,
    historicalContext:
      'น้ำล้นความจุ 102.5% เออท่วมพื้นที่ลุ่มต่ำในเขต จ.อุทัยธานี',
  },

  // 23. เขื่อนกระเสียว (Krasiao Dam)
  'dam-krasiao': {
    year: 2554,
    peakStorageMcm: 245,
    peakStoragePercent: 102.1,
    peakOutflowCms: 120,
    peakDateThai: 'ตุลาคม 2554',
    spillwayOverflow: true,
    historicalContext:
      'น้ำล้นสปิลเวย์ 102.1% ไหลหลากเข้าท่วมพื้นที่ อ.ด่านช้าง และ อ.เดิมบางนางบวช จ.สุพรรณบุรี',
  },

  // 24. สถานีแม่น้ำ C.2 ค่ายจิรประวัติ นครสวรรค์
  'river-c2': {
    year: 2554,
    peakStorageMcm: 0,
    peakStoragePercent: 130.5,
    peakOutflowCms: 4686, // อัตราการไหลสูงสุด 4,686 ลบ.ม./วินาที
    peakDateThai: '13 ตุลาคม 2554',
    spillwayOverflow: true,
    historicalContext:
      'จุดรวมแม่น้ำ ปิง วัง ยม น่าน ปริมาณน้ำไหลผ่านสูงสุดเป็นประวัติการณ์ถึง 4,686 ลบ.ม./วินาที (ความจุลำน้ำรับได้ 3,590 ลบ.ม./วินาที) น้ำท่วมมิดเมืองนครสวรรค์และคันกั้นน้ำพังทลาย',
  },

  // 25. สถานีแม่น้ำ C.29A บางไทร พระนครศรีอยุธยา (ก่อนเข้า กทม.)
  'river-c29a': {
    year: 2554,
    peakStorageMcm: 0,
    peakStoragePercent: 135.0,
    peakOutflowCms: 4000,
    peakDateThai: 'ตุลาคม - พฤศจิกายน 2554',
    spillwayOverflow: true,
    historicalContext:
      'อัตราน้ำหลากเข้าสู่บางไทรพุ่งสูงถึง 3,600 - 4,000 ลบ.ม./วินาที (เกณฑ์ตลิ่งรับได้ 3,500 ลบ.ม./วินาที) ไหลบ่าเข้าท่วมปทุมธานี นนทบุรี และพื้นที่กรุงเทพมหานครฝั่งตะวันออกและฝั่งธนบุรี',
  },
};

/**
 * สถิติภาพรวม 4 เขื่อนหลักลุ่มน้ำเจ้าพระยา (ภูมิพล + สิริกิติ์ + แควน้อย + ป่าสัก)
 */
export const CHAO_PHRAYA_FOUR_DAMS_2554 = {
  name: '4 เขื่อนหลักลุ่มน้ำเจ้าพระยา (ภูมิพล, สิริกิติ์, แควน้อย, ป่าสัก)',
  totalCapacityMcm: 24871, // 13462 + 9510 + 939 + 960
  peakStorage2554Mcm: 25227, // 13456 + 9503 + 960 + 1308
  peakPercent2554: 101.4, // เกินความจุรวมทั้ง 4 เขื่อน!
  description:
    'ในช่วงวิกฤตน้ำท่วมใหญ่ปี 2554 ทั้ง 4 เขื่อนหลักมีน้ำกักเก็บรวมถึง 25,227 ล้าน ลบ.ม. (เกินความจุเก็บกักรวม 101.4%) ทำให้น้ำล้นสปิลเวย์ทุกเขื่อนและไม่สามารถช่วยชะลอน้ำได้อีกต่อไป',
};

export interface Benchmark2554ComparisonResult {
  hasBenchmark: boolean;
  benchmark?: Flood2554Benchmark;
  currentStorageMcm: number;
  currentPercent: number;
  peak2554StorageMcm: number;
  peak2554Percent: number;
  storageGapMcm: number; // ปัจจุบันเทียบปี 54 (ล้าน ลบ.ม.) ติดลบ = ต่ำกว่าปี 54
  storageGapPercent: number; // % ปัจจุบันเทียบปี 54
  remainingBufferMcm: number; // ปริมาตรน้ำที่ยังรับได้อีกก่อนจะเท่าปี 54
  outflowRatioVs2554?: number; // อัตราส่วนการระบายน้ำเทียบปี 54 (เช่น 0.25x ของปี 54)
  severityLevel: 'safe' | 'moderate' | 'high' | 'critical'; // เทียบกับปี 54
  verdictText: string;
}

export function compareWith2554Benchmark(
  stationId: string,
  currentStorageMcm: number,
  currentPercent: number,
  currentOutflowCms: number
): Benchmark2554ComparisonResult {
  const benchmark = BENCHMARKS_2554[stationId];
  if (!benchmark) {
    return {
      hasBenchmark: false,
      currentStorageMcm,
      currentPercent,
      peak2554StorageMcm: 0,
      peak2554Percent: 0,
      storageGapMcm: 0,
      storageGapPercent: 0,
      remainingBufferMcm: 0,
      severityLevel: 'safe',
      verdictText: 'ไม่มีบันทึกข้อมูลปี 2554 สำหรับจุดตรวจวัดนี้',
    };
  }

  const storageGapMcm = currentStorageMcm - benchmark.peakStorageMcm;
  const storageGapPercent = Number((currentPercent - benchmark.peakStoragePercent).toFixed(1));
  const remainingBufferMcm = Math.max(0, benchmark.peakStorageMcm - currentStorageMcm);

  const outflowRatioVs2554 =
    benchmark.peakOutflowCms && benchmark.peakOutflowCms > 0
      ? Number((currentOutflowCms / benchmark.peakOutflowCms).toFixed(2))
      : undefined;

  let severityLevel: 'safe' | 'moderate' | 'high' | 'critical' = 'safe';
  let verdictText = '';

  if (currentPercent >= benchmark.peakStoragePercent || storageGapMcm >= 0) {
    severityLevel = 'critical';
    verdictText = `วิกฤตสูงสุด! ปริมาณน้ำปัจจุบันแตะหรือเกินระดับน้ำท่วมใหญ่ปี 2554 (+${Math.abs(storageGapMcm).toLocaleString()} ล้าน ลบ.ม.)`;
  } else if (currentPercent >= benchmark.peakStoragePercent - 10) {
    severityLevel = 'high';
    verdictText = `เฝ้าระวังสูงสุด! ปริมาณน้ำใกล้เคียงจุดวิกฤตปี 2554 มาก (ห่างจากจุดพีคปี 54 เพียง ${remainingBufferMcm.toLocaleString()} ล้าน ลบ.ม.)`;
  } else if (currentPercent >= benchmark.peakStoragePercent - 25) {
    severityLevel = 'moderate';
    verdictText = `ปานกลาง: ต่ำกว่าปี 2554 อยู่ ${Math.abs(storageGapPercent)}% (ยังมีช่องว่างรับน้ำได้อีก ${remainingBufferMcm.toLocaleString()} ล้าน ลบ.ม.)`;
  } else {
    severityLevel = 'safe';
    verdictText = `ปลอดภัยกว่าปี 2554 มาก: ต่ำกว่าจุดพีคปี 54 อยู่ ${Math.abs(storageGapPercent)}% (ยังมีช่องว่างรับน้ำได้อีก ${remainingBufferMcm.toLocaleString()} ล้าน ลบ.ม.)`;
  }

  return {
    hasBenchmark: true,
    benchmark,
    currentStorageMcm,
    currentPercent,
    peak2554StorageMcm: benchmark.peakStorageMcm,
    peak2554Percent: benchmark.peakStoragePercent,
    storageGapMcm,
    storageGapPercent,
    remainingBufferMcm,
    outflowRatioVs2554,
    severityLevel,
    verdictText,
  };
}
