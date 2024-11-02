import React from 'react';
import './Styles.scss';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-btn" onClick={toggleSidebar}>
        &times;
      </button>
      <div className="sidebar-logo">
        <h3>EV Dashboard</h3>
      </div>

    </div>
  );
};

export default Sidebar;
