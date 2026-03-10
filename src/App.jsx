import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard, Building2, Search as SearchIcon, Bell, BarChart3, Settings,
  AlertTriangle, BedDouble, Activity, Users, LogOut, Clock,
  Filter, Plus, MoreVertical, Edit2, CheckCircle2, Info, X, MapPin,
  Phone, ExternalLink, ChevronRight, ArrowUpRight, ArrowDownRight,
  TrendingUp, AlertCircle, Shield, User, Menu, RefreshCcw
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

// --- MOCK DATA ---
const ZONES = ['North', 'South', 'East', 'West', 'Central', 'Suburban'];
const ROLES = ['User', 'Hospital Admin', 'City Authority'];

const INITIAL_HOSPITALS = [
  { id: 1, name: 'City General Hospital', type: 'Public', zone: 'Central', status: 'Active', beds: { avail: 145, total: 200 }, icu: { avail: 8, total: 20 }, vent: { avail: 3, total: 15 }, address: '12, Sassoon Rd, Pune', contact: '+91 20 2612 8000', updated: '5 min ago' },
  { id: 2, name: 'Apollo Medical Center', type: 'Private', zone: 'North', status: 'Active', beds: { avail: 89, total: 120 }, icu: { avail: 18, total: 25 }, vent: { avail: 10, total: 12 }, address: 'Viman Nagar, Pune', contact: '+91 20 4910 1234', updated: '12 min ago' },
  { id: 3, name: 'Government District Hospital', type: 'Public', zone: 'South', status: 'Active', beds: { avail: 201, total: 350 }, icu: { avail: 4, total: 30 }, vent: { avail: 2, total: 20 }, address: 'Aundh Camp, Pune', contact: '+91 20 2727 0000', updated: '8 min ago' },
  { id: 4, name: 'Lifeline Multispecialty', type: 'Private', zone: 'East', status: 'Active', beds: { avail: 55, total: 80 }, icu: { avail: 12, total: 15 }, vent: { avail: 8, total: 10 }, address: 'Hadapsar, Pune', contact: '+91 20 6721 0000', updated: '22 min ago' },
  { id: 5, name: 'Sassoon General Hospital', type: 'Public', zone: 'West', status: 'Active', beds: { avail: 312, total: 500 }, icu: { avail: 22, total: 40 }, vent: { avail: 14, total: 25 }, address: 'Station Rd, Pune', contact: '+91 20 2612 7331', updated: '1 min ago' },
  { id: 6, name: 'Ruby Hall Clinic', type: 'Private', zone: 'Central', status: 'Active', beds: { avail: 78, total: 100 }, icu: { avail: 9, total: 12 }, vent: { avail: 6, total: 8 }, address: '40, Sassoon Rd, Pune', contact: '+91 20 6645 5100', updated: '30 min ago' },
  { id: 7, name: 'Jehangir Hospital', type: 'Private', zone: 'North', status: 'Active', beds: { avail: 44, total: 60 }, icu: { avail: 7, total: 10 }, vent: { avail: 4, total: 6 }, address: '32, Sassoon Rd, Pune', contact: '+91 20 6610 6610', updated: '45 min ago' },
  { id: 8, name: 'District Civil Hospital', type: 'Public', zone: 'Suburban', status: 'Inactive', beds: { avail: 0, total: 200 }, icu: { avail: 0, total: 20 }, vent: { avail: 0, total: 15 }, address: 'Wagholi, Pune', contact: '+91 20 2700 0001', updated: '2h ago' },
  { id: 9, name: 'Poona Hospital', type: 'Public', zone: 'East', status: 'Active', beds: { avail: 167, total: 250 }, icu: { avail: 15, total: 25 }, vent: { avail: 9, total: 18 }, address: 'Sadashiv Peth, Pune', contact: '+91 20 2433 1706', updated: '15 min ago' },
];

