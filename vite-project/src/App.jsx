import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Upload, Camera, Send, Mic, Globe, Leaf, TrendingUp, Calendar, MapPin } from 'lucide-react';
import { WEATHER_API } from './secret';
export default function KrishiMitra() {
  const [language, setLanguage] = useState('English');
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'Hello! How can I help you today?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const languages = ['English', 'हिन्दी', 'ಕನ್ನಡ', 'मराठी'];

  const translations = {
    English: {
      title: 'Krishi Mitra',
      dateWeather: "Today's Date & Weather",
      monday: 'Monday',
      sunny: 'Sunny',
      weeklyForecast: 'Weekly Forecast:',
      farmerDetails: 'Farmer Details',
      landArea: 'Land Area',
      crop: 'Crop',
      growthStage: 'Growth Stage',
      marketPrice: 'Market Price',
      estimatedYield: 'Estimated Yield',
      harvestIn: 'Harvest In',
      uploadImage: 'Upload Plant/Soil Image',
      remove: 'Remove',
      analysisResults: 'Analysis Results:',
      cropHealthy: '✓ Crop appears healthy',
      noPest: '✓ No pest disease detected',
      nitrogen: '⚠ Slight nitrogen deficiency - Urea fertilizer recommended',
      chooseGallery: 'Choose from Gallery',
      takePhoto: 'Take Photo',
      askAI: 'Ask AI Assistant',
      typePlaceholder: 'Type your question...',
      botWelcome: 'Hello! How can I help you today?',
      botResponse: 'Your rice crop looks healthy. Water regularly and monitor for pests.',
      cropName: 'Rice (Paddy)',
      stageName: 'Flowering Stage'
    },
    हिन्दी: {
      title: 'कृषि मित्र',
      dateWeather: 'आज की तारीख और मौसम',
      monday: 'सोमवार',
      sunny: 'धूप',
      weeklyForecast: 'साप्ताहिक पूर्वानुमान:',
      farmerDetails: 'किसान का विवरण',
      landArea: 'भूमि क्षेत्र',
      crop: 'फसल',
      growthStage: 'वृद्धि चरण',
      marketPrice: 'बाज़ार मूल्य',
      estimatedYield: 'अनुमानित उपज',
      harvestIn: 'कटाई तक',
      uploadImage: 'पौधे/मिट्टी की तस्वीर अपलोड करें',
      remove: 'हटाएं',
      analysisResults: 'विश्लेषण परिणाम:',
      cropHealthy: '✓ फसल स्वस्थ दिख रही है',
      noPest: '✓ कोई कीट रोग नहीं पाया गया',
      nitrogen: '⚠ नाइट्रोजन की थोड़ी कमी - यूरिया खाद की सिफारिश',
      chooseGallery: 'गैलरी से चुनें',
      takePhoto: 'फोटो लें',
      askAI: 'AI सहायक से पूछें',
      typePlaceholder: 'अपना सवाल टाइप करें...',
      botWelcome: 'नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?',
      botResponse: 'आपके धान की फसल स्वस्थ दिख रही है। नियमित रूप से पानी दें और कीटों पर नज़र रखें।',
      cropName: 'धान',
      stageName: 'फूल आने का चरण'
    },
    ಕನ್ನಡ: {
      title: 'ಕೃಷಿ ಮಿತ್ರ',
      dateWeather: 'ಇಂದಿನ ದಿನಾಂಕ ಮತ್ತು ಹವಾಮಾನ',
      monday: 'ಸೋಮವಾರ',
      sunny: 'ಬಿಸಿಲು',
      weeklyForecast: 'ವಾರದ ಮುನ್ಸೂಚನೆ:',
      farmerDetails: 'ರೈತರ ವಿವರಗಳು',
      landArea: 'ಭೂಮಿ ವಿಸ್ತೀರ್ಣ',
      crop: 'ಬೆಳೆ',
      growthStage: 'ಬೆಳವಣಿಗೆಯ ಹಂತ',
      marketPrice: 'ಮಾರುಕಟ್ಟೆ ಬೆಲೆ',
      estimatedYield: 'ಅಂದಾಜು ಇಳುವರಿ',
      harvestIn: 'ಕೊಯ್ಲು ಸಮಯ',
      uploadImage: 'ಸಸ್ಯ/ಮಣ್ಣಿನ ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
      remove: 'ತೆಗೆದುಹಾಕಿ',
      analysisResults: 'ವಿಶ್ಲೇಷಣೆ ಫಲಿತಾಂಶಗಳು:',
      cropHealthy: '✓ ಬೆಳೆ ಆರೋಗ್ಯಕರವಾಗಿ ಕಾಣುತ್ತದೆ',
      noPest: '✓ ಯಾವುದೇ ಕೀಟ ರೋಗ ಪತ್ತೆಯಾಗಿಲ್ಲ',
      nitrogen: '⚠ ಸ್ವಲ್ಪ ಸಾರಜನಕ ಕೊರತೆ - ಯೂರಿಯಾ ಗೊಬ್ಬರ ಶಿಫಾರಸು',
      chooseGallery: 'ಗ್ಯಾಲರಿಯಿಂದ ಆಯ್ಕೆಮಾಡಿ',
      takePhoto: 'ಫೋಟೋ ತೆಗೆಯಿರಿ',
      askAI: 'AI ಸಹಾಯಕರನ್ನು ಕೇಳಿ',
      typePlaceholder: 'ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ...',
      botWelcome: 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
      botResponse: 'ನಿಮ್ಮ ಭತ್ತದ ಬೆಳೆ ಆರೋಗ್ಯಕರವಾಗಿದೆ. ನಿಯಮಿತವಾಗಿ ನೀರು ಹಾಕಿ ಮತ್ತು ಕೀಟಗಳನ್ನು ಗಮನಿಸಿ.',
      cropName: 'ಭತ್ತ',
      stageName: 'ಹೂಬಿಡುವ ಹಂತ'
    },
    मराठी: {
      title: 'कृषी मित्र',
      dateWeather: 'आजची तारीख आणि हवामान',
      monday: 'सोमवार',
      sunny: 'सूर्यप्रकाश',
      weeklyForecast: 'साप्ताहिक अंदाज:',
      farmerDetails: 'शेतकऱ्याचे तपशील',
      landArea: 'जमिनीचे क्षेत्र',
      crop: 'पीक',
      growthStage: 'वाढीचा टप्पा',
      marketPrice: 'बाजार भाव',
      estimatedYield: 'अंदाजे उत्पन्न',
      harvestIn: 'कापणीपर्यंत',
      uploadImage: 'वनस्पती/मातीचे चित्र अपलोड करा',
      remove: 'काढा',
      analysisResults: 'विश्लेषण परिणाम:',
      cropHealthy: '✓ पीक निरोगी दिसते',
      noPest: '✓ कोणताही कीड रोग आढळला नाही',
      nitrogen: '⚠ थोडी नायट्रोजनची कमतरता - युरिया खताची शिफारस',
      chooseGallery: 'गॅलरीमधून निवडा',
      takePhoto: 'फोटो घ्या',
      askAI: 'AI सहाय्यक विचारा',
      typePlaceholder: 'तुमचा प्रश्न टाइप करा...',
      botWelcome: 'नमस्कार! मी तुम्हाला कशी मदत करू शकतो?',
      botResponse: 'तुमचे तांदूळ पीक निरोगी दिसते. नियमितपणे पाणी द्या आणि किडींवर लक्ष ठेवा.',
      cropName: 'तांदूळ',
      stageName: 'फुलांचा टप्पा'
    }
  };

  const t = translations[language];

  //replace with actual weather data from API
  const [weatherData, setWeatherData] = useState({
    today: { temp: 28, condition: 'Sunny', icon: Sun },
    forecast: [
      { day: 'Tue', temp: 30, icon: Sun },
      { day: 'Wed', temp: 26, icon: CloudRain },
      { day: 'Thu', temp: 27, icon: Cloud }
    ],
    weekly: 'Moderate rainfall expected mid-week. Good for irrigation.'
  });
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      const API_KEY = WEATHER_API;
      const LAT = 12.8855;
      const LON = 74.8388;

      try {
        // Get current weather
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`);

        if (!response.ok) {
          throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
        }

        const currentData = await response.json();

        // Get 5-day forecast
        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`);


        if (!forecastResponse.ok) {
          throw new Error(`Forecast API error: ${forecastResponse.status} ${forecastResponse.statusText}`);
        }

        const forecastData = await forecastResponse.json();

        const getIcon = (weather) => {
          switch (weather.toLowerCase()) {
            case 'clear': return Sun;
            case 'rain': return CloudRain;
            case 'clouds': return Cloud;
            default: return Sun;
          }
        };

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Get next 3 days forecast (skip today, get next 3 unique days)
        const dailyForecasts = [];
        const processedDates = new Set();

        for (let i = 0; i < forecastData.list.length && dailyForecasts.length < 3; i++) {
          const forecast = forecastData.list[i];
          const date = new Date(forecast.dt * 1000);
          const dateKey = date.toDateString();

          // Skip if we already processed this date, and skip today
          if (!processedDates.has(dateKey) && date.getDate() !== new Date().getDate()) {
            processedDates.add(dateKey);
            dailyForecasts.push({
              day: days[date.getDay()],
              temp: Math.round(forecast.main.temp),
              icon: getIcon(forecast.weather[0].main)
            });
          }
        }

        console.log(currentData.main.temp);
        setWeatherData({
          today: {
            temp: Math.round(currentData.main.temp),
            condition: currentData.weather[0].main,
            icon: getIcon(currentData.weather[0].main)
          },
          forecast: dailyForecasts,
          weekly: `${currentData.weather[0].description}. Humidity: ${currentData.main.humidity}%. Location: ${forecastData.city.name}`
        });
      } catch (error) {
        console.error('Weather API error:', error);
        console.log('Using default weather data due to API error');
        // Keep default data on error
      } finally {
        setIsWeatherLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  const farmerData = {
    landArea: '2.5 Acres',
    crop: 'Rice (Paddy)',
    stage: 'Flowering Stage',
    marketPrice: '₹2,150/Quintal',
    estimatedYield: '12 Quintal/Acre',
    harvestTime: '45 Days'
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setChatMessages([...chatMessages,
      { type: 'user', text: inputMessage },
      { type: 'bot', text: t.botResponse }
      ]);
      setInputMessage('');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    setShowLangDropdown(false);
    setChatMessages([{ type: 'bot', text: translations[lang].botWelcome }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8" />
            <h1 className="text-2xl font-bold">{t.title}</h1>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowLangDropdown((v) => !v)}
              className="flex items-center gap-2 bg-white text-green-700 px-4 py-2 rounded-full font-semibold hover:bg-green-50 transition-all"
            >
              <Globe className="w-5 h-5" />
              {language}
            </button>
            {showLangDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-green-200 rounded-xl shadow-lg z-50">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageSelect(lang)}
                    className={`w-full text-left px-4 py-2 hover:bg-green-50 ${lang === language ? 'font-bold text-green-700' : 'text-gray-800'
                      }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4 pb-32">
        {/* Date & Weather Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-green-100">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">{t.dateWeather}</h2>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-5 mb-4">
            {isWeatherLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-full bg-blue-400 rounded-full h-2 mb-4">
                  <div className="bg-white h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
                <p className="text-lg opacity-90">Loading weather data...</p>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-3xl font-bold">{new Date().toLocaleDateString(language === 'English' ? 'en-IN' : language === 'हिन्दी' ? 'hi-IN' : language === 'ಕನ್ನಡ' ? 'kn-IN' : 'mr-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="text-lg opacity-90">{t.monday}</p>
                </div>
                <div className="text-right">
                  <Sun className="w-16 h-16 mb-2 ml-auto" />
                  <p className="text-3xl font-bold">{weatherData.today.temp}°C</p>
                  <p className="opacity-90">{t.sunny}</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {isWeatherLoading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="bg-blue-50 rounded-xl p-3 text-center">
                  <div className="h-4 bg-gray-300 rounded mb-2 animate-pulse"></div>
                  <div className="w-8 h-8 bg-gray-300 rounded-full mx-auto my-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                </div>
              ))
            ) : (
              weatherData.forecast.map((day, idx) => {
                const Icon = day.icon;
                return (
                  <div key={idx} className="bg-blue-50 rounded-xl p-3 text-center">
                    <p className="font-semibold text-gray-700">{day.day}</p>
                    <Icon className="w-8 h-8 mx-auto my-2 text-blue-600" />
                    <p className="font-bold text-gray-800">{day.temp}°C</p>
                  </div>
                );
              })
            )}
          </div>

          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <p className="text-sm font-semibold text-green-800">{t.weeklyForecast}</p>
            <p className="text-gray-700 mt-1">{weatherData.weekly}</p>
          </div>
        </div>

        {/* Farmer Details Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-green-100">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">{t.farmerDetails}</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <p className="text-sm text-gray-600 mb-1">{t.landArea}</p>
              <p className="text-2xl font-bold text-green-700">{farmerData.landArea}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">{t.crop}</p>
              <p className="text-2xl font-bold text-blue-700">{t.cropName}</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
              <p className="text-sm text-gray-600 mb-1">{t.growthStage}</p>
              <p className="text-lg font-bold text-yellow-700">{t.stageName}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <p className="text-sm text-gray-600 mb-1">{t.marketPrice}</p>
              <p className="text-lg font-bold text-purple-700">{farmerData.marketPrice}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
              <p className="text-sm text-gray-600 mb-1">{t.estimatedYield}</p>
              <p className="text-lg font-bold text-orange-700">{farmerData.estimatedYield}</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
              <p className="text-sm text-gray-600 mb-1">{t.harvestIn}</p>
              <p className="text-lg font-bold text-red-700">{farmerData.harvestTime}</p>
            </div>
          </div>
        </div>

        {/* Image Upload Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-green-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t.uploadImage}</h2>

          {uploadedImage ? (
            <div className="relative">
              <img src={uploadedImage} alt="Uploaded" className="w-full h-64 object-cover rounded-2xl mb-4" />
              <button
                onClick={() => setUploadedImage(null)}
                className="absolute top-2 right-2 bg-red-500 text-white px-4 py-2 rounded-full font-semibold"
              >
                {t.remove}
              </button>
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <p className="font-semibold text-green-800 mb-2">{t.analysisResults}</p>
                <p className="text-gray-700">{t.cropHealthy}</p>
                <p className="text-gray-700">{t.noPest}</p>
                <p className="text-gray-700">{t.nitrogen}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8 text-center hover:shadow-lg transition-all border-2 border-dashed border-blue-400">
                  <Upload className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                  <p className="font-semibold text-blue-800">{t.chooseGallery}</p>
                </div>
              </label>

              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-8 text-center hover:shadow-lg transition-all border-2 border-dashed border-green-400">
                  <Camera className="w-12 h-12 mx-auto mb-3 text-green-600" />
                  <p className="font-semibold text-green-800">{t.takePhoto}</p>
                </div>
              </label>
            </div>
          )}
        </div>

        {/* Chatbot Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-green-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t.askAI}</h2>

          <div className="bg-gray-50 rounded-2xl p-4 h-64 overflow-y-auto mb-4 space-y-3">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-2xl px-4 py-3 max-w-[80%] ${msg.type === 'user'
                  ? 'bg-green-600 text-white'
                  : 'bg-white border-2 border-green-200 text-gray-800'
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t.typePlaceholder}
              className="flex-1 rounded-full px-6 py-3 border-2 border-green-300 focus:outline-none focus:border-green-500"
            />
            <button
              onClick={handleSendMessage}
              className="bg-green-600 text-white rounded-full p-3 hover:bg-green-700 transition-all"
            >
              <Send className="w-6 h-6" />
            </button>
            <button className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 transition-all">
              <Mic className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}