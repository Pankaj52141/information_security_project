import { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle } from 'lucide-react';

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/dashboard')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  if (loading) return <div className="animate-in">Loading dashboard...</div>;

  const riskData = [
    { name: 'Low', value: data.riskLevels.low, color: '#10b981' },
    { name: 'Medium', value: data.riskLevels.medium, color: '#f59e0b' },
    { name: 'High', value: data.riskLevels.high, color: '#f97316' },
    { name: 'Critical', value: data.riskLevels.critical, color: '#ef4444' },
  ];

  const vulnData = [
    { name: 'Open', value: data.vulnStatus.open, color: '#ef4444' },
    { name: 'Fixed', value: data.vulnStatus.fixed, color: '#10b981' },
  ];

  const totalHighCriticalRisks = data.riskLevels.high + data.riskLevels.critical;

  return (
    <div className="animate-in">
      <h1>Security Overview</h1>

      {totalHighCriticalRisks > 0 && (
        <div className="alert-banner">
          <AlertTriangle color="var(--danger)" />
          <span>You have <strong>{totalHighCriticalRisks}</strong> high/critical risks that require immediate attention.</span>
        </div>
      )}

      <div className="grid-cards">
        <div className="glass-panel metric-card">
          <span style={{ color: 'var(--text-muted)' }}>Total Projects</span>
          <span className="metric-value">{data.projectsCount}</span>
        </div>
        <div className="glass-panel metric-card">
          <span style={{ color: 'var(--text-muted)' }}>Total Risks</span>
          <span className="metric-value">{data.totalRisks}</span>
        </div>
        <div className="glass-panel metric-card">
          <span style={{ color: 'var(--text-muted)' }}>Open Vulnerabilities</span>
          <span className="metric-value">{data.vulnStatus.open}</span>
        </div>
      </div>

      <div className="charts-grid">
        <div className="glass-panel">
          <h3>Risk Levels</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.15)" />
                <XAxis dataKey="name" stroke="#f8fafc" />
                <YAxis stroke="#f8fafc" />
                <RechartsTooltip contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px', color: '#f8fafc' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel">
          <h3>Vulnerability Status</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={vulnData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {vulnData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px', color: '#f8fafc' }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#ef4444', flexShrink: 0, marginTop: '1px' }}></div>
                <span style={{ color: '#f8fafc', fontSize: '0.95rem' }}>Open</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#10b981', flexShrink: 0, marginTop: '1px' }}></div>
                <span style={{ color: '#f8fafc', fontSize: '0.95rem' }}>Fixed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
