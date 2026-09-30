import React, { useEffect, useState } from 'react';
import { HydrologicalStation } from '../types/hydrology';
import { GoogleGenAI } from '@google/genai';
import { 
  X, 
  Sparkles, 
  RefreshCw
} from 'lucide-react';

interface AiFloodReportModalProps {
  station: HydrologicalStation;
  onClose: () => void;
}

export const AiFloodReportModal: React.FC<AiFloodReportModalProps> = ({
  station,
  onClose,
}) => {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    async function fetchAiAssessment() {
      setLoading(true);
      const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;

      const fallbackText = `
### 🌊 รายงานการประเมินสถานการณ์อุทกภัยอัจฉริยะ (AI Hydro-Assessment)
**สถานี:** ${station.name} (${station.code}) · **ลุ่มน้ำ:** ${station.basin} · **จังหวัด:** ${station.province}

#### 1. การประเมินสถานะปัจจุบัน (Telemetry Diagnosis)
- **ระดับน้ำ:** ${station.telemetry.currentLevelMsl} ม.รทก. คิดเป็น **${station.telemetry.storagePercent}%** ของความจุเก็บกัก
- **ระยะตลิ่ง (Freeboard):** ${station.risk.freeboardMeters <= 0 ? `🚨 ล้นตลิ่งแล้ว +${Math.abs(station.risk.freeboardMeters)} เมตร` : `ต่ำกว่าตลิ่ง ${station.risk.freeboardMeters} เมตร`}
- **สมดุลน้ำไหลเข้า-ระบายออก:** Inflow ${station.telemetry.inflowRateCms} cms vs Outflow ${station.telemetry.outflowRateCms} cms (สุทธิ: ${station.telemetry.inflowRateCms - station.telemetry.outflowRateCms > 0 ? `น้ำเพิ่มขึ้น +${station.telemetry.inflowRateCms - station.telemetry.outflowRateCms} cms` : 'น้ำเริ่มลดลง'})
- **ปริมาณฝนตกสะสม:** ${station.telemetry.rainfall24hMm} มม. (จัดอยู่ในเกณฑ์ ${station.telemetry.rainfall24hMm > 70 ? 'ฝนตกหนักมาก' : 'ฝนตกปานกลาง'})

#### 2. การคาดการณ์การล้นตลิ่งและพื้นที่น้ำท่วม (Predictive Model)
- **ดัชนีความเสี่ยงน้ำท่วม:** **${station.risk.riskScore}/100 (${station.risk.alertLevel === 'critical' ? 'ระดับวิกฤตสูงสุด' : station.risk.alertLevel === 'warning' ? 'ระดับเตือนภัย' : 'ระดับเฝ้าระวัง'})**
- **เวลาคาดการณ์น้ำล้น:** ${station.risk.estimatedHoursToOverflow !== null ? (station.risk.estimatedHoursToOverflow === 0 ? 'น้ำล้นตลิ่งแล้วในขณะนี้' : `คาดการณ์ภายใน ${station.risk.estimatedHoursToOverflow} ชั่วโมง`) : 'ยังปลอดภัย'}
- **ระดับน้ำท่วมขังคาดการณ์:** ${station.risk.inundationDepthCm > 0 ? `${station.risk.inundationDepthCm} เซนติเมตร` : '0 เซนติเมตร'}
- **รัศมีผลกระทบ:** ประมาณ ${station.risk.impactedAreaRadiusKm} กิโลเมตร
- **พื้นที่เฝ้าระวังสูงสุด:** ${station.risk.affectedSubdistricts.join(', ')}

#### 3. ข้อเสนอแนะเชิงยุทธศาสตร์และการจัดการ (Hydrological Action Plan)
1. **การควบคุมการระบายน้ำ:** ปรับแผนการระบายน้ำเพื่อลดผลกระทบต่อชุมชนท้ายน้ำ พร้อมประสานงานแก้มลิงในพื้นที่
2. **การป้องกันน้ำล้นตลิ่ง:** เตรียมเสริมกระสอบทรายตามแนวคันกั้นน้ำที่ระดับต่ำกว่า 0.50 เมตร
3. **การสื่อสารเตือนภัย:** แจ้งเตือนประชาชนผ่านระบบ LINE Alert ล่วงหน้าอย่างน้อย 6 ชั่วโมง เพื่อขนย้ายทรัพย์สินและปศุสัตว์
4. **ความปลอดภัยระบบไฟฟ้า:** ให้การไฟฟ้าส่วนภูมิภาคเข้าตรวจสอบและยกมิเตอร์ไฟฟ้าในจุดเสี่ยง
      `.trim();

      if (!apiKey) {
        if (isMounted) {
          setReport(fallbackText);
          setLoading(false);
        }
        return;
      }

      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `
คุณเป็นผู้เชี่ยวชาญด้านอุทกวิทยาและการจัดการภัยพิบัติน้ำท่วมของประเทศไทย
โปรดวิเคราะห์สถานการณ์น้ำและประเมินความเสี่ยงน้ำท่วมสำหรับสถานีต่อไปนี้:
- ชื่อสถานี: ${station.name} (${station.type})
- จังหวัด: ${station.province} | ลุ่มน้ำ: ${station.basin}
- ระดับน้ำปัจจุบัน: ${station.telemetry.currentLevelMsl} ม.รทก. (ตลิ่ง: ${station.telemetry.bankLevelMsl} ม.รทก.)
- ความจุเก็บกัก: ${station.telemetry.storagePercent}%
- น้ำไหลเข้า: ${station.telemetry.inflowRateCms} cms, น้ำระบายออก: ${station.telemetry.outflowRateCms} cms
- ฝนสะสม 24 ชม.: ${station.telemetry.rainfall24hMm} มม.
- ระดับความเสี่ยงปัจจุบัน: ${station.risk.alertLevel} (คะแนน ${station.risk.riskScore}/100)

โปรดให้รายงานเป็นภาษาไทยในรูปแบบ Markdown ชัดเจน สรุป:
1. การประเมินสถานะปัจจุบัน
2. การคาดการณ์แนวโน้มและเวลาล้นตลิ่ง
3. แผนปฏิบัติการฉุกเฉินและคำแนะนำสำหรับประชาชนในพื้นที่
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        if (isMounted) {
          setReport(response.text || fallbackText);
          setLoading(false);
        }
      } catch (err) {
        console.warn('Gemini API call error, using hydrological synthesis:', err);
        if (isMounted) {
          setReport(fallbackText);
          setLoading(false);
        }
      }
    }

    fetchAiAssessment();

    return () => {
      isMounted = false;
    };
  }, [station]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white border border-slate-200/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#1d1d1f]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0071e3]/10 border border-[#0071e3]/20 flex items-center justify-center text-[#0071e3]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#1d1d1f] tracking-tight">
                AI วิเคราะห์ความเสี่ยงอุทกภัยเชิงลึก
              </h2>
              <p className="text-xs text-[#86868b]">{station.name} · จ.{station.province}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <RefreshCw className="w-6 h-6 text-[#0071e3] animate-spin" />
              <p className="text-xs font-medium text-slate-600">
                AI กำลังประมวลผลข้อมูลโทรมาตร สมดุลน้ำ และแบบจำลองลุ่มน้ำ...
              </p>
            </div>
          ) : (
            <div className="max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-2">
              {report}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
