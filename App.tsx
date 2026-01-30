
import React, { useState, useCallback, useEffect } from 'react';
import { AppState, OrderItem } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import MenuScreen from './components/MenuScreen';
import CheckoutScreen from './components/CheckoutScreen';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const [confirmedItems, setConfirmedItems] = useState<OrderItem[]>([]);
  const [waiterCalled, setWaiterCalled] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOccupied = useCallback(() => {
    setAppState(AppState.ORDERING);
  }, []);

  const handleFinishSession = useCallback(() => {
    if (confirmedItems.length === 0) {
      setAppState(AppState.WELCOME);
      return;
    }
    setAppState(AppState.PAYING);
  }, [confirmedItems.length]);

  const handlePaymentSuccess = useCallback(() => {
    setAppState(AppState.COMPLETED);
    setTimeout(() => {
      setConfirmedItems([]);
      setAppState(AppState.WELCOME);
    }, 5000);
  }, []);

  const handleGoBackToOrdering = useCallback(() => {
    setAppState(AppState.ORDERING);
  }, []);

  const callWaiter = () => {
    setWaiterCalled(true);
    setTimeout(() => setWaiterCalled(false), 3000);
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.WELCOME:
        return <WelcomeScreen onOccupied={handleOccupied} />;
      
      case AppState.ORDERING:
        return (
          <MenuScreen 
            onFinish={handleFinishSession} 
            confirmedItems={confirmedItems}
            setConfirmedItems={setConfirmedItems}
          />
        );
      
      case AppState.PAYING:
        return (
          <CheckoutScreen 
            confirmedItems={confirmedItems} 
            onPaymentSuccess={handlePaymentSuccess}
            onGoBack={handleGoBackToOrdering}
          />
        );

      case AppState.COMPLETED:
        return (
          <div className="h-full w-full flex flex-col items-center justify-center bg-white p-12 page-enter">
            <div className="w-40 h-40 bg-green-500 rounded-[3rem] flex items-center justify-center text-white mb-10 shadow-2xl shadow-green-100 animate-bounce">
              <i className="fa-solid fa-check text-7xl"></i>
            </div>
            <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tighter">Session Complete</h2>
            <p className="text-2xl text-gray-400 text-center max-w-lg leading-relaxed font-medium">
                Thank you! The session has ended. Ready for the next guest.
            </p>

            <div className="mt-16 text-gray-300 font-bold uppercase tracking-[0.3em] text-sm animate-pulse">
              Resetting for next guest...
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden select-none">
      <div className={`w-full h-10 px-8 flex justify-between items-center z-[100] transition-colors duration-500 ${appState === AppState.WELCOME ? 'bg-transparent' : 'bg-white border-b border-gray-100'}`}>
        <div className="flex items-center space-x-4">
            <span className="text-sm font-black text-gray-900">{currentTime}</span>
            <div className="flex items-center space-x-2 text-green-500">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                 <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Active</span>
            </div>

        </div>
        
        <div className="flex items-center space-x-6">
          {appState !== AppState.WELCOME && (
            <button 
              onClick={callWaiter}
              className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-all ${waiterCalled ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              <i className={`fa-solid ${waiterCalled ? 'fa-check' : 'fa-bell-concierge'} text-[10px]`}></i>
              <span className="text-[9px] font-black uppercase tracking-widest">
                    {waiterCalled ? 'Done' : 'Call'}
              </span>

              
            </button>
          )}
          <div className="flex items-center space-x-3 text-gray-400">
            <i className="fa-solid fa-wifi text-xs"></i>
            <i className="fa-solid fa-battery-full text-xs"></i>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {renderContent()}
      </div>

      {/* System Home Indicator */}
      <div className="h-8 w-full bg-white flex justify-center items-center pb-3">
        <div className="w-32 h-1.5 bg-gray-200/50 rounded-full"></div>
      </div>
    </div>
  );
};

export default App;
