import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  qualification: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  designation: {
    type: String,
    default: 'Teacher'
  },
  photo: {
    type: String,
    default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  }
}, { timestamps: true });

const Teacher = mongoose.model('Teacher', teacherSchema);
export default Teacher;
