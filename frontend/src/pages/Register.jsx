import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'patient', specialization: '', department: '', city: '', location: '', hospital: ''
    });
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
                        Create an account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input name="name" type="text" required className="input-field" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <input name="email" type="email" required className="input-field" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <input name="password" type="password" required className="input-field" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                            <select name="role" className="input-field" onChange={handleChange} value={formData.role}>
                                <option value="patient">Patient</option>
                                <option value="doctor">Doctor</option>
                            </select>
                        </div>
                        
                        {formData.role === 'doctor' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                                    <input name="city" type="text" required className="input-field" onChange={handleChange} placeholder="e.g. New York" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                                    <input name="location" type="text" required className="input-field" onChange={handleChange} placeholder="e.g. Manhattan" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Hospital</label>
                                    <input name="hospital" type="text" required className="input-field" onChange={handleChange} placeholder="e.g. City General Hospital" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                                    <input name="department" type="text" required className="input-field" onChange={handleChange} placeholder="e.g. Cardiology" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Specialization</label>
                                    <input name="specialization" type="text" required className="input-field" onChange={handleChange} placeholder="e.g. Surgeon" />
                                </div>
                            </>
                        )}
                    </div>

                    <div>
                        <button type="submit" className="w-full btn btn-primary py-3">
                            {t('register')}
                        </button>
                    </div>
                    
                    <div className="text-center text-sm text-slate-600">
                        Already have an account? <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-500">Sign in</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
