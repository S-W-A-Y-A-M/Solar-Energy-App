import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import mqtt from 'mqtt';

const mqttBrokerUrl = 'ws://raspberrypi.local:9001';
const topics = {
  voltage: 'solar/voltage',
  smoke: 'solar/smoke',
  energy: 'solar/energy',
  maintenance: 'solar/maintenance',
  impact: 'solar/impact',
  microgrid: 'solar/microgrid',
  emergency: 'solar/emergency'
};

const Sidebar = ({ toggleSidebar }) => (
  <div className="w-64 bg-blue-700 text-white p-4">
    <ul>
      <li className="mb-2"><Link to="/dashboard" className="block p-2 hover:bg-blue-600 rounded">Dashboard</Link></li>
      <li className="mb-2"><Link to="/energy-tracker" className="block p-2 hover:bg-blue-600 rounded">Energy Tracker</Link></li>
      <li className="mb-2"><Link to="/maintenance" className="block p-2 hover:bg-blue-600 rounded">Maintenance</Link></li>
      <li className="mb-2"><Link to="/impact-visualizer" className="block p-2 hover:bg-blue-600 rounded">Impact Visualizer</Link></li>
      <li className="mb-2"><Link to="/microgrid-control" className="block p-2 hover:bg-blue-600 rounded">Microgrid Control</Link></li>
      <li className="mb-2"><Link to="/emergency-alerts" className="block p-2 hover:bg-blue-600 rounded">Emergency Alerts</Link></li>
    </ul>
  </div>
);

const Card = ({ title, children }) => (
  <div className="p-6 mb-4 bg-white shadow-xl rounded-lg">
    <h2 className="text-lg font-semibold mb-2 text-sky-700">{title}</h2>
    {children}
  </div>
);

const useMQTTData = () => {
  const [data, setData] = useState({ voltage: 0, smoke: 0, energy: 0, maintenance: "Operational", impact: 0, microgrid: "Stable", emergency: "Safe", energyHistory: [], impactHistory: [] });

  useEffect(() => {
    const client = mqtt.connect(mqttBrokerUrl);

    client.on('connect', () => {
      console.log('Connected to MQTT Broker');
      Object.values(topics).forEach(topic => client.subscribe(topic));
    });

    client.on('message', (topic, message) => {
      const payload = message.toString();
      const newData = { ...data, [topic.split('/')[1]]: isNaN(parseFloat(payload)) ? payload : parseFloat(payload) };

      newData.energyHistory = [...newData.energyHistory.slice(-20), { time: new Date().toLocaleTimeString(), energy: newData.energy }];
      newData.impactHistory = [...newData.impactHistory.slice(-20), { time: new Date().toLocaleTimeString(), impact: newData.impact }];

      if (newData.voltage > 250 || newData.smoke > 5) {
        newData.emergency = "Critical Alert: Voltage/Smoke Level Exceeded!";
        newData.microgrid = "Shutting Down to Prevent Damage";
      } else if (newData.microgrid === "Shutting Down to Prevent Damage" && newData.voltage <= 250 && newData.smoke <= 5) {
        newData.microgrid = "Stable";
        newData.emergency = "Safe";
      }

      if (newData.energy > 80) newData.impact += 1;
      if (newData.impact > 10) newData.maintenance = "Immediate Maintenance Required";

      setData(newData);
    });

    return () => client.end();
  }, []);

  return data;
};

const EnergyTracker = () => {
  const { energyHistory } = useMQTTData();

  return (
    <Card title="Real-Time Energy Consumption">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={energyHistory}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="energy" stroke="#2563eb" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

const ImpactVisualizer = () => {
  const { impactHistory } = useMQTTData();

  return (
    <Card title="Environmental Impact Visualization">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={impactHistory}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="impact" stroke="#82ca9d" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

const Dashboard = () => (
  <div>
    <EnergyTracker />
    <Maintenance />
    <ImpactVisualizer />
    <MicrogridControl />
    <EmergencyAlerts />
  </div>
);

const SolarApp = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <div className="p-4 bg-blue-500 text-white text-lg font-semibold flex justify-between items-center">
          <span>Solar Energy Management</span>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 bg-blue-700 rounded-lg">☰</button>
        </div>
        <div className="flex">
          {sidebarOpen && <Sidebar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />}
          <div className="flex-1 p-6">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/energy-tracker" element={<EnergyTracker />} />
              <Route path="/impact-visualizer" element={<ImpactVisualizer />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default SolarApp;
