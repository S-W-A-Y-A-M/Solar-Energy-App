import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

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

const EnergyTracker = () => {
  const [energyData, setEnergyData] = useState([]);
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergyData((prevData) => [...prevData.slice(-20), { time: new Date().toLocaleTimeString(), energy: Math.random() * 100 }]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <Card title="Real-Time Energy Consumption">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={energyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d1e7f7" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="energy" stroke="#2563eb" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

const Maintenance = () => {
  const [maintenanceStatus, setMaintenanceStatus] = useState("All systems operational");

  useEffect(() => {
    const interval = setInterval(() => {
      const performance = Math.random();
      if (performance < 0.2) setMaintenanceStatus("Performance Degradation Detected!");
      else setMaintenanceStatus("All systems operational");
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card title="Predictive Maintenance">
      <p>{maintenanceStatus}</p>
    </Card>
  );
};

const ImpactVisualizer = () => {
  const [impactData, setImpactData] = useState([]);
  useEffect(() => {
    const interval = setInterval(() => {
      setImpactData((prevData) => [...prevData.slice(-20), { time: new Date().toLocaleTimeString(), impact: Math.random() * 10 }]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <Card title="Environmental Impact Visualization">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={impactData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d1e7f7" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="impact" stroke="#82ca9d" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

const MicrogridControl = () => {
  const [gridStatus, setGridStatus] = useState("Stable");

  useEffect(() => {
    const interval = setInterval(() => {
      const load = Math.random();
      setGridStatus(load > 0.8 ? "Overload" : "Stable");
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card title="Smart Microgrid Management">
      <p>Grid Status: {gridStatus}</p>
    </Card>
  );
};

const EmergencyAlerts = () => {
  const [emergencyAlert, setEmergencyAlert] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const alertTrigger = Math.random();
      setEmergencyAlert(alertTrigger > 0.95 ? "High Energy Surge Detected!" : "All systems operational");
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card title="Solar-Powered Emergency Alerts">
      <p>{emergencyAlert}</p>
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
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/impact-visualizer" element={<ImpactVisualizer />} />
              <Route path="/microgrid-control" element={<MicrogridControl />} />
              <Route path="/emergency-alerts" element={<EmergencyAlerts />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default SolarApp;
