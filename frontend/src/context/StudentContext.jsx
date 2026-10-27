import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

const StudentContext = createContext();

const API_BASE = '/api/students';
const HEALTH_URL = '/api/health';

const initialFilters = {
  branch: 'ALL',
  academicYear: 'ALL',
  semester: 'ALL',
  status: 'ALL',
  minCgpa: '',
  maxCgpa: '',
  attendanceRisk: '',
  includeDeleted: 'false',
  sortBy: 'createdAt',
  order: 'desc',
  page: 1,
  limit: 10,
};

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const [selectedIds, setSelectedIds] = useState([]);

  // UI Modal & Drawer States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('create'); // 'create' | 'edit'
  const [activeStudent, setActiveStudent] = useState(null);
  
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailStudent, setDetailStudent] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'single'|'bulk', data: student | ids }

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Theme state: 'dark' | 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('rvce_theme') || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('rvce_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Database Connection Health State
  const [dbHealth, setDbHealth] = useState({
    connected: false,
    status: 'Checking...',
    host: '127.0.0.1:27017',
    name: 'rvce_student_db',
    compassUri: 'mongodb://127.0.0.1:27017/rvce_student_db',
  });

  // Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success', undoCallback = null) => {
    setToast({
      id: Date.now(),
      message,
      type,
      undoCallback,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  // Keyboard shortcut Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setFilters((prev) => ({ ...prev, page: 1 }));
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Check DB Health
  const checkDbHealth = useCallback(async () => {
    try {
      const res = await axios.get(HEALTH_URL);
      if (res.data && res.data.database) {
        setDbHealth({
          connected: res.data.database.connected,
          status: res.data.database.status,
          host: res.data.database.host,
          name: res.data.database.name,
          compassUri: res.data.database.compassUri,
        });
      }
    } catch (err) {
      setDbHealth((prev) => ({
        ...prev,
        connected: false,
        status: 'Offline / Connecting',
      }));
    }
  }, []);

  // Fetch Analytics & Stats Pipeline
  const fetchAnalytics = useCallback(async () => {
    try {
      setStatsLoading(true);
      const res = await axios.get(`${API_BASE}/stats/analytics`);
      if (res.data && res.data.success) {
        setAnalytics(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch Students with current query parameters
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        search: debouncedSearch,
        ...filters,
      };

      const res = await axios.get(API_BASE, { params });
      if (res.data && res.data.success) {
        setStudents(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch students:', err);
      showToast(err.response?.data?.message || 'Failed to fetch student data', 'error');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filters, showToast]);

  // Initial loads and re-fetch when filters/search changes
  useEffect(() => {
    checkDbHealth();
    fetchAnalytics();
  }, [checkDbHealth, fetchAnalytics]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Create or Update Student
  const saveStudent = async (studentData) => {
    try {
      if (drawerMode === 'create') {
        const res = await axios.post(API_BASE, studentData);
        showToast(`Student ${res.data.data.name} added successfully!`, 'success');
      } else {
        const res = await axios.put(`${API_BASE}/${activeStudent._id}`, studentData);
        showToast(`Updated ${res.data.data.name} profile`, 'success');
      }
      setIsDrawerOpen(false);
      setActiveStudent(null);
      fetchStudents();
      fetchAnalytics();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save student profile';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // Soft Delete Student with Instant Undo Toast
  const deleteSingleStudent = async (student, permanent = false) => {
    try {
      await axios.delete(`${API_BASE}/${student._id}`, { params: { permanent } });
      fetchStudents();
      fetchAnalytics();
      setSelectedIds((prev) => prev.filter((id) => id !== student._id));

      if (!permanent) {
        showToast(`Moved ${student.name} to Trash`, 'warning', async () => {
          try {
            await axios.patch(`${API_BASE}/${student._id}/restore`);
            showToast(`Restored ${student.name} to active records`, 'success');
            fetchStudents();
            fetchAnalytics();
          } catch (restoreErr) {
            showToast('Failed to restore student', 'error');
          }
        });
      } else {
        showToast(`Permanently deleted ${student.name}`, 'info');
      }
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete student';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // Bulk Delete
  const bulkDelete = async (ids, permanent = false) => {
    try {
      const res = await axios.post(`${API_BASE}/bulk-delete`, { ids, permanent });
      showToast(res.data.message || `Processed ${ids.length} students`, 'warning', async () => {
        if (!permanent) {
          try {
            await axios.post(`${API_BASE}/bulk-restore`, { ids });
            showToast(`Restored ${ids.length} students`, 'success');
            fetchStudents();
            fetchAnalytics();
          } catch (rErr) {
            showToast('Failed to restore bulk selection', 'error');
          }
        }
      });
      setSelectedIds([]);
      fetchStudents();
      fetchAnalytics();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Bulk delete failed';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // Bulk Import
  const bulkImport = async (studentsArray) => {
    try {
      const res = await axios.post(`${API_BASE}/bulk-import`, { students: studentsArray });
      showToast(res.data.message, 'success');
      fetchStudents();
      fetchAnalytics();
      setIsImportModalOpen(false);
      return { success: true, results: res.data.results };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to import students';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // Export Data to CSV or JSON
  const exportData = async (format = 'csv') => {
    try {
      const res = await axios.get(`${API_BASE}/export/all`);
      const records = res.data.data;

      if (!records || records.length === 0) {
        showToast('No records available to export', 'info');
        return;
      }

      if (format === 'json') {
        const jsonBlob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(jsonBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `RVCE_Students_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Exported JSON successfully', 'success');
      } else {
        // Generate CSV
        const headers = ['USN', 'Name', 'Email', 'Branch', 'Semester', 'CGPA', 'Attendance', 'Status', 'GitHub', 'LeetCode', 'Skills', 'Phone', 'Section', 'Mentor'];
        const rows = records.map((s) => [
          s.usn,
          `"${s.name.replace(/"/g, '""')}"`,
          s.email,
          s.branch,
          s.semester,
          s.cgpa,
          s.attendance,
          s.status,
          s.githubUsername || '',
          s.leetcodeHandle || '',
          `"${(s.skills || []).join(', ')}"`,
          s.phone || '',
          s.section || 'A',
          `"${s.mentor || ''}"`,
        ]);

        const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(csvBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `RVCE_Students_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Exported CSV spreadsheet successfully', 'success');
      }
    } catch (err) {
      showToast('Failed to export student records', 'error');
    }
  };

  // Drawer helpers
  const openCreateDrawer = () => {
    setActiveStudent(null);
    setDrawerMode('create');
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (student) => {
    setActiveStudent(student);
    setDrawerMode('edit');
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setActiveStudent(null);
  };

  // Detail Modal helpers
  const openDetailModal = (student) => {
    setDetailStudent(student);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setDetailStudent(null);
    setIsDetailModalOpen(false);
  };

  // Delete Modal helpers
  const openDeleteModal = (target) => {
    setDeleteTarget(target);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteTarget(null);
    setIsDeleteModalOpen(false);
  };

  // Selection handlers
  const toggleSelectStudent = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (isAllSelected) => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(students.map((s) => s._id));
    }
  };

  // Filter setters
  const setFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : 1, // Reset page on filter changes unless changing page
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setSearchTerm('');
  };

  const value = {
    students,
    pagination,
    analytics,
    loading,
    statsLoading,
    searchTerm,
    setSearchTerm,
    filters,
    setFilter,
    resetFilters,
    viewMode,
    setViewMode,
    selectedIds,
    toggleSelectStudent,
    toggleSelectAll,
    // Drawer
    isDrawerOpen,
    drawerMode,
    activeStudent,
    openCreateDrawer,
    openEditDrawer,
    closeDrawer,
    saveStudent,
    // Modals
    isDetailModalOpen,
    detailStudent,
    openDetailModal,
    closeDetailModal,
    isDeleteModalOpen,
    deleteTarget,
    openDeleteModal,
    closeDeleteModal,
    deleteSingleStudent,
    bulkDelete,
    isImportModalOpen,
    setIsImportModalOpen,
    bulkImport,
    // Command Palette
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    // Actions & State
    dbHealth,
    checkDbHealth,
    fetchStudents,
    fetchAnalytics,
    exportData,
    toast,
    showToast,
    hideToast,
    theme,
    toggleTheme,
  };

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
};

export const useStudentContext = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudentContext must be used within a StudentProvider');
  }
  return context;
};
