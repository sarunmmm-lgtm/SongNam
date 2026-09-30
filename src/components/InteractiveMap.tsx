import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { AlertLevel, HydrologicalStation, StationType } from '../types/hydrology';
import { DamIcon, DAM_PIN_SVG_HTML, DAM_MINI_SVG_HTML } from './icons/DamIcon';
import { 
  Compass, 
  MapPin, 
  Search, 
  ShieldAlert, 
  Navigation, 
  Droplet, 
  Layers,
  CloudRain,
  Waves,
  FileText,
  Sun
} from 'lucide-react';

interface InteractiveMapProps {
  stations: HydrologicalStation[];
  selectedStation: HydrologicalStation | null;
  onSelectStation: (station: HydrologicalStation) => void;
  onOpenLocationSearch?: () => void;
  onOpenMarineTide?: () => void;
  onOpenDailyReport?: () => void;
  onOpenWeather?: () => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  stations,
  selectedStation,
  onSelectStation,
  onOpenLocationSearch,
  onOpenMarineTide,
  onOpenDailyReport,
  onOpenWeather,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const baseLayerRef = useRef<L.TileLayer | null>(null);
  const rainRadarLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const floodZonesLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [mapStyle, setMapStyle] = useState<'street' | 'dark' | 'satellite'>('street');
  const [showFloodZones, setShowFloodZones] = useState<boolean>(true);
  const [showRainRadar, setShowRainRadar] = useState<boolean>(true);
  const [radarPath, setRadarPath] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<StationType | 'all'>('all');
  const [filterAlert, setFilterAlert] = useState<AlertLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [nearestStation, setNearestStation] = useState<HydrologicalStation | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    const container = mapContainerRef.current;
    if ((container as any)._leaflet_id) {
      delete (container as any)._leaflet_id;
    }

    // Center on central Thailand / Chao Phraya basin
    const map = L.map(container, {
      center: [14.8, 100.6],
      zoom: 7,
      minZoom: 5,
      maxZoom: 18,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initial base layer (Standard OpenStreetMap is ultra reliable)
    const baseLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);
    baseLayerRef.current = baseLayer;

    // Layer group for flood inundation polygons
    const floodGroup = L.layerGroup().addTo(map);
    floodZonesLayerRef.current = floodGroup;

    mapRef.current = map;

    // Invalidate size to ensure tiles render immediately
    const timer1 = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    const timer2 = setTimeout(() => {
      map.invalidateSize();
    }, 500);

    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer1);
      clearTimeout(timer2);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Tile Layer on Style Switch
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (baseLayerRef.current) {
      map.removeLayer(baseLayerRef.current);
      baseLayerRef.current = null;
    }

    let url = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attribution = '&copy; OpenStreetMap contributors';
    let subdomains = 'abc';

    if (mapStyle === 'dark') {
      url = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png';
      attribution = '&copy; CartoDB & OpenStreetMap';
      subdomains = 'abcd';
    } else if (mapStyle === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Tiles &copy; Esri';
    }

    const newLayer = L.tileLayer(url, {
      attribution,
      subdomains,
      maxZoom: 18,
    }).addTo(map);

