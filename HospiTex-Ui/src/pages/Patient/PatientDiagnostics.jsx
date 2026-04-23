import React, { useState, useEffect } from 'react';
import { FlaskConical, FileText, Calendar, Download, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import toast from 'react-hot-toast';

const PatientDiagnostics = () => {
  const { api } = useApp();
  const [reports, setReports] = useState([]);
  const [diagnostics, setDiagnostics] = useState([]);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDiagnostic, setSelectedDiagnostic] = useState('');
  const [testName, setTestName] = useState('');
  const [testType, setTestType] = useState('');
  const [testDate, setTestDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReports();
    fetchDiagnostics();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/diagnostics/patient/reports');
      if (response.data.success) {
        setReports(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const fetchDiagnostics = async () => {
    try {
      const response = await api.get('/users/diagnostics');
      if (response.data.success) {
        setDiagnostics(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching diagnostics:', error);
    }
  };

  const handleBookTest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/diagnostics/book', {
        diagnosticId: selectedDiagnostic,
        testName,
        testType,
        testDate
      });
      if (response.data.success) {
        toast.success('Diagnostic test booked successfully!');
        setShowBooking(false);
        fetchReports();
        resetForm();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book test');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedDiagnostic('');
    setTestName('');
    setTestType('');
    setTestDate('');
  };

  const getStatusBadge = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-700',
      'In Progress': 'bg-blue-100 text-blue-700',
      'Completed': 'bg-green-100 text-green-700'
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors['Pending']}`}>{status}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Diagnostic Reports</h2>
        <button onClick={() => setShowBooking(true)} className="btn-primary">
          + Book Diagnostic Test
        </button>
      </div>

      <div className="grid gap-4">
        {reports.length === 0 ? (
          <div className="card text-center py-12">
            <FlaskConical className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No diagnostic reports found</p>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report._id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <FileText className="w-10 h-10 text-primary-500" />
                  <div>
                    <h3 className="font-semibold">{report.testName}</h3>
                    <p className="text-sm text-gray-600">{report.testType}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(report.testDate).toLocaleDateString()}</span>
                      {getStatusBadge(report.status)}
                    </div>
                  </div>
                </div>
                {report.reportFile && (
                  <button className="text-primary-600 hover:text-primary-700">
                    <Download className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Book Diagnostic Test</h3>
            <form onSubmit={handleBookTest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Diagnostic Center</label>
                <select value={selectedDiagnostic} onChange={(e) => setSelectedDiagnostic(e.target.value)} className="input-field" required>
                  <option value="">Select Center</option>
                  {diagnostics.map(d => <option key={d._id} value={d.user?._id}>{d.centerName || d.user?.username}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Test Name</label>
                <input type="text" value={testName} onChange={(e) => setTestName(e.target.value)} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Test Type</label>
                <input type="text" value={testType} onChange={(e) => setTestType(e.target.value)} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Test Date</label>
                <input type="date" value={testDate} onChange={(e) => setTestDate(e.target.value)} className="input-field" required />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={loading} className="flex-1 btn-primary">{loading ? 'Booking...' : 'Book Test'}</button>
                <button type="button" onClick={() => setShowBooking(false)} className="flex-1 btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDiagnostics;
