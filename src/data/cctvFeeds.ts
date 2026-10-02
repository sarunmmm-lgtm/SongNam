import { HydroCctvInfo } from '../types/hydrology';

/**
 * คลังภาพถ่ายกล้อง CCTV ของจริงจาก กฟผ.
 * URL: https://egatwater.egat.co.th/RealTimeCCTV
 */
export const EGAT_CCTV_BASE = 'https://egatwater.egat.co.th/assets/CCTV/images';

/**
 * พอร์ทัลกล้อง CCTV ทางการของหน่วยงานรัฐในประเทศไทย
 */
export const OFFICIAL_PORTALS = {
  egat: {
    name: 'ระบบกล้อง CCTV กฟผ. (EGAT Water CCTV Real Time)',
    url: 'https://egatwater.egat.co.th/RealTimeCCTV',
    description: 'กล้องตรวจวัดระดับน้ำและสันเขื่อน กฟผ. 10 เขื่อนหลักทั่วประเทศ อัปเดตทุก 1 นาที',
  },
  rid: {
    name: 'ศูนย์ปฏิบัติการน้ำอัจฉริยะ กรมชลประทาน (RID SWOC)',
    url: 'http://wmsc.rid.go.th/',
    description: 'ศูนย์ปฏิบัติการน้ำอัจฉริยะ (SWOC) กรมชลประทาน ตรวจวัดระดับน้ำและประตูระบายน้ำ',
  },
  thaiwater: {
    name: 'ระบบโทรมาตรลุ่มน้ำ สสน. (ThaiWater)',
    url: 'https://www.thaiwater.net/',
    description: 'คลังข้อมูลน้ำแห่งชาติ สถาบันสารสนเทศทรัพยากรน้ำ',
  },
  bma: {
    name: 'ระบบตรวจวัดน้ำท่วม กทม. (BMA Drainage)',
    url: 'https://floodbangkok.bangkok.go.th/',
    description: 'สำนักการระบายน้ำ กทม. กล้องตรวจวัดแม่น้ำเจ้าพระยาและสถานีสูบน้ำหลัก',
  },
  dwr: {
    name: 'ระบบเตือนภัยน้ำหลาก กรมทรัพยากรน้ำ (DWR Telemetry)',
    url: 'https://telemetry.dwr.go.th/',
    description: 'เครือข่ายเตือนภัยน้ำหลากดินถล่มลุ่มน้ำธรรมชาติ',
  },
};

/**
 * รายชื่อสถานีที่มีภาพถ่ายกล้อง CCTV ของจริง (เฉพาะเขื่อน 10 แห่งของ กฟผ. ที่ดึงข้อมูลภาพสดได้ 100%)
 * สถานีอื่นที่ไม่มีภาพจริงจะถูกตัดออกทั้งหมดตามคำสั่ง
 */
