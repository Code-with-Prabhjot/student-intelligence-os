const mongoose = require('mongoose');

// RVCE USN Format regex: supports both 1RV and 1RZ prefixes (e.g., 1RV23CS001, 1RZ25CS042)
const usnRegex = /^1(RV|RZ)\d{2}[A-Z]{2,3}\d{3}$/i;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const studentSchema = new mongoose.Schema(
  {
    usn: {
      type: String,
      required: [true, 'USN is mandatory'],
      unique: true,
      uppercase: true,
      trim: true,
      match: [usnRegex, 'USN must follow standard RVCE format (e.g., 1RV23CS001 or 1RZ25CS042)'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Student full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Student email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [emailRegex, 'Please provide a valid email address'],
      index: true,
    },
    branch: {
      type: String,
      required: [true, 'Engineering branch is required'],
      trim: true,
      uppercase: true,
      enum: {
        values: [
          'CSE',
          'ISE',
          'AIML',
          'ECE',
          'EEE',
          'MECH',
          'CIVIL',
          'BIOTECH',
          'CHEMICAL',
          'AEROSPACE',
          'ETE',
          'IEM'
        ],
        message: '{VALUE} is not a valid RVCE engineering branch',
      },
    },
    semester: {
      type: Number,
      required: [true, 'Academic semester is required'],
      min: [1, 'Semester must be between 1 and 8'],
      max: [8, 'Semester must be between 1 and 8'],
      index: true,
    },
    cgpa: {
      type: Number,
      required: [true, 'CGPA is required'],
      min: [0.0, 'CGPA cannot be less than 0.0'],
      max: [10.0, 'CGPA cannot exceed 10.0'],
      index: true,
    },
    attendance: {
      type: Number,
      required: [true, 'Attendance percentage is required'],
      min: [0, 'Attendance cannot be below 0%'],
      max: [100, 'Attendance cannot exceed 100%'],
      index: true,
    },
    status: {
      type: String,
      enum: [
        'Active',
        'At-Risk',
        'Suspended',
        'Graduated',
        'Condonation Required',
        'Detained',
        'Graduating'
      ],
      default: 'Active',
      index: true,
    },
    skills: {
      type: [String],
      default: [],
      set: (val) => {
        if (Array.isArray(val)) {
          return val.map((s) => s.trim()).filter(Boolean);
        }
        if (typeof val === 'string') {
          return val.split(',').map((s) => s.trim()).filter(Boolean);
        }
        return [];
      },
    },
    avatar: {
      type: String,
      trim: true,
      default: function () {
        const encodedName = encodeURIComponent(this.name || 'Student');
        return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodedName}`;
      },
    },
    phone: {
      type: String,
      trim: true,
      default: '+91 98765 43210',
    },
    section: {
      type: String,
      trim: true,
      uppercase: true,
      default: 'A',
    },
    mentor: {
      type: String,
      trim: true,
      default: 'Dr. K. N. Subramanya',
    },
    githubUsername: {
      type: String,
      trim: true,
      default: '',
    },
    leetcodeHandle: {
      type: String,
      trim: true,
      default: '',
    },
    portfolioUrl: {
      type: String,
      trim: true,
      default: '',
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual property: Attendance Tier
studentSchema.virtual('attendanceTier').get(function () {
  if (this.attendance >= 85) return 'Safe';
  if (this.attendance >= 75) return 'Warning';
  return 'Critical';
});

// Virtual property: Performance Tier
studentSchema.virtual('performanceTier').get(function () {
  if (this.cgpa >= 9.0) return 'Distinction';
  if (this.cgpa >= 7.5) return 'First Class';
  if (this.cgpa >= 6.0) return 'Second Class';
  return 'Pass Class';
});

// Virtual property: Academic Year derived from batch digits (25 -> 1st Year, 24 -> 2nd Year, etc.)
studentSchema.virtual('academicYear').get(function () {
  if (!this.usn) return 'Unknown Year';
  const match = this.usn.match(/^1(?:RV|RZ)(\d{2})/i);
  if (!match) return 'Unknown Year';
  const yearCode = parseInt(match[1], 10);
  if (yearCode === 25) return '1st Year';
  if (yearCode === 24) return '2nd Year';
  if (yearCode === 23) return '3rd Year';
  if (yearCode === 22) return '4th Year';
  return `${yearCode} Batch`;
});

// Virtual property: Batch Year (e.g., 2025, 2024, etc.)
studentSchema.virtual('batchYear').get(function () {
  if (!this.usn) return '';
  const match = this.usn.match(/^1(?:RV|RZ)(\d{2})/i);
  return match ? `20${match[1]}` : '';
});

// Auto-update status if attendance is critical
studentSchema.pre('save', function (next) {
  if (this.attendance < 75 && this.status === 'Active') {
    this.status = 'At-Risk';
  }
  next();
});

// Compound index for fast multi-field search and sorting
studentSchema.index({ name: 'text', usn: 'text', branch: 'text' });
studentSchema.index({ branch: 1, semester: 1 });
studentSchema.index({ cgpa: -1 });

module.exports = mongoose.model('Student', studentSchema);
