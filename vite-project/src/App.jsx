import FarmerDetailsCard from './FarmerDetailsCard';
import ImageUploadCard from './ImageUploadCard';
import ReactMarkdown from "react-markdown";

import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Upload, Camera, Send, Mic, Globe, Leaf, TrendingUp, Calendar, MapPin } from 'lucide-react';
import { WEATHER_API } from './secrets';
import { sendToGemini } from './ai';

export default function KrishiMitra() {
  const [language, setLanguage] = useState('English');
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'Hello! How can I help you today?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const languages = ['English', 'हिन्दी', 'ಕನ್ನಡ', 'मराठी'];
    
  // Add translations object
  const translations = {
    'English': {
      title: 'KrishiMitra',
      botWelcome: 'Hello! How can I help you today?',
      botResponse: 'I can help you with farming advice!',
      dateWeather: 'Date & Weather',
      monday: 'Monday',
      sunny: 'Sunny',
      weeklyForecast: 'Weekly Forecast',
      uploadImage: 'Upload Image',
      uploadPrompt: 'Upload a photo',
      askAI: 'Ask AI Assistant',
      typePlaceholder: 'Type your message...',
      farmerDetails: 'Farmer Details',
      landArea: 'Land Area',
      crop: 'Crop Type',
      growthStage: 'Growth Stage',
      marketPrice: 'Market Price',
      estimatedYield: 'Estimated Yield',
      harvestTime: 'Harvest Time',
      healthStatus: 'Health Status',
      recommendations: 'Recommendations',
      analysisResults: 'Analysis Results',
      analyzingCrop: 'Analyzing crop data...',
      pleaseWait: 'Please wait while we process your image',
      noData: 'No Data Available',
      uploadPromptDetails: 'Upload and analyze an image to see crop details',
      analysisIssue: 'Analysis Issue',
      aiPowered: 'Analysis powered by AI • Results are estimates'
    },
    'हिन्दी': {
      title: 'कृषि मित्र',
      botWelcome: 'नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?',
      botResponse: 'आपके धान की फसल स्वस्थ दिख रही है। नियमित रूप से पानी दें और कीटों पर नज़र रखें।',
      dateWeather: 'आज की तारीख और मौसम',
      monday: 'सोमवार',
      sunny: 'धूप',
      weeklyForecast: 'साप्ताहिक पूर्वानुमान',
      uploadImage: 'पौधे/मिट्टी की तस्वीर अपलोड करें',
      uploadPrompt: 'फोटो अपलोड करें',
      askAI: 'AI सहायक से पूछें',
      typePlaceholder: 'अपना सवाल टाइप करें...',
      farmerDetails: 'किसान का विवरण',
      landArea: 'भूमि क्षेत्र',
      crop: 'फसल का प्रकार',
      growthStage: 'वृद्धि चरण',
      marketPrice: 'बाज़ार मूल्य',
      estimatedYield: 'अनुमानित उपज',
      harvestTime: 'कटाई का समय',
      healthStatus: 'स्वास्थ्य स्थिति',
      recommendations: 'सिफारिशें',
      analysisResults: 'विश्लेषण परिणाम',
      analyzingCrop: 'फसल डेटा का विश्लेषण किया जा रहा है...',
      pleaseWait: 'कृपया प्रतीक्षा करें जब तक हम आपकी तस्वीर संसाधित करते हैं',
      noData: 'कोई डेटा उपलब्ध नहीं',
      uploadPromptDetails: 'फसल विवरण देखने के लिए एक तस्वीर अपलोड करें और विश्लेषण करें',
      analysisIssue: 'विश्लेषण समस्या',
      aiPowered: 'AI द्वारा संचालित विश्लेषण • परिणाम अनुमान हैं'
    },
    'ಕನ್ನಡ': {
      title: 'ಕೃಷಿ ಮಿತ್ರ',
      botWelcome: 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
      botResponse: 'ನಿಮ್ಮ ಭತ್ತದ ಬೆಳೆ ಆರೋಗ್ಯಕರವಾಗಿದೆ. ನಿಯಮಿತವಾಗಿ ನೀರು ಹಾಕಿ ಮತ್ತು ಕೀಟಗಳನ್ನು ಗಮನಿಸಿ.',
      dateWeather: 'ಇಂದಿನ ದಿನಾಂಕ ಮತ್ತು ಹವಾಮಾನ',
      monday: 'ಸೋಮವಾರ',
      sunny: 'ಬಿಸಿಲು',
      weeklyForecast: 'ವಾರದ ಮುನ್ಸೂಚನೆ',
      uploadImage: 'ಸಸ್ಯ/ಮಣ್ಣಿನ ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
      uploadPrompt: 'ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
      askAI: 'AI ಸಹಾಯಕರನ್ನು ಕೇಳಿ',
      typePlaceholder: 'ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ...',
      farmerDetails: 'ರೈತರ ವಿವರಗಳು',
      landArea: 'ಭೂಮಿ ವಿಸ್ತೀರ್ಣ',
      crop: 'ಬೆಳೆಯ ಪ್ರಕಾರ',
      growthStage: 'ಬೆಳವಣಿಗೆಯ ಹಂತ',
      marketPrice: 'ಮಾರುಕಟ್ಟೆ ಬೆಲೆ',
      estimatedYield: 'ಅಂದಾಜು ಇಳುವರಿ',
      harvestTime: 'ಕೊಯ್ಲು ಸಮಯ',
      healthStatus: 'ಆರೋಗ್ಯ ಸ್ಥಿತಿ',
      recommendations: 'ಶಿಫಾರಸುಗಳು',
      analysisResults: 'ವಿಶ್ಲೇಷಣೆ ಫಲಿತಾಂಶಗಳು',
      analyzingCrop: 'ಬೆಳೆ ಡೇಟಾವನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...',
      pleaseWait: 'ನಾವು ನಿಮ್ಮ ಚಿತ್ರವನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸುವವರೆಗೆ ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ',
      noData: 'ಯಾವುದೇ ಡೇಟಾ ಲಭ್ಯವಿಲ್ಲ',
      uploadPromptDetails: 'ಬೆಳೆ ವಿವರಗಳನ್ನು ನೋಡಲು ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತು ವಿಶ್ಲೇಷಿಸಿ',
      analysisIssue: 'ವಿಶ್ಲೇಷಣೆ ಸಮಸ್ಯೆ',
      aiPowered: 'AI ನಿಂದ ಚಾಲಿತ ವಿಶ್ಲೇಷಣೆ • ಫಲಿತಾಂಶಗಳು ಅಂದಾಜುಗಳಾಗಿವೆ'
    },
    'मराठी': {
      title: 'कृषी मित्र',
      botWelcome: 'नमस्कार! मी तुम्हाला कशी मदत करू शकतो?',
      botResponse: 'तुमचे तांदूळ पीक निरोगी दिसते. नियमितपणे पाणी द्या आणि किडींवर लक्ष ठेवा.',
      dateWeather: 'आजची तारीख आणि हवामान',
      monday: 'सोमवार',
      sunny: 'सूर्यप्रकाश',
      weeklyForecast: 'साप्ताहिक अंदाज',
      uploadImage: 'वनस्पती/मातीचे चित्र अपलोड करा',
      uploadPrompt: 'फोटो अपलोड करा',
      askAI: 'AI सहाय्यक विचारा',
      typePlaceholder: 'तुमचा प्रश्न टाइप करा...',
      farmerDetails: 'शेतकऱ्याचे तपशील',
      landArea: 'जमिनीचे क्षेत्र',
      crop: 'पीक प्रकार',
      growthStage: 'वाढीचा टप्पा',
      marketPrice: 'बाजार भाव',
      estimatedYield: 'अंदाजे उत्पन्न',
      harvestTime: 'कापणीची वेळ',
      healthStatus: 'आरोग्य स्थिती',
      recommendations: 'शिफारसी',
      analysisResults: 'विश्लेषण परिणाम',
      analyzingCrop: 'पीक डेटाचे विश्लेषण करत आहे...',
      pleaseWait: 'आम्ही तुमची प्रतिमा प्रक्रिया करत असताना कृपया प्रतीक्षा करा',
      noData: 'कोणताही डेटा उपलब्ध नाही',
      uploadPromptDetails: 'पीक तपशील पाहण्यासाठी प्रतिमा अपलोड करा आणि विश्लेषण करा',
      analysisIssue: 'विश्लेषण समस्या',
      aiPowered: 'AI द्वारे समर्थित विश्लेषण • परिणाम अंदाज आहेत'
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
  const [farmerData, setFarmerData] = useState(null);
  const [geminiJson, setGeminiJson] = useState(null);
  
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);

  useEffect(() => {
    const getUserLocation = () => {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by this browser'));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lon: position.coords.longitude
            });
          },
          (error) => {
            reject(new Error(`Location access denied: ${error.message}`));
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
          }
        );
      });
    };

    const fetchWeatherData = async () => {
      const API_KEY = WEATHER_API;

      try {
        // Get user's current location
        console.log('Requesting location permission...');
        const location = await getUserLocation();
        console.log('Location obtained:', location);

        const { lat, lon } = location;

        // Get current weather
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

        if (!response.ok) {
          throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
        }

        const currentData = await response.json();

        // Get 5-day forecast
        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

        if (!forecastResponse.ok) {
          throw new Error(`Forecast API error: ${forecastResponse.status} ${forecastResponse.statusText}`);
        }

        const forecastData = await forecastResponse.json();

        const getIcon = (weather) => {
          switch (weather.toLowerCase()) {
            case 'clear':
            case 'sunny':
              return Sun;
            case 'rain':
            case 'drizzle':
            case 'shower':
            case 'thunderstorm':
              return CloudRain;
            case 'clouds':
            case 'cloudy':
            case 'overcast':
            case 'mist':
            case 'fog':
            case 'haze':
              return Cloud;
            case 'snow':
            case 'sleet':
              return Cloud; // Using Cloud for snow since no snow icon available
            default:
              return Sun;
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

        console.log('Weather data for location:', currentData.name);
        setWeatherData({
          today: {
            temp: Math.round(currentData.main.temp),
            condition: currentData.weather[0].main,
            icon: getIcon(currentData.weather[0].main)
          },
          forecast: dailyForecasts,
          weekly: `${currentData.weather[0].description}. Humidity: ${currentData.main.humidity}%. Location: ${currentData.name}`
        });
      } catch (error) {
        console.error('Weather API error:', error);
        console.log('Using default weather data due to error:', error.message);
        // Keep default data on error - could be location denied or API error
      } finally {
        setIsWeatherLoading(false);
      }
    };

    fetchWeatherData();
  }, []);


  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      setChatMessages([...chatMessages, { type: 'user', text: inputMessage }]);
      const aiResponce = await sendToGemini(inputMessage);
      setChatMessages((prev) => [...prev, { type: 'bot', text: aiResponce }])

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


  const localizedWeatherCondition = (() => {
    const cond = weatherData.today.condition.toLowerCase();
    if (language === 'English') return weatherData.today.condition;
    if (language === 'हिन्दी') {
      if (cond === 'clear') return 'धूप';
      if (cond === 'clouds') return 'बादल';
      if (cond === 'rain') return 'बारिश';
      return weatherData.today.condition;
    }
    if (language === 'ಕನ್ನಡ') {
      if (cond === 'clear') return 'ಬಿಸಿಲು';
      if (cond === 'clouds') return 'ಮೋಡಗಳು';
      if (cond === 'rain') return 'ಮಳೆ';
      return weatherData.today.condition;
    }
    if (language === 'मराठी') {
      if (cond === 'clear') return 'सूर्यप्रकाश';
      if (cond === 'clouds') return 'ढग';
      if (cond === 'rain') return 'पाऊस';
      return weatherData.today.condition;
    }
    return weatherData.today.condition;
  })();

  const localizedHumidity = (() => {
    const humidityMatch = weatherData.weekly.match(/Humidity: (\d+)%/);
    const humidity = humidityMatch ? humidityMatch[1] : '';
    if (language === 'English') return `Humidity: ${humidity}%`;
    if (language === 'हिन्दी') return `आर्द्रता: ${humidity}%`;
    if (language === 'ಕನ್ನಡ') return `ಆದ್ರತೆ: ${humidity}%`;
    if (language === 'मराठी') return `आर्द्रता: ${humidity}%`;
    return `Humidity: ${humidity}%`;
  })();

  const localizedWeekly = (() => {
    let desc = weatherData.weekly;
    desc = desc.replace(/Humidity: (\d+)%/, localizedHumidity);
    if (language === 'English') return desc;
    if (language === 'हिन्दी') {
      desc = desc.replace('Location:', 'स्थान:');
      desc = desc.replace('clear sky', 'स्वच्छ आकाश');
      desc = desc.replace('clouds', 'बादल');
      desc = desc.replace('rain', 'बारिश');
      return desc;
    }
    if (language === 'ಕನ್ನಡ') {
      desc = desc.replace('Location:', 'ಸ್ಥಳ:');
      desc = desc.replace('clear sky', 'ಸ್ವಚ್ಛ ಆಕಾಶ');
      desc = desc.replace('clouds', 'ಮೋಡಗಳು');
      desc = desc.replace('rain', 'ಮಳೆ');
      return desc;
    }
    if (language === 'मराठी') {
      desc = desc.replace('Location:', 'स्थान:');
      desc = desc.replace('clear sky', 'स्वच्छ आकाश');
      desc = desc.replace('clouds', 'ढग');
      desc = desc.replace('rain', 'पाऊस');
      return desc;
    }
    return desc;
  })();

  const localizedDate = new Date().toLocaleDateString(
    language === 'English' ? 'en-IN' : language === 'हिन्दी' ? 'hi-IN' : language === 'ಕನ್ನಡ' ? 'kn-IN' : 'mr-IN',
    { day: 'numeric', month: 'long', year: 'numeric' }
  );

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
                    className={`w-full text-left px-4 py-2 hover:bg-green-50 ${lang === language ? 'font-bold text-green-700' : 'text-gray-800'}`}
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
                  <p className="text-3xl font-bold">{localizedDate}</p>
                  <p className="text-lg opacity-90">{t.monday}</p>
                </div>
                <div className="text-right">
                  {React.createElement(weatherData.today.icon, { className: "w-16 h-16 mb-2 ml-auto" })}
                  <p className="text-3xl font-bold">{weatherData.today.temp}°C</p>
                  <p className="opacity-90">{localizedWeatherCondition}</p>
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
            <p className="text-gray-700 mt-1">{localizedWeekly}</p>
          </div>
        </div>

        {/* Image Upload Card */}
        <ImageUploadCard
          t={t}
          language={language}
          uploadedImage={uploadedImage}
          setUploadedImage={setUploadedImage}
          handleImageUpload={handleImageUpload}
          onGeminiResult={result => {
            if (result && typeof result === 'object') {
              setGeminiJson(result);
              setFarmerData(prev => ({
                ...prev,
                ...result,
                landArea: result.landArea ? result.landArea + ' Acres' : prev?.landArea
              }));
            }
          }}
          setAnalyzing={setAnalyzing}
        />

        {/* Farmer Details Card: always show, but with state */}
        {/* Show FarmerDetailsCard only after Gemini reply */}
        {farmerData && Object.keys(farmerData).length > 0 && (
          <FarmerDetailsCard farmerData={farmerData} analyzing={analyzing} t={t} />
        )}

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
                  <ReactMarkdown>{msg.text}</ReactMarkdown> 
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