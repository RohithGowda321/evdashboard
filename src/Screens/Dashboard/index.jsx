import React, { useState } from 'react';
import evData from '../../Constants/Electric_vehicle_data';
import VehicleTable from '../VehicleTable';
import Charts from '../Charts';
import { FaSun, FaMoon } from 'react-icons/fa';
import './Styles.scss';

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className={`dashboard-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <header className="dashboard-header">
        <h2>Electric Vehicle Dashboard</h2>
        <button className="theme-toggle" onClick={toggleTheme}>
          {darkMode ? <FaSun /> : <FaMoon />}
          <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </header>
      <div className="charts-section">
        <Charts data={evData} />
      </div>
      <div className="table-section">
        <VehicleTable data={evData} />
      </div>
    </div>
  );
};

export default Dashboard;