const INITIAL_ALERTS = [
  { id: 1, hospital: 'City General Hospital', resource: 'ICU Beds', value: 4, threshold: 5, severity: 'Critical', time: '14 min ago', status: 'Active' },
  { id: 2, hospital: 'Government District Hospital', resource: 'Ventilators', value: 2, threshold: 5, severity: 'Critical', time: '1h 23min ago', status: 'Active' },
  { id: 3, hospital: 'Poona Hospital', resource: 'General Beds', value: 83, threshold: 100, severity: 'Warning', time: '32 min ago', status: 'Active' },
  { id: 4, hospital: 'Sassoon Hospital', resource: 'ICU Beds', value: 2, threshold: 5, severity: 'Critical', time: '2h ago', status: 'Resolved', resolvedBy: 'Dr. Rao', note: 'Staff assigned' },
  { id: 5, hospital: 'Apollo Center', resource: 'Ventilators', value: 1, threshold: 3, severity: 'Critical', time: '4h ago', status: 'Resolved', resolvedBy: 'Admin', note: 'Fixed' },
];

const CHART_DATA_7D = [
  { name: 'Mon', general: 65, icu: 78, vent: 45 },
  { name: 'Tue', general: 59, icu: 82, vent: 48 },
  { name: 'Wed', general: 80, icu: 75, vent: 52 },
  { name: 'Thu', general: 81, icu: 70, vent: 50 },
  { name: 'Fri', general: 56, icu: 68, vent: 40 },
  { name: 'Sat', general: 55, icu: 72, vent: 38 },
  { name: 'Sun', general: 40, icu: 65, vent: 35 },
];

const UTILIZATION_BY_ZONE = [
  { zone: 'North', util: 72 },
  { zone: 'South', util: 85 },
  { zone: 'East', util: 58 },
  { zone: 'West', util: 77 },
  { zone: 'Central', util: 92 },
  { zone: 'Suburban', util: 45 },
];

const DASHBOARD_CHART_DATA = [
  { name: 'Monday', general: 65, icu: 78, vent: 45 },
  { name: 'Tuesday', general: 59, icu: 82, vent: 48 },
  { name: 'Wednesday', general: 80, icu: 75, vent: 52 },
  { name: 'Thursday', general: 81, icu: 70, vent: 50 },
  { name: 'Friday', general: 56, icu: 68, vent: 40 },
  { name: 'Saturday', general: 55, icu: 72, vent: 38 },
  { name: 'Sunday', general: 40, icu: 65, vent: 35 },
];

const DISTRIBUTION_DATA = [
  { name: 'General Beds', value: 3200, color: '#06B6D4' },
  { name: 'ICU Beds', value: 450, color: '#10B981' },
  { name: 'Ventilators', value: 180, color: '#F59E0B' },
  { name: 'Others', value: 120, color: '#EF4444' },
];

const USERS = [
  { id: 1, name: 'Dr. Sameer Admin', email: 'sameer@medigrid.com', role: 'System Admin', hospital: 'System-wide', status: 'Active', lastLogin: '10 min ago' },
  { id: 2, name: 'Priya Sharma', email: 'priya@cityhosp.com', role: 'Hospital Admin', hospital: 'City General', status: 'Active', lastLogin: '2h ago' },
  { id: 3, name: 'Rahul Verma', email: 'rahul@vision.com', role: 'Emergency Operator', hospital: 'Vision Medical', status: 'Inactive', lastLogin: '1 day ago' },
  { id: 4, name: 'Dr. Anjali Rao', email: 'anjali@apollo.com', role: 'Hospital Admin', hospital: 'Apollo Center', status: 'Active', lastLogin: '15 min ago' },
];

const AUDIT_LOGS = [
  { id: 1, entity: 'ICU Beds', oldVal: '10', newVal: '8', timestamp: '10:45 AM', user: 'Dr. Rao' },
  { id: 2, entity: 'Ventilators', oldVal: '2', newVal: '5', timestamp: '09:15 AM', user: 'Admin' },
  { id: 3, entity: 'General Beds', oldVal: '150', newVal: '145', timestamp: 'Yesterday', user: 'Priya S.' },
];

