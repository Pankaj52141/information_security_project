import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Project from './models/Project.js';
import Risk from './models/Risk.js';
import Vulnerability from './models/Vulnerability.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Replace with a default local mongo uri if not provided
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/security_dashboard';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Dashboard Data
app.get('/api/dashboard', async (req, res) => {
  try {
    const projectsCount = await Project.countDocuments();
    const risks = await Risk.find();
    const vulnerabilities = await Vulnerability.find();
    
    const riskLevels = { low: 0, medium: 0, high: 0, critical: 0 };
    risks.forEach(r => {
      if (r.score <= 5) riskLevels.low++;
      else if (r.score <= 10) riskLevels.medium++;
      else if (r.score <= 15) riskLevels.high++;
      else riskLevels.critical++;
    });

    const vulnStatus = { open: 0, fixed: 0 };
    vulnerabilities.forEach(v => {
      if (v.status === 'Open') vulnStatus.open++;
      else vulnStatus.fixed++;
    });

    res.json({
      projectsCount,
      riskLevels,
      vulnStatus,
      totalRisks: risks.length,
      totalVulnerabilities: vulnerabilities.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Projects
app.post('/api/projects', async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    
    // Get all risks and vulnerabilities to calculate alerts/statuses
    const projectsWithDetails = await Promise.all(projects.map(async (project) => {
      const risks = await Risk.find({ projectId: project._id });
      const vulnerabilities = await Vulnerability.find({ projectId: project._id, status: 'Open' });
      return {
        ...project.toObject(),
        riskCount: risks.length,
        openVulnerabilities: vulnerabilities.length
      };
    }));

    res.json(projectsWithDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    const risks = await Risk.find({ projectId: req.params.id });
    const vulnerabilities = await Vulnerability.find({ projectId: req.params.id });
    res.json({ project, risks, vulnerabilities });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Risks
app.post('/api/projects/:id/risks', async (req, res) => {
  try {
    const risk = new Risk({
      ...req.body,
      projectId: req.params.id,
      score: req.body.severity * req.body.probability
    });
    await risk.save();
    res.status(201).json(risk);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Vulnerabilities
app.post('/api/projects/:id/vulnerabilities', async (req, res) => {
  try {
    const vuln = new Vulnerability({
      ...req.body,
      projectId: req.params.id
    });
    await vuln.save();
    res.status(201).json(vuln);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/vulnerabilities/:id', async (req, res) => {
  try {
    const vuln = await Vulnerability.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(vuln);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
