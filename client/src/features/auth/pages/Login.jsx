import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Minimal Inline Icons for dependencies-free usage
const Eye = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>);
const EyeOff = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>);
const GoogleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>);
const AppleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 13.92c-.06-2.58 2.08-3.83 2.18-3.89-1.2-1.75-3.08-1.98-3.76-2-1.61-.17-3.14.95-3.95.95-.82 0-2.08-.94-3.46-.91-1.78.02-3.42 1.04-4.34 2.63-1.85 3.22-.48 7.97 1.33 10.6.89 1.28 1.94 2.7 3.3 2.66 1.3-.04 1.83-.84 3.42-.84 1.58 0 2.08.84 3.44.82 1.39-.02 2.29-1.29 3.17-2.58.98-1.44 1.39-2.83 1.41-2.91-.03-.02-2.64-1.02-2.74-4.53zm-2.01-6.19c.73-.88 1.21-2.11 1.08-3.34-1.05.04-2.34.71-3.1 1.6-.61.71-1.18 1.96-1.03 3.16 1.18.09 2.32-.54 3.05-1.42z" /></svg>);

// Functional Input Component to maintain state easily
const InputField = ({ label, name, type, value, onChange, focused, setFocused, error, maxLength, prefix, children }) => {
    const isFocused = focused === name;
    const hasValue = value && value.length > 0;
    const isActive = isFocused || hasValue;

    return (
        <div className="relative group">
            <div className={`relative flex items-center w-full bg-white/70 backdrop-blur-md shadow-[inset_0_1px_3px_rgba(0,0,0,0.03)] border rounded-2xl transition-all duration-300 ${isFocused ? 'border-amber-400 ring-[3px] ring-amber-400/20' : error ? 'border-red-300 bg-red-50/50' : 'border-white/40 hover:border-white hover:bg-white/90'}`}>
                {prefix && (
                    <span className={`absolute left-4 top-6 text-[15px] font-medium transition-all duration-300 ${isActive ? 'text-neutral-800 opacity-100' : 'opacity-0'}`}>
                        {prefix}
                    </span>
                )}
                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setFocused(name)}
                    onBlur={() => setFocused('')}
                    maxLength={maxLength}
                    className={`w-full bg-transparent outline-none text-neutral-800 text-[15px] font-medium transition-all pt-6 pb-2.5 ${prefix && isActive ? 'pl-12 pr-4' : 'px-4'}`}
                />

                {/* Floating Label */}
                <label
                    htmlFor={name}
                    className={`absolute cursor-text transition-all duration-300 pointer-events-none ${isActive ? 'text-[11px] font-semibold top-1.5 left-4 text-amber-700 uppercase tracking-wide' : 'text-sm top-3.5 left-4 text-neutral-500 font-medium'}`}
                >
                    {label}
                </label>

                {/* Icons inside Right slot */}
                {children && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                        {children}
                    </div>
                )}
            </div>
            {/* Simple Inline Error */}
            <div className={`overflow-hidden transition-all duration-300 ${error ? 'h-6 opacity-100' : 'h-0 opacity-0'}`}>
                {error && <p className="text-[11px] text-red-600 font-semibold pt-1.5 pl-2 flex items-center gap-1.5 mb-1"><span className="w-1 h-1 rounded-full bg-red-600 inline-block"></span>{error}</p>}
            </div>
        </div>
    );
};

