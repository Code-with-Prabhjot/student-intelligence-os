const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/studentController');

// Analytics & Bulk Routes (Defined before :id parameterized routes)
router.get('/stats/analytics', getStudentAnalytics);
router.get('/export/all', exportStudentsData);
router.post('/bulk-import', bulkImportStudents);
router.post('/bulk-delete', bulkDeleteStudents);
router.post('/bulk-restore', bulkRestoreStudents);

// Core CRUD Routes
router.route('/')
  .get(getStudents)
  .post(createStudent);

router.route('/:id')
  .get(getStudentById)
  .put(updateStudent)
  .delete(deleteStudent);

router.patch('/:id/restore', restoreStudent);

module.exports = router;
