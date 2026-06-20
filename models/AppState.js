import mongoose from 'mongoose';

const AppStateSchema = new mongoose.Schema({
  stateKey: {
    type: String,
    required: true,
    unique: true,
    default: 'main'
  },
  schools: { type: mongoose.Schema.Types.Mixed, default: [] },
  teachers: { type: mongoose.Schema.Types.Mixed, default: [] },
  students: { type: mongoose.Schema.Types.Mixed, default: [] },
  parents: { type: mongoose.Schema.Types.Mixed, default: [] },
  admins: { type: mongoose.Schema.Types.Mixed, default: [] },
  attendance: { type: mongoose.Schema.Types.Mixed, default: [] },
  marks: { type: mongoose.Schema.Types.Mixed, default: [] },
  homework: { type: mongoose.Schema.Types.Mixed, default: [] },
  notes: { type: mongoose.Schema.Types.Mixed, default: [] },
  circulars: { type: mongoose.Schema.Types.Mixed, default: [] },
  liveClasses: { type: mongoose.Schema.Types.Mixed, default: [] },
  libraryBooks: { type: mongoose.Schema.Types.Mixed, default: [] },
  hostels: { type: mongoose.Schema.Types.Mixed, default: [] },
  transportRoutes: { type: mongoose.Schema.Types.Mixed, default: [] },
  timetables: { type: mongoose.Schema.Types.Mixed, default: [] },
  fees: { type: mongoose.Schema.Types.Mixed, default: [] },
  tickerItems: { type: mongoose.Schema.Types.Mixed, default: [] },
  schoolInfo: { type: mongoose.Schema.Types.Mixed, default: {} },
  managementCommittee: { type: mongoose.Schema.Types.Mixed, default: [] },
  exams: { type: mongoose.Schema.Types.Mixed, default: [] },
  classes: { type: mongoose.Schema.Types.Mixed, default: [] },
  sections: { type: mongoose.Schema.Types.Mixed, default: [] },
  auditLogs: { type: mongoose.Schema.Types.Mixed, default: [] },
  supportTickets: { type: mongoose.Schema.Types.Mixed, default: [] },
  galleryItems: { type: mongoose.Schema.Types.Mixed, default: [] },
  academicCalendar: { type: mongoose.Schema.Types.Mixed, default: [] },
  academicPrograms: { type: mongoose.Schema.Types.Mixed, default: [] },
  testimonials: { type: mongoose.Schema.Types.Mixed, default: [] },
  enquiries: { type: mongoose.Schema.Types.Mixed, default: [] },
  subjects: { type: mongoose.Schema.Types.Mixed, default: [] },
  admissionBanner: { type: mongoose.Schema.Types.Mixed, default: {} },
  admissions: { type: mongoose.Schema.Types.Mixed, default: [] },
  facilities: { type: mongoose.Schema.Types.Mixed, default: [] },
  homepageInfra: { type: mongoose.Schema.Types.Mixed, default: [] },
  homepageStats: { type: mongoose.Schema.Types.Mixed, default: [] },
  gradingProcess: { type: mongoose.Schema.Types.Mixed, default: [] },
  gradingScheme: { type: mongoose.Schema.Types.Mixed, default: [] },
  departments: { type: mongoose.Schema.Types.Mixed, default: [] },
  galleryCategories: { type: mongoose.Schema.Types.Mixed, default: [] },
  complaints: { type: mongoose.Schema.Types.Mixed, default: [] },
  whatsappLogs: { type: mongoose.Schema.Types.Mixed, default: [] },
  requiredDocuments: { type: mongoose.Schema.Types.Mixed, default: [] },
  leaveRequests: { type: mongoose.Schema.Types.Mixed, default: [] },
  starredFormFields: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { 
  timestamps: true,
  minimize: false 
});

const AppState = mongoose.models.AppState || mongoose.model('AppState', AppStateSchema);

export default AppState;
