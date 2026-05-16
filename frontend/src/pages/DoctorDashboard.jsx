import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Users, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const DoctorDashboard = () => {
    const { user } = useContext(AuthContext);
    const [queue, setQueue] = useState([]);

    useEffect(() => {
        fetchQueue();
    }, []);

    const fetchQueue = async () => {
        try {
            const res = await api.get('/doctor/queue');
            setQueue(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const updateStatus = async (queue_id, status) => {
        try {
            await api.put(`/doctor/queue/${queue_id}/status`, { status });
            fetchQueue();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mb-2">
                    <Users className="h-6 w-6 text-primary-600"/> Today's Queue
                </h1>
                {user.hospital && (
                    <p className="text-slate-600 font-medium">
                        {user.hospital} • {user.department}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {queue.map((patient) => (
                    <div key={patient.queue_id} className={`card p-6 border-l-4 ${
                        patient.priority === 'Emergency' ? 'border-l-red-500' :
                        patient.priority === 'Urgent' ? 'border-l-orange-500' : 'border-l-primary-500'
                    }`}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg">{patient.patient_name}</h3>
                                <span className="text-sm font-medium text-slate-500">Token: {patient.token_number}</span>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                patient.priority === 'Emergency' ? 'bg-red-100 text-red-700' :
                                patient.priority === 'Urgent' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'
                            }`}>
                                {patient.priority}
                            </span>
                        </div>
                        <div className="text-sm text-slate-600 mb-4 flex justify-between">
                            <span>Time: {patient.appointment_time}</span>
                            <span className="font-medium text-primary-600">{patient.current_status}</span>
                        </div>
                        
                        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                            {patient.current_status === 'Waiting' && (
                                <button onClick={() => updateStatus(patient.queue_id, 'In Progress')} className="btn bg-blue-50 text-blue-600 hover:bg-blue-100 flex-1 text-sm flex justify-center items-center gap-1">
                                    <AlertCircle className="w-4 h-4"/> Start
                                </button>
                            )}
                            {patient.current_status === 'In Progress' && (
                                <button onClick={() => updateStatus(patient.queue_id, 'Completed')} className="btn bg-green-50 text-green-600 hover:bg-green-100 flex-1 text-sm flex justify-center items-center gap-1">
                                    <CheckCircle className="w-4 h-4"/> Complete
                                </button>
                            )}
                            {(patient.current_status === 'Waiting' || patient.current_status === 'In Progress') && (
                                <button onClick={() => updateStatus(patient.queue_id, 'Skipped')} className="btn bg-red-50 text-red-600 hover:bg-red-100 flex-1 text-sm flex justify-center items-center gap-1">
                                    <XCircle className="w-4 h-4"/> Skip
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                
                {queue.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-200">
                        No patients in the queue for today.
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorDashboard;
