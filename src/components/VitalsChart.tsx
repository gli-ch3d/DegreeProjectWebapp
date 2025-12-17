import { Card } from './ui/card';

export default function VitalsChart() {
  return (
    <Card className="p-6">
      <h3 className="mb-4 text-[#4A5FBF]">Vitals Monitor</h3>
      
      {/* Simple waveform visualization */}
      <div className="relative bg-gradient-to-b from-pink-50 to-white border border-pink-200 rounded-lg p-4" style={{ height: '200px' }}>
        {/* Grid background */}
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.3 }}>
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e63946" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        
        {/* Waveform */}
        <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 200 100" preserveAspectRatio="none">
          <path
            d="M 0 50 L 20 50 L 25 30 L 30 50 L 35 45 L 40 50 L 60 50 L 65 30 L 70 50 L 75 45 L 80 50 L 100 50 L 105 30 L 110 50 L 115 45 L 120 50 L 140 50 L 145 30 L 150 50 L 155 45 L 160 50 L 180 50 L 185 30 L 190 50 L 195 45 L 200 50"
            fill="none"
            stroke="#4A5FBF"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
      
      {/* Vital signs display */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-600">Heart Rate</div>
          <div className="text-2xl text-[#4A5FBF]">-- bpm</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-600">SpO2</div>
          <div className="text-2xl text-[#4A5FBF]">-- %</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-600">Blood Pressure</div>
          <div className="text-2xl text-[#4A5FBF]">--/--</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-600">Resp Rate</div>
          <div className="text-2xl text-[#4A5FBF]">-- /min</div>
        </div>
      </div>
    </Card>
  );
}
