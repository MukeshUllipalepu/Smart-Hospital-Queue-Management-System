import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Clock, Users, Activity, ChevronRight } from 'lucide-react';

const Home = () => {
    const { t } = useTranslation();

    return (
        <div className="bg-slate-50 min-h-[calc(100vh-4rem)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
                        {t('welcome')}
                    </h1>
                    <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                        Digitizing patient appointments, queue handling, and waiting time tracking for a better healthcare experience.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/register" className="btn btn-primary text-lg flex items-center justify-center gap-2 px-8 py-3">
                            Get Started <ChevronRight className="h-5 w-5" />
                        </Link>
                        <Link to="/login" className="btn btn-secondary text-lg px-8 py-3">
                            Patient Login
                        </Link>
                    </div>
                </div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="card p-6 bg-white hover:shadow-lg transition-shadow">
                        <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            <Clock className="h-6 w-6 text-primary-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Reduce Wait Times</h3>
                        <p className="text-slate-600">Track real-time queue status and arrive just in time for your appointment.</p>
                    </div>
                    
                    <div className="card p-6 bg-white hover:shadow-lg transition-shadow">
                        <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            <Activity className="h-6 w-6 text-primary-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Smart Token System</h3>
                        <p className="text-slate-600">Department-wise automated token generation ensuring smooth workflow.</p>
                    </div>

                    <div className="card p-6 bg-white hover:shadow-lg transition-shadow">
                        <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                            <Users className="h-6 w-6 text-primary-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Doctor Dashboard</h3>
                        <p className="text-slate-600">Doctors can easily manage their patient queue and update availability.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
