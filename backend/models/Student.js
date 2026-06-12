import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  registerNo: {
    type: String,
    required: true,
    unique: true
  },
  rollNo: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  bloodGroup: {
    type: String,
    default: 'O+'
  },
  aadhaarNo: {
    type: String
  },
  address: {
    type: String
  },
  class: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent'
  },
  emergencyContact: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    default: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  }
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
export default Student;
