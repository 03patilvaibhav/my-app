import React, { useState, useEffect } from 'react';
import './App.css';
// import './data.json'

const StrategyViewer = () => {
  const [selectedView, setSelectedView] = useState('Bullish');
  const [selectedDate, setSelectedDate] = useState('');
  const [strategies, setStrategies] = useState([]);
  const [dateArray, setDateArray] = useState([]);
  const [strategyArray, setStrategyArray] = useState([]);

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const response = await fetch('https://mocki.io/v1/929be479-af32-4522-ac50-f78785841ef1');
        const data = await response.json();
        setDateArray(data.dateArray);
        setStrategyArray(data.strategyArray);
        setSelectedDate(data.dateArray[0]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const viewData = strategyArray.find(item => item.View === selectedView);
    if (viewData && viewData.Value[selectedDate]) {
      const strategiesForDate = viewData.Value[selectedDate];
      const strategyCounts = strategiesForDate.reduce((acc, strategy) => {
        acc[strategy] = (acc[strategy] || 0) + 1;
        return acc;
      }, {});
      setStrategies(Object.entries(strategyCounts).map(([name, count]) => ({ name, count })));
    } else {
      setStrategies([]);
    }
  }, [selectedView, selectedDate, strategyArray]);

  return (
    <div className="strategy-viewer">
      <div className="view-toggle">
        {['Bullish', 'Bearish', 'Rangebound', 'Volatile'].map((view) => (
          <button
            key={view}
            className={`toggle-button ${selectedView === view ? 'active' : ''}`}
            onClick={() => setSelectedView(view)}
          >
            {view}
          </button>
        ))}
      </div>

      <div className="date-dropdown">
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        >
          {dateArray.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>
      </div>

      {strategies.length > 0 ? (
        <div className="strategy-list">
          {strategies.map(({ name, count }) => (
            <div key={name} className="strategy-card">
              <span className="strategy-name">{name}</span>
              <span className="strategy-count">
                {count} {count === 1 ? 'Strategy' : 'Strategies'}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>There are no strategies for</p>
          <p className="selected-date">{selectedDate}</p>
        </div>
      )}
    </div>
  );
};

export default StrategyViewer;