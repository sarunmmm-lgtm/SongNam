import { HydrologicalStation } from '../types/hydrology';

export interface ImpactingWaterSource {
  stationId: string;
  stationName: string;
  stationType: 'dam' | 'reservoir' | 'canal' | 'river_station';
  role: 'primary' | 'secondary' | 'regulator' | 'local_sensor';
  riverRoute: string; // เช่น "แม่น้ำเจ้าพระยา", "แม่น้ำป่าสัก", "คลองรพีพัฒน์"
  waterTravelTimeHours: string; // เช่น "8-16 ชั่วโมง"
  impactDescription: string; // คำอธิบายว่าเขื่อนนี้ส่งผลอย่างไรต่อพื้นที่
  severityNote: string;
}

export interface LocationImpactReport {
  query: string;
  matchedName: string;
  province: string;
  basin: string;
  overallThreatLevel: 'critical' | 'warning' | 'watch' | 'normal';
  headline: string;
  explanation: string;
  impactingSources: ImpactingWaterSource[];
  localTelemeteringSensors: string[]; // station IDs of nearby telemetering stations to watch
  recommendedActions: string[];
}

interface LocationRule {
  keywords: string[];
  matchedName: string;
  province: string;
  basin: string;
  headline: string;
  explanation: string;
  sources: {
    stationId: string;
    role: 'primary' | 'secondary' | 'regulator' | 'local_sensor';
    riverRoute: string;
    waterTravelTimeHours: string;
    impactDescription: string;
  }[];
  localSensorIds: string[];
}

