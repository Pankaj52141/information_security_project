import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ProjectDetails() {
  const { id } = useParams();
  const [data, setData] = useState({ project: null, risks: [], vulnerabilities: [] });
  const [loading, setLoading] = useState(true);

  // Form states
  const [riskForm, setRiskForm] = useState({ title: '', severity: 1, probability: 1, mitigationPlan: '' });
  const [vulnForm, setVulnForm] = useState({ title: '', severity: 'Low' });

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = () => {
    axios.get(`http://localhost:5000/api/projects/${id}`)
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  };

  const addRisk = (e) => {
    e.preventDefault();
    axios.post(`http://localhost:5000/api/projects/${id}/risks`, riskForm)
      .then(() => {
        fetchProject();
        setRiskForm({ title: '', severity: 1, probability: 1, mitigationPlan: '' });
      })
      .catch(err => console.error(err));
  };

  const addVuln = (e) => {
    e.preventDefault();
    axios.post(`http://localhost:5000/api/projects/${id}/vulnerabilities`, vulnForm)
      .then(() => {
        fetchProject();
        setVulnForm({ title: '', severity: 'Low' });
      })
      .catch(err => console.error(err));
  };

  const toggleVulnStatus = (vulnId, currentStatus) => {
    const newStatus = currentStatus === 'Open' ? 'Fixed' : 'Open';
    axios.put(`http://localhost:5000/api/vulnerabilities/${vulnId}`, { status: newStatus })
      .then(() => fetchProject())
      .catch(err => console.error(err));
  };

  if (loading) return <div className="animate-in">Loading project details...</div>;

  const { project, risks, vulnerabilities } = data;

  return (
    <div className="animate-in">
      <h1 style={{ marginBottom: '8px' }}>{project.name}</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
        Team: {project.team} | Deadline: {new Date(project.deadline).toLocaleDateString()}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Risks Section */}
        <div>
          <div className="glass-panel" style={{ marginBottom: '24px' }}>
            <h3>Add Risk</h3>
            <form onSubmit={addRisk}>
              <div className="input-group">
                <label>Risk Title</label>
                <input type="text" required value={riskForm.title} onChange={e => setRiskForm({...riskForm, title: e.target.value})} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label>Severity (1-5)</label>
                  <input type="number" min="1" max="5" required value={riskForm.severity} onChange={e => setRiskForm({...riskForm, severity: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Probability (1-5)</label>
                  <input type="number" min="1" max="5" required value={riskForm.probability} onChange={e => setRiskForm({...riskForm, probability: e.target.value})} />
                </div>
              </div>
              <div className="input-group">
                <label>Mitigation Plan</label>
                <textarea required value={riskForm.mitigationPlan} onChange={e => setRiskForm({...riskForm, mitigationPlan: e.target.value})}></textarea>
              </div>
              <button type="submit" className="btn">Add Risk</button>
            </form>
          </div>

          <div className="glass-panel">
            <h3>Registered Risks</h3>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {risks.map(r => (
                    <tr key={r._id}>
                      <td>{r.title}</td>
                      <td>
                        <span className={`badge badge-${r.score > 15 ? 'danger' : r.score > 10 ? 'warning' : 'success'}`}>
                          {r.score}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {risks.length === 0 && <tr><td colSpan="2">No risks logged.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Vulnerabilities Section */}
        <div>
          <div className="glass-panel" style={{ marginBottom: '24px' }}>
            <h3>Track Vulnerability</h3>
            <form onSubmit={addVuln}>
              <div className="input-group">
                <label>Vulnerability Type / Title</label>
                <input type="text" placeholder="e.g. SQL Injection" required value={vulnForm.title} onChange={e => setVulnForm({...vulnForm, title: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Severity</label>
                <select value={vulnForm.severity} onChange={e => setVulnForm({...vulnForm, severity: e.target.value})}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <button type="submit" className="btn">Add Vulnerability</button>
            </form>
          </div>

          <div className="glass-panel">
            <h3>Vulnerabilities</h3>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {vulnerabilities.map(v => (
                    <tr key={v._id}>
                      <td>{v.title}</td>
                      <td>
                        <span className={`badge badge-${v.severity.toLowerCase()}`}>
                          {v.severity}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${v.status === 'Open' ? 'danger' : 'success'}`}>
                          {v.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => toggleVulnStatus(v._id, v.status)}>
                          Mark {v.status === 'Open' ? 'Fixed' : 'Open'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {vulnerabilities.length === 0 && <tr><td colSpan="4">No vulnerabilities found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProjectDetails;