// --- COMPONENTS ---

const Badge = ({ children, color = 'cyan' }) => {
  const colors = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    gray: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${colors[color] || colors.cyan}`}>
      {children}
    </span>
  );
};

const StatCard = ({ title, value, label, icon: Icon, color, trend }) => (
  <div className="glass-card p-5 rounded-xl flex flex-col gap-3 relative overflow-hidden group">
    <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-${color}-500/5 rounded-full blur-2xl group-hover:bg-${color}-500/10 transition-colors`} />
    <div className="flex justify-between items-start">
      <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-400`}>
        <Icon size={20} />
      </div>
      {trend && (
        <span className={`text-xs font-medium flex items-center ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {trend > 0 ? <ArrowUpRight size={14} className="mr-0.5" /> : <ArrowDownRight size={14} className="mr-0.5" />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div>
      <div className="text-2xl font-bold font-mono tracking-tight text-white">{value}</div>
      <div className="text-sm text-slate-400 font-medium">{title}</div>
      {label && <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">{label}</div>}
    </div>
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="glass-card w-full max-w-2xl rounded-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto scrollbar-hide">
          {children}
        </div>
      </div>
    </div>
  );
};

const Toast = ({ message, type = 'success', onClose }) => (
  <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 glass-card px-4 py-3 rounded-xl shadow-2xl animate-in slide-in-from-right duration-300 border-l-4 border-l-cyan-500">
    {type === 'success' && <CheckCircle2 className="text-emerald-400" size={18} />}
    {type === 'error' && <AlertCircle className="text-red-400" size={18} />}
    <span className="text-sm text-slate-200 font-medium">{message}</span>
    <button onClick={onClose} className="ml-2 text-slate-500 hover:text-white"><X size={14} /></button>
  </div>
);

// --- APP COMPONENT ---

