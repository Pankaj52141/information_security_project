import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  team: { type: String, required: true },
  deadline: { type: Date, required: true },
  progress: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
