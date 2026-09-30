import React, { useState } from 'react';
import { HydrologicalStation } from '../types/hydrology';
import { 
  X, 
  FileText, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  ShieldAlert, 
  Droplet, 
  TrendingUp,
  Clock,
  Layers
} from 'lucide-react';

interface DailyReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  stations: HydrologicalStation[];
}

export const DailyReportExportModal: React.FC<DailyReportExportModalProps> = ({
  isOpen,
  onClose,
  stations,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const now = new Date();
  const dateFormatted = new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'full',
  }).format(now);
  const timeFormatted = new Intl.DateTimeFormat('th-TH', {
    timeStyle: 'medium',
  }).format(now);

  const totalStations = stations.length;
  const criticalStations = stations.filter((s) => s.risk.alertLevel === 'critical');
  const warningStations = stations.filter((s) => s.risk.alertLevel === 'warning');
  const watchStations = stations.filter((s) => s.risk.alertLevel === 'watch');
  const normalStations = stations.filter((s) => s.risk.alertLevel === 'normal');

  const dams = stations.filter((s) => s.type === 'dam' || s.type === 'reservoir');
  const avgDamStorage = dams.length > 0 
    ? (dams.reduce((acc, d) => acc + d.telemetry.storagePercent, 0) / dams.length).toFixed(1)
    : '0';

  const totalInflow = dams.reduce((acc, d) => acc + d.telemetry.inflowRateCms, 0);
  const totalOutflow = dams.reduce((acc, d) => acc + d.telemetry.outflowRateCms, 0);

  // Highest risk stations
  const topCritical = [...stations]
    .sort((a, b) => b.risk.riskScore - a.risk.riskScore)
    .slice(0, 5);

  // Generate CSV Content with UTF-8 BOM
  const handleDownloadCsv = () => {
    const headers = [
      'รหัสสถานี',
      'ชื่อสถานี',
      'ประเภท',
      'ลุ่มน้ำ',
      'จังหวัด',
      'อำเภอ',
      'ตำบล',
      'ระดับน้ำปัจจุบัน(ม.รทก.)',
      'ระดับตลิ่ง(ม.รทก.)',
      'ปริมาตรน้ำ(%)',
      'น้ำไหลเข้า(ลบ.ม./วินาที)',
      'น้ำระบายออก(ลบ.ม./วินาที)',
      'ฝนสะสม24ชม.(มม.)',
      'ระดับความเสี่ยง',
      'คะแนนความเสี่ยง(100)',
      'คาดการณ์น้ำท่วม(ซม.)',
    ];

    const rows = stations.map((s) => [
      `"${s.code}"`,
      `"${s.name}"`,
      `"${s.type === 'dam' ? 'เขื่อน' : s.type === 'canal' ? 'คลอง' : s.type === 'river_station' ? 'สถานีแม่น้ำ' : 'อ่างเก็บน้ำ'}"`,
      `"${s.basin}"`,
      `"${s.province}"`,
      `"${s.district}"`,
      `"${s.subdistrict}"`,
      s.telemetry.currentLevelMsl,
      s.telemetry.bankLevelMsl,
      s.telemetry.storagePercent,
      s.telemetry.inflowRateCms,
      s.telemetry.outflowRateCms,
      s.telemetry.rainfall24hMm,
      `"${s.risk.alertLevel === 'critical' ? 'วิกฤต' : s.risk.alertLevel === 'warning' ? 'เตือนภัย' : s.risk.alertLevel === 'watch' ? 'เฝ้าระวัง' : 'ปกติ'}"`,
      s.risk.riskScore,
      s.risk.inundationDepthCm,
    ]);

    const csvString = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `รายงานสถานการณ์น้ำ_${now.toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const summaryText = `
📊 รายงานสรุปสถานการณ์น้ำและอุทกภัยประจำวัน - ส่องน้ำ (SongNam)
ประจำวันที่ ${dateFormatted} เวลา ${timeFormatted}
----------------------------------------
• จุดตรวจวัดทั้งหมด: ${totalStations} สถานี
• จุดวิกฤต (สีแดง): ${criticalStations.length} แห่ง
• จุดเตือนภัย (สีส้ม): ${warningStations.length} แห่ง
• จุดเฝ้าระวัง (สีเหลือง): ${watchStations.length} แห่ง
• สภาพน้ำปกติ (สีเขียว): ${normalStations.length} แห่ง
• ความจุน้ำในเขื่อนหลักเฉลี่ย: ${avgDamStorage}%
• อัตราน้ำไหลเข้ารวม: ${totalInflow.toLocaleString()} ลบ.ม./วินาที | อัตราการระบายรวม: ${totalOutflow.toLocaleString()} ลบ.ม./วินาที

🚨 สถานีที่มีความเสี่ยงสูงสุด 5 อันดับแรก:
${topCritical.map((s, i) => `${i + 1}. ${s.name} (${s.province}) - ความจุน้ำ ${s.telemetry.storagePercent}% [${s.risk.alertLevel === 'critical' ? 'วิกฤต' : 'เตือนภัย'}]`).join('\n')}

🔗 ตรวจสอบแผนที่สดแบบเรียลไทม์: ${window.location.origin}
  `.trim();

  const handleCopyText = () => {
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div 
        className="relative w-full max-w-3xl bg-white border border-slate-200/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-[#1d1d1f]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0071e3]/10 border border-[#0071e3]/20 flex items-center justify-center text-[#0071e3]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#1d1d1f] tracking-tight">
                ส่งออกรายงานสถานการณ์น้ำประจำวัน
              </h2>
              <p className="text-xs text-[#86868b]">
                รายงานทางการพร้อมพิมพ์ (Printable PDF) และข้อมูลดิบสถิติ (Excel CSV)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-50/80 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#86868b]">
            <Clock className="w-3 h-3" />
            <span>ข้อมูลล่าสุด ณ {timeFormatted}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors font-medium shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอกสรุป'}</span>
            </button>

            <button
              onClick={handleDownloadCsv}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ดาวน์โหลด Excel (CSV)</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>พิมพ์รายงาน / บันทึก PDF</span>
            </button>
          </div>
        </div>

        {/* Printable Official Briefing Sheet */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 print:p-0 print:space-y-3">
          {/* Official Document Frame */}
          <div className="border border-slate-200 rounded-xl p-5 sm:p-6 bg-white shadow-xs space-y-5 print:border-none print:shadow-none">
            {/* Report Title */}
            <div className="text-center border-b border-slate-200 pb-4">
              <span className="text-[11px] font-semibold text-[#0071e3] uppercase tracking-wider">
                ส่องน้ำ · THAI HYDROWATCH INTELLIGENCE
              </span>
              <h1 className="text-lg sm:text-xl font-bold text-[#1d1d1f] mt-0.5">
                รายงานสรุปสถานการณ์น้ำและการประเมินความเสี่ยงอุทกภัยประจำวัน
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                ประจำวันที่ {dateFormatted} (ข้อมูลตรวจวัดโทรมาตร ณ เวลา {timeFormatted})
              </p>
            </div>

            {/* Key Stat Blocks */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                <div className="text-[11px] text-slate-500">จุดตรวจวัดทั้งหมด</div>
                <div className="text-xl font-bold text-slate-900 mt-0.5">{totalStations} สถานี</div>
                <div className="text-[10px] text-slate-500 mt-0.5">ครอบคลุมทุกลุ่มน้ำหลัก</div>
              </div>

              <div className="p-3 rounded-lg bg-rose-50/70 border border-rose-200/80">
                <div className="text-[11px] text-rose-700">จุดวิกฤต (Critical)</div>
                <div className="text-xl font-bold text-rose-700 mt-0.5">{criticalStations.length} แห่ง</div>
                <div className="text-[10px] text-rose-600 mt-0.5">เสี่ยงน้ำล้นตลิ่ง/เต็มความจุ</div>
              </div>

              <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200/80">
                <div className="text-[11px] text-amber-800">จุดเตือนภัย (Warning)</div>
                <div className="text-xl font-bold text-amber-800 mt-0.5">{warningStations.length} แห่ง</div>
                <div className="text-[10px] text-amber-700 mt-0.5">ระดับน้ำ 80-89%</div>
              </div>

              <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200/80">
                <div className="text-[11px] text-blue-700">ความจุเขื่อนเฉลี่ย</div>
                <div className="text-xl font-bold text-blue-900 mt-0.5">{avgDamStorage}%</div>
                <div className="text-[10px] text-blue-600 mt-0.5">ระบายรวม {totalOutflow.toLocaleString()} cms</div>
              </div>
            </div>

            {/* Top Critical Stations Table */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> สถานีที่มีความเสี่ยงสูงสุด (Top 5 Vulnerable Stations)
              </h3>

              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="p-2 sm:p-2.5">สถานี</th>
                      <th className="p-2 sm:p-2.5">จังหวัด/ลุ่มน้ำ</th>
                      <th className="p-2 sm:p-2.5 text-right">ความจุ</th>
                      <th className="p-2 sm:p-2.5 text-right">ระยะตลิ่ง</th>
                      <th className="p-2 sm:p-2.5 text-right">ระบายน้ำ</th>
                      <th className="p-2 sm:p-2.5 text-center">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {topCritical.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50/60">
                        <td className="p-2 sm:p-2.5 font-medium text-slate-900">
                          {st.name}
                        </td>
                        <td className="p-2 sm:p-2.5 text-slate-600">
                          {st.province} · {st.basin}
                        </td>
                        <td className="p-2 sm:p-2.5 text-right font-bold text-slate-800">
                          {st.telemetry.storagePercent}%
                        </td>
                        <td className="p-2 sm:p-2.5 text-right">
                          {st.risk.freeboardMeters <= 0 ? (
                            <span className="text-rose-600 font-bold">ล้นตลิ่ง +{Math.abs(st.risk.freeboardMeters)} ม.</span>
                          ) : (
                            <span className="text-slate-600">ต่ำกว่า {st.risk.freeboardMeters} ม.</span>
                          )}
                        </td>
                        <td className="p-2 sm:p-2.5 text-right font-mono text-slate-700">
                          {st.telemetry.outflowRateCms.toLocaleString()} cms
                        </td>
                        <td className="p-2 sm:p-2.5 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            st.risk.alertLevel === 'critical'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {st.risk.alertLevel === 'critical' ? 'วิกฤต' : 'เตือนภัย'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Strategic Action Checklist */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="font-bold text-slate-900">ข้อสั่งการและคำแนะนำสำหรับพื้นที่เฝ้าระวัง:</div>
              <ol className="list-decimal pl-4 space-y-1 text-slate-600 text-[11px] leading-relaxed">
                <li>พื้นที่ท้ายเขื่อนป่าสักชลสิทธิ์และลุ่มน้ำเจ้าพระยาตอนล่าง ให้ติดตามการระบายน้ำอย่างใกล้ชิด</li>
                <li>ชุมชนริมคลองในเขตกรุงเทพมหานครและปริมณฑล เตรียมยกของขึ้นที่สูงในช่วงที่น้ำทะเลหนุนสูงรอบค่ำ</li>
                <li>ให้องค์กรปกครองส่วนท้องถิ่นตรวจสอบเครื่องสูบน้ำและกระสอบทรายตามแนวฟันหลอให้พร้อมใช้งาน 24 ชั่วโมง</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-100 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
