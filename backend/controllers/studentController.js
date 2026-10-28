const Student = require('../models/Student');
const mongoose = require('mongoose');

// Fallback in-memory dataset initialized with 15 realistic RVCE profiles
const initialSeed = [
  {
    _id: '65e01a1a1a1a1a1a1a000001',
    usn: '1RV22CS001',
    name: 'Aarav Sharma',
    email: 'aarav.cs22@rvce.edu.in',
    branch: 'CSE',
    semester: 6,
    cgpa: 9.68,
    attendance: 94,
    status: 'Active',
    skills: ['React', 'Node.js', 'System Design', 'Kubernetes', 'Go'],
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AaravSharma',
    phone: '+91 98450 11021',
    section: 'A',
    mentor: 'Dr. B. S. Shylaja',
    githubUsername: 'aarav-sharma',
    leetcodeHandle: 'aarav_codes',
    portfolioUrl: 'https://aaravsharma.dev',
    isDeleted: false,
    createdAt: new Date('2023-08-10'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    _id: '65e01a1a1a1a1a1a1a000002',
    usn: '1RV22CS045',
    name: 'Ananya Iyer',
    email: 'ananya.cs22@rvce.edu.in',
    branch: 'CSE',
    semester: 6,
    cgpa: 9.42,
    attendance: 91,
    status: 'Active',
    skills: ['Python', 'FastAPI', 'PyTorch', 'Data Structures', 'PostgreSQL'],
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AnanyaIyer',
    phone: '+91 98450 22032',
    section: 'A',
    mentor: 'Dr. B. S. Shylaja',
    githubUsername: 'ananya-iyer',
    leetcodeHandle: 'ananya_algo',
    portfolioUrl: 'https://ananyaiyer.me',
    isDeleted: false,
    createdAt: new Date('2023-08-10'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    _id: '65e01a1a1a1a1a1a1a000003',
    usn: '1RV23AI012',
    name: 'Rohan Deshmukh',
    email: 'rohan.ai23@rvce.edu.in',
    branch: 'AIML',
    semester: 4,
    cgpa: 8.85,
    attendance: 88,
    status: 'Active',
    skills: ['TensorFlow', 'Computer Vision', 'LangChain', 'Docker', 'Python'],
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=RohanDeshmukh',
    phone: '+91 98450 33043',
    section: 'B',
    mentor: 'Dr. Ramakanth Kumar',
    isDeleted: false,
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    _id: '65e01a1a1a1a1a1a1a000004',
    usn: '1RV23AI034',
    name: 'Pooja Hegde',
    email: 'pooja.ai23@rvce.edu.in',
    branch: 'AIML',
    semester: 4,
    cgpa: 7.92,
    attendance: 72,
    status: 'At-Risk',
    skills: ['NLP', 'Transformers', 'Scikit-Learn', 'Pandas'],
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=PoojaHegde',
    phone: '+91 98450 44054',
    section: 'B',
    mentor: 'Dr. Ramakanth Kumar',
    isDeleted: false,
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    _id: '65e01a1a1a1a1a1a1a000005',
    usn: '1RV22IS028',
    name: 'Vikramaditya Rao',
    email: 'vikram.is22@rvce.edu.in',
    branch: 'ISE',
    semester: 6,
    cgpa: 8.74,
    attendance: 89,
    status: 'Active',
    skills: ['MongoDB', 'Express', 'React', 'Node.js', 'Redis', 'AWS'],
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=VikramadityaRao',
    phone: '+91 98450 55065',
    section: 'A',
    mentor: 'Dr. G. Shobha',
    isDeleted: false,
    createdAt: new Date('2023-08-10'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    _id: '65e01a1a1a1a1a1a1a000006',
    usn: '1RV22IS061',
    name: 'Meera Nambiar',
    email: 'meera.is22@rvce.edu.in',
    branch: 'ISE',
    semester: 6,
    cgpa: 9.81,
    attendance: 96,
    status: 'Active',
    skills: ['Cybersecurity', 'Solidity', 'Web3', 'Node.js', 'Cryptography'],
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=MeeraNambiar',
    phone: '+91 98450 66076',
    section: 'A',
    mentor: 'Dr. G. Shobha',
    isDeleted: false,
    createdAt: new Date('2023-08-10'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    _id: '65e01a1a1a1a1a1a1a000007',
    usn: '1RV23EC015',
    name: 'Karthik Sundaram',
    email: 'karthik.ec23@rvce.edu.in',
    branch: 'ECE',
    semester: 4,
    cgpa: 7.45,
    attendance: 68,
    status: 'At-Risk',
    skills: ['Embedded C', 'Verilog', 'VLSI', 'Arduino', 'MATLAB'],
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=KarthikSundaram',
    phone: '+91 98450 77087',
    section: 'C',
    mentor: 'Dr. H. V. Ravish Aradhya',
    isDeleted: false,
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    _id: '65e01a1a1a1a1a1a1a000008',
    usn: '1RV23EC089',
    name: 'Sneha Reddy',
    email: 'sneha.ec23@rvce.edu.in',
    branch: 'ECE',
    semester: 4,
    cgpa: 9.15,
    attendance: 93,
    status: 'Active',
    skills: ['Signal Processing', 'FPGA', 'Rust', 'RTOS', 'KiCAD'],
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=SnehaReddy',
    phone: '+91 98450 88098',
    section: 'C',
    mentor: 'Dr. H. V. Ravish Aradhya',
    isDeleted: false,
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    _id: '65e01a1a1a1a1a1a1a000009',
    usn: '1RV21ME044',
    name: 'Tanmay Kulkarni',
    email: 'tanmay.me21@rvce.edu.in',
    branch: 'MECH',
    semester: 8,
    cgpa: 8.35,
    attendance: 84,
    status: 'Active',
    skills: ['SolidWorks', 'ANSYS', 'AutoCAD', 'Robotics', 'Additive Mfg'],
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=TanmayKulkarni',
    phone: '+91 98450 99109',
    section: 'A',
    mentor: 'Dr. M. S. Krupashankara',
    isDeleted: false,
    createdAt: new Date('2022-08-10'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    _id: '65e01a1a1a1a1a1a1a000010',
    usn: '1RV24CS002',
    name: 'Diya Bhat',
    email: 'diya.cs24@rvce.edu.in',
    branch: 'CSE',
    semester: 2,
    cgpa: 9.55,
    attendance: 98,
    status: 'Active',
    skills: ['C++', 'Python', 'Algorithms', 'TailwindCSS', 'Git'],
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=DiyaBhat',
    phone: '+91 98451 10213',
    section: 'A',
    mentor: 'Dr. B. S. Shylaja',
    githubUsername: 'diya-bhat',
    leetcodeHandle: 'diya_algo',
    portfolioUrl: 'https://diyabhat.me',
    isDeleted: false,
    createdAt: new Date('2024-08-10'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    _id: '65e01a1a1a1a1a1a1a000011',
    usn: '1RV23EE032',
    name: 'Aditya Varma',
    email: 'aditya.ee23@rvce.edu.in',
    branch: 'EEE',
    semester: 4,
    cgpa: 6.82,
    attendance: 64,
    status: 'At-Risk',
    skills: ['Power Electronics', 'Simulink', 'PLC', 'SCADA'],
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AdityaVarma',
    phone: '+91 98451 21324',
    section: 'B',
    mentor: 'Dr. Rudranna Nandihalli',
    isDeleted: false,
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    _id: '65e01a1a1a1a1a1a1a000012',
    usn: '1RV23CV019',
    name: 'Ishaan Joshi',
    email: 'ishaan.cv23@rvce.edu.in',
    branch: 'CIVIL',
    semester: 4,
    cgpa: 8.12,
    attendance: 82,
    status: 'Active',
    skills: ['STAAD Pro', 'Revit', 'GIS', 'Surveying', 'BIM'],
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=IshaanJoshi',
    phone: '+91 98451 32435',
    section: 'A',
    mentor: 'Dr. Radhakrishna',
    isDeleted: false,
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    _id: '65e01a1a1a1a1a1a1a000013',
    usn: '1RV22BT008',
    name: 'Rhea Sen',
    email: 'rhea.bt22@rvce.edu.in',
    branch: 'BIOTECH',
    semester: 6,
    cgpa: 9.38,
    attendance: 95,
    status: 'Active',
    skills: ['Bioinformatics', 'Biopython', 'CRISPR Data Analysis', 'R Programming'],
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=RheaSen',
    phone: '+91 98451 43546',
    section: 'A',
    mentor: 'Dr. Vidya Niranjan',
    isDeleted: false,
    createdAt: new Date('2023-08-10'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    _id: '65e01a1a1a1a1a1a1a000014',
    usn: '1RV23AS011',
    name: 'Pranav Menon',
    email: 'pranav.as23@rvce.edu.in',
    branch: 'AEROSPACE',
    semester: 4,
    cgpa: 8.64,
    attendance: 87,
    status: 'Active',
    skills: ['CFD', 'OpenFOAM', 'Aerodynamics', 'Flight Dynamics', 'Python'],
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=PranavMenon',
    phone: '+91 98451 54657',
    section: 'A',
    mentor: 'Dr. Ravindra S. Kulkarni',
    isDeleted: false,
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    _id: '65e01a1a1a1a1a1a1a000015',
    usn: '1RV23CH007',
    name: 'Kavya Pillai',
    email: 'kavya.ch23@rvce.edu.in',
    branch: 'CHEMICAL',
    semester: 4,
    cgpa: 7.78,
    attendance: 79,
    status: 'Active',
    skills: ['Aspen Plus', 'Thermodynamics', 'Process Simulation', 'Chemical Safety'],
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=KavyaPillai',
    phone: '+91 98451 65768',
    section: 'A',
    mentor: 'Dr. M. A. Lourdu Antony Raj',
    isDeleted: false,
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-02-15'),
  },
];

let allSeedStudents = [...initialSeed];
try {
  const { realisticStudents } = require('../seed/seedData');
  if (Array.isArray(realisticStudents) && realisticStudents.length > 0) {
    allSeedStudents = realisticStudents.map((st, idx) => ({
      ...st,
      _id: st._id || '65e01a1a1a1a1a1a1a' + String(idx + 1).padStart(6, '0'),
      createdAt: st.createdAt || new Date('2023-08-10'),
      updatedAt: st.updatedAt || new Date('2024-02-15'),
    }));
  }
} catch (e) {
  console.warn('[studentController] Error loading realisticStudents fallback:', e.message);
}

let inMemoryStudents = [...allSeedStudents];

// Helper to determine if real MongoDB is currently connected
const isMongoConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all students with search, filters, pagination & sorting
// @route   GET /api/students
const getStudents = async (req, res) => {
  try {
    const {
      search = '',
      branch,
      academicYear,
      semester,
      status,
      minCgpa,
      maxCgpa,
      attendanceRisk,
      includeDeleted = 'false',
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));

    if (isMongoConnected()) {
      const query = {};

      if (includeDeleted === 'only') {
        query.isDeleted = true;
      } else if (includeDeleted !== 'true') {
        query.isDeleted = false;
      }

      if (search.trim()) {
        const searchRegex = new RegExp(search.trim(), 'i');
        query.$or = [
          { usn: searchRegex },
          { name: searchRegex },
          { branch: searchRegex },
          { email: searchRegex },
          { skills: searchRegex },
          { githubUsername: searchRegex },
          { leetcodeHandle: searchRegex },
        ];
      }

      
      // Academic Year Filter (batch digits 25, 24, 23, 22)
      if (academicYear && academicYear !== 'ALL') {
        let yr = academicYear.toString();
        if (yr.includes('1') || yr.includes('25')) yr = '25';
        else if (yr.includes('2') || yr.includes('24')) yr = '24';
        else if (yr.includes('3') || yr.includes('23')) yr = '23';
        else if (yr.includes('4') || yr.includes('22')) yr = '22';
        query.usn = new RegExp(`^1(?:RV|RZ)${yr}`, 'i');
      }

      if (branch && branch !== 'ALL') {
        if (branch.toUpperCase() === 'OTHERS') {
          query.branch = { $nin: ['CSE', 'AIML', 'ISE', 'ECE', 'EEE', 'MECH', 'CIVIL'] };
        } else {
          query.branch = branch.toUpperCase();
        }
      }
      if (semester && semester !== 'ALL') query.semester = Number(semester);
      if (status && status !== 'ALL') query.status = status;

      const hasMinCgpa = minCgpa !== undefined && minCgpa !== '';
      const hasMaxCgpa = maxCgpa !== undefined && maxCgpa !== '';
      if (hasMinCgpa || hasMaxCgpa) {
        query.cgpa = {};
        if (hasMinCgpa) query.cgpa.$gte = Number(minCgpa);
        if (hasMaxCgpa) query.cgpa.$lte = Number(maxCgpa);
      }

      if (attendanceRisk === 'true' || attendanceRisk === 'critical') {
        query.attendance = { $lt: 75 };
      } else if (attendanceRisk === 'warning') {
        query.attendance = { $gte: 75, $lt: 85 };
      }

      const sortOptions = {};
      sortOptions[sortBy] = order === 'asc' ? 1 : -1;
      const skip = (pageNum - 1) * limitNum;

      const [students, totalCount, totalActive, totalAtRisk] = await Promise.all([
        Student.find(query).sort(sortOptions).skip(skip).limit(limitNum),
        Student.countDocuments(query),
        Student.countDocuments({ isDeleted: false }),
        Student.countDocuments({ isDeleted: false, attendance: { $lt: 75 } }),
      ]);

      const totalPages = Math.ceil(totalCount / limitNum) || 1;

      return res.status(200).json({
        success: true,
        data: students,
        pagination: {
          totalCount,
          totalPages,
          currentPage: pageNum,
          limit: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
        metadata: { totalActive, totalAtRisk },
      });
    }

    // In-Memory Processing Fallback
    let filtered = inMemoryStudents.filter((s) => {
      if (includeDeleted === 'only' && !s.isDeleted) return false;
      if (includeDeleted !== 'true' && includeDeleted !== 'only' && s.isDeleted) return false;

      if (search.trim()) {
        const term = search.trim().toLowerCase();
        const matchesUsn = s.usn.toLowerCase().includes(term);
        const matchesName = s.name.toLowerCase().includes(term);
        const matchesBranch = s.branch.toLowerCase().includes(term);
        const matchesEmail = s.email.toLowerCase().includes(term);
        const matchesSkills = (s.skills || []).some((sk) => sk.toLowerCase().includes(term));
        const matchesGithub = (s.githubUsername || '').toLowerCase().includes(term);
        const matchesLeetcode = (s.leetcodeHandle || '').toLowerCase().includes(term);
        if (!matchesUsn && !matchesName && !matchesBranch && !matchesEmail && !matchesSkills && !matchesGithub && !matchesLeetcode) {
          return false;
        }
      }

      
      // Academic Year Filter
      if (academicYear && academicYear !== 'ALL') {
        let yr = academicYear.toString();
        if (yr.includes('1') || yr.includes('25')) yr = '25';
        else if (yr.includes('2') || yr.includes('24')) yr = '24';
        else if (yr.includes('3') || yr.includes('23')) yr = '23';
        else if (yr.includes('4') || yr.includes('22')) yr = '22';
        const batchMatch = s.usn.match(/^1(?:RV|RZ)(\d{2})/i);
        if (!batchMatch || batchMatch[1] !== yr) return false;
      }

      if (branch && branch !== 'ALL') {
        if (branch.toUpperCase() === 'OTHERS') {
          if (['CSE', 'AIML', 'ISE', 'ECE', 'EEE', 'MECH', 'CIVIL'].includes(s.branch)) return false;
        } else if (s.branch !== branch.toUpperCase()) {
          return false;
        }
      }
      if (semester && semester !== 'ALL' && s.semester !== Number(semester)) return false;
      if (status && status !== 'ALL' && s.status !== status) return false;

      if (minCgpa !== undefined && minCgpa !== '' && s.cgpa < Number(minCgpa)) return false;
      if (maxCgpa !== undefined && maxCgpa !== '' && s.cgpa > Number(maxCgpa)) return false;

      if ((attendanceRisk === 'true' || attendanceRisk === 'critical') && s.attendance >= 75) return false;
      if (attendanceRisk === 'warning' && (s.attendance < 75 || s.attendance >= 85)) return false;

      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });

    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / limitNum) || 1;
    const skip = (pageNum - 1) * limitNum;
    const paginated = filtered.slice(skip, skip + limitNum);

    const totalActive = inMemoryStudents.filter((s) => !s.isDeleted).length;
    const totalAtRisk = inMemoryStudents.filter((s) => !s.isDeleted && s.attendance < 75).length;

    return res.status(200).json({
      success: true,
      data: paginated,
      pagination: {
        totalCount,
        totalPages,
        currentPage: pageNum,
        limit: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      metadata: { totalActive, totalAtRisk },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single student by ID or USN
// @route   GET /api/students/:id
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      let student = mongoose.Types.ObjectId.isValid(id)
        ? await Student.findById(id)
        : await Student.findOne({ usn: id.toUpperCase() });

      if (!student) {
        return res.status(404).json({ success: false, message: 'Student not found.' });
      }
      return res.status(200).json({ success: true, data: student });
    }

    const student = inMemoryStudents.find(
      (s) => s._id === id || s.usn.toUpperCase() === id.toUpperCase()
    );

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    return res.status(200).json({ success: true, data: student });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new student
// @route   POST /api/students
const createStudent = async (req, res) => {
  try {
    const { usn, name, email, branch, semester, cgpa, attendance, status, skills, avatar, phone, section, mentor, githubUsername, leetcodeHandle, portfolioUrl } = req.body;

    const usnUpper = usn ? usn.toUpperCase().trim() : '';
    const emailLower = email ? email.toLowerCase().trim() : '';
    const usnRegex = /^1(RV|RZ)\d{2}[A-Z]{2,3}\d{3}$/i;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!usnUpper || !usnRegex.test(usnUpper)) {
      return res.status(400).json({
        success: false,
        message: 'USN must follow standard RVCE format (e.g., 1RV23CS001 or 1RZ25CS042)',
      });
    }

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name is required and must be at least 2 characters',
      });
    }

    if (!emailLower || !emailRegex.test(emailLower)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid institutional email address',
      });
    }

    if (isMongoConnected()) {
      const existingUsn = await Student.findOne({ usn: usnUpper });
      if (existingUsn) {
        return res.status(409).json({ success: false, message: `USN '${usnUpper}' already exists.` });
      }

      const existingEmail = await Student.findOne({ email: emailLower });
      if (existingEmail) {
        return res.status(409).json({ success: false, message: `Email '${emailLower}' already exists.` });
      }

      const newStudent = await Student.create({
        usn: usnUpper,
        name: name.trim(),
        email: emailLower,
        branch: branch.toUpperCase().trim(),
        semester: Number(semester),
        cgpa: Number(cgpa),
        attendance: Number(attendance),
        status: status || (Number(attendance) < 75 ? 'At-Risk' : 'Active'),
        skills: skills || [],
        avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name.trim())}`,
        phone: phone || '+91 98765 43210',
        section: section || 'A',
        mentor: mentor || 'Dr. B. S. Shylaja',
        githubUsername: (githubUsername || '').trim(),
        leetcodeHandle: (leetcodeHandle || '').trim(),
        portfolioUrl: (portfolioUrl || '').trim(),
        isDeleted: false,
      });

      return res.status(201).json({ success: true, message: 'Student enrolled successfully.', data: newStudent });
    }

    // In-memory check
    if (inMemoryStudents.some((s) => s.usn === usnUpper)) {
      return res.status(409).json({ success: false, message: `USN '${usnUpper}' already exists.` });
    }
    if (inMemoryStudents.some((s) => s.email === emailLower)) {
      return res.status(409).json({ success: false, message: `Email '${emailLower}' already exists.` });
    }

    const newObj = {
      _id: new mongoose.Types.ObjectId().toString(),
      usn: usnUpper,
      name: name.trim(),
      email: emailLower,
      branch: branch.toUpperCase().trim(),
      semester: Number(semester),
      cgpa: Number(cgpa),
      attendance: Number(attendance),
      status: status || (Number(attendance) < 75 ? 'At-Risk' : 'Active'),
      skills: Array.isArray(skills) ? skills : typeof skills === 'string' ? skills.split(',').map((s) => s.trim()) : [],
      avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name.trim())}`,
      phone: phone || '+91 98765 43210',
      section: section || 'A',
      mentor: mentor || 'Dr. B. S. Shylaja',
      githubUsername: (githubUsername || '').trim(),
      leetcodeHandle: (leetcodeHandle || '').trim(),
      portfolioUrl: (portfolioUrl || '').trim(),
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    inMemoryStudents.unshift(newObj);
    return res.status(201).json({ success: true, message: 'Student enrolled successfully.', data: newObj });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update existing student
// @route   PUT /api/students/:id
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.usn) updates.usn = updates.usn.toUpperCase().trim();
    if (updates.email) updates.email = updates.email.toLowerCase().trim();
    if (updates.branch) updates.branch = updates.branch.toUpperCase().trim();
    if (updates.semester) updates.semester = Number(updates.semester);
    if (updates.cgpa !== undefined) updates.cgpa = Number(updates.cgpa);
    if (updates.attendance !== undefined) {
      updates.attendance = Number(updates.attendance);
      if (updates.attendance < 75 && (!updates.status || updates.status === 'Active')) {
        updates.status = 'At-Risk';
      }
    }

    if (isMongoConnected()) {
      if (updates.usn) {
        const clash = await Student.findOne({ usn: updates.usn, _id: { $ne: id } });
        if (clash) return res.status(409).json({ success: false, message: `USN '${updates.usn}' is already in use.` });
      }
      if (updates.email) {
        const clash = await Student.findOne({ email: updates.email, _id: { $ne: id } });
        if (clash) return res.status(409).json({ success: false, message: `Email '${updates.email}' is already in use.` });
      }

      const updated = await Student.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Student not found.' });
      return res.status(200).json({ success: true, message: 'Profile updated.', data: updated });
    }

    const index = inMemoryStudents.findIndex((s) => s._id === id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Student not found.' });

    inMemoryStudents[index] = {
      ...inMemoryStudents[index],
      ...updates,
      updatedAt: new Date(),
    };

    return res.status(200).json({ success: true, message: 'Profile updated.', data: inMemoryStudents[index] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Soft / Permanent Delete student
// @route   DELETE /api/students/:id
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { permanent } = req.query;

    if (isMongoConnected()) {
      if (permanent === 'true') {
        const del = await Student.findByIdAndDelete(id);
        if (!del) return res.status(404).json({ success: false, message: 'Student not found.' });
        return res.status(200).json({ success: true, message: 'Student permanently purged.', data: del });
      }
      const soft = await Student.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
      if (!soft) return res.status(404).json({ success: false, message: 'Student not found.' });
      return res.status(200).json({ success: true, message: 'Moved to trash with soft recovery enabled.', data: soft });
    }

    const index = inMemoryStudents.findIndex((s) => s._id === id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Student not found.' });

    if (permanent === 'true') {
      const [removed] = inMemoryStudents.splice(index, 1);
      return res.status(200).json({ success: true, message: 'Student permanently purged.', data: removed });
    }

    inMemoryStudents[index].isDeleted = true;
    return res.status(200).json({ success: true, message: 'Moved to trash with soft recovery enabled.', data: inMemoryStudents[index] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Restore student
// @route   PATCH /api/students/:id/restore
const restoreStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const restored = await Student.findByIdAndUpdate(id, { isDeleted: false }, { new: true });
      if (!restored) return res.status(404).json({ success: false, message: 'Student not found.' });
      return res.status(200).json({ success: true, message: 'Student record restored.', data: restored });
    }

    const index = inMemoryStudents.findIndex((s) => s._id === id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Student not found.' });

    inMemoryStudents[index].isDeleted = false;
    return res.status(200).json({ success: true, message: 'Student record restored.', data: inMemoryStudents[index] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Bulk Delete
// @route   POST /api/students/bulk-delete
const bulkDeleteStudents = async (req, res) => {
  try {
    const { ids, permanent = false } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Provide array of IDs.' });
    }

    if (isMongoConnected()) {
      if (permanent) {
        const resDel = await Student.deleteMany({ _id: { $in: ids } });
        return res.status(200).json({ success: true, message: `${resDel.deletedCount} students permanently deleted.` });
      }
      const resSoft = await Student.updateMany({ _id: { $in: ids } }, { $set: { isDeleted: true } });
      return res.status(200).json({ success: true, message: `${resSoft.modifiedCount} students moved to trash.` });
    }

    if (permanent) {
      inMemoryStudents = inMemoryStudents.filter((s) => !ids.includes(s._id));
      return res.status(200).json({ success: true, message: `${ids.length} students permanently deleted.` });
    }

    inMemoryStudents.forEach((s) => {
      if (ids.includes(s._id)) s.isDeleted = true;
    });

    return res.status(200).json({ success: true, message: `${ids.length} students moved to trash.` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Bulk Restore
// @route   POST /api/students/bulk-restore
const bulkRestoreStudents = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Provide array of IDs.' });
    }

    if (isMongoConnected()) {
      const resRestore = await Student.updateMany({ _id: { $in: ids } }, { $set: { isDeleted: false } });
      return res.status(200).json({ success: true, message: `${resRestore.modifiedCount} students restored.` });
    }

    inMemoryStudents.forEach((s) => {
      if (ids.includes(s._id)) s.isDeleted = false;
    });

    return res.status(200).json({ success: true, message: `${ids.length} students restored.` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Dashboard Intelligence: Advanced Aggregation Pipelines
// @route   GET /api/students/stats/analytics
const getStudentAnalytics = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const matchActive = { $match: { isDeleted: false } };

      const [
        overallStats,
        branchDistribution,
        semesterStats,
        performanceTiers,
        attendanceRiskStats,
        topPerformers,
        atRiskStudents,
        skillsDistribution,
      ] = await Promise.all([
        Student.aggregate([
          matchActive,
          {
            $group: {
              _id: null,
              totalStudents: { $sum: 1 },
              avgCgpa: { $avg: '$cgpa' },
              avgAttendance: { $avg: '$attendance' },
              highestCgpa: { $max: '$cgpa' },
              lowestCgpa: { $min: '$cgpa' },
            },
          },
        ]),
        Student.aggregate([
          matchActive,
          {
            $group: {
              _id: '$branch',
              count: { $sum: 1 },
              avgCgpa: { $avg: '$cgpa' },
              avgAttendance: { $avg: '$attendance' },
            },
          },
          { $sort: { count: -1, avgCgpa: -1 } },
        ]),
        Student.aggregate([
          matchActive,
          {
            $group: {
              _id: '$semester',
              count: { $sum: 1 },
              avgCgpa: { $avg: '$cgpa' },
              avgAttendance: { $avg: '$attendance' },
            },
          },
          { $sort: { _id: 1 } },
        ]),
        Student.aggregate([
          matchActive,
          {
            $project: {
              tier: {
                $switch: {
                  branches: [
                    { case: { $gte: ['$cgpa', 9.0] }, then: 'Distinction (≥9.0)' },
                    { case: { $gte: ['$cgpa', 7.5] }, then: 'First Class (7.5-8.99)' },
                    { case: { $gte: ['$cgpa', 6.0] }, then: 'Second Class (6.0-7.49)' },
                  ],
                  default: 'Pass Class (<6.0)',
                },
              },
            },
          },
          { $group: { _id: '$tier', count: { $sum: 1 } } },
        ]),
        Student.aggregate([
          matchActive,
          {
            $group: {
              _id: null,
              criticalRisk: { $sum: { $cond: [{ $lt: ['$attendance', 75] }, 1, 0] } },
              warningZone: {
                $sum: {
                  $cond: [
                    { $and: [{ $gte: ['$attendance', 75] }, { $lt: ['$attendance', 85] }] },
                    1,
                    0,
                  ],
                },
              },
              safeZone: { $sum: { $cond: [{ $gte: ['$attendance', 85] }, 1, 0] } },
            },
          },
        ]),
        Student.find({ isDeleted: false })
          .sort({ cgpa: -1, attendance: -1 })
          .limit(5)
          .select('usn name branch semester cgpa attendance avatar'),
        Student.find({ isDeleted: false, $or: [{ attendance: { $lt: 75 } }, { cgpa: { $lt: 6.0 } }] })
          .sort({ attendance: 1, cgpa: 1 })
          .limit(6)
          .select('usn name branch semester cgpa attendance status avatar phone'),
        Student.aggregate([
          matchActive,
          { $unwind: '$skills' },
          { $group: { _id: { $toLower: { $trim: { input: '$skills' } } }, count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ]),
      ]);

      const stats = overallStats[0] || { totalStudents: 0, avgCgpa: 0, avgAttendance: 0, highestCgpa: 0, lowestCgpa: 0 };
      const risk = attendanceRiskStats[0] || { criticalRisk: 0, warningZone: 0, safeZone: 0 };
      const topBranch = branchDistribution.length > 0 ? branchDistribution[0] : null;

      return res.status(200).json({
        success: true,
        data: {
          summary: {
            totalStudents: stats.totalStudents,
            avgCgpa: Number((stats.avgCgpa || 0).toFixed(2)),
            avgAttendance: Number((stats.avgAttendance || 0).toFixed(1)),
            highestCgpa: Number((stats.highestCgpa || 0).toFixed(2)),
            lowestCgpa: Number((stats.lowestCgpa || 0).toFixed(2)),
            criticalRiskStudents: risk.criticalRisk,
            warningStudents: risk.warningZone,
            safeStudents: risk.safeZone,
            riskRate: stats.totalStudents ? Number(((risk.criticalRisk / stats.totalStudents) * 100).toFixed(1)) : 0,
            topBranch: topBranch ? { branch: topBranch._id, avgCgpa: Number(topBranch.avgCgpa.toFixed(2)), count: topBranch.count } : null,
          },
          branchDistribution: branchDistribution.map((b) => ({ branch: b._id, count: b.count, avgCgpa: Number(b.avgCgpa.toFixed(2)), avgAttendance: Number(b.avgAttendance.toFixed(1)) })),
          semesterStats: semesterStats.map((s) => ({ semester: `Sem ${s._id}`, count: s.count, avgCgpa: Number(s.avgCgpa.toFixed(2)), avgAttendance: Number(s.avgAttendance.toFixed(1)) })),
          performanceTiers: performanceTiers.map((p) => ({ tier: p._id, count: p.count })),
          topPerformers,
          atRiskStudents,
          topSkills: skillsDistribution.map((s) => ({ skill: s._id.toUpperCase(), count: s.count })),
        },
      });
    }

    // In-memory Analytics Calculation
    const active = inMemoryStudents.filter((s) => !s.isDeleted);
    const total = active.length;
    const avgCgpa = total ? active.reduce((acc, s) => acc + s.cgpa, 0) / total : 0;
    const avgAttendance = total ? active.reduce((acc, s) => acc + s.attendance, 0) / total : 0;
    const highestCgpa = total ? Math.max(...active.map((s) => s.cgpa)) : 0;
    const lowestCgpa = total ? Math.min(...active.map((s) => s.cgpa)) : 0;

    const criticalRisk = active.filter((s) => s.attendance < 75).length;
    const warningZone = active.filter((s) => s.attendance >= 75 && s.attendance < 85).length;
    const safeZone = active.filter((s) => s.attendance >= 85).length;

    // Branches
    const branchMap = {};
    active.forEach((s) => {
      if (!branchMap[s.branch]) branchMap[s.branch] = { count: 0, totalCgpa: 0, totalAtt: 0 };
      branchMap[s.branch].count++;
      branchMap[s.branch].totalCgpa += s.cgpa;
      branchMap[s.branch].totalAtt += s.attendance;
    });

    const branchDistribution = Object.keys(branchMap).map((b) => ({
      branch: b,
      count: branchMap[b].count,
      avgCgpa: Number((branchMap[b].totalCgpa / branchMap[b].count).toFixed(2)),
      avgAttendance: Number((branchMap[b].totalAtt / branchMap[b].count).toFixed(1)),
    })).sort((a, b) => b.count - a.count);

    // Semesters
    const semMap = {};
    active.forEach((s) => {
      const k = `Sem ${s.semester}`;
      if (!semMap[k]) semMap[k] = { count: 0, totalCgpa: 0, totalAtt: 0 };
      semMap[k].count++;
      semMap[k].totalCgpa += s.cgpa;
      semMap[k].totalAtt += s.attendance;
    });

    const semesterStats = Object.keys(semMap).map((k) => ({
      semester: k,
      count: semMap[k].count,
      avgCgpa: Number((semMap[k].totalCgpa / semMap[k].count).toFixed(2)),
      avgAttendance: Number((semMap[k].totalAtt / semMap[k].count).toFixed(1)),
    }));

    // Performance Tiers
    const tiers = [
      { tier: 'Distinction (≥9.0)', count: active.filter((s) => s.cgpa >= 9.0).length },
      { tier: 'First Class (7.5-8.99)', count: active.filter((s) => s.cgpa >= 7.5 && s.cgpa < 9.0).length },
      { tier: 'Second Class (6.0-7.49)', count: active.filter((s) => s.cgpa >= 6.0 && s.cgpa < 7.5).length },
      { tier: 'Pass Class (<6.0)', count: active.filter((s) => s.cgpa < 6.0).length },
    ];

    // Skills
    const skillCounts = {};
    active.forEach((s) => {
      (s.skills || []).forEach((sk) => {
        const clean = sk.trim().toUpperCase();
        skillCounts[clean] = (skillCounts[clean] || 0) + 1;
      });
    });

    const topSkills = Object.entries(skillCounts)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const topPerformers = [...active].sort((a, b) => b.cgpa - a.cgpa).slice(0, 5);
    const atRiskStudents = [...active].filter((s) => s.attendance < 75 || s.cgpa < 6.0).slice(0, 6);

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          totalStudents: total,
          avgCgpa: Number(avgCgpa.toFixed(2)),
          avgAttendance: Number(avgAttendance.toFixed(1)),
          highestCgpa: Number(highestCgpa.toFixed(2)),
          lowestCgpa: Number(lowestCgpa.toFixed(2)),
          criticalRiskStudents: criticalRisk,
          warningStudents: warningZone,
          safeStudents: safeZone,
          riskRate: total ? Number(((criticalRisk / total) * 100).toFixed(1)) : 0,
          topBranch: branchDistribution[0] || null,
        },
        branchDistribution,
        semesterStats,
        performanceTiers: tiers,
        topPerformers,
        atRiskStudents,
        topSkills,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export All Records
// @route   GET /api/students/export/all
const exportStudentsData = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const students = await Student.find({ isDeleted: false }).sort({ usn: 1 }).select('-__v');
      return res.status(200).json({ success: true, count: students.length, data: students });
    }
    const active = inMemoryStudents.filter((s) => !s.isDeleted);
    return res.status(200).json({ success: true, count: active.length, data: active });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Bulk Import
// @route   POST /api/students/bulk-import
const bulkImportStudents = async (req, res) => {
  try {
    const { students } = req.body;
    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ success: false, message: 'No records provided.' });
    }

    const results = { imported: 0, updated: 0, errors: [] };

    for (let i = 0; i < students.length; i++) {
      const item = students[i];
      if (!item.usn || !item.name || !item.email || !item.branch) {
        results.errors.push(`Row ${i + 1}: Missing USN, Name, Email, or Branch.`);
        continue;
      }

      const formattedUsn = item.usn.toUpperCase().trim();
      const formattedEmail = item.email.toLowerCase().trim();

      if (isMongoConnected()) {
        const existing = await Student.findOne({ $or: [{ usn: formattedUsn }, { email: formattedEmail }] });
        if (existing) {
          Object.assign(existing, {
            name: item.name.trim(),
            branch: item.branch.toUpperCase().trim(),
            semester: Number(item.semester || existing.semester),
            cgpa: Number(item.cgpa !== undefined ? item.cgpa : existing.cgpa),
            attendance: Number(item.attendance !== undefined ? item.attendance : existing.attendance),
            status: item.status || existing.status,
            skills: item.skills || existing.skills,
            githubUsername: item.githubUsername !== undefined ? item.githubUsername : existing.githubUsername,
            leetcodeHandle: item.leetcodeHandle !== undefined ? item.leetcodeHandle : existing.leetcodeHandle,
            portfolioUrl: item.portfolioUrl !== undefined ? item.portfolioUrl : existing.portfolioUrl,
            isDeleted: false,
          });
          await existing.save();
          results.updated++;
        } else {
          await Student.create({
            usn: formattedUsn,
            name: item.name.trim(),
            email: formattedEmail,
            branch: item.branch.toUpperCase().trim(),
            semester: Number(item.semester || 1),
            cgpa: Number(item.cgpa || 0),
            attendance: Number(item.attendance || 0),
            status: item.status || (Number(item.attendance) < 75 ? 'At-Risk' : 'Active'),
            skills: item.skills || [],
          });
          results.imported++;
        }
      } else {
        const existingIndex = inMemoryStudents.findIndex(
          (s) => s.usn === formattedUsn || s.email === formattedEmail
        );
        if (existingIndex !== -1) {
          inMemoryStudents[existingIndex] = {
            ...inMemoryStudents[existingIndex],
            name: item.name.trim(),
            branch: item.branch.toUpperCase().trim(),
            semester: Number(item.semester || inMemoryStudents[existingIndex].semester),
            cgpa: Number(item.cgpa !== undefined ? item.cgpa : inMemoryStudents[existingIndex].cgpa),
            attendance: Number(item.attendance !== undefined ? item.attendance : inMemoryStudents[existingIndex].attendance),
            status: item.status || inMemoryStudents[existingIndex].status,
            skills: item.skills || inMemoryStudents[existingIndex].skills,
            isDeleted: false,
            updatedAt: new Date(),
          };
          results.updated++;
        } else {
          inMemoryStudents.unshift({
            _id: new mongoose.Types.ObjectId().toString(),
            usn: formattedUsn,
            name: item.name.trim(),
            email: formattedEmail,
            branch: item.branch.toUpperCase().trim(),
            semester: Number(item.semester || 1),
            cgpa: Number(item.cgpa || 0),
            attendance: Number(item.attendance || 0),
            status: item.status || (Number(item.attendance) < 75 ? 'At-Risk' : 'Active'),
            skills: item.skills || [],
            avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(item.name.trim())}`,
            phone: item.phone || '+91 98765 43210',
            section: item.section || 'A',
            mentor: item.mentor || 'Dr. B. S. Shylaja',
            githubUsername: (item.githubUsername || '').trim(),
            leetcodeHandle: (item.leetcodeHandle || '').trim(),
            portfolioUrl: (item.portfolioUrl || '').trim(),
            isDeleted: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          results.imported++;
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: `Batch complete: ${results.imported} created, ${results.updated} updated, ${results.errors.length} skipped.`,
      results,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  restoreStudent,
  bulkDeleteStudents,
  bulkRestoreStudents,
  getStudentAnalytics,
  exportStudentsData,
  bulkImportStudents,
};
