import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  UserPlus, 
  GraduationCap, 
  Layers, 
  Hash, 
  Mail, 
  Percent, 
  Award, 
  BookOpen, 
  Wrench,
  UserCheck
} from 'lucide-react';
import { useStudentContext } from '../context/StudentContext';

const branches = [
  'CSE', 'AIML', 'ISE', 'ECE', 'EEE', 'MECH', 
  'CIVIL', 'BIOTECH', 'CHEMICAL', 'AEROSPACE', 'ETE', 'IEM'
];

export default function StudentDrawer() {
  const { isDrawerOpen, drawerMode, activeStudent, closeDrawer, saveStudent } = useStudentContext();

  const [formData, setFormData] = useState({
    usn: '',
    name: '',
    email: '',
    branch: 'CSE',
    semester: 4,
    cgpa: 8.5,
    attendance: 88,
    status: 'Active',
    skills: '',
    phone: '+91 98765 43210',
    section: 'A',
    mentor: 'Dr. B. S. Shylaja',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (activeStudent && drawerMode === 'edit') {
      setFormData({
        usn: activeStudent.usn || '',
        name: activeStudent.name || '',
        email: activeStudent.email || '',
        branch: activeStudent.branch || 'CSE',
        semester: activeStudent.semester || 4,
        cgpa: activeStudent.cgpa !== undefined ? activeStudent.cgpa : 8.5,
        attendance: activeStudent.attendance !== undefined ? activeStudent.attendance : 88,
        status: activeStudent.status || 'Active',
        skills: Array.isArray(activeStudent.skills) ? activeStudent.skills.join(', ') : '',
        phone: activeStudent.phone || '+91 98765 43210',
        section: activeStudent.section || 'A',
        mentor: activeStudent.mentor || 'Dr. B. S. Shylaja',
      });
    } else {
      setFormData({
        usn: '',
        name: '',
        email: '',
        branch: 'CSE',
        semester: 4,
        cgpa: 8.5,
        attendance: 88,
        status: 'Active',
        skills: 'React, Node.js, Python, MongoDB',
        phone: '+91 98765 43210',
        section: 'A',
        mentor: 'Dr. B. S. Shylaja',
      });
    }
    setErrors({});
  }, [activeStudent, drawerMode, isDrawerOpen]);

  if (!isDrawerOpen) return null;

  const validate = () => {
    const newErrors = {};
    const usnPattern = /^1RV\d{2}[A-Z]{2,3}\d{3}$/i;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.usn.trim()) {
      newErrors.usn = 'USN is required';
    } else if (!usnPattern.test(formData.usn.trim())) {
      newErrors.usn = 'Must follow RVCE format (e.g., 1RV23CS001)';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailPattern.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address';
    }

    if (formData.cgpa === '' || isNaN(formData.cgpa) || formData.cgpa < 0 || formData.cgpa > 10) {
      newErrors.cgpa = 'CGPA must be between 0.00 and 10.00';
    }

    if (formData.attendance === '' || isNaN(formData.attendance) || formData.attendance < 0 || formData.attendance > 100) {
      newErrors.attendance = 'Attendance must be between 0% and 100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'usn') formattedValue = value.toUpperCase();
    if (name === 'semester' || name === 'cgpa' || name === 'attendance') {
      formattedValue = value === '' ? '' : Number(value);
    }

    // Auto-update status if attendance adjusted below 75
    if (name === 'attendance') {
      const numAtt = Number(value);
      if (numAtt < 75 && formData.status === 'Active') {
        setFormData((prev) => ({ ...prev, [name]: numAtt, status: 'At-Risk' }));
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const autoGenerateEmail = () => {
    if (formData.usn) {
      const cleanUsn = formData.usn.toLowerCase().trim();
      setFormData((prev) => ({
        ...prev,
        email: `${cleanUsn}@rvce.edu.in`,
      }));
      setErrors((prev) => ({ ...prev, email: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const parsedSkills = typeof formData.skills === 'string'
      ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean)
      : formData.skills;

    const payload = {
      ...formData,
      usn: formData.usn.toUpperCase().trim(),
      email: formData.email.toLowerCase().trim(),
      skills: parsedSkills,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(formData.name || 'Student')}`,
    };

    const res = await saveStudent(payload);
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={closeDrawer}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl glass-panel bg-slate-950/95 border-l border-white/10 shadow-2xl flex flex-col justify-between">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                {drawerMode === 'create' ? <UserPlus className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {drawerMode === 'create' ? 'Enroll New Student' : 'Update Academic Profile'}
                </h3>
                <p className="text-xs text-slate-400">
                  {drawerMode === 'create'
                    ? 'Enter USN and academic metrics to register record.'
                    : `Modifying record for ${formData.usn || 'student'}`}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeDrawer}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Scrollable Body with Live Preview */}
          <form id="student-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Live Preview Card */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Real-time Profile Preview
              </span>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-blue-500/20 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(formData.name || 'Sample')}`}
                    alt="Preview"
                    className="w-12 h-12 rounded-xl bg-slate-800 border border-white/10"
                  />
                  <div>
                    <h5 className="font-bold text-white text-sm">
                      {formData.name || 'Student Name'}
                    </h5>
                    <span className="font-mono text-xs text-blue-400 font-semibold block">
                      {formData.usn || '1RV23CS000'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {formData.branch} &bull; Sem {formData.semester} &bull; Sec {formData.section}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">CGPA</span>
                  <span className="text-base font-extrabold text-amber-400">
                    {Number(formData.cgpa || 0).toFixed(2)}
                  </span>
                  <span className={`block text-[10px] font-semibold ${formData.attendance >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {formData.attendance}% Attendance
                  </span>
                </div>
              </div>
            </div>

            {/* Field: USN & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  USN (University Seat Number) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="usn"
                  value={formData.usn}
                  onChange={handleChange}
                  placeholder="e.g. 1RV23CS045"
                  className={`w-full px-3.5 py-2.5 rounded-xl glass-input font-mono text-sm uppercase ${
                    errors.usn ? 'border-rose-500 ring-1 ring-rose-500' : ''
                  }`}
                />
                {errors.usn && <p className="text-rose-400 text-xs mt-1">{errors.usn}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Branch / Department <span className="text-rose-400">*</span>
                </label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
                >
                  {branches.map((b) => (
                    <option key={b} value={b} className="bg-slate-900 text-slate-200">
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Field: Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Student Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Aarav Sharma"
                  className={`w-full px-3.5 py-2.5 rounded-xl glass-input text-sm ${
                    errors.name ? 'border-rose-500 ring-1 ring-rose-500' : ''
                  }`}
                />
                {errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Institutional Email <span className="text-rose-400">*</span>
                  </label>
                  {formData.usn && (
                    <button
                      type="button"
                      onClick={autoGenerateEmail}
                      className="text-[10px] text-blue-400 hover:text-blue-300 font-medium"
                    >
                      Use @rvce.edu.in
                    </button>
                  )}
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name.branch@rvce.edu.in"
                  className={`w-full px-3.5 py-2.5 rounded-xl glass-input text-sm ${
                    errors.email ? 'border-rose-500 ring-1 ring-rose-500' : ''
                  }`}
                />
                {errors.email && <p className="text-rose-400 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Field: Semester, CGPA, Attendance */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Semester (1-8)
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl glass-input text-sm text-center font-bold"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem} className="bg-slate-900 text-white">
                      Sem {sem}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  CGPA (0 - 10)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleChange}
                  placeholder="8.50"
                  className={`w-full px-3 py-2.5 rounded-xl glass-input text-sm text-center font-bold ${
                    errors.cgpa ? 'border-rose-500' : ''
                  }`}
                />
                {errors.cgpa && <p className="text-rose-400 text-[10px] mt-1">{errors.cgpa}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Attendance (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  name="attendance"
                  value={formData.attendance}
                  onChange={handleChange}
                  placeholder="85"
                  className={`w-full px-3 py-2.5 rounded-xl glass-input text-sm text-center font-bold ${
                    errors.attendance ? 'border-rose-500' : ''
                  }`}
                />
                {errors.attendance && <p className="text-rose-400 text-[10px] mt-1">{errors.attendance}</p>}
              </div>
            </div>

            {/* Field: Status & Section */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Enrollment Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
                >
                  <option value="Active" className="bg-slate-900 text-emerald-400">Active</option>
                  <option value="At-Risk" className="bg-slate-900 text-rose-400">At-Risk</option>
                  <option value="Suspended" className="bg-slate-900 text-amber-400">Suspended</option>
                  <option value="Graduated" className="bg-slate-900 text-blue-400">Graduated</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Section & Batch
                </label>
                <input
                  type="text"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  placeholder="e.g. A"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-center uppercase"
                />
              </div>
            </div>

            {/* Field: Skills Tag Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Technical Skills & Competencies (comma separated)
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g. React, Node.js, Python, Docker, PyTorch"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Enter skills separated by commas to power skill telemetry on the dashboard.
              </p>
            </div>

            {/* Mentor & Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Faculty Mentor
                </label>
                <input
                  type="text"
                  name="mentor"
                  value={formData.mentor}
                  onChange={handleChange}
                  placeholder="e.g. Dr. B. S. Shylaja"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Contact Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98450 11021"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

          </form>

          {/* Drawer Footer Actions */}
          <div className="p-6 border-t border-white/10 flex items-center justify-end gap-3 bg-slate-950/80">
            <button
              type="button"
              onClick={closeDrawer}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="student-form"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-glow-blue transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Saving...' : drawerMode === 'create' ? 'Register Student' : 'Save Changes'}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
