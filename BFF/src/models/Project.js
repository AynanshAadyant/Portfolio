import mongoose from 'mongoose';

const KeyFeatureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    code: { type: String, default: '' },
    language: { type: String, default: 'typescript' },
  },
  { _id: false }
);

const ProjectSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: [true, 'Project slug is required'],
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    problem: {
      type: String,
      default: '',
    },
    architecture: {
      type: String,
      default: '',
    },
    architecture_diagram: {
      type: String,
      default: '',
    },
    key_features: {
      type: [KeyFeatureSchema],
      default: [],
    },
    impact_metrics: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: () => new Map(),
    },
    tech_tags: {
      type: [String],
      default: [],
    },
    github_url: {
      type: String,
      default: '',
    },
    live_url: {
      type: String,
      default: '',
    },
    thumbnail_url: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    display_order: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        // Convert Map to plain object for impact_metrics
        if (ret.impact_metrics instanceof Map) {
          ret.impact_metrics = Object.fromEntries(ret.impact_metrics);
        }
        return ret;
      },
    },
  }
);

export const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
export default Project;
