import React from 'react';
import { Leaf, TrendingUp, Calendar, DollarSign, Scale, Heart, CheckCircle, AlertTriangle } from 'lucide-react';

export default function FarmerDetailsCard({ farmerData, analyzing }) {
  // Map field keys to display labels and icons
  const fieldConfig = {
    landArea: { label: 'Land Area', icon: Scale, color: 'blue' },
    crop: { label: 'Crop Type', icon: Leaf, color: 'green' },
    growthStage: { label: 'Growth Stage', icon: TrendingUp, color: 'purple' },
    marketPrice: { label: 'Market Price', icon: DollarSign, color: 'orange' },
    estimatedYield: { label: 'Est. Yield', icon: Scale, color: 'indigo' },
    harvestTime: { label: 'Harvest Time', icon: Calendar, color: 'red' },
    healthStatus: { label: 'Health Status', icon: Heart, color: 'pink' },
    recommendations: { label: 'Recommendations', icon: CheckCircle, color: 'teal' }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      green: 'bg-green-100 text-green-700 border-green-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      orange: 'bg-orange-100 text-orange-700 border-orange-200',
      indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      red: 'bg-red-100 text-red-700 border-red-200',
      pink: 'bg-pink-100 text-pink-700 border-pink-200',
      teal: 'bg-teal-100 text-teal-700 border-teal-200'
    };
    return colors[color] || colors.green;
  };

  const formatFieldValue = (key, value) => {
    if (!value) return 'N/A';
    
    // Special formatting for specific fields
    if (key === 'healthStatus') {
      const status = value.toLowerCase();
      if (status.includes('healthy') || status.includes('good')) {
        return (
          <span className="flex items-center gap-1 text-green-700 font-semibold">
            <CheckCircle className="w-4 h-4" />
            {value}
          </span>
        );
      } else if (status.includes('attention') || status.includes('warning')) {
        return (
          <span className="flex items-center gap-1 text-orange-600 font-semibold">
            <AlertTriangle className="w-4 h-4" />
            {value}
          </span>
        );
      }
    }
    
    return value;
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-green-100">
      <div className="flex items-center gap-2 mb-4">
        <Leaf className="w-7 h-7 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-800">Analysis Results</h2>
      </div>

      {analyzing ? (
        <div className="bg-green-50 rounded-2xl p-8 text-center border-2 border-green-200">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-green-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-green-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-green-700 font-semibold text-lg">Analyzing crop data...</p>
          <p className="text-green-600 text-sm mt-2">Please wait while we process your image</p>
        </div>
      ) : !farmerData || Object.keys(farmerData).length === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-8 text-center border-2 border-gray-200">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <Leaf className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 font-semibold text-lg mb-2">No Data Available</p>
          <p className="text-gray-500 text-sm">Upload and analyze an image to see crop details</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(farmerData).map(([key, value]) => {
            // Skip raw or error fields
            if (key === 'raw' || key === 'error') return null;
            
            const config = fieldConfig[key] || { 
              label: key.charAt(0).toUpperCase() + key.slice(1), 
              icon: Leaf, 
              color: 'green' 
            };
            const Icon = config.icon;
            const colorClasses = getColorClasses(config.color);

            return (
              <div 
                key={key} 
                className={`flex items-start gap-3 p-5 rounded-2xl border-2 ${colorClasses} transition-all hover:shadow-lg hover:scale-[1.02] duration-200`}
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-xl bg-white bg-opacity-50 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-xs uppercase tracking-wide mb-1.5 opacity-70">
                    {config.label}
                  </p>
                  <p className="font-bold text-lg break-words leading-tight">
                    {formatFieldValue(key, value)}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Show error message if present */}
          {farmerData.error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mt-4 col-span-1 md:col-span-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-800 mb-1">Analysis Issue</p>
                  <p className="text-red-700 text-sm">{farmerData.error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Summary footer */}
          <div className="mt-6 pt-4 border-t-2 border-gray-200 col-span-1 md:col-span-2">
            <p className="text-sm text-gray-600 text-center">
              💡 Analysis powered by AI • Results are estimates
            </p>
          </div>
        </div>
      )}
    </div>
  );
}