import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Activity, Users, UserCheck, Clock } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        total_patients: 0, total_doctors: 0, today_appointments: 0, waiting_queue: 0
    });
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        fetchStats();
        fetchDoctors();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/admin/stats');
            setStats(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDoctors = async () => {
        try {
            const res = await api.get('/admin/doctors');
            setDoctors(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard icon={<Users className="w-8 h-8 text-blue-500"/>} title="Total Patients" value={stats.total_patients} />
                <StatCard icon={<UserCheck className="w-8 h-8 text-green-500"/>} title="Total Doctors" value={stats.total_doctors} />
                <StatCard icon={<Activity className="w-8 h-8 text-primary-500"/>} title="Appointments Today" value={stats.today_appointments} />
                <StatCard icon={<Clock className="w-8 h-8 text-orange-500"/>} title="Waiting in Queue" value={stats.waiting_queue} />
            </div>

            <div className="card overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold">Manage Doctors</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Department</th>
                                <th className="px-6 py-3">Specialization</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {doctors.map(doc => (
                                <tr key={doc.doctor_id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium">{doc.name}</td>
                                    <td className="px-6 py-4">{doc.email}</td>
                                    <td className="px-6 py-4">{doc.department}</td>
                                    <td className="px-6 py-4">{doc.specialization}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${doc.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {doc.availability ? 'Available' : 'Unavailable'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value }) => (
    <div className="card p-6 flex items-center gap-4">
        <div className="p-3 bg-slate-50 rounded-lg">{icon}</div>
        <div>
            <p className="text-sm text-slate-500 font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        </div>
    </div>
);

export default AdminDashboard;
