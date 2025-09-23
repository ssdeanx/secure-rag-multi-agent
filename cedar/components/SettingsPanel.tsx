import React, { useState, useEffect } from 'react';

interface UserSettings {
  name: string;
  color: string;
}

const SettingsPanel = () => {
  const [settings, setSettings] = useState<UserSettings>({
    name: 'User',
    color: '#3B82F6',
  });

  useEffect(() => {
    const saved = localStorage.getItem('userSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    // Dispatch storage event for multi-tab sync
    window.dispatchEvent(new StorageEvent('storage', { key: 'userSettings', newValue: JSON.stringify(settings) }));
  }, [settings]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, name: e.target.value }));
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, color: e.target.value }));
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-100 dark:bg-gray-800">
      <h3 className="text-sm font-semibold mb-2">Collaboration Settings</h3>
      <label className="block text-xs mb-1">User Name</label>
      <input
        type="text"
        value={settings.name}
        onChange={handleNameChange}
        placeholder="Enter your name"
        title="User name input"
        className="w-full p-1 border rounded mb-2 text-xs"
      />
      <label className="block text-xs mb-1">User Color</label>
      <input
        type="color"
        value={settings.color}
        onChange={handleColorChange}
        title="Select your color"
        className="w-full mb-2"
      />
      <p className="text-xs text-gray-600">Changes saved locally for collaboration demo. Syncs across tabs.</p>
    </div>
  );
};

export default SettingsPanel;