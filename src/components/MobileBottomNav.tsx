import React from 'react';
import { ActiveTab } from './Navbar';
import { DamIcon } from './icons/DamIcon';
import { 
  Map, 
  Droplet, 
  Waves, 
  Sliders,
  Video
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenCctv?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenCctv,
}) => {
  return (
    <div className="md:hidden fixed bottom-3 left-3 right-3 z-40 pointer-events-none">
      <nav className="pointer-events-auto bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-2xl p-1.5 flex items-center justify-around shadow-lg shadow-slate-900/10 text-slate-500">
        {/* Map Tab */}
        <button
          onClick={() => onSelectTab('map')}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl flex-1 transition-all ${
            activeTab === 'map'
              ? 'bg-[#0071e3]/10 text-[#0071e3] font-bold shadow-xs'
              : 'hover:text-slate-900'
          }`}
        >
          <Map className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">แผนที่</span>
        </button>

        {/* Dams & Reservoirs Tab */}
        <button
          onClick={() => onSelectTab('dams')}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl flex-1 transition-all ${
            activeTab === 'dams'
              ? 'bg-[#0071e3]/10 text-[#0071e3] font-bold shadow-xs'
              : 'hover:text-slate-900'
          }`}
        >
          <DamIcon className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">เขื่อน/อ่าง</span>
        </button>

        {/* Canals Tab */}
        <button
          onClick={() => onSelectTab('canals')}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl flex-1 transition-all ${
            activeTab === 'canals'
              ? 'bg-[#0071e3]/10 text-[#0071e3] font-bold shadow-xs'
              : 'hover:text-slate-900'
          }`}
        >
          <Waves className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">คลอง/แม่น้ำ</span>
        </button>

        {/* Live CCTV Launcher Button */}
        {onOpenCctv && (
          <button
            onClick={onOpenCctv}
            className="flex flex-col items-center justify-center py-1.5 px-2 rounded-xl flex-1 text-rose-600 hover:text-rose-700 transition-all cursor-pointer relative"
          >
            <div className="relative">
              <span className="animate-ping absolute -top-1 -right-1 h-2 w-2 rounded-full bg-rose-400 opacity-75"></span>
              <Video className="w-4 h-4 mb-0.5" />
            </div>
            <span className="text-[10px] font-bold text-rose-600">กล้องสด</span>
          </button>
        )}

        {/* Simulator Tab */}
        <button
          onClick={() => onSelectTab('simulator')}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl flex-1 transition-all ${
            activeTab === 'simulator'
              ? 'bg-[#0071e3]/10 text-[#0071e3] font-bold shadow-xs'
              : 'hover:text-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">จำลอง</span>
        </button>
      </nav>
    </div>
  );
};
