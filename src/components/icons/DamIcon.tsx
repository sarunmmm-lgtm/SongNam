import React from 'react';

interface DamIconProps {
  className?: string;
  size?: number;
  variant?: 'outline' | 'filled' | 'badge';
}

/**
 * ไอคอนเขื่อนกักเก็บน้ำ (Hydrological Dam Icon)
 * ออกแบบตามสัญลักษณ์สากลทางชลศาสตร์และวิศวกรรมเขื่อน:
 * ประกอบด้วย สันเขื่อน (Dam Crest), ตัวเขื่อนคอนกรีต/ดิน (Dam Body),
 * ช่องระบายน้ำล้นสปิลเวย์ (Spillway Gates), และมวลน้ำระบายสู่ท้ายน้ำ (Tailrace River Flow)
 */
export const DamIcon: React.FC<DamIconProps> = ({ 
  className = 'w-4 h-4', 
  size,
  variant = 'outline'
}) => {
  const style = size ? { width: size, height: size } : undefined;

  if (variant === 'filled' || variant === 'badge') {
    return (
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={style}
      >
        {/* สันเขื่อน (Crest Bridge / Roadway) */}
        <rect x="2" y="4.5" width="20" height="2.8" rx="0.6" fill="currentColor" />
        
        {/* ตัวเขื่อนทรงลาดเอียง (Trapezoidal Dam Wall) */}
        <path d="M3.2 8H20.8L18.5 17.2H5.5L3.2 8Z" fill="currentColor" fillOpacity="0.88" />
        
        {/* ช่องประตูระบายน้ำล้น (Spillway Sluice Gates) */}
        <rect x="7" y="8" width="2.2" height="4.5" rx="0.4" fill="white" fillOpacity="0.45" />
        <rect x="10.9" y="8" width="2.2" height="4.5" rx="0.4" fill="white" fillOpacity="0.45" />
        <rect x="14.8" y="8" width="2.2" height="4.5" rx="0.4" fill="white" fillOpacity="0.45" />
        
        {/* สายน้ำระบายลงสู่ท้ายน้ำ (Cascading Water Streams) */}
        <path d="M8.1 12.5V17M12 12.5V17.2M15.9 12.5V17" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
        
        {/* ระลอกคลื่นท้ายเขื่อน (Tailwater Discharge Flow) */}
        <path d="M2.5 20.2C4.5 19.2 6.5 21.2 8.5 20.2C10.5 19.2 12.5 21.2 14.5 20.2C16.5 19.2 18.5 21.2 21.5 20.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.8" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      style={style}
    >
      {/* สันเขื่อนและราวสะพานบนสันเขื่อน */}
      <path d="M2 5.5h20" />
      <path d="M3 3.8h18" strokeWidth="1" strokeDasharray="1.5 2" />
      <path d="M3 5.5v1.8" />
      <path d="M21 5.5v1.8" />

      {/* โครงสร้างตัวเขื่อนทรงเทลาด (Dam Face Wall) */}
      <path d="M3.2 7.3h17.6l-2.2 10.2H5.4L3.2 7.3z" fill="currentColor" fillOpacity="0.12" />

      {/* เสาแบ่งช่องระบายน้ำสปิลเวย์ (Spillway Piers) */}
      <path d="M8 7.3v6" />
      <path d="M12 7.3v6.5" />
      <path d="M16 7.3v6" />

      {/* ลำน้ำพุ่งระบายน้ำ (Water Cascades) */}
      <path d="M10 13.5v3.8" strokeDasharray="1 1.5" strokeWidth="1.2" />
      <path d="M14 13.5v3.8" strokeDasharray="1 1.5" strokeWidth="1.2" />

      {/* แม่น้ำท้ายเขื่อน (Downstream River Flow) */}
      <path d="M2 20.5c2.5-1 4.5 1 7.5 0s5-1 7.5 0 3.5 0.5 5-0.5" />
    </svg>
  );
};

/**
 * SVG String สำหรับใช้ใน Leaflet `L.divIcon` marker HTML
 */
export const DAM_PIN_SVG_HTML = `
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
    <!-- สันเขื่อน -->
    <rect x="2" y="4.5" width="20" height="2.8" rx="0.6" fill="currentColor" />
    <!-- ตัวเขื่อน -->
    <path d="M3.2 8H20.8L18.5 17.2H5.5L3.2 8Z" fill="currentColor" fill-opacity="0.9" />
    <!-- ช่องระบายน้ำสปิลเวย์ -->
    <rect x="7" y="8" width="2.2" height="4.5" rx="0.4" fill="white" fill-opacity="0.5" />
    <rect x="10.9" y="8" width="2.2" height="4.5" rx="0.4" fill="white" fill-opacity="0.5" />
    <rect x="14.8" y="8" width="2.2" height="4.5" rx="0.4" fill="white" fill-opacity="0.5" />
    <!-- สายน้ำพุ่งระบาย -->
    <path d="M8.1 12.5V17M12 12.5V17.2M15.9 12.5V17" stroke="white" stroke-width="1.3" stroke-linecap="round" />
    <!-- ผิวน้ำท้ายเขื่อน -->
    <path d="M2.5 20.2C4.5 19.2 6.5 21.2 8.5 20.2C10.5 19.2 12.5 21.2 14.5 20.2C16.5 19.2 18.5 21.2 21.5 20.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
  </svg>
`;

/**
 * SVG String ขนาดเล็กสำหรับ Tooltip หรือ Badge เล็ก (16x16)
 */
export const DAM_MINI_SVG_HTML = `
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
    <rect x="2" y="4.5" width="20" height="3" rx="0.6" fill="currentColor" />
    <path d="M3.5 8H20.5L18.5 17H5.5L3.5 8Z" fill="currentColor" fill-opacity="0.9" />
    <rect x="7.5" y="8" width="2.5" height="4.5" fill="white" fill-opacity="0.6" />
    <rect x="14" y="8" width="2.5" height="4.5" fill="white" fill-opacity="0.6" />
    <path d="M2 20.5C5 19.5 7 21.5 10 20.5C13 19.5 15 21.5 18 20.5C19.5 20 21 20.5 22 20.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
  </svg>
`;