const LOCATION_RULES: LocationRule[] = [
  // 1. พระนครศรีอยุธยา (อยุธยา, บางบาล, บางไทร, เสนา, ท่าเรือ, ผักไห่)
  {
    keywords: ['อยุธยา', 'พระนครศรีอยุธยา', 'บางบาล', 'บางไทร', 'เสนา', 'ท่าเรือ', 'ผักไห่', 'มหาราช', 'ป่าโมก', 'เจ้าเจ็ด'],
    matchedName: 'จ.พระนครศรีอยุธยา (ลุ่มน้ำเจ้าพระยา-ป่าสัก)',
    province: 'พระนครศรีอยุธยา',
    basin: 'ลุ่มน้ำเจ้าพระยา / ป่าสัก',
    headline: 'พื้นที่จุดบรรจบแม่น้ำสายหลัก รับน้ำหลากจากทั้งเขื่อนเจ้าพระยาและเขื่อนป่าสัก',
    explanation: 'อยุธยาเป็นพื้นที่ลุ่มต่ำจุดบรรจบของแม่น้ำเจ้าพระยาและแม่น้ำป่าสัก (หน้าวัดพนัญเชิง) หากเขื่อนเจ้าพระยาและเขื่อนป่าสักชลสิทธิ์เร่งระบายน้ำพร้อมกัน จะส่งผลให้น้ำเอ่อล้นตลิ่งเข้าท่วมชุมชนริมน้ำอย่างรวดเร็ว',
    sources: [
      {
        stationId: 'dam-chaophraya',
        role: 'primary',
        riverRoute: 'แม่น้ำเจ้าพระยา (ชัยนาท -> สิงห์บุรี -> อ่างทอง -> อยุธยา)',
        waterTravelTimeHours: '12 - 18 ชั่วโมง',
        impactDescription: 'หากเขื่อนเจ้าพระยาระบายน้ำเกิน 1,800 cms จะเริ่มส่งผลกระทบต่อพื้นที่ลุ่มต่ำ อ.เสนา อ.บางบาล อ.ผักไห่',
      },
      {
        stationId: 'dam-pasak',
        role: 'primary',
        riverRoute: 'แม่น้ำป่าสัก (ลพบุรี -> ท่าเรือ -> อยุธยา)',
        waterTravelTimeHours: '8 - 14 ชั่วโมง',
        impactDescription: 'หากเขื่อนป่าสักชลสิทธิ์ระบายเกิน 200 cms จะดันระดับน้ำแม่น้ำป่าสักที่ อ.ท่าเรือ และไหลมาท่วมหนุนที่ตัวเมืองอยุธยา',
      },
      {
        stationId: 'res-kaemling-bangban',
        role: 'regulator',
        riverRoute: 'พื้นที่แก้มลิงหน่วงน้ำทุ่งบางบาล-บางไทร',
        waterTravelTimeHours: 'พื้นที่รองรับน้ำโดยตรง',
        impactDescription: 'ช่วยตัดยอดน้ำหลากไม่ให้ไหลเข้าท่วมตัวเมืองเศรษฐกิจของอยุธยาและปทุมธานี',
      },
      {
        stationId: 'dam-sirikit',
        role: 'secondary',
        riverRoute: 'แม่น้ำน่าน -> แม่น้ำเจ้าพระยา',
        waterTravelTimeHours: '3 - 4 วัน',
        impactDescription: 'การกักเก็บน้ำของเขื่อนสิริกิติ์มีผลต่อปริมาณน้ำสะสมรวมในลุ่มน้ำเจ้าพระยาตอนล่าง',
      }
    ],
    localSensorIds: ['river-chaophraya-c29a', 'river-pasak-s26', 'res-kaemling-bangban']
  },

  // 2. ปทุมธานี / รังสิต
  {
    keywords: ['รังสิต', 'ปทุมธานี', 'ธัญบุรี', 'คลองหลวง', 'ลำลูกกา', 'สามโคก', 'นวนคร', 'เมืองปทุม'],
    matchedName: 'รังสิต / จ.ปทุมธานี',
    province: 'ปทุมธานี',
    basin: 'ลุ่มน้ำเจ้าพระยา / ทุ่งรังสิต',
    headline: 'ติดตามเขื่อนป่าสักชลสิทธิ์ (ผ่านคลองรพีพัฒน์) และเขื่อนเจ้าพระยา',
    explanation: 'รังสิตและปทุมธานีรับน้ำ 2 ทางหลัก: 1) น้ำตัดยอดจากแม่น้ำป่าสักผ่านคลองระบายน้ำรพีพัฒน์ลงสู่คลอง 1 ถึง 14 และ 2) น้ำจากแม่น้ำเจ้าพระยาตอนบนที่ไหลผ่านบางไทร',
    sources: [
      {
        stationId: 'dam-pasak',
        role: 'primary',
        riverRoute: 'เขื่อนป่าสัก -> คลองรพีพัฒน์ -> คลองรังสิตประยูรศักดิ์',
        waterTravelTimeHours: '14 - 24 ชั่วโมง',
        impactDescription: 'การระบายน้ำออกทางฝั่งขวาของเขื่อนป่าสักจะไหลเข้าคลองระบายน้ำสายรังสิต หากฝนตกหนักในพื้นที่จะระบายไม่ทัน',
      },
      {
        stationId: 'dam-chaophraya',
        role: 'primary',
        riverRoute: 'แม่น้ำเจ้าพระยาตอนล่าง',
        waterTravelTimeHours: '16 - 22 ชั่วโมง',
        impactDescription: 'ระดับน้ำในแม่น้ำเจ้าพระยาที่สถานีบางไทร (C.29A) ส่งผลต่อความสามารถในการสูบระบายน้ำออกจากคลองรังสิต',
      },
      {
        stationId: 'canal-rangsit-chulalongkorn',
        role: 'local_sensor',
        riverRoute: 'ประตูระบายน้ำจุฬาลงกรณ์',
        waterTravelTimeHours: 'สถานีตรวจวัดหลักในพื้นที่',
        impactDescription: 'เซนเซอร์ระดับน้ำหน้าและหลังประตูจุฬาลงกรณ์เป็นดัชนีชี้วัดน้ำท่วมย่านรังสิต',
      }
    ],
    localSensorIds: ['canal-rangsit-chulalongkorn', 'river-chaophraya-c29a', 'canal-premprachakorn']
  },

  // 3. กรุงเทพมหานคร / นนทบุรี
  {
    keywords: ['กรุงเทพ', 'กทม', 'ดอนเมือง', 'หลักสี่', 'บางกะปิ', 'ทวีวัฒนา', 'นนทบุรี', 'ปากเกร็ด', 'บางกรวย', 'พระราม', 'คลองเตย', 'พระโขนง', 'จตุจักร', 'บางเขน', 'สายไหม'],
    matchedName: 'กรุงเทพมหานคร และ จ.นนทบุรี',
    province: 'กรุงเทพมหานคร',
    basin: 'ลุ่มน้ำเจ้าพระยาตอนล่าง / ปริมณฑล',
    headline: 'ต้องติดตามเขื่อนเจ้าพระยา เขื่อนป่าสัก และสภาวะน้ำทะเลหนุนสูง (3 ปัจจัยเกื้อหนุน)',
    explanation: 'กรุงเทพฯ และนนทบุรี เผชิญกับความเสี่ยงน้ำท่วมจาก 3 ปัจจัยร่วมกัน: 1) น้ำเหนือหลากจากเขื่อนเจ้าพระยาและเขื่อนป่าสัก 2) น้ำฝนตกสะสมในพื้นที่ที่ระบายผ่านระบบท่อและลำคลอง และ 3) น้ำทะเลหนุนสูงในอ่าวไทยที่ดุนน้ำย้อนเข้าแม่น้ำเจ้าพระยา',
    sources: [
      {
        stationId: 'dam-chaophraya',
        role: 'primary',
        riverRoute: 'แม่น้ำเจ้าพระยา ผ่านชัยนาท สิงห์บุรี อ่างทอง อยุธยา ลงสู่นนทบุรีและ กทม.',
        waterTravelTimeHours: '20 - 30 ชั่วโมง',
        impactDescription: 'หากการระบายน้ำท้ายเขื่อนเจ้าพระยามากกว่า 2,000 cms จะดันระดับน้ำเจ้าพระยาใน กทม. สูงแตะระดับแนวป้องกันน้ำท่วม',
      },
      {
        stationId: 'dam-pasak',
        role: 'secondary',
        riverRoute: 'แม่น้ำป่าสัก ไหลลงแม่น้ำเจ้าพระยาที่อยุธยา',
        waterTravelTimeHours: '16 - 26 ชั่วโมง',
        impactDescription: 'การระบายน้ำจากป่าสักจะเพิ่มอัตราการไหลรวมที่สถานีบางไทร (C.29A) ก่อนเข้าสู่ กทม.',
      },
      {
        stationId: 'canal-premprachakorn',
        role: 'local_sensor',
        riverRoute: 'คลองเปรมประชากร (ดอนเมือง-หลักสี่)',
        waterTravelTimeHours: 'เซนเซอร์คลองหลักระบายน้ำ กทม. ตอนบน',
        impactDescription: 'วัดระดับน้ำระบายจากปทุมธานีเข้าสู่ระบบอุโมงค์ระบายน้ำ กทม.',
      },
      {
        stationId: 'canal-saensaep-bangkapi',
        role: 'local_sensor',
        riverRoute: 'คลองแสนแสบ (บางกะปิ-คลองตัน)',
        waterTravelTimeHours: 'เส้นทางน้ำสายหลักกลางเมือง',
        impactDescription: 'ตรวจเช็คระดับน้ำในคลองแสนแสบเพื่อประเมินความเสี่ยงน้ำท่วมถนนรามคำแหง พระราม 9 และสุขุมวิท',
      }
    ],
    localSensorIds: ['river-chaophraya-memorial-bridge', 'canal-premprachakorn', 'canal-saensaep-bangkapi', 'canal-mahasawat', 'canal-phrakhanong']
  },

  // 4. ชัยนาท / สิงห์บุรี / อ่างทอง
  {
    keywords: ['ชัยนาท', 'สิงห์บุรี', 'อ่างทอง', 'สรรพยา', 'อินทร์บุรี', 'พรหมบุรี', 'ป่าโมก', 'ไชโย', 'เมืองสิงห์'],
    matchedName: 'จ.ชัยนาท / จ.สิงห์บุรี / จ.อ่างทอง',
    province: 'ชัยนาท / สิงห์บุรี / อ่างทอง',
    basin: 'ลุ่มน้ำเจ้าพระยาตอนกลาง',
    headline: 'ติดตาม "เขื่อนเจ้าพระยา" โดยตรง ซึ่งเป็นประตูระบายน้ำหลักคุมระดับน้ำท้ายเขื่อน',
    explanation: 'พื้นที่ท้ายเขื่อนเจ้าพระยาใน อ.สรรพยา จ.ชัยนาท, อ.อินทร์บุรี จ.สิงห์บุรี และ อ.ป่าโมก จ.อ่างทอง เป็นจุดเสี่ยงน้ำท่วมจุดแรกๆ เมื่อเขื่อนเจ้าพระยามีการปรับเพิ่มอัตราการระบายน้ำ',
    sources: [
      {
        stationId: 'dam-chaophraya',
        role: 'primary',
        riverRoute: 'ท้ายเขื่อนเจ้าพระยา (กม. 0)',
        waterTravelTimeHours: '1 - 6 ชั่วโมง',
        impactDescription: 'ส่งผลกระทบทันที เมื่อเขื่อนเจ้าพระยาระบายเกิน 1,500 cms พื้นที่นอกคันกั้นน้ำ อ.สรรพยา และ อ.อินทร์บุรี จะเริ่มถูกน้ำเอ่อท่วม',
      },
      {
        stationId: 'dam-bhumibol',
        role: 'secondary',
        riverRoute: 'แม่น้ำปิง ไหลลงสู่นครสวรรค์เข้าหน้าเขื่อนเจ้าพระยา',
        waterTravelTimeHours: '2 - 3 วัน',
        impactDescription: 'การระบายน้ำของเขื่อนภูมิพลจะไหลรวมกับแม่น้ำน่านที่นครสวรรค์ (C.2) ก่อนเข้าเขื่อนเจ้าพระยา',
      },
      {
        stationId: 'dam-sirikit',
        role: 'secondary',
        riverRoute: 'แม่น้ำน่าน ไหลลงสู่นครสวรรค์เข้าหน้าเขื่อนเจ้าพระยา',
        waterTravelTimeHours: '2 - 3 วัน',
        impactDescription: 'มีบทบาทสำคัญในการหน่วงน้ำทางภาคเหนือไม่ให้ไหลมาสมทบที่เขื่อนเจ้าพระยาเร็วเกินไป',
      }
    ],
    localSensorIds: ['dam-chaophraya', 'river-chaophraya-c2']
  },

  // 5. นครสวรรค์
  {
    keywords: ['นครสวรรค์', 'ปากน้ำโพ', 'บึงบอระเพ็ด', 'ชุมแสง', 'เก้าเลี้ยว', 'พยุหะคีรี'],
    matchedName: 'จ.นครสวรรค์ (ปากน้ำโพ)',
    province: 'นครสวรรค์',
    basin: 'จุดรวมลุ่มน้ำ ปิง-วัง-ยม-น่าน',
    headline: 'ติดตาม "เขื่อนภูมิพล" และ "เขื่อนสิริกิติ์" รวมถึงพื้นที่ชะลอน้ำบึงบอระเพ็ด',
    explanation: 'นครสวรรค์เป็นจุดรวมของแม่น้ำ 4 สาย (ปิง วัง ยม น่าน) เกิดเป็นแม่น้ำเจ้าพระยาที่ปากน้ำโพ มีสถานีโทรมาตร C.2 วัดปริมาณน้ำผ่านเมือง',
    sources: [
      {
        stationId: 'dam-bhumibol',
        role: 'primary',
        riverRoute: 'แม่น้ำปิง (ตาก -> กำแพงเพชร -> นครสวรรค์)',
        waterTravelTimeHours: '36 - 48 ชั่วโมง',
        impactDescription: 'ควบคุมน้ำจากลุ่มน้ำปิงตอนบน',
      },
      {
        stationId: 'dam-sirikit',
        role: 'primary',
        riverRoute: 'แม่น้ำน่าน (อุตรดิตถ์ -> พิษณุโลก -> พิจิตร -> นครสวรรค์)',
        waterTravelTimeHours: '48 - 60 ชั่วโมง',
        impactDescription: 'ควบคุมมวลน้ำจากลุ่มน้ำน่าน',
      },
      {
        stationId: 'res-buengboraphet',
        role: 'regulator',
        riverRoute: 'บึงบอระเพ็ด',
        waterTravelTimeHours: 'พื้นที่หน่วงน้ำธรรมชาติ',
        impactDescription: 'ช่วยตัดยอดน้ำหลากจากแม่น้ำน่านก่อนไหลลงสู่ตัวเมืองนครสวรรค์',
      }
    ],
    localSensorIds: ['river-chaophraya-c2', 'res-buengboraphet']
  },

  // 6. ลพบุรี / สระบุรี
  {
    keywords: ['ลพบุรี', 'สระบุรี', 'พัฒนานิคม', 'บ้านหมี่', 'ท่าวุ้ง', 'แก่งคอย', 'เสาไห้', 'วังม่วง'],
    matchedName: 'จ.ลพบุรี / จ.สระบุรี (ลุ่มน้ำป่าสัก)',
    province: 'ลพบุรี / สระบุรี',
    basin: 'ลุ่มน้ำป่าสัก',
    headline: 'ติดตาม "เขื่อนป่าสักชลสิทธิ์" โดยตรง',
    explanation: 'หากเขื่อนป่าสักชลสิทธิ์มีปริมาณน้ำเกิน 80-90% และต้องเปิดประตูระบายน้ำท้ายเขื่อน ชุมชนริมแม่น้ำป่าสักใน อ.พัฒนานิคม จ.ลพบุรี และ อ.แก่งคอย อ.เมือง อ.เสาไห้ จ.สระบุรี จะได้รับผลกระทบโดยตรง',
    sources: [
      {
        stationId: 'dam-pasak',
        role: 'primary',
        riverRoute: 'แม่น้ำป่าสัก (เขื่อนป่าสักชลสิทธิ์ -> สระบุรี)',
        waterTravelTimeHours: '2 - 6 ชั่วโมง',
        impactDescription: 'น้ำระบายจากสปิลเวย์จะไหลถึงสระบุรีและลพบุรีตอนล่างภายในเวลาไม่กี่ชั่วโมง',
      }
    ],
    localSensorIds: ['dam-pasak', 'river-pasak-s26']
  },

  // 7. ขอนแก่น / กาฬสินธุ์ / มหาสารคาม / ร้อยเอ็ด / อุบลราชธานี (ลุ่มน้ำชี-มูล)
  {
    keywords: ['ขอนแก่น', 'อุบล', 'อุบลราชธานี', 'กาฬสินธุ์', 'มหาสารคาม', 'ร้อยเอ็ด', 'วารินชำราบ', 'เขื่อนอุบลรัตน์', 'ลำปาว', 'น้ำพอง', 'ยางตลาด', 'กมลาไสย'],
    matchedName: 'ภาคตะวันออกเฉียงเหนือ (ลุ่มน้ำชี - มูล)',
    province: 'ขอนแก่น / กาฬสินธุ์ / อุบลราชธานี',
    basin: 'ลุ่มน้ำชี - ลุ่มน้ำมูล',
    headline: 'ติดตาม "เขื่อนอุบลรัตน์" (ลุ่มน้ำชี) "เขื่อนลำปาว" และแม่น้ำมูล (สถานี M.7)',
    explanation: 'ลุ่มน้ำชีไหลจากเขื่อนอุบลรัตน์และเขื่อนลำปาว ผ่านร้อยเอ็ด ยโสธร ไปบรรจบกับแม่น้ำมูลที่ อ.วารินชำราบ จ.อุบลราชธานี ก่อนไหลลงแม่น้ำโขง',
    sources: [
      {
        stationId: 'dam-ubolratana',
        role: 'primary',
        riverRoute: 'แม่น้ำพอง -> แม่น้ำชี (ขอนแก่น -> มหาสารคาม -> ร้อยเอ็ด -> อุบลฯ)',
        waterTravelTimeHours: '12 ชม. (ขอนแก่น) / 3-4 วัน (อุบลฯ)',
        impactDescription: 'การระบายน้ำของเขื่อนอุบลรัตน์กระทบพื้นที่ท้ายเขื่อน อ.น้ำพอง อ.เมืองขอนแก่น และไหลต่อเนื่องสู่อุบลราชธานี',
      },
      {
        stationId: 'dam-lampaow',
        role: 'primary',
        riverRoute: 'ลำปาว -> แม่น้ำชี (กาฬสินธุ์ -> ร้อยเอ็ด -> อุบลฯ)',
        waterTravelTimeHours: '6 ชม. (กาฬสินธุ์) / 2-3 วัน (อุบลฯ)',
        impactDescription: 'ส่งผลกระทบต่อพื้นที่ อ.เมืองกาฬสินธุ์ อ.กมลาไสย และไหลร่วมกับแม่น้ำชี',
      },
      {
        stationId: 'river-mun-m7',
        role: 'local_sensor',
        riverRoute: 'แม่น้ำมูล สะพานเสรีประชาธิปไตย อุบลฯ',
        waterTravelTimeHours: 'สถานีวัดน้ำวิกฤตลุ่มน้ำมูล-ชี',
        impactDescription: 'ดัชนีตรวจวัดน้ำท่วม อ.เมืองอุบลฯ และ อ.วารินชำราบ',
      }
    ],
    localSensorIds: ['dam-ubolratana', 'dam-lampaow', 'river-mun-m7']
  },

  // 8. เชียงใหม่ / ลำพูน
  {
    keywords: ['เชียงใหม่', 'ลำพูน', 'สะพานนวรัฐ', 'ช้างม่อย', 'สารภี', 'หางดง', 'สันทราย', 'แม่วาง', 'แม่ริม'],
    matchedName: 'จ.เชียงใหม่ / จ.ลำพูน (ลุ่มน้ำปิงตอนบน)',
    province: 'เชียงใหม่',
    basin: 'ลุ่มน้ำปิงตอนบน',
    headline: 'ติดตาม "สถานีโทรมาตรแม่น้ำปิง P.1 สะพานนวรัฐ" (อยู่เหนือเขื่อนภูมิพล)',
    explanation: 'เชียงใหม่อยู่ต้นน้ำเหนือเขื่อนภูมิพล ดังนั้นระดับน้ำในตัวเมืองไม่ได้เกิดจากการระบายน้ำของเขื่อน แต่เกิดจากปริมาณฝนสะสมบนดอยเชียงดาวและแม่น้ำปิงตอนบน ซึ่งน้ำทั้งหมดจะไหลลงไปกักเก็บที่เขื่อนภูมิพล จ.ตาก',
    sources: [
      {
        stationId: 'river-ping-p1',
        role: 'primary',
        riverRoute: 'แม่น้ำปิงตอนบน สะพานนวรัฐ',
        waterTravelTimeHours: 'วัดระดับน้ำเรียลไทม์ในตัวเมือง',
        impactDescription: 'หากระดับน้ำที่ P.1 เกิน 3.70 - 4.20 เมตร น้ำจะเริ่มเอ่อเข้าท่วมย่านช้างคลาน ไนท์บาซาร์ และสารภี',
      },
      {
        stationId: 'dam-bhumibol',
        role: 'regulator',
        riverRoute: 'ปลายทางรับน้ำของลุ่มน้ำปิง (จ.ตาก)',
        waterTravelTimeHours: 'น้ำจากเชียงใหม่ไหลลงเขื่อนภูมิพลใน 1-2 วัน',
        impactDescription: 'เขื่อนภูมิพลทำหน้าที่กักเก็บน้ำหลากทั้งหมดจากเชียงใหม่ เพื่อไม่ให้ไหลลงไปท่วมภาคกลาง',
      }
    ],
    localSensorIds: ['river-ping-p1', 'dam-bhumibol']
  },

  // 9. กาญจนบุรี / นครปฐม / ราชบุรี
  {
    keywords: ['กาญจนบุรี', 'นครปฐม', 'ราชบุรี', 'ศรีสวัสดิ์', 'ทองผาภูมิ', 'ไทรโยค', 'ท่าม่วง', 'ศาลายา', 'นครชัยศรี', 'สามพราน'],
    matchedName: 'จ.กาญจนบุรี / จ.นครปฐม / จ.ราชบุรี (ลุ่มน้ำแม่กลอง-ท่าจีน)',
    province: 'กาญจนบุรี / นครปฐม',
    basin: 'ลุ่มน้ำแม่กลอง / ท่าจีน',
    headline: 'ติดตาม "เขื่อนศรีนครินทร์" และ "เขื่อนวชิราลงกรณ"',
    explanation: 'จังหวัดกาญจนบุรีและแม่น้ำแม่กลองถูกควบคุมโดย 2 เขื่อนยักษ์ใหญ่ คือ เขื่อนศรีนครินทร์ (แม่น้ำแควใหญ่) และเขื่อนวชิราลงกรณ (แม่น้ำแควน้อย) ไหลมาบรรจบกันที่ ต.ปากแพรก เมืองกาญจนบุรี',
    sources: [
      {
        stationId: 'dam-srinagarind',
        role: 'primary',
        riverRoute: 'แม่น้ำแควใหญ่ (ศรีสวัสดิ์ -> เมืองกาญจน์ -> แม่กลอง)',
        waterTravelTimeHours: '6 - 12 ชั่วโมง',
        impactDescription: 'เขื่อนที่มีความจุมากที่สุดในประเทศไทย (17,745 ล้าน ลบ.ม.) ควบคุมน้ำหลากฝั่งตะวันตก',
      },
      {
        stationId: 'dam-vajiralongkorn',
        role: 'primary',
        riverRoute: 'แม่น้ำแควน้อย (ทองผาภูมิ -> ไทรโยค -> เมืองกาญจน์)',
        waterTravelTimeHours: '8 - 14 ชั่วโมง',
        impactDescription: 'ควบคุมน้ำหลากจากเทือกเขาตะนาวศรีด้านชายแดนพม่า',
      },
      {
        stationId: 'canal-taweewatthana',
        role: 'local_sensor',
        riverRoute: 'คลองทวีวัฒนา (ศาลายา นครปฐม)',
        waterTravelTimeHours: 'คลองเชื่อมโยงแม่น้ำท่าจีนและเจ้าพระยา',
        impactDescription: 'ช่วยระบายน้ำในเขตศาลายาและฝั่งธนบุรี',
      }
    ],
    localSensorIds: ['dam-srinagarind', 'dam-vajiralongkorn', 'canal-taweewatthana']
  },

  // 10. นครนายก / ปราจีนบุรี / ฉะเชิงเทรา
  {
    keywords: ['นครนายก', 'ปราจีนบุรี', 'ฉะเชิงเทรา', 'หินตั้ง', 'ท่าตะเกียบ', 'บางปะกง', 'พนมสารคาม'],
    matchedName: 'จ.นครนายก / ปราจีนบุรี / ฉะเชิงเทรา (ลุ่มน้ำบางปะกง)',
    province: 'นครนายก / ฉะเชิงเทรา',
    basin: 'ลุ่มน้ำบางปะกง / นครนายก',
    headline: 'ติดตาม "เขื่อนขุนด่านปราการชล" และ "อ่างเก็บน้ำคลองสียัด"',
    explanation: 'เขื่อนขุนด่านปราการชลรับน้ำโดยตรงจากอุทยานแห่งชาติเขาใหญ่ ไหลลงแม่น้ำนครนายก ก่อนไปบรรจบกับแม่น้ำปราจีนบุรีกลายเป็นแม่น้ำบางปะกง',
    sources: [
      {
        stationId: 'dam-khundan',
        role: 'primary',
        riverRoute: 'แม่น้ำนครนายก (เขาใหญ่ -> เมืองนครนายก -> บ้านสร้าง)',
        waterTravelTimeHours: '1 - 4 ชั่วโมง',
        impactDescription: 'หากน้ำเต็มสปิลเวย์จะระบายลงลำน้ำนครนายก ส่งผลกระทบต่อรีสอร์ทและชุมชนริมแม่น้ำอย่างรวดเร็ว',
      },
      {
        stationId: 'res-khlongsiyat',
        role: 'primary',
        riverRoute: 'คลองสียัด -> แม่น้ำบางปะกง (ฉะเชิงเทรา)',
        waterTravelTimeHours: '6 - 12 ชั่วโมง',
        impactDescription: 'อ่างเก็บน้ำขนาดใหญ่ที่ควบคุมน้ำหลากในพื้นที่ จ.ฉะเชิงเทรา',
      }
    ],
    localSensorIds: ['dam-khundan', 'res-khlongsiyat']
  },

  // 11. สุราษฎร์ธานี (ภาคใต้)
  {
    keywords: ['สุราษฎร์', 'สุราษฎร์ธานี', 'เชี่ยวหลาน', 'บ้านตาขุน', 'พุนพิน', 'ตาปี', 'พุมดวง', 'เกาะสมุย'],
    matchedName: 'จ.สุราษฎร์ธานี (ลุ่มน้ำตาปี-พุมดวง)',
    province: 'สุราษฎร์ธานี',
    basin: 'ลุ่มน้ำตาปี',
    headline: 'ติดตาม "เขื่อนรัชชประภา (เขื่อนเชี่ยวหลาน)"',
    explanation: 'เขื่อนรัชชประภากักเก็บน้ำจากเทือกเขาสกและคลองพุมดวง มีบทบาทสำคัญในการควบคุมน้ำไม่ให้ไหลหลากท่วม อ.พุนพิน และ อ.เมืองสุราษฎร์ธานี',
    sources: [
      {
        stationId: 'dam-ratchaprapha',
        role: 'primary',
        riverRoute: 'แม่น้ำพุมดวง -> แม่น้ำตาปี (บ้านตาขุน -> พุนพิน -> อ่าวไทย)',
        waterTravelTimeHours: '8 - 16 ชั่วโมง',
        impactDescription: 'การระบายน้ำของเขื่อนมีผลต่อระดับน้ำที่ อ.พุนพิน ซึ่งเป็นจุดเสี่ยงน้ำท่วมซ้ำซาก',
      }
    ],
    localSensorIds: ['dam-ratchaprapha']
  },

  // 12. นครราชสีมา / โคราช
  {
    keywords: ['โคราช', 'นครราชสีมา', 'สีคิ้ว', 'ปักธงชัย', 'พิมาย', 'โนนสูง', 'เมืองนครราชสีมา', 'ลำตะคอง', 'ลำพระเพลิง'],
    matchedName: 'จ.นครราชสีมา (ลุ่มน้ำมูลตอนบน)',
    province: 'นครราชสีมา',
    basin: 'ลุ่มน้ำมูลตอนบน',
    headline: 'ติดตาม "เขื่อนลำตะคอง" และ "เขื่อนลำพระเพลิง"',
    explanation: 'จังหวัดนครราชสีมาถูกล้อมรอบด้วย 2 เขื่อนสำคัญ: เขื่อนลำตะคอง (คุมน้ำไหลผ่านตัวเมืองโคราชและสีคิ้ว) และเขื่อนลำพระเพลิง (คุมน้ำ อ.ปักธงชัย) ก่อนไหลไปบรรจบที่ อ.พิมาย',
    sources: [
      {
        stationId: 'dam-lamtakhong',
        role: 'primary',
        riverRoute: 'ลำตะคอง (สีคิ้ว -> สูงเนิน -> ตัวเมืองโคราช -> พิมาย)',
        waterTravelTimeHours: '6 - 12 ชั่วโมง',
        impactDescription: 'หากเขื่อนลำตะคองระบายน้ำสูง จะส่งผลให้ลำตะคองเอ่อท่วมตลาดเซฟวันและเขตเศรษฐกิจตัวเมืองโคราช',
      },
      {
        stationId: 'dam-lamphraploeng',
        role: 'primary',
        riverRoute: 'ลำพระเพลิง (ปักธงชัย -> โชคชัย -> ลำน้ำมูล)',
        waterTravelTimeHours: '4 - 8 ชั่วโมง',
        impactDescription: 'ส่งผลกระทบโดยตรงต่อน้ำท่วมในเขตเทศบาลเมืองปักธงชัย',
      }
    ],
    localSensorIds: ['dam-lamtakhong', 'dam-lamphraploeng']
  },

  // 13. พิษณุโลก / พิจิตร
  {
    keywords: ['พิษณุโลก', 'พิจิตร', 'วัดโบสถ์', 'วังทอง', 'บางระกำ', 'พรหมพิราม', 'เมืองพิษณุโลก'],
    matchedName: 'จ.พิษณุโลก / จ.พิจิตร (ลุ่มน้ำน่าน-แควน้อย)',
    province: 'พิษณุโลก / พิจิตร',
    basin: 'ลุ่มน้ำน่าน / แควน้อย',
    headline: 'ติดตาม "เขื่อนแควน้อยบำรุงแดน" และ "เขื่อนสิริกิติ์"',
    explanation: 'พิษณุโลกและพิจิตรรองรับน้ำจากแม่น้ำน่าน (จากเขื่อนสิริกิติ์) และแม่น้ำแควน้อย (จากเขื่อนแควน้อยบำรุงแดน) บรรจบกันที่ อ.เมืองพิษณุโลก โดยมีทุ่งบางระกำโมเดลเป็นพื้นที่หน่วงน้ำ',
    sources: [
      {
        stationId: 'dam-kwainoi',
        role: 'primary',
        riverRoute: 'แม่น้ำแควน้อย (วัดโบสถ์ -> ตัวเมืองพิษณุโลก)',
        waterTravelTimeHours: '4 - 8 ชั่วโมง',
        impactDescription: 'ควบคุมน้ำหลากจากเทือกเขาเพชรบูรณ์และอ.ชาติตระการ ไม่ให้เข้าท่วมตัวเมืองพิษณุโลก',
      },
      {
        stationId: 'dam-sirikit',
        role: 'primary',
        riverRoute: 'แม่น้ำน่าน (อุตรดิตถ์ -> พิษณุโลก -> พิจิตร)',
        waterTravelTimeHours: '24 - 36 ชั่วโมง',
        impactDescription: 'การระบายน้ำของเขื่อนสิริกิติ์มีผลต่อระดับแม่น้ำน่านตลอดสาย',
      }
    ],
    localSensorIds: ['dam-kwainoi', 'dam-sirikit']
  },

  // 14. สุโขทัย
  {
    keywords: ['สุโขทัย', 'สวรรคโลก', 'ศรีสำโรง', 'กงไกรลาศ', 'แม่น้ำยม'],
    matchedName: 'จ.สุโขทัย (ลุ่มน้ำยม)',
    province: 'สุโขทัย',
    basin: 'ลุ่มน้ำยม',
    headline: 'ต้องเฝ้าระวัง "สถานีโทรมาตรแม่น้ำยม Y.14" เป็นพิเศษ (ลุ่มน้ำยมไม่มีเขื่อนขนาดใหญ่)',
    explanation: 'ลุ่มน้ำยมเป็นลุ่มน้ำสายเดียวในภาคเหนือตอนล่างที่ไม่มีเขื่อนเก็บกักน้ำขนาดใหญ่ ทำให้น้ำหลากจาก จ.แพร่ ไหลบ่าลงมายัง อ.สวรรคโลก อ.ศรีสำโรง และตัวเมืองสุโขทัยอย่างรวดเร็ว ประชาชนต้องติดตามสถานี Y.14 อย่างใกล้ชิด',
    sources: [
      {
        stationId: 'river-yom-y14',
        role: 'primary',
        riverRoute: 'แม่น้ำยม (แพร่ -> สวรรคโลก -> ศรีสำโรง -> เมืองสุโขทัย)',
        waterTravelTimeHours: 'ไหลหลากฉับพลันตามธรรมชาติ',
        impactDescription: 'ระดับตลิ่งสถานี Y.14 อยู่ที่ 51.20 ม.รทก. หากน้ำสูงเกินระดับนี้จะทะลักเข้าท่วมเขตเทศบาลเมืองสุโขทัยทันที',
      },
      {
        stationId: 'dam-sirikit',
        role: 'secondary',
        riverRoute: 'ผันน้ำข้ามลุ่มน้ำ (คลองผันน้ำยม-น่าน)',
        waterTravelTimeHours: 'การบริหารจัดการผันน้ำระบาย',
        impactDescription: 'การลดการระบายของเขื่อนสิริกิติ์ช่วยให้แม่น้ำน่านสามารถรับน้ำผันจากแม่น้ำยมได้มากขึ้น',
      }
    ],
    localSensorIds: ['river-yom-y14']
  },

  // 15. ลำปาง
  {
    keywords: ['ลำปาง', 'เมืองลำปาง', 'กิ่วลม', 'แม่น้ำวัง', 'เกาะคา', 'สบปราบ', 'เถิน'],
    matchedName: 'จ.ลำปาง (ลุ่มน้ำวัง)',
    province: 'ลำปาง',
    basin: 'ลุ่มน้ำวัง',
    headline: 'ติดตาม "เขื่อนกิ่วลม" และ "สถานีโทรมาตรแม่น้ำวัง W.1A สะพานเสตุวารี"',
    explanation: 'แม่น้ำวังไหลผ่านใจกลางเมืองลำปาง โดยมีเขื่อนกิ่วลมตั้งอยู่ทางตอนบนคอยควบคุมน้ำไม่ให้หลากเข้าท่วมเขตเทศบาลนครลำปาง',
    sources: [
      {
        stationId: 'dam-kiewlom',
        role: 'primary',
        riverRoute: 'แม่น้ำวัง (เขื่อนกิ่วลม -> ตัวเมืองลำปาง -> เกาะคา -> เถิน)',
        waterTravelTimeHours: '2 - 5 ชั่วโมง',
        impactDescription: 'หากเขื่อนกิ่วลมมีระดับน้ำเกิน 85% และต้องเร่งระบายน้ำ จะส่งผลให้ระดับน้ำในแม่น้ำวังสะพานเสตุวารีเพิ่มสูงขึ้นอย่างรวดเร็ว',
      },
      {
        stationId: 'river-wang-w1a',
        role: 'local_sensor',
        riverRoute: 'สะพานเสตุวารี ตัวเมืองลำปาง',
        waterTravelTimeHours: 'สถานีตรวจวัดใจกลางเมือง',
        impactDescription: 'ดัชนีตรวจวัดน้ำท่วมเขตชุมชนเมืองลำปาง',
      }
    ],
    localSensorIds: ['dam-kiewlom', 'river-wang-w1a']
  },

  // 16. เพชรบุรี / ประจวบคีรีขันธ์
  {
    keywords: ['เพชรบุรี', 'ท่ายาง', 'บ้านแหลม', 'ชะอำ', 'หัวหิน', 'ปราณบุรี', 'แก่งกระจาน', 'กุยบุรี'],
    matchedName: 'จ.เพชรบุรี / จ.ประจวบคีรีขันธ์ (ภาคตะวันตก)',
    province: 'เพชรบุรี / ประจวบคีรีขันธ์',
    basin: 'ลุ่มน้ำเพชรบุรี / ปราณบุรี',
    headline: 'ติดตาม "เขื่อนแก่งกระจาน" (เพชรบุรี) และ "เขื่อนปราณบุรี"',
    explanation: 'เมืองเพชรบุรีและ อ.บ้านแหลม มักเกิดน้ำท่วมใหญ่เมื่อเขื่อนแก่งกระจานมีปริมาณน้ำเกิน 100% จนน้ำล้นสปิลเวย์และไหลลงแม่น้ำเพชรบุรี',
    sources: [
      {
        stationId: 'dam-kaengkrachan',
        role: 'primary',
        riverRoute: 'แม่น้ำเพชรบุรี (แก่งกระจาน -> ท่ายาง -> เมืองเพชรบุรี -> บ้านแหลม)',
        waterTravelTimeHours: '10 - 16 ชั่วโมง',
        impactDescription: 'หากน้ำล้นทางระบายน้ำสปิลเวย์ มวลน้ำจะใช้เวลาประมาณครึ่งวันเดินทางถึงตัวเมืองเพชรบุรี',
      },
      {
        stationId: 'dam-pranburi',
        role: 'primary',
        riverRoute: 'แม่น้ำปราณบุรี (ปราณบุรี -> ปากน้ำปราณ)',
        waterTravelTimeHours: '4 - 8 ชั่วโมง',
        impactDescription: 'ควบคุมน้ำหลากในพื้นที่ อ.ปราณบุรี และ อ.หัวหินตอนล่าง',
      }
    ],
    localSensorIds: ['dam-kaengkrachan', 'dam-pranburi']
  },

  // 17. ยะลา / ปัตตานี (ภาคใต้ตอนล่าง)
  {
    keywords: ['ยะลา', 'ปัตตานี', 'บันนังสตา', 'เบตง', 'เมืองยะลา', 'เมืองปัตตานี', 'หนองจิก', 'สายบุรี', 'บางลาง'],
    matchedName: 'จ.ยะลา / จ.ปัตตานี (ลุ่มน้ำปัตตานี)',
    province: 'ยะลา / ปัตตานี',
    basin: 'ลุ่มน้ำปัตตานี',
    headline: 'ติดตาม "เขื่อนบางลาง" เขื่อนอเนกประสงค์ขนาดใหญ่ที่สุดของภาคใต้ตอนล่าง',
    explanation: 'เขื่อนบางลางกักเก็บน้ำจากเทือกเขาสันกาลาคีรี ช่วยป้องกันและบรรเทาอุทกภัยในเขตตัวเมืองยะลาและจังหวัดปัตตานีตลอดแนวแม่น้ำปัตตานี',
    sources: [
      {
        stationId: 'dam-banglang',
        role: 'primary',
        riverRoute: 'แม่น้ำปัตตานี (บันนังสตา -> เมืองยะลา -> เมืองปัตตานี -> อ่าวไทย)',
        waterTravelTimeHours: '12 - 24 ชั่วโมง',
        impactDescription: 'หากเขื่อนบางลางเร่งระบายน้ำช่วงฤดูมรสุมภาคใต้ จะส่งผลให้น้ำในแม่น้ำปัตตานีเอ่อล้นเข้าท่วมพื้นที่ลุ่มต่ำตลาดเก่ายะลาและปัตตานี',
      }
    ],
    localSensorIds: ['dam-banglang']
  }
];

