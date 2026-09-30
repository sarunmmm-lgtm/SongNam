import React from 'react';
import { ActiveTab } from './Navbar';
import { DamIcon } from './icons/DamIcon';
import { 
  Map, 
  Droplet, 
  Waves, 
  Sliders 
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-black/5 px-1 py-1.5 flex items-center justify-around safe-area-pb shadow-[0_-1px_3px_rgba(0,0,0,0.03)] text-[#86868b]">
      {/* Map Tab */}
      <button
        onClick={() => onSelectTab('map')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg flex-1 transition-colors ${
          activeTab === 'map'
            ? 'text-[#0071e3] font-semibold'
            : 'text-[#86868b] hover:text-[#1d1d1f]'
        }`}
      >
        <Map className="w-4 h-4 mb-0.5" />
        <span className="text-[10px]">แผนที่</span>
      </button>

      {/* Dams & Reservoirs Tab */}
      <button
        onClick={() => onSelectTab('dams')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg flex-1 transition-colors ${
          activeTab === 'dams'
            ? 'text-[#0071e3] font-semibold'
            : 'text-[#86868b] hover:text-[#1d1d1f]'
        }`}
      >
        <DamIcon className="w-4 h-4 mb-0.5" />
        <span className="text-[10px]">เขื่อน/อ่าง</span>
      </button>

      {/* Canals Tab */}
      <button
        onClick={() => onSelectTab('canals')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg flex-1 transition-colors ${
          activeTab === 'canals'
            ? 'text-[#0071e3] font-semibold'
            : 'text-[#86868b] hover:text-[#1d1d1f]'
        }`}
      >
        <Waves className="w-4 h-4 mb-0.5" />
        <span className="text-[10px]">คลอง</span>
      </button>

      {/* Simulator Tab */}
      <button
        onClick={() => onSelectTab('simulator')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg flex-1 transition-colors ${
          activeTab === 'simulator'
            ? 'text-[#0071e3] font-semibold'
            : 'text-[#86868b] hover:text-[#1d1d1f]'
        }`}
      >
        <Sliders className="w-4 h-4 mb-0.5" />
        <span className="text-[10px]">จำลอง</span>
      </button>
    </nav>
  );
};
