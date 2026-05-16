import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { CalendarPlus, Clock, Search, Calendar as CalendarIcon } from 'lucide-react';

const PatientDashboard = () => {
    const { user } = useContext(AuthContext);
    const { t } = useTranslation();
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [departments, setDepartments] = useState([]);
    
    // New filtering states
    const [cities, setCities] = useState([]);
    const [locations, setLocations] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    
    const [bookingData, setBookingData] = useState({
        city: '', location: '', hospital: '', doctor_id: '', department: '', appointment_date: '', appointment_time: '', priority: 'Normal'
    });
    const [showBooking, setShowBooking] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchAppointments();
        fetchCities();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await api.get('/patient/appointments');
            setAppointments(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCities = async () => {
        try {
            const res = await api.get('/public/cities');
            setCities(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchLocations = async (city) => {
        try {
            const res = await api.get(`/public/locations/${city}`);
            setLocations(res.data);
            setHospitals([]);
            setDepartments([]);
            setDoctors([]);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchHospitals = async (location) => {
        try {
            const res = await api.get(`/public/hospitals/${location}`);
            setHospitals(res.data);
            setDepartments([]);
            setDoctors([]);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDepartmentsAndDoctors = async (hospital) => {
        try {
            const docRes = await api.get(`/public/doctors?hospital=${encodeURIComponent(hospital)}`);
            setDoctors(docRes.data);
            const deptRes = await api.get(`/public/departments?hospital=${encodeURIComponent(hospital)}`);
            setDepartments(deptRes.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCityChange = (e) => {
        const city = e.target.value;
        setBookingData({ ...bookingData, city, location: '', hospital: '', department: '', doctor_id: '' });
        if (city) fetchLocations(city);
    };

    const handleLocationChange = (e) => {
        const location = e.target.value;
        setBookingData({ ...bookingData, location, hospital: '', department: '', doctor_id: '' });
        if (location) fetchHospitals(location);
    };

    const handleHospitalChange = (e) => {
        const hospital = e.target.value;
        setBookingData({ ...bookingData, hospital, department: '', doctor_id: '' });
        if (hospital) fetchDepartmentsAndDoctors(hospital);
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/patient/appointments', bookingData);
            setMessage(`Success! Token: ${res.data.token_number}`);
            setShowBooking(false);
            fetchAppointments();
        } catch (error) {
            setMessage(error.response?.data?.message || 'Booking failed');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Patient Dashboard</h1>
                <button onClick={() => setShowBooking(!showBooking)} className="btn btn-primary flex items-center gap-2">
                    <CalendarPlus className="h-5 w-5" /> Book Appointment
                </button>
            </div>

            {message && (
                <div className="mb-4 p-4 bg-primary-50 text-primary-700 rounded-lg border border-primary-200">
                    {message}
                </div>
            )}

            {showBooking && (
                <div className="card p-6 mb-8">
                    <h2 className="text-xl font-bold mb-4">New Appointment</h2>
                    <form onSubmit={handleBooking} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">City</label>
                            <select 
                                className="input-field" required
                                value={bookingData.city}
                                onChange={handleCityChange}
                            >
                                <option value="">Select City</option>
                                {cities.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Location</label>
                            <select 
                                className="input-field" required disabled={!bookingData.city}
                                value={bookingData.location}
                                onChange={handleLocationChange}
                            >
                                <option value="">Select Location</option>
                                {locations.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Hospital</label>
                            <select 
                                className="input-field" required disabled={!bookingData.location}
                                value={bookingData.hospital}
                                onChange={handleHospitalChange}
                            >
                                <option value="">Select Hospital</option>
                                {hospitals.map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Department</label>
                            <select 
                                className="input-field" required disabled={!bookingData.hospital}
                                value={bookingData.department}
                                onChange={(e) => setBookingData({...bookingData, department: e.target.value})}
                            >
                                <option value="">Select Department</option>
                                {departments.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Doctor</label>
                            <select 
                                className="input-field" required
                                value={bookingData.doctor_id}
                                onChange={(e) => setBookingData({...bookingData, doctor_id: e.target.value})}
                            >
                                <option value="">Select Doctor</option>
                                {doctors.filter(d => !bookingData.department || d.department === bookingData.department).map(d => (
                                    <option key={d.doctor_id} value={d.doctor_id}>Dr. {d.doctor_name} ({d.specialization})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Date</label>
                            <input 
                                type="date" className="input-field" required
                                min={new Date().toISOString().split('T')[0]}
                                value={bookingData.appointment_date}
                                onChange={(e) => setBookingData({...bookingData, appointment_date: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Time</label>
                            <input 
                                type="time" className="input-field" required
                                value={bookingData.appointment_time}
                                onChange={(e) => setBookingData({...bookingData, appointment_time: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Priority</label>
                            <select 
                                className="input-field"
                                value={bookingData.priority}
                                onChange={(e) => setBookingData({...bookingData, priority: e.target.value})}
                            >
                                <option value="Normal">Normal</option>
                                <option value="Urgent">Urgent</option>
                                <option value="Emergency">Emergency</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 lg:col-span-3 flex justify-end">
                            <button type="submit" className="btn btn-primary">Confirm Booking</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold flex items-center gap-2"><Clock className="h-5 w-5"/> My Appointments & Queue Status</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600">
                            <tr>
                                <th className="px-6 py-3">Token</th>
                                <th className="px-6 py-3">Doctor</th>
                                <th className="px-6 py-3">Date & Time</th>
                                <th className="px-6 py-3">Est. Wait Time</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {appointments.map(apt => (
                                <tr key={apt.appointment_id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-primary-600">{apt.token_number}</td>
                                    <td className="px-6 py-4">Dr. {apt.doctor_name}<br/><span className="text-xs text-slate-500">{apt.specialization}</span></td>
                                    <td className="px-6 py-4">{apt.appointment_date} <br/> {apt.appointment_time}</td>
                                    <td className="px-6 py-4">{apt.waiting_time ? `${apt.waiting_time} mins` : '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            apt.queue_status === 'Waiting' ? 'bg-yellow-100 text-yellow-800' :
                                            apt.queue_status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                            apt.queue_status === 'Completed' ? 'bg-green-100 text-green-800' :
                                            'bg-slate-100 text-slate-800'
                                        }`}>
                                            {apt.queue_status || apt.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {appointments.length === 0 && (
                                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No appointments found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