export function findLocationImpact(
  query: string,
  allStations: HydrologicalStation[]
): LocationImpactReport | null {
  const clean = query.trim().toLowerCase();
  if (!clean) return null;

  // 1. Direct keyword match in rules
  let matchedRule = LOCATION_RULES.find((rule) =>
    rule.keywords.some((kw) => clean.includes(kw.toLowerCase()) || kw.toLowerCase().includes(clean))
  );

  // 2. If not matched, search by station province or name
  if (!matchedRule) {
    const stationMatch = allStations.find(
      (s) =>
        s.province.toLowerCase().includes(clean) ||
        s.district.toLowerCase().includes(clean) ||
        s.name.toLowerCase().includes(clean) ||
        clean.includes(s.province.toLowerCase())
    );

    if (stationMatch) {
      // Find rule with same basin or province
      matchedRule = LOCATION_RULES.find(
        (r) => r.province.includes(stationMatch.province) || r.basin.includes(stationMatch.basin)
      );

      if (!matchedRule) {
        // Synthesize dynamic rule
        return synthesizeGenericReport(clean, stationMatch, allStations);
      }
    }
  }

  if (!matchedRule) {
    // Default fallback to Chao Phraya central basin
    return null;
  }

  // Calculate actual current risk of impacting sources
  let maxRiskScore = 0;
  let highestAlert: 'critical' | 'warning' | 'watch' | 'normal' = 'normal';

  const enrichedSources: ImpactingWaterSource[] = matchedRule.sources.map((src) => {
    const foundStation = allStations.find((s) => s.id === src.stationId);
    let severityNote = 'ระดับน้ำปกติ';
    if (foundStation) {
      if (foundStation.risk.alertLevel === 'critical') {
        severityNote = `🚨 วิกฤต! ปัจจุบันเก็บกัก ${foundStation.telemetry.storagePercent}% (${foundStation.telemetry.outflowRateCms.toLocaleString()} cms)`;
        if (maxRiskScore < 90) maxRiskScore = 90;
      } else if (foundStation.risk.alertLevel === 'warning') {
        severityNote = `⚠️ เตือนภัย! ปัจจุบันเก็บกัก ${foundStation.telemetry.storagePercent}%`;
        if (maxRiskScore < 75) maxRiskScore = 75;
      } else if (foundStation.risk.alertLevel === 'watch') {
        severityNote = `🟡 เฝ้าระวัง ปัจจุบันเก็บกัก ${foundStation.telemetry.storagePercent}%`;
        if (maxRiskScore < 60) maxRiskScore = 60;
      } else {
        severityNote = `✅ ปกติ เก็บกัก ${foundStation.telemetry.storagePercent}%`;
      }
    }

    return {
      stationId: src.stationId,
      stationName: foundStation ? foundStation.name : src.stationId,
      stationType: foundStation ? foundStation.type : 'dam',
      role: src.role,
      riverRoute: src.riverRoute,
      waterTravelTimeHours: src.waterTravelTimeHours,
      impactDescription: src.impactDescription,
      severityNote,
    };
  });

  if (maxRiskScore >= 90) highestAlert = 'critical';
  else if (maxRiskScore >= 75) highestAlert = 'warning';
  else if (maxRiskScore >= 60) highestAlert = 'watch';
  else highestAlert = 'normal';

  const recommendedActions = [
    `🔔 กด "ติดตามรับแจ้งเตือนเขื่อนที่เกี่ยวข้อง" เข้า LINE เพื่อรับข่าวสารอัตโนมัติเมื่อเขื่อนปรับระบายน้ำ`,
    `🌊 สังเกตการเพิ่มขึ้นของระดับน้ำในลำน้ำสายหลัก ${matchedRule.basin}`,
    `📦 ชุมชนริมน้ำและพื้นที่ลุ่มต่ำเตรียมยกสิ่งของมีค่าขึ้นที่สูงหากเขื่อนปรับระบายน้ำเกินเกณฑ์`,
  ];

  return {
    query,
    matchedName: matchedRule.matchedName,
    province: matchedRule.province,
    basin: matchedRule.basin,
    overallThreatLevel: highestAlert,
    headline: matchedRule.headline,
    explanation: matchedRule.explanation,
    impactingSources: enrichedSources,
    localTelemeteringSensors: matchedRule.localSensorIds,
    recommendedActions,
  };
}