export default function App() {
  const [activePage, setActivePage] = useState('hospitals');
  const [role, setRole] = useState('User');
  const [hospitals, setHospitals] = useState(INITIAL_HOSPITALS);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [toast, setToast] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [hospitalFilters, setHospitalFilters] = useState({ type: 'All', zone: 'All', status: 'All' });
  const [modals, setModals] = useState({ hospitalDetails: null, addHospital: false, addUser: false, editThresholds: null });

  // Effects
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Derived State
  const activeAlertsCount = alerts.filter(a => a.status === 'Active').length;

  const filteredHospitals = useMemo(() => {
    return hospitals.filter(h => {
      const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.zone.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = hospitalFilters.type === 'All' || h.type === hospitalFilters.type;
      const matchesZone = hospitalFilters.zone === 'All' || h.zone === hospitalFilters.zone;
      const matchesStatus = hospitalFilters.status === 'All' || h.status === hospitalFilters.status;
      return matchesSearch && matchesType && matchesZone && matchesStatus;
    });
  }, [hospitals, searchQuery, hospitalFilters]);

  // Actions
  const showToast = (msg, type = 'success') => setToast({ message: msg, type });

  const resolveAlert = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'Resolved', resolvedBy: 'Dr. Admin', note: 'Manually cleared' } : a));
    showToast('Alert marked as resolved');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'hospitals', label: 'Hospitals', icon: Building2 },
    { id: 'search', label: 'Search', icon: SearchIcon },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: activeAlertsCount },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'myhospital', label: 'My Hospital', icon: Building2 },
    { id: 'admin', label: 'Admin Panel', icon: Settings },
  ].filter(item => {
    if (role === 'User') return ['hospitals', 'search'].includes(item.id);
    if (role === 'City Authority') return ['dashboard', 'hospitals', 'alerts', 'analytics'].includes(item.id);
    if (role === 'Hospital Admin') return ['dashboard', 'myhospital'].includes(item.id);
    return ['hospitals', 'search'].includes(item.id);
  });

  // Pages
  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Hospitals" value="24" icon={Building2} color="cyan" trend={2.3} />
        <StatCard title="Available Beds" value="1,847 / 3,200" icon={BedDouble} color="emerald" trend={-1.2} label="58% Availability" />
        <StatCard title="Active Alerts" value={activeAlertsCount} icon={AlertTriangle} color="red" label="Require Action" />
        <StatCard title="ICU Occupancy" value="78%" icon={Activity} color="amber" trend={0.5} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-cyan-400" />
            City-wide Resource Availability
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DASHBOARD_CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#1F2937', color: '#F9FAFB', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                <Bar dataKey="general" name="General Beds" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="icu" name="ICU Beds" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="vent" name="Ventilators" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex flex-col h-full">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Bell size={18} className="text-red-400" />
            Critical Alerts
          </h3>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 scrollbar-hide">
            {alerts.filter(a => a.status === 'Active').map(alert => (
              <div key={alert.id} className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-white">{alert.hospital}</h4>
                    <p className="text-xs text-red-400 font-medium mt-1">{alert.resource} Low</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-red-500 pulse-dot danger" />
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <Clock size={10} /> {alert.time}
                  <AlertCircle size={10} className="ml-auto" /> {alert.severity}
                </div>
                <button
                  onClick={() => resolveAlert(alert.id)}
                  className="w-full py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-lg transition-colors border border-red-500/20"
                >
                  Mark Resolved
                </button>
              </div>
            ))}
            <button
              onClick={() => setActivePage('alerts')}
              className="w-full py-2 text-slate-400 text-xs font-medium hover:text-cyan-400 transition-colors mt-2"
            >
              View All Alerts
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHospitals = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search hospitals or zones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select
            value={hospitalFilters.type}
            onChange={(e) => setHospitalFilters({ ...hospitalFilters, type: e.target.value })}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
          >
            <option>All Types</option>
            <option>Public</option>
            <option>Private</option>
          </select>
          <select
            value={hospitalFilters.zone}
            onChange={(e) => setHospitalFilters({ ...hospitalFilters, zone: e.target.value })}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
          >
            <option>All Zones</option>
            {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
          </select>
          <button
            onClick={() => setModals({ ...modals, addHospital: true })}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-2 transition-all"
          >
            <Plus size={16} /> Add Hospital
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHospitals.map(h => {
          const icuPercent = (h.icu.avail / h.icu.total) * 100;
          return (
            <div key={h.id} className="glass-card rounded-2xl p-5 flex flex-col gap-4 group">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="font-bold text-white group-hover:text-cyan-400 transition-colors">{h.name}</h4>
                  <div className="flex gap-2">
                    <Badge color={h.type === 'Public' ? 'blue' : 'purple'}>{h.type}</Badge>
                    <Badge color="gray">{h.zone}</Badge>
                    <Badge color={h.status === 'Active' ? 'green' : 'red'}>{h.status}</Badge>
                  </div>
                </div>
                <button className="p-1 hover:bg-slate-800 rounded-lg text-slate-500"><MoreVertical size={16} /></button>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'General Beds', avail: h.beds.avail, total: h.beds.total, color: 'emerald' },
                  { label: 'ICU Beds', avail: h.icu.avail, total: h.icu.total, color: icuPercent < 30 ? 'red' : icuPercent < 50 ? 'amber' : 'emerald' },
                  { label: 'Ventilators', avail: h.vent.avail, total: h.vent.total, color: 'cyan' },
                ].map((res, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-medium">
                      <span className="text-slate-400">{res.label}</span>
                      <span className="text-white font-mono">{res.avail}/{res.total}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-${res.color}-500 transition-all duration-1000`}
                        style={{ width: `${(res.avail / res.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-2 pt-4 border-t border-slate-800 flex justify-between items-center text-[10px]">
                <span className="text-slate-500">Last updated: {h.updated}</span>
                <div className="flex gap-2">
                  <button onClick={() => setModals({ ...modals, hospitalDetails: h })} className="px-3 py-1.5 rounded-lg border border-slate-700 hover:border-cyan-500/50 hover:bg-cyan-500/5 text-slate-300 hover:text-cyan-400 transition-all">Details</button>
                  <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors">Edit</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderSearch = () => (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto text-center space-y-6 py-12">
        <h1 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">Find Available Resources</h1>
        <p className="text-slate-400 text-lg">Real-time capacity tracking across all hospitals in Pune city.</p>

        <div className="glass-card p-2 rounded-2xl flex flex-col md:flex-row gap-2 shadow-2xl relative z-10">
          <div className="flex-1 relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" size={20} />
            <input
              type="text"
              placeholder="Enter area, zone or hospital name..."
              className="w-full bg-slate-900/50 border-none rounded-xl py-4 pl-12 pr-4 text-white focus:ring-2 ring-cyan-500/20"
            />
          </div>
          <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all">
            <SearchIcon size={20} /> Search
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          <span className="text-slate-500 uppercase tracking-widest font-bold">Filters:</span>
          <button className="px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-bold">All Resources</button>
          <button className="px-4 py-2 rounded-full border border-slate-800 hover:border-slate-700 text-slate-400">ICU Bed</button>
          <button className="px-4 py-2 rounded-full border border-slate-800 hover:border-slate-700 text-slate-400">Ventilator</button>
          <button className="px-4 py-2 rounded-full border border-slate-800 hover:border-slate-700 text-slate-400">Any Zone</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold">Top Recommendations</h3>
          <span className="text-xs text-slate-500">{hospitals.length} hospitals found</span>
        </div>

        {hospitals.slice(0, 6).sort((a, b) => b.icu.avail - a.icu.avail).map((h, idx) => (
          <div key={h.id} className={`glass-card rounded-2xl overflow-hidden flex flex-col md:flex-row items-stretch group relative ${idx === 0 ? 'border-cyan-500/40 border-2' : ''}`}>
            <div className="w-2 md:w-3 bg-gradient-to-b from-emerald-500 to-emerald-600" />
            {idx === 0 && <span className="absolute -top-3 left-8 bg-cyan-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">Best Match</span>}

            <div className="p-6 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">{h.name}</h4>
                  <Badge color={h.type === 'Public' ? 'blue' : 'purple'}>{h.type}</Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><MapPin size={12} className="text-cyan-500" /> {h.zone}</span>
                  <span className="flex items-center gap-1"><Shield size={12} className="text-emerald-500" /> Verified</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-2">{h.address}</div>
              </div>

              <div className="flex items-center gap-4">
                {[
                  { val: h.beds.avail, label: 'General', color: 'bg-emerald-500/20 text-emerald-400' },
                  { val: h.icu.avail, label: 'ICU', color: 'bg-amber-500/20 text-amber-400' },
                  { val: h.vent.avail, label: 'Vent', color: 'bg-cyan-500/20 text-cyan-400' }
                ].map((res, i) => (
                  <div key={i} className={`flex-1 p-3 rounded-xl ${res.color} border border-white/5 text-center`}>
                    <div className="text-lg font-bold font-mono">{res.val}</div>
                    <div className="text-[9px] uppercase tracking-wider font-bold opacity-80">{res.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col justify-center gap-2">
                <button className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20">Get Directions</button>
                <button className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all">
                  <Phone size={14} /> Call Hospital
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Active" value={activeAlertsCount} icon={AlertTriangle} color="red" />
        <StatCard title="Resolved Today" value="12" icon={CheckCircle2} color="emerald" />
        <StatCard title="Avg. Resolution Time" value="42m" icon={Clock} color="cyan" />
      </div>

      <div className="glass-card rounded-2xl p-6 min-h-[500px]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            {['All', 'Active', 'Resolved'].map(tab => (
              <button key={tab} className={`pb-2 px-1 text-sm font-bold transition-colors border-b-2 ${tab === 'All' ? 'text-cyan-400 border-cyan-400' : 'text-slate-500 border-transparent hover:text-white'}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {alerts.map(alert => (
            <div key={alert.id} className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex flex-col md:flex-row items-center gap-4 hover:border-slate-700 transition-all">
              <div className={`w-2 h-2 rounded-full ${alert.status === 'Active' ? 'bg-red-500 pulse-dot danger' : 'bg-emerald-500'}`} />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-sm">{alert.hospital}</h4>
                  <Badge color={alert.severity === 'Critical' ? 'red' : 'amber'}>{alert.severity}</Badge>
                </div>
                <p className="text-xs text-slate-400">{alert.resource} triggered at {alert.value} (Threshold: {alert.threshold})</p>
              </div>
              <div className="text-right space-y-1 md:w-32">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest">{alert.status}</div>
                <div className="text-[11px] text-slate-400">{alert.time}</div>
              </div>
              <div className="md:w-40 flex justify-end">
                {alert.status === 'Active' ? (
                  <button onClick={() => resolveAlert(alert.id)} className="px-4 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-500 text-[11px] font-bold rounded-lg border border-emerald-500/20 transition-all">Mark Resolved</button>
                ) : (
                  <div className="text-[10px] text-emerald-500 font-bold flex items-center gap-1"><CheckCircle2 size={12} /> Resolved by {alert.resolvedBy}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2"><BarChart3 className="text-cyan-400" /> System Insights</h2>
        <div className="flex gap-2">
          <select className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
          </select>
          <button onClick={() => showToast('Report exported successfully')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors">Export CSV</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-wider">Bed Availability Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CHART_DATA_7D}>
                <CartesianGrid stroke="#1F2937" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="general" stroke="#06B6D4" strokeWidth={3} dot={{ fill: '#06B6D4', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: '#fff' }} />
                <Line type="monotone" dataKey="icu" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', strokeWidth: 0, r: 4 }} />
                <Line type="monotone" dataKey="vent" stroke="#F59E0B" strokeWidth={3} dot={{ fill: '#F59E0B', strokeWidth: 0, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-wider">Utilization by Zone</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={UTILIZATION_BY_ZONE}>
                <XAxis dataKey="zone" stroke="#64748b" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                <Bar dataKey="util" radius={[6, 6, 0, 0]}>
                  {UTILIZATION_BY_ZONE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.util > 80 ? '#EF4444' : entry.util > 60 ? '#F59E0B' : '#10B981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-wider">Resource Distribution</h3>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={DISTRIBUTION_DATA} innerRadius={80} outerRadius={110} paddingAngle={8} dataKey="value">
                  {DISTRIBUTION_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
          <h3 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-wider">Top Utilized Hospitals</h3>
          <div className="space-y-4">
            {hospitals.slice(0, 5).map((h, i) => {
              const perc = Math.floor(60 + Math.random() * 35);
              return (
                <div key={h.id} className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-white">{h.name}</span>
                    <span className={perc > 85 ? 'text-red-400' : 'text-emerald-400'}>{perc}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${perc > 85 ? 'from-red-600 to-red-400' : 'from-emerald-600 to-emerald-400'}`} style={{ width: `${perc}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdmin = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex gap-4 border-b border-slate-800 pb-px">
        {['Users', 'Thresholds', 'Audit Logs'].map(tab => (
          <button key={tab} className="pb-4 px-2 text-sm font-bold text-cyan-400 border-b-2 border-cyan-400">
            {tab}
          </button>
        ))}
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/50 text-slate-500 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Hospital</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Login</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {USERS.map(u => (
                <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{u.name}<div className="text-[10px] text-slate-500 font-normal">{u.email}</div></td>
                  <td className="px-6 py-4"><Badge color="cyan">{u.role}</Badge></td>
                  <td className="px-6 py-4 text-slate-400 text-xs">{u.hospital}</td>
                  <td className="px-6 py-4"><span className={`flex items-center gap-1.5 text-xs ${u.status === 'Active' ? 'text-emerald-400' : 'text-slate-500'}`}><div className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-600'}`} /> {u.status}</span></td>
                  <td className="px-6 py-4 text-xs text-slate-500">{u.lastLogin}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 group-hover:text-white transition-all"><Edit2 size={14} /></button>
                    <button className="p-2 hover:bg-red-500/10 rounded-lg text-red-400/50 hover:text-red-400 ml-1 transition-all"><X size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderHospitalAdmin = () => (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-2xl mx-auto py-8">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-bold text-white">Resource Management</h2>
        <p className="text-slate-400">Update current availability for City General Hospital</p>
      </div>

      <div className="glass-card rounded-2xl p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'General Beds', val: 145, max: 200, unit: 'Beds', icon: BedDouble, color: 'emerald' },
            { label: 'ICU Beds', val: 8, max: 20, unit: 'Beds', icon: Activity, color: 'amber' },
            { label: 'Ventilators', val: 3, max: 15, unit: 'Units', icon: TrendingUp, color: 'cyan' },
          ].map((field, i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <field.icon size={14} /> {field.label}
              </div>
              <input
                type="number"
                defaultValue={field.val}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-2xl font-mono text-white focus:outline-none focus:border-cyan-500 focus:ring-1 ring-cyan-500/50"
              />
              <div className="text-[10px] text-slate-500 text-center font-bold">MAX CAPACITY: {field.max} {field.unit}</div>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-slate-800">
          <button onClick={() => showToast('Hospital resources updated successfully')} className="w-full py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-xl shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2">
            <RefreshCcw size={18} /> Update Resources
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Recent Updates</h3>
        <div className="space-y-4">
          {AUDIT_LOGS.slice(0, 3).map(log => (
            <div key={log.id} className="flex justify-between items-center text-xs">
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold">DS</div>
                <div>
                  <div className="text-white font-bold">{log.entity}</div>
                  <div className="text-slate-500 text-[10px] uppercase">Changed {log.oldVal} → {log.newVal}</div>
                </div>
              </div>
              <div className="text-slate-500">{log.timestamp}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#0A0E1A] text-slate-200 medi-grid-bg">
      {/* Sidebar */}
      <aside className={`w-[240px] border-r border-slate-800 bg-[#0D1117] flex flex-col h-screen fixed inset-y-0 z-40 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActivePage('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:scale-110 transition-transform">
              <Shield size={24} />
            </div>
            <span className="text-xl font-bold tracking-tighter text-white">MediGrid</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1.5">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${activePage === item.id ? 'active-nav-item' : 'text-slate-500 hover:text-white hover:bg-slate-800/50'}`}
            >
              <item.icon size={20} className={activePage === item.id ? 'text-cyan-400' : 'group-hover:text-cyan-400 transition-colors'} />
              <span className="text-sm font-bold">{item.label}</span>
              {item.badge > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-slate-900">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900/20">
          <div className="flex items-center gap-3 p-2">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-xs font-bold text-white uppercase tracking-tighter">DA</div>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-bold text-white truncate">Dr. Admin</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest truncate">{role}</div>
            </div>
            <button className="p-2 text-slate-500 hover:text-red-400 transition-colors"><LogOut size={16} /></button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? 'lg:pl-[240px]' : ''}`}>
        <header className="h-16 border-b border-slate-800 bg-[#0A0E1A]/80 backdrop-blur-xl sticky top-0 z-30 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 lg:hidden">
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-bold text-white capitalize">{activePage.replace(/([A-Z])/g, ' $1')}</h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-tighter">
                <Clock size={12} className="text-cyan-400" />
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className="text-[10px] text-slate-500">{currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</div>
            </div>

            <div className="h-8 w-px bg-slate-800 mx-2" />

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold hidden sm:block">Role:</span>
              <select
                value={role}
                onChange={(e) => {
                  const newRole = e.target.value;
                  setRole(newRole);
                  showToast(`Switched to ${newRole} perspective`, 'info');

                  // Reset view if current page is restricted
                  const allowed = {
                    'User': ['hospitals', 'search'],
                    'City Authority': ['dashboard', 'hospitals', 'alerts', 'analytics'],
                    'Hospital Admin': ['dashboard', 'myhospital'],
                  };
                  if (!allowed[newRole]?.includes(activePage)) {
                    setActivePage(allowed[newRole][0]);
                  }
                }}
                className="bg-slate-900/50 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <button className="relative p-2 text-slate-500 hover:text-white transition-colors" onClick={() => setActivePage('alerts')}>
              <Bell size={20} />
              {activeAlertsCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0A0E1A]" />}
            </button>
          </div>
        </header>

        <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
          {activePage === 'dashboard' && renderDashboard()}
          {activePage === 'hospitals' && renderHospitals()}
          {activePage === 'search' && renderSearch()}
          {activePage === 'alerts' && renderAlerts()}
          {activePage === 'analytics' && renderAnalytics()}
          {activePage === 'admin' && renderAdmin()}
          {activePage === 'myhospital' && renderHospitalAdmin()}
        </div>
      </main>

      {/* Modals & Toasts */}
      <Modal
        isOpen={!!modals.hospitalDetails}
        onClose={() => setModals({ ...modals, hospitalDetails: null })}
        title={modals.hospitalDetails?.name || 'Hospital Details'}
      >
        {modals.hospitalDetails && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Type</div>
                <div className="text-sm font-bold text-white">{modals.hospitalDetails.type}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Zone</div>
                <div className="text-sm font-bold text-white">{modals.hospitalDetails.zone}</div>
              </div>
              <div className="space-y-1 col-span-2">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Address</div>
                <div className="text-sm text-slate-300">{modals.hospitalDetails.address}</div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">Resource Utilization</h4>
              <div className="space-y-6">
                {[
                  { label: 'General Beds', avail: modals.hospitalDetails.beds.avail, total: modals.hospitalDetails.beds.total, fill: '#06B6D4' },
                  { label: 'ICU Beds', avail: modals.hospitalDetails.icu.avail, total: modals.hospitalDetails.icu.total, fill: '#10B981' },
                  { label: 'Ventilators', avail: modals.hospitalDetails.vent.avail, total: modals.hospitalDetails.vent.total, fill: '#F59E0B' }
                ].map((res, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">{res.label}</span>
                      <span className="text-white font-mono">{Math.floor((res.avail / res.total) * 100)}% Used</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full transition-all" style={{ width: `${(res.avail / res.total) * 100}%`, backgroundColor: res.fill }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button className="px-4 py-2 border border-slate-700 hover:border-slate-600 rounded-lg text-xs" onClick={() => setModals({ ...modals, hospitalDetails: null })}>Close</button>
              <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-lg text-xs transition-colors">Edit Records</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={modals.addHospital} onClose={() => setModals({ ...modals, addHospital: false })} title="Add New Hospital">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setModals({ ...modals, addHospital: false }); showToast('Hospital added to registry successfully'); }}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 col-span-2">
              <label className="text-[10px] text-slate-500 uppercase font-bold">Hospital Name</label>
              <input type="text" required className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-cyan-500" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 uppercase font-bold">Type</label>
              <select className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none">
                <option>Public</option>
                <option>Private</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 uppercase font-bold">Zone</label>
              <select className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none">
                {ZONES.map(z => <option key={z}>{z}</option>)}
              </select>
            </div>
            <div className="space-y-1 col-span-2">
              <label className="text-[10px] text-slate-500 uppercase font-bold">Address</label>
              <textarea className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none h-20" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 uppercase font-bold">Contact Number</label>
              <input type="tel" className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 uppercase font-bold">General Capacity</label>
              <input type="number" className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <button type="button" className="px-4 py-2 text-slate-500 hover:text-white" onClick={() => setModals({ ...modals, addHospital: false })}>Cancel</button>
            <button type="submit" className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-lg text-xs shadow-lg shadow-cyan-500/20">Register Hospital</button>
          </div>
        </form>
      </Modal>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
