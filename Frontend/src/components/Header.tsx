import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <header className="header">
      <div className="logo-section">
        <img 
          src="/pics/Logistech Logo.png" 
          alt="LogisTECH Logo" 
          className="logo-image"
        />
        <h1 className="system-title">Dimension Weights Scanning System</h1>
      </div>
      <div className="timestamp-section">
        <span className="current-timestamp-simple">{formatTime(currentTime)}</span>
      </div>
    </header>
  );
};

export default Header;