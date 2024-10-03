import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom'
import { SettingsContext } from '../contexts/SettingsContext';

const Settings = () => {
  const history = useHistory();
  const { lookaheadPeriod, setLookaheadPeriod } = useContext(SettingsContext);

  const goBack = () => {
    history.goBack();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Settings</h1>
      <b>Notifications</b>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>Notification lookahead period:</label>
        <select 
          value={lookaheadPeriod} 
          onChange={(e) => setLookaheadPeriod(e.target.value)} 
          style={{ padding: '5px', borderRadius: '5px' }}
        >
          <option value="7 days">7 days</option>
          <option value="2 weeks">2 weeks</option>
          <option value="1 month">1 month</option>
        </select>
      </div>
      <br/>
      <button onClick={goBack}>Back</button>
    </div>
  );
};

export default Settings;