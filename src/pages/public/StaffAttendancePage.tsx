import React, { useState } from 'react';
import { Clock, User, CheckCircle, XCircle, Calendar, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { db } from '../../firebase';
import { collectionGroup, query, where, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';

interface AttendanceRecord {
  id: string;
  employeeId: string;
  name: string;
  clockIn?: string;
  clockOut?: string;
  date: string;
  status: 'clocked-in' | 'clocked-out' | 'not-started';
  hoursWorked?: string;
}

const StaffAttendancePage: React.FC = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [currentEmployee, setCurrentEmployee] = useState<AttendanceRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // No local mock employees/attendance — we persist to Firestore

  const handleEmployeeSearch = () => {
    if (!employeeId.trim()) {
      toast.error('Please enter your employee ID.');
      return;
    }

    setIsLoading(true);
    // Search for staff documents across all users' 'staff' subcollections
    (async () => {
      try {
        const staffQuery = query(collectionGroup(db, 'staff'), where('employeeId', '==', employeeId));
        const snap = await getDocs(staffQuery);

        if (!snap.empty) {
          const docData = snap.docs[0];
          const staff = { id: docData.id, ...(docData.data() as any) };
          const today = new Date().toISOString().split('T')[0];

          // Attendance doc id per employee per day
          const attendanceDocId = `${staff.employeeId}_${today}`;
          const attendanceRef = doc(db, 'attendance', attendanceDocId);
          const attendanceSnap = await getDoc(attendanceRef);

          let attendanceRecord: AttendanceRecord;
          if (attendanceSnap.exists()) {
            attendanceRecord = { id: attendanceSnap.id, ...(attendanceSnap.data() as any) } as AttendanceRecord;
          } else {
            attendanceRecord = {
              id: attendanceDocId,
              employeeId: staff.employeeId,
              name: staff.name,
              date: today,
              status: 'not-started'
            } as AttendanceRecord;
          }

          // Auto toggle attendance based on previous state
          await autoToggleAttendance(attendanceRecord);
        } else {
          toast.error('Please check your employee ID and try again.');
          setCurrentEmployee(null);
          setIsLoading(false);
        }
      } catch (e) {
        console.error(e);
        toast.error('Failed to lookup employee.');
        setCurrentEmployee(null);
        setIsLoading(false);
      }
    })();
  };

  const handleClockIn = () => {
    if (!currentEmployee) return;

    const now = new Date();
    const timeString = now.toTimeString().slice(0, 5);
    
    const updatedRecord: AttendanceRecord = {
      ...currentEmployee,
      clockIn: timeString,
      status: 'clocked-in'
    };

    setCurrentEmployee(updatedRecord);
    // Persist to Firestore
    (async () => {
      try {
        const attendanceRef = doc(db, 'attendance', updatedRecord.id);
        await setDoc(attendanceRef, { ...updatedRecord });
      } catch (e) {
        console.error(e);
        toast.error('Failed to save clock in to database.');
      }
    })();

    toast.success(`You clocked in at ${timeString}`);
  };

  const handleClockOut = () => {
    if (!currentEmployee) return;

    const now = new Date();
    const timeString = now.toTimeString().slice(0, 5);
    
    const updatedRecord: AttendanceRecord = {
      ...currentEmployee,
      clockOut: timeString,
      status: 'clocked-out'
    };

    setCurrentEmployee(updatedRecord);
    // calculate hours worked
    const hours = calculateHoursWorked(updatedRecord.clockIn, updatedRecord.clockOut) || undefined;
    (async () => {
      try {
        const attendanceRef = doc(db, 'attendance', updatedRecord.id);
        await setDoc(attendanceRef, { ...updatedRecord, hoursWorked: hours });
        // reflect hours in local state
        setCurrentEmployee({ ...updatedRecord, hoursWorked: hours });
      } catch (e) {
        console.error(e);
        toast.error('Failed to save clock out to database.');
      }
    })();

    toast.success(`You clocked out at ${timeString}`);
  };

  const calculateHoursWorked = (clockIn?: string, clockOut?: string) => {
    if (!clockIn || !clockOut) return null;
    
    const [inHour, inMin] = clockIn.split(':').map(Number);
    const [outHour, outMin] = clockOut.split(':').map(Number);
    
    const inMinutes = inHour * 60 + inMin;
    const outMinutes = outHour * 60 + outMin;
    
    const diffMinutes = outMinutes - inMinutes;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  };

  // Helper to toggle attendance state automatically and persist
  const autoToggleAttendance = async (attendanceRecord: AttendanceRecord) => {
    // If not-started -> clock in, if clocked-in -> clock out, if clocked-out -> do nothing
    if (attendanceRecord.status === 'not-started') {
      const now = new Date();
      const timeString = now.toTimeString().slice(0, 5);
      const updated: AttendanceRecord = { ...attendanceRecord, clockIn: timeString, status: 'clocked-in' };
      try {
        const attendanceRef = doc(db, 'attendance', updated.id);
        await setDoc(attendanceRef, updated);
        setCurrentEmployee(updated);
        toast.success(`You clocked in at ${timeString}`);
      } catch (e) {
        console.error(e);
        toast.error('Failed to save clock in to database.');
      } finally {
        setIsLoading(false);
      }
    } else if (attendanceRecord.status === 'clocked-in') {
      const now = new Date();
      const timeString = now.toTimeString().slice(0, 5);
      const hours = calculateHoursWorked(attendanceRecord.clockIn, timeString);
      const updated: AttendanceRecord = { ...attendanceRecord, clockOut: timeString, status: 'clocked-out', hoursWorked: hours } as AttendanceRecord;
      try {
        const attendanceRef = doc(db, 'attendance', updated.id);
        await setDoc(attendanceRef, { ...updated });
        setCurrentEmployee(updated);
        toast.success(`You clocked out at ${timeString}`);
      } catch (e) {
        console.error(e);
        toast.error('Failed to save clock out to database.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // already clocked-out
      setCurrentEmployee(attendanceRecord);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f7e7d7' }}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-orange-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Staff Attendance</h1>
              <p className="text-gray-600">Clock in and out for your shifts</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Employee ID Input */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Employee Login
            </h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-2">
                  Employee ID
                </label>
                <input
                  id="employeeId"
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleEmployeeSearch()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
                  placeholder="Enter your employee ID"
                />
              </div>
              
              <button
                onClick={handleEmployeeSearch}
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <User className="h-5 w-5" />
                    <span>Find Employee</span>
                  </>
                )}
              </button>
            </div>

            {/* Demo IDs */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Demo Employee IDs</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-blue-700">
                  <strong>1:</strong> John Doe (Head Chef)
                </div>
                <div className="text-blue-700">
                  <strong>2:</strong> Sarah Adams (Server)
                </div>
                <div className="text-blue-700">
                  <strong>3:</strong> Mike Johnson (Cook)
                </div>
                <div className="text-blue-700">
                  <strong>4:</strong> Emma Wilson (Server)
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Actions */}
          {currentEmployee && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Attendance
              </h2>

              {/* Employee Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {currentEmployee.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{currentEmployee.name}</h3>
                    <p className="text-sm text-gray-600">
                      Employee ID: {currentEmployee.employeeId}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>Restaurant Location</span>
                  </div>
                </div>
              </div>

              {/* Current Status */}
              <div className="mb-6">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  currentEmployee.status === 'clocked-in' 
                    ? 'bg-green-100 text-green-800'
                    : currentEmployee.status === 'clocked-out'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {currentEmployee.status === 'clocked-in' && <CheckCircle className="h-4 w-4 mr-1" />}
                  {currentEmployee.status === 'clocked-out' && <XCircle className="h-4 w-4 mr-1" />}
                  {currentEmployee.status === 'not-started' && <Clock className="h-4 w-4 mr-1" />}
                  
                  {currentEmployee.status === 'clocked-in' && 'Currently Working'}
                  {currentEmployee.status === 'clocked-out' && 'Shift Completed'}
                  {currentEmployee.status === 'not-started' && 'Ready to Start'}
                </div>
              </div>

              {/* Time Information */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-sm text-blue-600 font-medium">Clock In</div>
                  <div className="text-lg font-bold text-blue-900">
                    {currentEmployee.clockIn || '--:--'}
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="text-sm text-purple-600 font-medium">Clock Out</div>
                  <div className="text-lg font-bold text-purple-900">
                    {currentEmployee.clockOut || '--:--'}
                  </div>
                </div>
              </div>

              {/* Hours Worked */}
              {currentEmployee.clockIn && currentEmployee.clockOut && (
                <div className="bg-green-50 rounded-lg p-4 mb-6">
                  <div className="text-sm text-green-600 font-medium">Hours Worked Today</div>
                  <div className="text-2xl font-bold text-green-900">
                    {calculateHoursWorked(currentEmployee.clockIn, currentEmployee.clockOut)}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {currentEmployee.status === 'not-started' && (
                  <button
                    onClick={handleClockIn}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span>Clock In</span>
                  </button>
                )}

                {currentEmployee.status === 'clocked-in' && (
                  <button
                    onClick={handleClockOut}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    <XCircle className="h-5 w-5" />
                    <span>Clock Out</span>
                  </button>
                )}

                {currentEmployee.status === 'clocked-out' && (
                  <div className="text-center text-gray-600">
                    <p>You have completed your shift for today.</p>
                    <p className="text-sm mt-1">Thank you for your hard work!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Instructions */}
          {!currentEmployee && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">How to Use</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Enter Employee ID</h3>
                    <p className="text-sm text-gray-600">Type your employee ID in the input field</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Find Employee</h3>
                    <p className="text-sm text-gray-600">Click the button to verify your identity</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Clock In/Out</h3>
                    <p className="text-sm text-gray-600">Use the buttons to record your attendance</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Current Time Display */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 inline-block">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Current Time</h3>
            <div className="text-3xl font-bold text-gray-900">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {new Date().toLocaleDateString([], { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffAttendancePage;