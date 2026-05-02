import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Plus } from 'lucide-react';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', team: '', deadline: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    axios.get('http://localhost:5000/api/projects')
      .then(res => setProjects(res.data))
      .catch(err => console.error(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/projects', formData)
      .then(() => {
        fetchProjects();
        setShowForm(false);
        setFormData({ name: '', team: '', deadline: '' });
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1>Projects</h1>
        <button className="btn" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> New Project
        </button>
      </div>

      {showForm && (
        <div className="glass-panel" style={{ marginBottom: '24px' }}>
          <h3>Create Project</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
            <div className="input-group">
              <label>Project Name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Team</label>
              <input type="text" required value={formData.team} onChange={e => setFormData({...formData, team: e.target.value})} />
            </div>
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label>Deadline</label>
              <input type="date" required value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn">Save Project</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-panel table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Team</th>
              <th>Deadline</th>
              <th>Risks</th>
              <th>Open Vulns</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(p => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.team}</td>
                <td>{new Date(p.deadline).toLocaleDateString()}</td>
                <td><span className="badge badge-warning">{p.riskCount || 0}</span></td>
                <td><span className="badge badge-danger">{p.openVulnerabilities || 0}</span></td>
                <td>
                  <Link to={`/projects/${p._id}`} className="btn" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>View</Link>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No projects found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Projects;
