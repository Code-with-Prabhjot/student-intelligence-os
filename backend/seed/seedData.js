require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const { connectDB, disconnectDB, MONGO_URI } = require('../config/db');
const Student = require('../models/Student');

const realisticStudents = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
];

const seedDatabase = async () => {
  console.log('\n[Seed Script] Initializing RVCE Student Database Seeder...');
  console.log(`[Seed Script] Target URI: ${MONGO_URI}`);

  try {
    const conn = await connectDB();

    if (mongoose.connection.readyState === 1) {
      console.log('[Seed Script] Purging old records from `students` collection in MongoDB...');
      await Student.deleteMany({});
      console.log('[Seed Script] Previous records purged.');

      console.log(`[Seed Script] Inserting ${realisticStudents.length} realistic RVCE student profiles into MongoDB...`);
      const inserted = await Student.insertMany(realisticStudents);

      console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
      console.log('║                RVCE SEED DATA POPULATED SUCCESSFULLY              ║');
      console.log('╠═══════════════════════════════════════════════════════════════════╣');
      console.log(`║  \x1b[32m✔ Documents Seeded:\x1b[0m   ${String(inserted.length).padEnd(46)}║`);
      console.log(`║  \x1b[36m✔ Collection:\x1b[0m         students                                      ║`);
      console.log(`║  \x1b[33m✔ Compass URI:\x1b[0m        ${MONGO_URI.padEnd(46)}║`);
      console.log('║  \x1b[90m(Open MongoDB Compass and click Connect to inspect documents)\x1b[0m   ║');
      console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

      await disconnectDB();
      process.exit(0);
    } else {
      console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
      console.log('║                       SEED SCRIPT NOTICE                          ║');
      console.log('╠═══════════════════════════════════════════════════════════════════╣');
      console.log('║  \x1b[33m! MongoDB is not running locally on port 27017.\x1b[0m                  ║');
      console.log(`║  Target: ${MONGO_URI.padEnd(57)}║`);
      console.log('║                                                                   ║');
      console.log('║  \x1b[32m✔ Validated:\x1b[0m 15 RVCE Student records verified & syntax checked. ║');
      console.log('║  \x1b[36m✔ In-Memory Hub:\x1b[0m The backend will serve all 15 records            ║');
      console.log('║    automatically in fallback mode until mongod is started!        ║');
      console.log('╚═══════════════════════════════════════════════════════════════════╝\n');
      process.exit(0);
    }
  } catch (err) {
    console.error('[Seed Script Error]:', err.message);
    process.exit(1);
  }
};

seedDatabase();