const Login = () => {
    const [role, setRole] = useState('User');
    const [formData, setFormData] = useState({ contact: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { handleLogin } = useAuth();
    const navigate = useNavigate();

    const handleInput = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const getContactError = () => {
        if (!formData.contact || focused === 'contact') return '';
        return formData.contact.length >= 3 ? '' : 'Please enter a valid email or phone number';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const loginId = formData.contact.trim();
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginId);

        try {
            await handleLogin({
                email: isEmail ? loginId : '',
                contact: isEmail ? '' : loginId,
                password: formData.password
            });
            navigate("/");
        } catch {
            // Error state is already handled by useAuth.
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex font-sans selection:bg-amber-200">
            <style>{`
                @keyframes smoothFadeUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-entry {
                    animation: smoothFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .animate-delay-1 { animation-delay: 0.1s; }
                .animate-delay-2 { animation-delay: 0.2s; }
                .animate-delay-3 { animation-delay: 0.3s; }
            `}</style>

            {/* FULL-SCREEN BACKGROUND IMAGE */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-neutral-900">
                <img
                    src="https://i.pinimg.com/1200x/0d/1d/8b/0d1d8b3c63e3152f841380cd2f01b6d9.jpg"
                    alt="Premium Fashion Lifestyle"
                    className="w-full h-full object-cover opacity-90 transition-transform duration-[10s] ease-out hover:scale-105 "
                />
                {/* Premium Gradients to ensure text and card readability across the screen */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/60"></div>      
            </div>

            {/* CONTENT CONTAINER - Sitting on top of the background */}
            <div className="relative z-10 flex w-full h-full min-h-screen">

                {/* LEFT SIDE: Imagery & Brand */}
                <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 flex-col justify-between p-12 lg:p-16">
                    <div className="text-4xl font-serif font-black tracking-widest text-white uppercase drop-shadow-lg animate-entry">
                        Snitch
                    </div>
                    <div className="max-w-md animate-entry animate-delay-1 pb-10">
                        <h1 className="text-4xl xl:text-5xl font-bold leading-tight text-white mb-6">
                            Welcome back to <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">
                                Your Signature Look
                            </span>
                        </h1>
                        <p className="text-lg text-white/80 font-light leading-relaxed">
                            Sign in to continue exploring the most exclusive streetwear collective and manage your account.
                        </p>
                    </div>
                </div>

                {/* RIGHT SIDE: Onboarding Form */}
                <div className="w-full lg:w-[55%] xl:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">

                    {/* Mobile Branding (Visible only on smaller screens) */}
                    <div className="absolute top-8 w-full text-center z-10 lg:hidden">
                        <h1 className="text-3xl font-serif font-black tracking-widest text-white uppercase drop-shadow-md">Snitch</h1>
                    </div>

                    {/* Floating Glassmorphism Form Card */}
                    <div className="w-full max-w-lg bg-white/10 backdrop-blur-[24px] rounded-[2rem] p-8 sm:p-10 lg:p-12 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border border-white/30 animate-entry mt-24 lg:mt-0">

                        <div className="mb-10 text-center lg:text-left">
                            <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Welcome Back</h2>
                            <p className="text-white/80 text-sm font-medium">Log in to your account.</p>
                        </div>

                        {/* Role Segmented Control */}
                        <div className="relative flex p-1.5 bg-black/20 backdrop-blur-md shadow-inner rounded-2xl mb-8 border border-white/10">
                            <div
                                className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-md transition-transform duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)"
                                style={{ transform: role === 'Seller' ? 'translateX(100%)' : 'translateX(0)' }}
                            ></div>
                            {['User', 'Seller'].map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setRole(r)}
                                    className={`relative flex-1 py-3 text-sm font-bold rounded-xl z-10 transition-colors duration-300 ${role === r ? 'text-amber-700' : 'text-white hover:text-white/80'}`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            <InputField
                                label="Email / Contact Number" name="contact" type="text"
                                value={formData.contact} onChange={handleInput}
                                focused={focused} setFocused={setFocused}
                                error={getContactError()}
                            />

                            <div className="relative">
                                <InputField
                                    label="Password" name="password" type={showPassword ? "text" : "password"}
                                    value={formData.password} onChange={handleInput}
                                    focused={focused} setFocused={setFocused}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="p-1.5 text-neutral-500 hover:text-amber-600 hover:bg-black/5 rounded-lg transition-all focus:outline-none"
                                        aria-label="Toggle password visibility"
                                    >
                                        {showPassword ? <EyeOff /> : <Eye />}
                                    </button>
                                </InputField>
                            </div>

                            <div className="text-right mt-2">
                                <a href="#" className="text-xs font-bold text-white/70 hover:text-amber-400 transition-colors">Forgot Password?</a>
                            </div>

                            {/* Action Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full mt-6 py-4 bg-amber-500 text-neutral-900 rounded-2xl font-bold text-sm tracking-wide shadow-[0_10px_20px_rgba(245,158,11,0.25)] hover:shadow-[0_15px_25px_rgba(245,158,11,0.35)] hover:-translate-y-1 hover:bg-amber-400 active:translate-y-0 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <svg className="animate-spin h-5 w-5 text-neutral-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                ) : (
                                    <>
                                        Log In
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="mt-8 mb-6 flex items-center justify-between opacity-80">
                            <div className="flex-1 h-px bg-white/20"></div>
                            <span className="px-5 text-[11px] font-bold text-white/80 uppercase tracking-widest">Or log in with</span>
                            <div className="flex-1 h-px bg-white/20"></div>
                        </div>

                        {/* Social Authentication */}
                        <div className="flex justify-center gap-5">
                            <button type="button" className="p-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-white/20 hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-lg group text-white">
                                <span className="group-hover:scale-110 transition-transform block"><GoogleIcon /></span>
                            </button>
                            <button type="button" className="p-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-white/20 hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-lg group text-white">
                                <span className="group-hover:scale-110 transition-transform block"><AppleIcon /></span>
                            </button>
                        </div>

                        {/* Register Link */}
                        <div className="mt-10 text-center flex justify-center items-center gap-1.5">
                            <span className="text-sm text-white/80 font-medium">New here?</span>
                            <Link to="/register" className="text-sm font-bold text-white border-b-2 border-white/40 hover:text-amber-400 hover:border-amber-400 transition-colors pb-0.5">
                                Create an Account
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
