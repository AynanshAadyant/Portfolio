import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, 'Content block key is required'],
      unique: true,
      index: true,
      trim: true,
    },
    value: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Content = mongoose.models.Content || mongoose.model('Content', ContentSchema);
export default Content;