function synthesizeGenericReport(
  query: string,
  matchedStation: HydrologicalStation,
  allStations: HydrologicalStation[]
): LocationImpactReport {
  const nearbyDams = allStations
    .filter((s) => s.type === 'dam' && (s.basin === matchedStation.basin || s.province === matchedStation.province))
    .slice(0, 3);

  const sources: ImpactingWaterSource[] = (nearbyDams.length > 0 ? nearbyDams : [allStations[0]]).map((d) => ({
    stationId: d.id,
    stationName: d.name,
    stationType: d.type,
    role: 'primary',
    riverRoute: `ลุ่มน้ำ${d.basin}`,
    waterTravelTimeHours: '12 - 24 ชั่วโมง',
    impactDescription: `การบริหารจัดการน้ำของ ${d.name} ส่งผลต่อสมดุลน้ำใน${matchedStation.province}`,
    severityNote: `สถานะปัจจุบัน: ${d.telemetry.storagePercent}% (${d.risk.alertLevel})`,
  }));

  return {
    query,
    matchedName: `พื้นที่ จ.${matchedStation.province} (${matchedStation.basin})`,
    province: matchedStation.province,
    basin: matchedStation.basin,
    overallThreatLevel: matchedStation.risk.alertLevel,
    headline: `วิเคราะห์พื้นที่เชื่อมโยงใน ${matchedStation.basin}`,
    explanation: `พื้นที่ "${query}" ตั้งอยู่ใน ${matchedStation.basin} มีความสัมพันธ์โดยตรงกับสถานีตรวจวัดและเขื่อนหลักในลุ่มน้ำเดียวกัน`,
    impactingSources: sources,
    localTelemeteringSensors: [matchedStation.id],
    recommendedActions: [
      `🔔 ตรวจสอบสถานะการระบายน้ำของ ${sources.map((s) => s.stationName).join(', ')} อย่างใกล้ชิด`,
      `📱 เปิดการแจ้งเตือน LINE เพื่อรับรายงานการเปลี่ยนแปลงระดับน้ำ`,
    ],
  };
}
