import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  QrCode, 
  Smartphone, 
  Send,
  ExternalLink,
  Globe,
  Image as ImageIcon,
  Download
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  appUrl: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  appUrl,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  // Clean URL without query params
  const cleanUrl = appUrl.split('?')[0];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(cleanUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Thai HydroWatch (ส่องน้ำ) - ระบบเตือนภัยและติดตามระดับน้ำอัจฉริยะ',
          text: 'เช็คระดับน้ำในเขื่อน อ่างเก็บน้ำ ลำคลอง แบบเรียลไทม์ พร้อมสถิติมหาอุทกภัยปี 2554',
          url: cleanUrl,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadCover = () => {
    setDownloading(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 630;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, 1200, 630);
        try {
          const pngUrl = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = pngUrl;
          a.download = 'thai-hydrowatch-cover.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } catch {
          // Fallback to direct svg download
          const a = document.createElement('a');
          a.href = '/og-cover.svg';
          a.download = 'thai-hydrowatch-cover.svg';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      }
      setDownloading(false);
    };
    img.onerror = () => {
      // Fallback direct link
      const a = document.createElement('a');
      a.href = '/og-cover.svg';
      a.download = 'thai-hydrowatch-cover.svg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setDownloading(false);
    };
    img.src = '/og-cover.svg';
  };

  const shareText = encodeURIComponent('ระบบตรวจเช็คปริมาณน้ำและเตือนภัยน้ำท่วมเรียลไทม์ Thai HydroWatch (ส่องน้ำ) พร้อมเปรียบเทียบสถิติน้ำท่วมปี 2554');
  const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(cleanUrl)}&text=${shareText}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(cleanUrl)}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(cleanUrl)}&text=${shareText}`;

  // QR Code generator URL with clean light theme
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(cleanUrl)}&bgcolor=ffffff&color=1d1d1f&margin=2`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div 
        className="relative w-full max-w-xl bg-white border border-slate-200/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-[#1d1d1f]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0071e3]/10 border border-[#0071e3]/20 flex items-center justify-center text-[#0071e3]">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#1d1d1f] tracking-tight">
                ลิงก์เว็บไซต์ & รูปปกสำหรับแนะนำ
              </h2>
              <p className="text-xs text-[#86868b]">แชร์สู่สาธารณะ หรือดาวน์โหลดภาพปกนำไปโพสต์ Facebook</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Copy URL Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1d1d1f] flex items-center justify-between">
              <span>URL เว็บไซต์สาธารณะของคุณ:</span>
              {copied && (
                <span className="text-emerald-700 text-[11px] font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" /> คัดลอกสำเร็จแล้ว
                </span>
              )}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={cleanUrl}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-mono select-all focus:outline-none focus:border-[#0071e3]"
              />
              <button
                onClick={handleCopyLink}
                className="px-3.5 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-lg text-xs font-medium shadow-sm flex items-center gap-1.5 transition-colors shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอกลิงก์'}</span>
              </button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-700 block">แชร์ต่อไปยังช่องทางโซเชียล:</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <a
                href={lineShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-[#06C755] hover:bg-[#05b34c] text-white text-xs font-medium rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" /> ส่งใน LINE
              </a>

              <a
                href={facebookShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-medium rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" /> แชร์ Facebook
              </a>

              <a
                href={twitterShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-black hover:bg-slate-800 text-white text-xs font-medium rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" /> โพสต์บน X
              </a>
            </div>

            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="w-full mt-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5 text-[#0071e3]" /> เมนูแชร์มาตรฐานบนอุปกรณ์
              </button>
            )}
          </div>

          {/* Visual Cover Banner Section */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#1d1d1f] flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#0071e3]" />
                รูปปกแนะนำเว็บไซต์ (สำหรับแนบโพสต์ Facebook / IG / LINE)
              </span>
              <button
                onClick={handleDownloadCover}
                disabled={downloading}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-[#0071e3] border border-[#0071e3]/30 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>{downloading ? 'กำลังบันทึก...' : 'ดาวน์โหลดรูปปก'}</span>
              </button>
            </div>

            {/* Thumbnail Preview */}
            <div className="relative rounded-lg overflow-hidden border border-slate-200 shadow-xs group bg-[#021B35]">
              <img
                src="/og-cover.svg"
                alt="รูปปกแนะนำเว็บไซต์ Thai HydroWatch"
                className="w-full aspect-[16/9] object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={handleDownloadCover}
                  className="px-3 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg"
                >
                  <Download className="w-3.5 h-3.5" /> บันทึกรูปภาพนี้
                </button>
                <a
                  href="/og-cover.svg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-slate-900/80 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> ดูภาพเต็ม
                </a>
              </div>
            </div>
            <p className="text-[11px] text-[#86868b] leading-relaxed">
              💡 <b>ทริคแนะนำ:</b> เวลาโพสต์ Facebook หากแนบรูปปกนี้คู่กับแคปชั่น จะช่วยเพิ่มยอดคนคลิกเข้าชมเว็บได้สูงขึ้นอย่างมากครับ!
            </p>
          </div>

          {/* QR Code for Phone Scan */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="p-2.5 bg-white border border-slate-200/80 rounded-xl shadow-xs shrink-0">
              <img
                src={qrCodeUrl}
                alt="QR Code สำหรับสแกนเข้าแอปบนมือถือ"
                className="w-24 h-24 rounded-lg object-contain"
              />
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-[#1d1d1f] flex items-center justify-center sm:justify-start gap-1.5">
                <QrCode className="w-4 h-4 text-[#0071e3]" />
                สแกนเปิดบนสมาร์ทโฟน
              </div>
              <p className="text-[11px] text-[#86868b] leading-relaxed">
                เปิดกล้องมือถือแล้วส่อง QR Code ด้านข้างเพื่อเข้าสู่หน้าเว็บได้ทันที หรือแชร์ภาพ QR นี้ให้เพื่อนสแกน
              </p>
            </div>
          </div>

          {/* How to add to home screen */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5 text-slate-700">
            <div className="font-semibold text-[#1d1d1f] flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-[#0071e3]" /> วิธีติดตั้งเป็นเว็บแอปบนหน้าจอมือถือ (PWA):
            </div>
            <ul className="space-y-1 text-[11px] text-[#86868b] pl-1 list-disc list-inside">
              <li>
                <b className="text-slate-800">iPhone / iPad (Safari):</b> กดปุ่ม <b>แชร์ (⎋)</b> ➔ เลือก <b>&quot;เพิ่มไปยังหน้าจอโฮม&quot; (Add to Home Screen)</b>
              </li>
              <li>
                <b className="text-slate-800">Android (Chrome):</b> กดปุ่ม <b>เมนู (⋮)</b> ➔ เลือก <b>&quot;ติดตั้งแอป&quot; หรือ &quot;เพิ่มลงในหน้าจอหลัก&quot;</b>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-100 bg-white flex items-center justify-between">
          <a
            href={cleanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#0071e3] hover:underline flex items-center gap-1"
          >
            <ExternalLink className="w-3.5 h-3.5" /> เปิดในแท็บใหม่
          </a>

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
