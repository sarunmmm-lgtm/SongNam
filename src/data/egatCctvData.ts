/**
 * ข้อมูลกล้อง CCTV ภาพถ่ายล่าสุดของแต่ละเขื่อน
 * ดึงตรงจากระบบ CCTV Real Time กฟผ. (EGAT Water Intelligence Center)
 * URL อ้างอิง: https://egatwater.egat.co.th/RealTimeCCTV
 */

export interface EgatDamCamera {
  camNumber: number;
  name: string;
  description: string;
  directUrl: string;
  active: boolean;
}

export interface EgatDamInfo {
  damCode: string; // e.g. 'BB', 'SK', 'VRK'
  stationId: string; // e.g. 'dam-bhumibol'
  name: string;
  province: string;
  basin: string;
  cameras: EgatDamCamera[];
}

export const EGAT_PORTAL_URL = 'https://egatwater.egat.co.th/RealTimeCCTV';

export const EGAT_DAMS: EgatDamInfo[] = [
  {
    damCode: 'BB',
    stationId: 'dam-bhumibol',
    name: 'เขื่อนภูมิพล',
    province: 'ตาก',
    basin: 'ลุ่มน้ำปิง',
    cameras: [
      {
        camNumber: 1,
        name: 'กล้องตัวที่ 1',
        description: 'หน้าอ่างเก็บน้ำ (Upstream / Reservoir Front)',
        directUrl: 'https://egatwater.egat.co.th/assets/CCTV/images/BB/1.jpg',
        active: true,
      },
      {
        camNumber: 2,
        name: 'กล้องตัวที่ 2',
        description: 'หน้าโรงไฟฟ้า (Powerhouse Front)',
        directUrl: 'https://egatwater.egat.co.th/assets/CCTV/images/BB/2.jpg',
        active: true,
      },
      {
        camNumber: 3,
        name: 'กล้องตัวที่ 3',
        description: 'ประตูระบายน้ำล้น (Spillway Gates)',
        directUrl: 'https://egatwater.egat.co.th/assets/CCTV/images/BB/3.jpg',
        active: true,
      },
      {
        camNumber: 4,
        name: 'กล้องตัวที่ 4',
        description: 'ท้ายอ่างเก็บน้ำ (Tailrace / Downstream)',
        directUrl: 'https://egatwater.egat.co.th/assets/CCTV/images/BB/4.jpg',
        active: true,
      },
    ],
  },
  {
    damCode: 'SK',
    stationId: 'dam-sirikit',
    name: 'เขื่อนสิริกิติ์',
    province: 'อุตรดิตถ์',
    basin: 'ลุ่มน้ำน่าน',
    cameras: [
      {
        camNumber: 1,
        name: 'กล้องตัวที่ 1',
        description: 'หน้าอ่างเก็บน้ำ (Upstream)',
        directUrl: 'https://egatwater.egat.co.th/assets/CCTV/images/SK/1.jpg',
        active: true,
      },
      {
        camNumber: 2,
        name: 'กล้องตัวที่ 2',
        description: 'หน้าโรงไฟฟ้า (Powerhouse)',
        directUrl: 'https://egatwater.egat.co.th/assets/CCTV/images/SK/2.jpg',
        active: true,
      },
      {
        camNumber: 3,
        name: 'กล้องตัวที่ 3',
        description: 'ประตูระบายน้ำล้น (Spillway)',
        directUrl: 'https://egatwater.egat.co.th/assets/CCTV/images/SK/3.jpg',
        active: true,
      },
      {
        camNumber: 4,
        name: 'กล้องตัวที่ 4',
        description: 'ท้ายอ่างเก็บน้ำ (Downstream)',
        directUrl: 'https://egatwater.egat.co.th/assets/CCTV/images/SK/4.jpg',
        active: true,
      },
    ],
  },
  {
    damCode: 'VRK',
    stationId: 'dam-vajiralongkorn',
    name: 'เขื่อนวชิราลงกรณ',
    province: 'กาญจนบุรี',
    basin: 'ลุ่มน้ำแม่กลอง',
    cameras: [
      {
        camNumber: 1,
        name: 'กล้องตัวที่ 1',
        description: 'หน้าอ่างเก็บน้ำ (สันเขื่อน)',
        directUrl: 'https://egatwater.egat.co.th/assets/CCTV/images/VRK/1.jpg',
        active: true,
      },
      {
        camNumber: 2,
        name: 'กล้องตัวที่ 2',
        description: 'หน้าโรงไฟฟ้าพลังน้ำ',
        directUrl: 'https://egatwater.egat.co.th/assets/CCTV/images/VRK/2.jpg',
        active: true,
      },
      {
        camNumber: 3,
        name: 'กล้องตัวที่ 3',
        description: 'ประตูระบายน้ำล้น (Spillway)',
        directUrl: 'https://egatwater.egat.co.th/assets/CCTV/images/VRK/3.jpg',
        active: true,
      },
      {
        camNumber: 4,
        name: 'กล้องตัวที่ 4',
        description: 'ท้ายอ่างเก็บน้ำ (แม่น้ำแควน้อย)',
        directUrl: 'https://egatwater.egat.co.th/assets/CCTV/images/VRK/4.jpg',
        active: true,
      },
    ],
  },
  {
    damCode: 'SNR',
    stationId: 'dam-srinagarind',
    name: 'เขื่อนศรีนครินทร์',
    province: 'กาญจนบุรี',
    basin: 'ลุ่มน้ำแม่กลอง',
    cameras: [
      {
        camNumber: 1,
        name: 'กล้องตัวที่ 1',
        description: 'หน้าอ่างเก็บน้ำ (Reservoir)',
        directUrl: 'https://egatwater.egat.co.th/assets/CCTV/images/SNR/1.jpg',
        active: true,
      },
      {
        camNumber: 2,
        name: 'กล้องตัวที่ 2',
        description: 'หน้าโรงไฟฟ้า (Powerhouse)',
        directUrl: 'https://egatwater.egat.co.th/assets/CCTV/images/SNR/2.jpg',
        active: true,
      },
      {
        camNumber: 4,
        name: 'กล้องตัวที่ 4',
        description: 'ท้ายอ่างเก็บน้ำ (Downstream)',
        directUrl: 'https://egatwater.egat.co.th/assets/CCTV/images/SNR/4.jpg',
        active: true,
      },
    ],
  },
  {
    damCode: 'RPB',
    stationId: 'dam-ratchaprapha',
    name: 'เขื่อนรัชชประภา',
    province: 'สุราษฎร์ธานี',
    basin: 'ลุ่มน้ำตาปี',
    cameras: [
      {
        camNumber: 2,
        name: 'กล้องตัวที่ 2',
        description: 'หน้าโรงไฟฟ้า (Powerhouse)',
        directUrl: 'https://egatwater.egat.co.th/assets/CCTV/images/RPB/2.jpg',
        active: true,
      },
      {
        camNumber: 3,
        name: 'กล้องตัวที่ 3',
        description: 'ประตูระบายน้ำล้น (Spillway)',
        directUrl: 'https://egatwater.egat.co.th/assets/CCTV/images/RPB/3.jpg',
        active: true,
      },
      {
        camNumber: 4,
        name: 'กล้องตัวที่ 4',
        description: 'ท้ายอ่างเก็บน้ำ (Downstream)',
        directUrl: 'https://egatwater.egat.co.th/assets/CCTV/images/RPB/4.jpg',
        active: true,
      },
    ],
  },
  {
    damCode: 'BLG',
    stationId: 'dam-banglang',
    name: 'เขื่อนบางลาง',
    province: 'ยะลา',
    basin: 'ลุ่มน้ำปัตตานี',
    cameras: [
      {
        camNumber: 1,
        name: 'กล้องตัวที่ 1',
        description: 'หน้าอ่างเก็บน้ำ (Reservoir)',
        directUrl: 'https://egatwater.egat.co.th/assets/CCTV/images/BLG/1.jpg',
        active: true,
      },
      {
        camNumber: 2,
        name: 'กล้องตัวที่ 2',
        description: 'หน้าโรงไฟฟ้า (Powerhouse)',
        directUrl: 'https://egatwater.egat.co.th/assets/CCTV/images/BLG/2.jpg',
        active: true,
      },
      {
        camNumber: 4,
        name: 'กล้องตัวที่ 4',
        description: 'ท้ายอ่างเก็บน้ำ (Downstream)',
        directUrl: 'https://egatwater.egat.co.th/assets/CCTV/images/BLG/4.jpg',
        active: true,
      },
    ],
  },
  {
    damCode: 'UR',
    stationId: 'dam-ubolratana',
    name: 'เขื่อนอุบลรัตน์',
    province: 'ขอนแก่น',
    basin: 'ลุ่มน้ำชี',
    cameras: [
      {
        camNumber: 1,
        name: 'กล้องตัวที่ 1',
        description: 'หน้าอ่างเก็บน้ำ (Reservoir)',
        directUrl: 'https://egatwater.egat.co.th/assets/CCTV/images/UR/1.jpg',
        active: true,
      },
      {
        camNumber: 3,
        name: 'กล้องตัวที่ 3',
        description: 'ประตูระบายน้ำล้น (Spillway)',
        directUrl: 'https://egatwater.egat.co.th/assets/CCTV/images/UR/3.jpg',
        active: true,
      },
      {
        camNumber: 4,
        name: 'กล้องตัวที่ 4',
        description: 'ท้ายอ่างเก็บน้ำ (Downstream)',
        directUrl: 'https://egatwater.egat.co.th/assets/CCTV/images/UR/4.jpg',
        active: true,
      },
    ],
  },
  {
    damCode: 'NP',
    stationId: 'dam-namphung',
    name: 'เขื่อนน้ำพุง',
    province: 'สกลนคร',
    basin: 'ลุ่มน้ำโขง',
    cameras: [
      {
        camNumber: 1,
        name: 'กล้องตัวที่ 1',
        description: 'หน้าอ่างเก็บน้ำ (Reservoir)',
        directUrl: 'https://egatwater.egat.co.th/assets/CCTV/images/NP/1.jpg',
        active: true,
      },
      {
        camNumber: 2,
        name: 'กล้องตัวที่ 2',
        description: 'หน้าโรงไฟฟ้า (Powerhouse)',
        directUrl: 'https://egatwater.egat.co.th/assets/CCTV/images/NP/2.jpg',
        active: true,
      },
      {
        camNumber: 3,
        name: 'กล้องตัวที่ 3',
        description: 'ประตูระบายน้ำล้น (Spillway)',
        directUrl: 'https://egatwater.egat.co.th/assets/CCTV/images/NP/3.jpg',
        active: true,
      },
    ],
  },
  {
    damCode: 'SRD',
    stationId: 'dam-sirindhorn',
    name: 'เขื่อนสิรินธร',
    province: 'อุบลราชธานี',
    basin: 'ลุ่มน้ำมูล',
    cameras: [
      {
        camNumber: 1,
        name: 'กล้องตัวที่ 1',
        description: 'หน้าอ่างเก็บน้ำ (Reservoir)',
        directUrl: 'https://egatwater.egat.co.th/assets/CCTV/images/SRD/1.jpg',
        active: true,
      },
      {
        camNumber: 4,
        name: 'กล้องตัวที่ 4',
        description: 'ท้ายอ่างเก็บน้ำ (Downstream)',
        directUrl: 'https://egatwater.egat.co.th/assets/CCTV/images/SRD/4.jpg',
        active: true,
      },
    ],
  },
  {
    damCode: 'CLB',
    stationId: 'dam-chulabhorn',
    name: 'เขื่อนจุฬาภรณ์',
    province: 'ชัยภูมิ',
    basin: 'ลุ่มน้ำชี',
    cameras: [
      {
        camNumber: 1,
        name: 'กล้องตัวที่ 1',
        description: 'หน้าอ่างเก็บน้ำ (Reservoir)',
        directUrl: 'https://egatwater.egat.co.th/assets/CCTV/images/CLB/1.jpg',
        active: true,
      },
      {
        camNumber: 3,
        name: 'กล้องตัวที่ 3',
        description: 'ประตูระบายน้ำล้น (Spillway)',
        directUrl: 'https://egatwater.egat.co.th/assets/CCTV/images/CLB/3.jpg',
        active: true,
      },
      {
        camNumber: 4,
        name: 'กล้องตัวที่ 4',
        description: 'ท้ายอ่างเก็บน้ำ (Downstream)',
        directUrl: 'https://egatwater.egat.co.th/assets/CCTV/images/CLB/4.jpg',
        active: true,
      },
    ],
  },
];

/**
 * ค้นหาข้อมูลกล้องของ กฟผ. ตาม stationId หรือ damCode
 */
export function findEgatDam(stationIdOrCode: string): EgatDamInfo | undefined {
  return EGAT_DAMS.find(
    (d) =>
      d.stationId === stationIdOrCode ||
      (d.damCode === 'NP' && (stationIdOrCode === 'res-nampung' || stationIdOrCode === 'dam-namphung')) ||
      d.damCode.toLowerCase() === stationIdOrCode.toLowerCase() ||
      d.name.includes(stationIdOrCode)
  );
}