export const HYDRO_CCTV_CONFIGS: Record<string, HydroCctvInfo> = {
  // 1. เขื่อนภูมิพล (ตาก) - BB
  'dam-bhumibol': {
    enabled: true,
    operator: 'กฟผ. (EGAT CCTV Real Time)',
    lastPingSeconds: 45,
    officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
    agencyPortalName: 'ระบบ CCTV Real Time กฟผ.',
    cameras: [
      {
        id: 'cam-bb-1',
        name: 'กล้องตัวที่ 1',
        angleName: 'หน้าอ่างเก็บน้ำ',
        imageUrl: `${EGAT_CCTV_BASE}/BB/1.jpg`,
        status: 'live',
        waterLevelText: '+237.50 ม.รทก.',
        officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
      },
      {
        id: 'cam-bb-2',
        name: 'กล้องตัวที่ 2',
        angleName: 'หน้าโรงไฟฟ้า',
        imageUrl: `${EGAT_CCTV_BASE}/BB/2.jpg`,
        status: 'live',
        waterLevelText: '+237.50 ม.รทก.',
        officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
      },
      {
        id: 'cam-bb-3',
        name: 'กล้องตัวที่ 3',
        angleName: 'ประตูระบายน้ำล้น (Spillway)',
        imageUrl: `${EGAT_CCTV_BASE}/BB/3.jpg`,
        status: 'live',
        waterLevelText: '+237.50 ม.รทก.',
        officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
      },
      {
        id: 'cam-bb-4',
        name: 'กล้องตัวที่ 4',
        angleName: 'ท้ายอ่างเก็บน้ำ (Downstream)',
        imageUrl: `${EGAT_CCTV_BASE}/BB/4.jpg`,
        status: 'live',
        waterLevelText: '+237.50 ม.รทก.',
        officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
      },
    ],
  },

  // 2. เขื่อนสิริกิติ์ (อุตรดิตถ์) - SK
  'dam-sirikit': {
    enabled: true,
    operator: 'กฟผ. (EGAT CCTV Real Time)',
    lastPingSeconds: 50,
    officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
    agencyPortalName: 'ระบบ CCTV Real Time กฟผ.',
    cameras: [
      {
        id: 'cam-sk-1',
        name: 'กล้องตัวที่ 1',
        angleName: 'หน้าอ่างเก็บน้ำ',
        imageUrl: `${EGAT_CCTV_BASE}/SK/1.jpg`,
        status: 'live',
        waterLevelText: '+153.20 ม.รทก.',
        officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
      },
      {
        id: 'cam-sk-2',
        name: 'กล้องตัวที่ 2',
        angleName: 'หน้าโรงไฟฟ้า',
        imageUrl: `${EGAT_CCTV_BASE}/SK/2.jpg`,
        status: 'live',
        waterLevelText: '+153.20 ม.รทก.',
        officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
      },
      {
        id: 'cam-sk-3',
        name: 'กล้องตัวที่ 3',
        angleName: 'ประตูระบายน้ำล้น (Spillway)',
        imageUrl: `${EGAT_CCTV_BASE}/SK/3.jpg`,
        status: 'live',
        waterLevelText: '+153.20 ม.รทก.',
        officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
      },
      {
        id: 'cam-sk-4',
        name: 'กล้องตัวที่ 4',
        angleName: 'ท้ายอ่างเก็บน้ำ (Downstream)',
        imageUrl: `${EGAT_CCTV_BASE}/SK/4.jpg`,
        status: 'live',
        waterLevelText: '+153.20 ม.รทก.',
        officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
      },
    ],
  },

  // 3. เขื่อนวชิราลงกรณ (กาญจนบุรี) - VRK
  'dam-vajiralongkorn': {
    enabled: true,
    operator: 'กฟผ. (EGAT CCTV Real Time)',
    lastPingSeconds: 40,
    officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
    agencyPortalName: 'ระบบ CCTV Real Time กฟผ.',
    cameras: [
      {
        id: 'cam-vrk-1',
        name: 'กล้องตัวที่ 1',
        angleName: 'หน้าอ่างเก็บน้ำ (สันเขื่อน)',
        imageUrl: `${EGAT_CCTV_BASE}/VRK/1.jpg`,
        status: 'live',
        waterLevelText: '+147.80 ม.รทก.',
        officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
      },
      {
        id: 'cam-vrk-2',
        name: 'กล้องตัวที่ 2',
        angleName: 'หน้าโรงไฟฟ้าพลังน้ำ',
        imageUrl: `${EGAT_CCTV_BASE}/VRK/2.jpg`,
        status: 'live',
        waterLevelText: '+147.80 ม.รทก.',
        officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
      },
      {
        id: 'cam-vrk-3',
        name: 'กล้องตัวที่ 3',
        angleName: 'ประตูระบายน้ำล้น (Spillway)',
        imageUrl: `${EGAT_CCTV_BASE}/VRK/3.jpg`,
        status: 'live',
        waterLevelText: '+147.80 ม.รทก.',
        officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
      },
      {
        id: 'cam-vrk-4',
        name: 'กล้องตัวที่ 4',
        angleName: 'ท้ายอ่างเก็บน้ำ (แม่น้ำแควน้อย)',
        imageUrl: `${EGAT_CCTV_BASE}/VRK/4.jpg`,
        status: 'live',
        waterLevelText: '+147.80 ม.รทก.',
        officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
      },
    ],
  },

  // 4. เขื่อนศรีนครินทร์ (กาญจนบุรี) - SNR
  'dam-srinagarind': {
    enabled: true,
    operator: 'กฟผ. (EGAT CCTV Real Time)',
    lastPingSeconds: 55,
    officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
    agencyPortalName: 'ระบบ CCTV Real Time กฟผ.',
    cameras: [
      {
        id: 'cam-snr-1',
        name: 'กล้องตัวที่ 1',
        angleName: 'หน้าอ่างเก็บน้ำ',
        imageUrl: `${EGAT_CCTV_BASE}/SNR/1.jpg`,
        status: 'live',
        waterLevelText: '+174.20 ม.รทก.',
        officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
      },
      {
        id: 'cam-snr-2',
        name: 'กล้องตัวที่ 2',
        angleName: 'หน้าโรงไฟฟ้า',
        imageUrl: `${EGAT_CCTV_BASE}/SNR/2.jpg`,
        status: 'live',
        waterLevelText: '+174.20 ม.รทก.',
        officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
      },
      {
        id: 'cam-snr-4',
        name: 'กล้องตัวที่ 4',
        angleName: 'ท้ายอ่างเก็บน้ำ (Downstream)',
        imageUrl: `${EGAT_CCTV_BASE}/SNR/4.jpg`,
        status: 'live',
        waterLevelText: '+174.20 ม.รทก.',
        officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
      },
    ],
  },

  // 5. เขื่อนรัชชประภา (สุราษฎร์ธานี) - RPB
  'dam-ratchaprapha': {
    enabled: true,
    operator: 'กฟผ. (EGAT CCTV Real Time)',
    lastPingSeconds: 60,
    officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
    agencyPortalName: 'ระบบ CCTV Real Time กฟผ.',
    cameras: [
      {
        id: 'cam-rpb-2',
        name: 'กล้องตัวที่ 2',
        angleName: 'หน้าโรงไฟฟ้า',
        imageUrl: `${EGAT_CCTV_BASE}/RPB/2.jpg`,
        status: 'live',
        waterLevelText: '+87.50 ม.รทก.',
        officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
      },
      {
        id: 'cam-rpb-3',
        name: 'กล้องตัวที่ 3',
        angleName: 'ประตูระบายน้ำล้น (Spillway)',
        imageUrl: `${EGAT_CCTV_BASE}/RPB/3.jpg`,
        status: 'live',
        waterLevelText: '+87.50 ม.รทก.',
        officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
      },
      {
        id: 'cam-rpb-4',
        name: 'กล้องตัวที่ 4',
        angleName: 'ท้ายอ่างเก็บน้ำ (Downstream)',
        imageUrl: `${EGAT_CCTV_BASE}/RPB/4.jpg`,
        status: 'live',
        waterLevelText: '+87.50 ม.รทก.',
        officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
      },
    ],
  },

  // 6. เขื่อนบางลาง (ยะลา) - BLG
  'dam-banglang': {
    enabled: true,
    operator: 'กฟผ. (EGAT CCTV Real Time)',
    lastPingSeconds: 40,
    officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
    agencyPortalName: 'ระบบ CCTV Real Time กฟผ.',
    cameras: [
      {
        id: 'cam-blg-1',
        name: 'กล้องตัวที่ 1',
        angleName: 'หน้าอ่างเก็บน้ำ',
        imageUrl: `${EGAT_CCTV_BASE}/BLG/1.jpg`,
        status: 'live',
        waterLevelText: '+110.15 ม.รทก.',
        officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
      },
      {
        id: 'cam-blg-2',
        name: 'กล้องตัวที่ 2',
        angleName: 'หน้าโรงไฟฟ้า',
        imageUrl: `${EGAT_CCTV_BASE}/BLG/2.jpg`,
        status: 'live',
        waterLevelText: '+110.15 ม.รทก.',
        officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
      },
      {
        id: 'cam-blg-4',
        name: 'กล้องตัวที่ 4',
        angleName: 'ท้ายอ่างเก็บน้ำ (Downstream)',
        imageUrl: `${EGAT_CCTV_BASE}/BLG/4.jpg`,
        status: 'live',
        waterLevelText: '+110.15 ม.รทก.',
        officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
      },
    ],
  },

  // 7. เขื่อนอุบลรัตน์ (ขอนแก่น) - UR
  'dam-ubolratana': {
    enabled: true,
    operator: 'กฟผ. (EGAT CCTV Real Time)',
    lastPingSeconds: 35,
    officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
    agencyPortalName: 'ระบบ CCTV Real Time กฟผ.',
    cameras: [
      {
        id: 'cam-ur-1',
        name: 'กล้องตัวที่ 1',
        angleName: 'หน้าอ่างเก็บน้ำ',
        imageUrl: `${EGAT_CCTV_BASE}/UR/1.jpg`,
        status: 'live',
        waterLevelText: '+180.45 ม.รทก.',
        officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
      },
      {
        id: 'cam-ur-3',
        name: 'กล้องตัวที่ 3',
        angleName: 'ประตูระบายน้ำล้น (Spillway)',
        imageUrl: `${EGAT_CCTV_BASE}/UR/3.jpg`,
        status: 'live',
        waterLevelText: '+180.45 ม.รทก.',
        officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
      },
      {
        id: 'cam-ur-4',
        name: 'กล้องตัวที่ 4',
        angleName: 'ท้ายอ่างเก็บน้ำ (Downstream)',
        imageUrl: `${EGAT_CCTV_BASE}/UR/4.jpg`,
        status: 'live',
        waterLevelText: '+180.45 ม.รทก.',
        officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
      },
    ],
  },

  // 8. เขื่อนน้ำพุง (สกลนคร) - NP
  'res-nampung': {
    enabled: true,
    operator: 'กฟผ. (EGAT CCTV Real Time)',
    lastPingSeconds: 45,
    officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
    agencyPortalName: 'ระบบ CCTV Real Time กฟผ.',
    cameras: [
      {
        id: 'cam-np-1',
        name: 'กล้องตัวที่ 1',
        angleName: 'หน้าอ่างเก็บน้ำ',
        imageUrl: `${EGAT_CCTV_BASE}/NP/1.jpg`,
        status: 'live',
        waterLevelText: '+284.10 ม.รทก.',
        officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
      },
      {
        id: 'cam-np-2',
        name: 'กล้องตัวที่ 2',
        angleName: 'หน้าโรงไฟฟ้า',
        imageUrl: `${EGAT_CCTV_BASE}/NP/2.jpg`,
        status: 'live',
        waterLevelText: '+284.10 ม.รทก.',
        officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
      },
      {
        id: 'cam-np-3',
        name: 'กล้องตัวที่ 3',
        angleName: 'ประตูระบายน้ำล้น (Spillway)',
        imageUrl: `${EGAT_CCTV_BASE}/NP/3.jpg`,
        status: 'live',
        waterLevelText: '+284.10 ม.รทก.',
        officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
      },
    ],
  },

  // 9. เขื่อนสิรินธร (อุบลราชธานี) - SRD
  'dam-sirindhorn': {
    enabled: true,
    operator: 'กฟผ. (EGAT CCTV Real Time)',
    lastPingSeconds: 50,
    officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
    agencyPortalName: 'ระบบ CCTV Real Time กฟผ.',
    cameras: [
      {
        id: 'cam-srd-1',
        name: 'กล้องตัวที่ 1',
        angleName: 'หน้าอ่างเก็บน้ำ',
        imageUrl: `${EGAT_CCTV_BASE}/SRD/1.jpg`,
        status: 'live',
        waterLevelText: '+141.25 ม.รทก.',
        officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
      },
      {
        id: 'cam-srd-4',
        name: 'กล้องตัวที่ 4',
        angleName: 'ท้ายอ่างเก็บน้ำ (Downstream)',
        imageUrl: `${EGAT_CCTV_BASE}/SRD/4.jpg`,
        status: 'live',
        waterLevelText: '+141.25 ม.รทก.',
        officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
      },
    ],
  },

  // 10. เขื่อนจุฬาภรณ์ (ชัยภูมิ) - CLB
  'dam-chulabhorn': {
    enabled: true,
    operator: 'กฟผ. (EGAT CCTV Real Time)',
    lastPingSeconds: 40,
    officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
    agencyPortalName: 'ระบบ CCTV Real Time กฟผ.',
    cameras: [
      {
        id: 'cam-clb-1',
        name: 'กล้องตัวที่ 1',
        angleName: 'หน้าอ่างเก็บน้ำ',
        imageUrl: `${EGAT_CCTV_BASE}/CLB/1.jpg`,
        status: 'live',
        waterLevelText: '+758.30 ม.รทก.',
        officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
      },
      {
        id: 'cam-clb-3',
        name: 'กล้องตัวที่ 3',
        angleName: 'ประตูระบายน้ำล้น (Spillway)',
        imageUrl: `${EGAT_CCTV_BASE}/CLB/3.jpg`,
        status: 'live',
        waterLevelText: '+758.30 ม.รทก.',
        officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
      },
      {
        id: 'cam-clb-4',
        name: 'กล้องตัวที่ 4',
        angleName: 'ท้ายอ่างเก็บน้ำ (Downstream)',
        imageUrl: `${EGAT_CCTV_BASE}/CLB/4.jpg`,
        status: 'live',
        waterLevelText: '+758.30 ม.รทก.',
        officialPortalUrl: 'https://egatwater.egat.co.th/RealTimeCCTV',
      },
    ],
  },
};
