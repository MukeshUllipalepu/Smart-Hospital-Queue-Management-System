import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { Activity, LogOut, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { language, changeLanguage } = useContext(LanguageContext);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getDashboardLink = () => {
        if (!user) return '/';
        switch (user.role) {
            case 'admin': return '/admin-dashboard';
            case 'doctor': return '/doctor-dashboard';
            case 'patient': return '/patient-dashboard';
            default: return '/';
        }
    };

    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 text-primary-600">
                            <Activity className="h-8 w-8" />
                            <span className="font-bold text-xl tracking-tight hidden sm:block">SmartQueue</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <select 
                            value={language} 
                            onChange={(e) => changeLanguage(e.target.value)}
                            className="bg-slate-50 border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2 outline-none"
                        >
                            <option value="en">English</option>
                            <option value="te">తెలుగు</option>
                            <option value="hi">हिंदी</option>
                        </select>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to={getDashboardLink()} className="text-slate-600 hover:text-primary-600 font-medium transition-colors hidden sm:block">
                                    {t('dashboard')}
                                </Link>
                                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                                    <User className="h-4 w-4 text-slate-500" />
                                    <span className="text-sm font-medium text-slate-700">{user.name}</span>
                                </div>
                                <button onClick={handleLogout} className="text-red-500 hover:text-red-700 transition-colors" title={t('logout')}>
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Link to="/login" className="btn btn-secondary text-sm px-4 py-2">
                                    {t('login')}
                                </Link>
                                <Link to="/register" className="btn btn-primary text-sm px-4 py-2 hidden sm:block">
                                    {t('register')}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