    baseLayerRef.current = newLayer;
  }, [mapStyle]);

  // Fetch latest RainViewer Radar Frame
  useEffect(() => {
    let isMounted = true;
    fetch('https://api.rainviewer.com/public/weather-maps.json')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        const past = data?.radar?.past;
        if (past && past.length > 0) {
          const latest = past[past.length - 1];
          setRadarPath(latest.path || `/v2/radar/${latest.time}`);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        // Fallback to latest standard path
        setRadarPath('/v2/radar/now');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Update Rain Radar Tile Layer
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (rainRadarLayerRef.current) {
      map.removeLayer(rainRadarLayerRef.current);
      rainRadarLayerRef.current = null;
    }

    if (showRainRadar && radarPath) {
      const radarLayer = L.tileLayer(
        `https://tilecache.rainviewer.com${radarPath}/256/{z}/{x}/{y}/2/1_1.png`,
        {
          opacity: 0.65,
          zIndex: 15,
          maxNativeZoom: 7,
          maxZoom: 19,
          tileSize: 256,
        }
      ).addTo(map);
      rainRadarLayerRef.current = radarLayer;
    }
  }, [showRainRadar, radarPath]);

  // Update Flood Inundation Polygons
  useEffect(() => {
    if (!mapRef.current || !floodZonesLayerRef.current) return;
    const floodGroup = floodZonesLayerRef.current;
    floodGroup.clearLayers();

    if (!showFloodZones) return;

    stations.forEach((st) => {
      if (st.risk.alertLevel === 'critical' || st.risk.alertLevel === 'warning') {
        const radiusMeters = st.risk.impactedAreaRadiusKm * 1000;
        const color = st.risk.alertLevel === 'critical' ? '#ef4444' : '#f97316';
        const fillOpacity = st.risk.alertLevel === 'critical' ? 0.35 : 0.2;

        const circle = L.circle([st.lat, st.lng], {
          radius: radiusMeters,
          color,
          weight: 2,
          opacity: 0.8,
          fillColor: color,
          fillOpacity,
          dashArray: '4, 4',
        });

        circle.bindTooltip(
          `<div class="p-1 text-xs">
            <div class="font-bold text-red-300">⚠️ พื้นที่เสี่ยงน้ำท่วม: ${st.name}</div>
            <div>รัศมี: ${st.risk.impactedAreaRadiusKm} กม.</div>
            ${st.risk.inundationDepthCm > 0 ? `<div>ระดับน้ำคาดการณ์: <b>${st.risk.inundationDepthCm} ซม.</b></div>` : ''}
          </div>`,
          { sticky: true }
        );

        floodGroup.addLayer(circle);
      }
    });
  }, [stations, showFloodZones]);

  // Update Markers
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // Filter stations
    const filtered = stations.filter((s) => {
      const matchType = filterType === 'all' || s.type === filterType;
      const matchAlert = filterAlert === 'all' || s.risk.alertLevel === filterAlert;
      const matchSearch =
        searchQuery === '' ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.basin.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchAlert && matchSearch;
    });

    // Clear old markers not in filtered list
    Object.keys(markersRef.current).forEach((id) => {
      if (!filtered.find((s) => s.id === id)) {
        map.removeLayer(markersRef.current[id]);
        delete markersRef.current[id];
      }
    });

    filtered.forEach((st) => {
      const isSelected = selectedStation?.id === st.id;
      const isCritical = st.risk.alertLevel === 'critical';
      const isWarning = st.risk.alertLevel === 'warning';
      const isWatch = st.risk.alertLevel === 'watch';

      const alertColor = isCritical
        ? 'bg-rose-500 border-rose-300 text-white'
        : isWarning
        ? 'bg-amber-500 border-amber-300 text-white'
        : isWatch
        ? 'bg-yellow-400 border-yellow-200 text-slate-900'
        : 'bg-emerald-500 border-emerald-300 text-white';

      const ringEffect = isCritical ? 'radar-pulse-danger' : '';

      // Graduated hierarchy: Dam (Largest) > Reservoir > Canal > River Station
      let pinSizePx = 32;
      let pinClass = 'w-8 h-8 rounded-lg shadow-sm border-[1.5px]';
      let iconClass = 'text-xs';
      let badgeClass = 'text-[8px] -bottom-1.5 -right-1 px-1 py-0.2';
      let zIndexOffset = 500;
      let typeLabel = '〰️ คลอง';

      if (st.type === 'dam') {
        // Dam is largest (46px)
        pinSizePx = 46;
        pinClass = 'w-11 h-11 rounded-2xl shadow-lg border-[2.5px]';
        iconClass = 'text-lg';
        badgeClass = 'text-[10px] -bottom-2 -right-1.5 px-1.5 py-0.5 font-bold';
        zIndexOffset = 1000;
        typeLabel = 'เขื่อนหลัก';
      } else if (st.type === 'reservoir') {
        // Reservoir (38px)
        pinSizePx = 38;
        pinClass = 'w-[38px] h-[38px] rounded-xl shadow-md border-2';
        iconClass = 'text-sm';
        badgeClass = 'text-[9px] -bottom-2 -right-1 px-1 py-0.2 font-semibold';
        zIndexOffset = 700;
        typeLabel = '💧 อ่างเก็บน้ำ';
      } else if (st.type === 'canal') {
        // Canal (32px)
        pinSizePx = 32;
        pinClass = 'w-8 h-8 rounded-lg shadow-sm border-[1.5px]';
        iconClass = 'text-xs';
        badgeClass = 'text-[8px] -bottom-1.5 -right-1 px-1 py-0.2 font-medium';
        zIndexOffset = 500;
        typeLabel = '〰️ ลำคลอง';
      } else {
        // River Station (28px)
        pinSizePx = 28;
        pinClass = 'w-7 h-7 rounded-lg shadow-xs border-[1.5px]';
        iconClass = 'text-[11px]';
        badgeClass = 'text-[8px] -bottom-1.5 -right-1 px-1 py-0.2 font-medium';
        zIndexOffset = 300;
        typeLabel = '🌊 สถานีแม่น้ำ';
      }

      if (isSelected) {
        zIndexOffset += 2000;
      }

      const typeIcon =
        st.type === 'reservoir'
          ? '💧'
          : st.type === 'canal'
          ? '〰️'
          : '🌊';

      const pinContent =
        st.type === 'dam'
          ? `<span class="w-6 h-6 flex items-center justify-center">${DAM_PIN_SVG_HTML}</span>`
          : `<span class="${iconClass}">${typeIcon}</span>`;

      const iconHtml = `
        <div class="relative group cursor-pointer transition-transform duration-200">
          <div class="${pinClass} flex items-center justify-center font-bold transition-all transform hover:scale-125 ${alertColor} ${ringEffect} ${
        isSelected ? 'ring-4 ring-[#0071e3] ring-offset-2 scale-125 shadow-xl' : ''
      }">
            ${pinContent}
          </div>
          <div class="absolute ${badgeClass} bg-[#1d1d1f] text-white font-mono rounded-full border border-white/40 shadow-xs leading-none">
            ${st.telemetry.storagePercent}%
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-station-pin',
        html: iconHtml,
        iconSize: [pinSizePx, pinSizePx],
        iconAnchor: [pinSizePx / 2, pinSizePx / 2],
      });

      if (markersRef.current[st.id]) {
        markersRef.current[st.id].setIcon(customIcon);
        markersRef.current[st.id].setLatLng([st.lat, st.lng]);
        markersRef.current[st.id].setZIndexOffset(zIndexOffset);
      } else {
        const marker = L.marker([st.lat, st.lng], { 
          icon: customIcon,
          zIndexOffset
        }).addTo(map);

        marker.on('click', () => {
          onSelectStation(st);
        });

        // Informative Apple-styled hover tooltip
        marker.bindTooltip(
          `<div class="p-1 font-sans text-xs">
            <div class="font-bold text-slate-900">${st.name}</div>
            <div class="text-[11px] text-slate-500 flex items-center gap-1">
              ${st.type === 'dam' ? DAM_MINI_SVG_HTML : ''} <span>${typeLabel} · จ.${st.province}</span>
            </div>
            <div class="text-[11px] font-semibold mt-0.5 ${isCritical ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-blue-600'}">
              ความจุ: ${st.telemetry.storagePercent}% (${isCritical ? 'ระดับวิกฤต' : isWarning ? 'ระดับเตือนภัย' : 'ระดับปกติ'})
            </div>
          </div>`,
          { direction: 'top', offset: [0, -pinSizePx / 2], opacity: 0.95 }
        );

        markersRef.current[st.id] = marker;
      }
    });
  }, [stations, filterType, filterAlert, searchQuery, selectedStation, onSelectStation]);

  // Center map on selected station
  useEffect(() => {
    if (!mapRef.current || !selectedStation) return;
    mapRef.current.flyTo([selectedStation.lat, selectedStation.lng], 12, {
      duration: 1.2,
    });
  }, [selectedStation]);

  // Geolocation finding nearest water station
  const handleFindMyLocation = () => {
    if (!navigator.geolocation) {
      if (mapRef.current) {
        mapRef.current.flyTo([13.7563, 100.5018], 11);
      }
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        if (mapRef.current) {
          mapRef.current.flyTo([latitude, longitude], 12);

          // Add or move user marker
          if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng([latitude, longitude]);
          } else {
            const userIcon = L.divIcon({
              className: 'user-pin',
              html: `
                <div class="relative flex items-center justify-center">
                  <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-cyan-400 opacity-75"></span>
                  <div class="w-6 h-6 rounded-full bg-cyan-500 border-2 border-white flex items-center justify-center text-xs shadow-lg">
                    📍
                  </div>
                </div>
              `,
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            });
            userMarkerRef.current = L.marker([latitude, longitude], { icon: userIcon }).addTo(mapRef.current);
          }

          // Calculate nearest station
          let minDistance = Infinity;
          let closest: HydrologicalStation | null = null;
          stations.forEach((st) => {
            const dLat = st.lat - latitude;
            const dLng = st.lng - longitude;
            const dist = Math.sqrt(dLat * dLat + dLng * dLng);
            if (dist < minDistance) {
              minDistance = dist;
              closest = st;
            }
          });

          if (closest) {
            setNearestStation(closest);
          }
        }
      },
      () => {
        // Fallback default coordinate (Bangkok City Hall)
        const bkkLat = 13.7563;
        const bkkLng = 100.5018;
        if (mapRef.current) {
          mapRef.current.flyTo([bkkLat, bkkLng], 12);
        }
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="relative w-full h-[600px] md:h-[calc(100vh-140px)] rounded-2xl overflow-hidden border border-slate-200/80 bg-white shadow-sm">
      {/* 1. Underlying Leaflet Map Engine Container (Guaranteed full viewport) */}
      <div 
        ref={mapContainerRef} 
        className="absolute inset-0 w-full h-full z-0" 
        style={{ width: '100%', height: '100%', minHeight: '450px' }}
      />

      {/* 2. Top Filter and Controls Bar Overlay */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-col md:flex-row gap-2 pointer-events-none">
        {/* Search & quick filters */}
        <div className="flex-1 pointer-events-auto flex flex-col sm:flex-row gap-2 bg-white/90 backdrop-blur-md p-2 rounded-xl border border-black/5 shadow-sm">
          {/* Search Box */}
          <div className="relative flex-1 flex items-center gap-1.5">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="ค้นหาเขื่อน คลอง ลุ่มน้ำ หรือจังหวัด..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100/90 border border-slate-200/80 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0071e3]"
              />
            </div>

            {onOpenLocationSearch && (
              <button
                onClick={onOpenLocationSearch}
                className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-[#0071e3] border border-slate-200/80 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
                title="วิเคราะห์ว่าพื้นที่บ้านของคุณได้รับผลกระทบจากเขื่อนไหน"
              >
                <Compass className="w-3.5 h-3.5 text-[#0071e3]" />
                <span className="hidden sm:inline">เช็คผลกระทบ</span>
                <span className="sm:hidden">ผลกระทบ</span>
              </button>
            )}

            {onOpenMarineTide && (
              <button
                onClick={onOpenMarineTide}
                className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-blue-700 border border-slate-200/80 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
                title="ตารางเวลาน้ำทะเลหนุนสูงสุด & ตรวจวัดความเค็มแม่น้ำเจ้าพระยา"
              >
                <Waves className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">น้ำทะเลหนุน</span>
                <span className="sm:hidden">น้ำหนุน</span>
              </button>
            )}

            {onOpenDailyReport && (
              <button
                onClick={onOpenDailyReport}
                className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/80 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
                title="ส่งออกรายงานสถานการณ์น้ำทางการประจำวัน (PDF & Excel CSV)"
              >
                <FileText className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">รายงานสรุป</span>
                <span className="sm:hidden">รายงาน</span>
              </button>
            )}

            {onOpenWeather && (
              <button
                onClick={onOpenWeather}
                className="px-2.5 py-1.5 bg-blue-50/80 hover:bg-blue-100 text-[#0071e3] border border-blue-200/80 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
                title="ดูสภาพอากาศสด ปริมาณฝนสะสม และลมกระโชกแรง"
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">สภาพอากาศ</span>
                <span className="sm:hidden">อากาศ</span>
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 sm:pb-0 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filterType === 'all'
                  ? 'bg-white text-slate-900 shadow-sm border border-black/5 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ทั้งหมด ({stations.length})
            </button>
            <button
              onClick={() => setFilterType('dam')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                filterType === 'dam'
                  ? 'bg-white text-slate-900 shadow-sm border border-black/5 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <DamIcon className="w-3.5 h-3.5 text-[#0071e3]" />
              <span>เขื่อน ({stations.filter((s) => s.type === 'dam').length})</span>
            </button>
            <button
              onClick={() => setFilterType('reservoir')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filterType === 'reservoir'
                  ? 'bg-white text-slate-900 shadow-sm border border-black/5 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              อ่างเก็บน้ำ
            </button>
            <button
              onClick={() => setFilterType('canal')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filterType === 'canal'
                  ? 'bg-white text-slate-900 shadow-sm border border-black/5 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              คลอง
            </button>
            <button
              onClick={() => setFilterType('river_station')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filterType === 'river_station'
                  ? 'bg-white text-slate-900 shadow-sm border border-black/5 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              สถานีแม่น้ำ
            </button>
          </div>
        </div>

        {/* Status Filter */}
        <div className="pointer-events-auto flex items-center gap-1 bg-white/90 backdrop-blur-md p-1.5 rounded-xl border border-black/5 shadow-sm self-start text-xs overflow-x-auto max-w-full">
          <button
            onClick={() => setFilterAlert(filterAlert === 'critical' ? 'all' : 'critical')}
            className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
              filterAlert === 'critical'
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'text-slate-600 hover:text-rose-700 hover:bg-rose-50/50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            วิกฤต ({stations.filter((s) => s.risk.alertLevel === 'critical').length})
          </button>
          <button
            onClick={() => setFilterAlert(filterAlert === 'warning' ? 'all' : 'warning')}
            className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
              filterAlert === 'warning'
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'text-slate-600 hover:text-amber-700 hover:bg-amber-50/50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            เตือนภัย ({stations.filter((s) => s.risk.alertLevel === 'warning').length})
          </button>
          <button
            onClick={() => setFilterAlert(filterAlert === 'watch' ? 'all' : 'watch')}
            className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
              filterAlert === 'watch'
                ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                : 'text-slate-600 hover:text-yellow-800 hover:bg-yellow-50/50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
            เฝ้าระวัง ({stations.filter((s) => s.risk.alertLevel === 'watch').length})
          </button>
        </div>
      </div>

      {/* 3. Floating Action Tools (Right side) */}
      <div className="absolute right-3 top-24 z-20 flex flex-col gap-1.5 pointer-events-auto">
        {/* Find My Location */}
        <button
          onClick={handleFindMyLocation}
          title="ค้นหาตำแหน่งของฉัน เพื่อดูระดับน้ำใกล้ตัว"
          className="p-2.5 bg-white/90 hover:bg-slate-50 text-slate-700 hover:text-[#0071e3] rounded-xl border border-slate-200/80 backdrop-blur-md shadow-sm transition-colors flex items-center justify-center"
        >
          <Navigation className="w-4 h-4 text-[#0071e3]" />
        </button>

        {/* Toggle Rain Radar Layer */}
        <button
          onClick={() => setShowRainRadar(!showRainRadar)}
          title="เปิด/ปิด แผ่นภาพเรดาร์ตรวจจับกลุ่มฝนสด (Live Rain Radar)"
          className={`p-2.5 rounded-xl border backdrop-blur-md shadow-sm transition-colors flex items-center justify-center relative ${
            showRainRadar
              ? 'bg-blue-50 text-[#0071e3] border-blue-300'
              : 'bg-white/90 text-slate-600 border-slate-200/80 hover:text-slate-900'
          }`}
        >
          <CloudRain className="w-4 h-4" />
          {showRainRadar && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#0071e3] border-2 border-white"></span>
          )}
        </button>

        {/* Toggle Flood Zones Layer */}
        <button
          onClick={() => setShowFloodZones(!showFloodZones)}
          title="เปิด/ปิด ชั้นพื้นที่จำลองเสี่ยงน้ำท่วม (Flood Inundation Buffer)"
          className={`p-2.5 rounded-xl border backdrop-blur-md shadow-sm transition-colors flex items-center justify-center ${
            showFloodZones
              ? 'bg-rose-50 text-rose-700 border-rose-300'
              : 'bg-white/90 text-slate-600 border-slate-200/80 hover:text-slate-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
        </button>

        {/* Live Weather Forecast Shortcut */}
        {onOpenWeather && (
          <button
            onClick={onOpenWeather}
            title="ตรวจสภาพอากาศ อุณหภูมิ และปริมาณฝนสะสมทุกลุ่มน้ำ"
            className="p-2.5 rounded-xl border backdrop-blur-md shadow-sm transition-colors flex items-center justify-center bg-blue-50/90 hover:bg-blue-100 text-[#0071e3] border-blue-200"
          >
            <Sun className="w-4 h-4 text-amber-500" />
          </button>
        )}

        {/* Tile Style Switcher */}
        <div className="bg-white/90 border border-slate-200/80 rounded-xl p-1 flex flex-col gap-1 backdrop-blur-md shadow-sm">
          <button
            onClick={() => setMapStyle('street')}
            title="แผนที่ถนนมาตรฐาน (Street Map)"
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              mapStyle === 'street' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            🗺️
          </button>
          <button
            onClick={() => setMapStyle('dark')}
            title="แผนที่ธีมมืด (Dark Mode)"
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              mapStyle === 'dark' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            🌙
          </button>
          <button
            onClick={() => setMapStyle('satellite')}
            title="ภาพถ่ายดาวเทียม (Satellite)"
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              mapStyle === 'satellite' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            🛰️
          </button>
        </div>
      </div>

      {/* Rain Radar Mini Legend */}
      {showRainRadar && (
        <div className="absolute bottom-4 left-4 z-20 pointer-events-auto hidden sm:flex items-center gap-2.5 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-xl px-3 py-1.5 shadow-sm text-[11px] text-slate-600">
          <div className="flex items-center gap-1 font-semibold text-slate-800">
            <CloudRain className="w-3.5 h-3.5 text-[#0071e3]" /> เรดาร์ฝนสด
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2 rounded-xs bg-[#40c057]"></span>
            <span className="text-[10px]">เบา</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2 rounded-xs bg-[#fcc419]"></span>
            <span className="text-[10px]">ปานกลาง</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2 rounded-xs bg-[#f03e3e]"></span>
            <span className="text-[10px]">หนัก</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2 rounded-xs bg-[#7950f2]"></span>
            <span className="text-[10px]">หนักมาก</span>
          </div>
        </div>
      )}

      {/* Pin Size Hierarchy Legend (Bottom Right) */}
      <div className="absolute bottom-4 right-14 z-20 pointer-events-auto hidden md:flex items-center gap-2 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-xl px-3 py-1.5 shadow-xs text-[11px] text-slate-600">
        <span className="text-[10px] text-slate-400 font-medium">ลำดับขนาดหมุด:</span>
        <span className="flex items-center gap-1 font-semibold text-slate-900">
          <span className="text-xs">⛰️</span> เขื่อนใหญ่
        </span>
        <span className="text-slate-300">›</span>
        <span className="flex items-center gap-1 text-slate-700">
          <span className="text-[11px]">💧</span> อ่างเก็บน้ำ
        </span>
        <span className="text-slate-300">›</span>
        <span className="flex items-center gap-1 text-slate-700">
          <span className="text-[10px]">〰️</span> คลอง
        </span>
        <span className="text-slate-300">›</span>
        <span className="flex items-center gap-1 text-slate-700">
          <span className="text-[9px]">🌊</span> แม่น้ำ
        </span>
      </div>

      {/* 4. Nearest Station Banner (if located) */}
      {nearestStation && (
        <div className="absolute top-20 left-4 z-20 pointer-events-auto bg-white/95 border border-[#0071e3]/30 p-3 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-top-2 max-w-sm text-[#1d1d1f]">
          <div className="w-9 h-9 rounded-xl bg-[#0071e3]/10 border border-[#0071e3]/20 flex items-center justify-center text-[#0071e3] shrink-0">
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] text-[#0071e3] font-semibold uppercase tracking-wider">
              สถานีตรวจวัดใกล้คุณที่สุด
            </div>
            <div className="text-sm font-bold text-[#1d1d1f] truncate">{nearestStation.name}</div>
            <div className="text-xs text-[#86868b]">
              ความจุ: <b className="text-slate-900">{nearestStation.telemetry.storagePercent}%</b> | ระดับ: {nearestStation.telemetry.currentLevelMsl} ม.รทก.
            </div>
          </div>
          <button
            onClick={() => onSelectStation(nearestStation)}
            className="px-2.5 py-1.5 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold rounded-xl shadow-xs shrink-0 transition-colors"
          >
            ดูข้อมูล
          </button>
        </div>
      )}

      {/* 5. Selected Station Quick Summary Drawer (Bottom of Map) */}
      {selectedStation && (
        <div className="absolute bottom-4 left-4 right-4 md:left-6 md:right-auto md:w-96 z-20 pointer-events-auto bg-white/95 border border-slate-200/90 rounded-2xl p-4 shadow-xl backdrop-blur-xl text-[#1d1d1f] animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                    selectedStation.risk.alertLevel === 'critical'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : selectedStation.risk.alertLevel === 'warning'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : selectedStation.risk.alertLevel === 'watch'
                      ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {selectedStation.risk.alertLevel === 'critical'
                    ? '🔴 วิกฤตน้ำล้น'
                    : selectedStation.risk.alertLevel === 'warning'
                    ? '🟠 เตือนภัย'
                    : selectedStation.risk.alertLevel === 'watch'
                    ? '🟡 เฝ้าระวัง'
                    : '🟢 สภาวะปกติ'}
                </span>
                <span className="text-xs text-[#86868b]">{selectedStation.province}</span>
              </div>
              <h3 className="text-base font-semibold text-[#1d1d1f] mt-1 leading-snug flex items-center gap-1.5">
                {selectedStation.type === 'dam' && (
                  <DamIcon className="w-4 h-4 text-[#0071e3] shrink-0" />
                )}
                <span>{selectedStation.name}</span>
              </h3>
              <p className="text-xs text-[#86868b]">{selectedStation.basin}</p>
            </div>

            <button
              onClick={() => onSelectStation(null as any)}
              className="text-slate-400 hover:text-slate-700 text-sm p-1 rounded-md"
            >
              ✕
            </button>
          </div>

          {/* Quick Telemetry Grid */}
          <div className="grid grid-cols-3 gap-2 my-3 text-center">
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/60">
              <div className="text-[10px] text-[#86868b]">ระดับน้ำ</div>
              <div className="text-sm font-bold text-[#0071e3]">
                {selectedStation.telemetry.currentLevelMsl} <span className="text-[10px] font-normal text-slate-500">ม.</span>
              </div>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/60">
              <div className="text-[10px] text-[#86868b]">ความจุ</div>
              <div className="text-sm font-bold text-amber-700">
                {selectedStation.telemetry.storagePercent}%
              </div>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/60">
              <div className="text-[10px] text-[#86868b]">เทียบตลิ่ง</div>
              <div
                className={`text-sm font-bold ${
                  selectedStation.risk.freeboardMeters <= 0 ? 'text-rose-600' : 'text-emerald-700'
                }`}
              >
                {selectedStation.risk.freeboardMeters <= 0
                  ? `+${Math.abs(selectedStation.risk.freeboardMeters)}ม.`
                  : `${selectedStation.risk.freeboardMeters}ม.`}
              </div>
            </div>
          </div>

          {/* Quick 2554 benchmark badge if available */}
          {selectedStation.benchmark2554 && (
            <div className="bg-blue-50/70 border border-blue-100 rounded-xl px-2.5 py-1.5 flex items-center justify-between text-[11px] text-[#0071e3]">
              <span className="flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                เทียบน้ำท่วมปี 54 (พีค {selectedStation.benchmark2554.peakStoragePercent}%)
              </span>
              <span className="font-semibold text-slate-700">
                {selectedStation.telemetry.storagePercent < selectedStation.benchmark2554.peakStoragePercent
                  ? `ต่ำกว่า ${(selectedStation.benchmark2554.peakStoragePercent - selectedStation.telemetry.storagePercent).toFixed(1)}%`
                  : `สูงกว่า +${(selectedStation.telemetry.storagePercent - selectedStation.benchmark2554.peakStoragePercent).toFixed(1)}%`}
              </span>
            </div>
          )}

          {/* Buttons */}
          <div className="pt-1">
            <button
              onClick={() => onSelectStation(selectedStation)}
              className="w-full py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <Droplet className="w-3.5 h-3.5" /> รายละเอียดเต็ม
            </button>
          </div>
        </div>
      )}

      {/* 6. Bottom Map Legend */}
      <div className="absolute bottom-2 right-2 z-10 pointer-events-auto bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 shadow-sm hidden sm:flex items-center gap-3">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span> วิกฤต (&gt;90%)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span> เตือนภัย (80-90%)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-yellow-400"></span> เฝ้าระวัง (70-80%)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> ปกติ (&lt;70%)
        </span>
      </div>
    </div>
  );
};
