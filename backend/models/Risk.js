import mongoose from 'mongoose';

const riskSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  title: { type: String, required: true },
  severity: { type: Number, required: true, min: 1, max: 5 },
  probability: { type: Number, required: true, min: 1, max: 5 },
  score: { type: Number, required: true },
  mitigationPlan: { type: String }
}, { timestamps: true });

export default mongoose.model('Risk', riskSchema);
