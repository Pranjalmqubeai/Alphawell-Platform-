// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAlphaWell } from '../../context/AlphaWellContext';
// import {
//   Activity, Mail, Lock, ArrowRight, User, Briefcase, BarChart3, Eye, EyeOff,
// } from 'lucide-react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// export default function Login() {
//   const { login } = useAlphaWell();
//   const navigate = useNavigate();

//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const demoAccounts = [
//     { role: 'Investor', email: 'investor@alphawell.com', icon: Briefcase, color: 'from-blue-500 to-cyan-500' },
//     { role: 'Operator', email: 'operator@alphawell.com', icon: User, color: 'from-indigo-500 to-blue-500' },
//     { role: 'Analyst', email: 'analyst@alphawell.com', icon: BarChart3, color: 'from-purple-500 to-indigo-500' },
//   ];

//   const fillDemo = (demoEmail) => {
//     setEmail(demoEmail);
//     setPassword('demo123');
//     toast.info('Filled demo credentials');
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     const ok = await login(email, password);
//     setIsLoading(false);
//     if (ok) navigate('/app');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
//       <ToastContainer position="top-right" />
//       {/* Animated Background */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
//         <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
//         <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
//       </div>

//       <div className="relative w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
//         {/* Left Side - Branding */}
//         <div className="hidden md:flex flex-col justify-center space-y-8 p-8">
//           <div className="space-y-4">
//             <div className="flex items-center space-x-3 mb-6">
//               <div className="relative">
//                 <div className="absolute inset-0 bg-blue-500 blur-xl opacity-30 rounded-full animate-pulse-slow"></div>
//                 <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-xl">
//                   <Activity className="w-12 h-12 text-white" strokeWidth={2.5} />
//                 </div>
//               </div>
//               <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
//                 AlphaWell
//               </h1>
//             </div>
//             <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
//             <p className="text-lg text-gray-600 leading-relaxed">
//               Sign in to access your AI-driven production and economic intelligence platform
//             </p>
//           </div>

//           <div className="space-y-4">
//             {[
//               { icon: BarChart3, title: 'Real-Time Analytics', desc: 'Track performance metrics instantly', color: 'bg-blue-100 text-blue-600' },
//               { icon: Activity, title: 'AI-Powered Insights', desc: 'Make data-driven decisions', color: 'bg-indigo-100 text-indigo-600' },
//               { icon: Briefcase, title: 'Enterprise Grade', desc: 'Secure and scalable platform', color: 'bg-purple-100 text-purple-600' },
//             ].map((f, i) => (
//               <div key={i} className="flex items-start space-x-3">
//                 <div className={`${f.color} rounded-lg p-2 mt-1`}>
//                   <f.icon className="w-5 h-5" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900">{f.title}</h3>
//                   <p className="text-sm text-gray-600">{f.desc}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Right Side - Login Form */}
//         <div className="relative">
//           <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-200">
//             {/* Mobile Logo */}
//             <div className="md:hidden text-center mb-6">
//               <div className="flex items-center justify-center space-x-2 mb-3">
//                 <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
//                   <Activity className="w-8 h-8 text-white" strokeWidth={2.5} />
//                 </div>
//                 <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//                   AlphaWell
//                 </h1>
//               </div>
//             </div>

//             <div className="mb-8">
//               <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
//               <p className="text-gray-600">Enter your credentials to continue</p>
//             </div>

//             <form onSubmit={onSubmit} className="space-y-6">
//               {/* Email */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
//                 <div className="relative">
//                   <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
//                     placeholder="your.email@company.com"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Password */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
//                 <div className="relative">
//                   <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
//                     placeholder="••••••••"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword((s) => !s)}
//                     className="absolute right-4 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
//                   >
//                     {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                   </button>
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="group w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
//               >
//                 {isLoading ? (
//                   <>
//                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     Signing in...
//                   </>
//                 ) : (
//                   <>
//                     Sign In
//                     <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
//                   </>
//                 )}
//               </button>
//             </form>

//             {/* Demo Accounts */}
//             <div className="mt-8">
//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-300"></div>
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-4 bg-white text-gray-500 font-medium">Quick Demo Access</span>
//                 </div>
//               </div>

//               <div className="mt-6 grid gap-3">
//                 {demoAccounts.map((account) => (
//                   <button
//                     key={account.role}
//                     type="button"
//                     onClick={() => fillDemo(account.email)}
//                     className="group flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-300 hover:shadow-md cursor-pointer"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className={`bg-gradient-to-br ${account.color} p-2 rounded-lg`}>
//                         <account.icon className="w-5 h-5 text-white" />
//                       </div>
//                       <div className="text-left">
//                         <p className="font-semibold text-gray-900">{account.role}</p>
//                         <p className="text-xs text-gray-500">{account.email}</p>
//                       </div>
//                     </div>
//                     <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
//                   </button>
//                 ))}
//               </div>

//               <p className="text-xs text-gray-500 text-center mt-4">
//                 Password: <span className="font-mono font-semibold">demo123</span>
//               </p>
//             </div>

//             <div className="mt-6 text-center text-sm text-gray-600">
//               Don&apos;t have an account?{' '}
//               <button
//                 type="button"
//                 onClick={() => navigate('/signup')}
//                 className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
//               >
//                 Create Account
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Animations */}
//       <style>
//         {`
//           @keyframes blob { 0%,100%{transform:translate(0,0) scale(1);} 33%{transform:translate(30px,-50px) scale(1.1);} 66%{transform:translate(-20px,20px) scale(0.9);} }
//           @keyframes pulse-slow { 0%,100%{opacity:.3;} 50%{opacity:.5;} }
//           .animate-blob { animation: blob 12s ease-in-out infinite; }
//           .animation-delay-2000 { animation-delay: 2s; }
//           .animation-delay-4000 { animation-delay: 4s; }
//           .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
//         `}
//       </style>
//     </div>
//   );
// }




import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlphaWell } from '../../context/AlphaWellContext';
import {
  Activity,
  Mail,
  Lock,
  ArrowRight,
  User,
  Briefcase,
  BarChart3,
  Eye,
  EyeOff,
} from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const { login } = useAlphaWell();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const demoAccounts = [
    {
      role: 'Investor',
      email: 'investor@alphawell.com',
      icon: Briefcase,
      color: 'from-sky-500 to-cyan-500',
    },
    {
      role: 'Operator',
      email: 'operator@alphawell.com',
      icon: User,
      color: 'from-indigo-500 to-blue-500',
    },
    {
      role: 'Analyst',
      email: 'analyst@alphawell.com',
      icon: BarChart3,
      color: 'from-purple-500 to-indigo-500',
    },
  ];

  const fillDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('demo123');
    toast.info('Filled demo credentials');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const ok = await login(email, password);
    setIsLoading(false);
    if (ok) navigate('/app');
  };

  const inputBase =
    'w-full rounded-xl border text-sm ' +
    'bg-slate-900/80 border-slate-700 text-slate-100 ' +
    'placeholder:text-slate-500 ' +
    'focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ' +
    'transition-all duration-300';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden text-slate-100">
      <ToastContainer position="top-right" />

      {/* Animated Background (dark-tuned) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-sky-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-fuchsia-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden md:flex flex-col justify-center space-y-8 p-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-sky-500 blur-xl opacity-40 rounded-full animate-pulse-slow"></div>
                <div className="relative bg-gradient-to-br from-sky-500 to-indigo-600 p-4 rounded-2xl shadow-[0_0_35px_rgba(56,189,248,0.55)]">
                  <Activity className="w-12 h-12 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <h1 className="text-5xl font-semibold bg-gradient-to-r from-sky-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
                AlphaWell
              </h1>
            </div>
            <h2 className="text-3xl font-semibold text-slate-50">Welcome Back</h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Sign in to access your AI-driven production and economic intelligence platform.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                icon: BarChart3,
                title: 'Real-Time Analytics',
                desc: 'Track performance metrics instantly.',
                color: 'bg-sky-500/10 text-sky-300 border border-sky-500/30',
              },
              {
                icon: Activity,
                title: 'AI-Powered Insights',
                desc: 'Make data-driven decisions with confidence.',
                color: 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30',
              },
              {
                icon: Briefcase,
                title: 'Enterprise Grade',
                desc: 'Secure and scalable platform for your portfolio.',
                color: 'bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/30',
              },
            ].map((f, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className={`${f.color} rounded-lg p-2 mt-1`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-50">{f.title}</h3>
                  <p className="text-sm text-slate-400">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="relative">
          <div className="bg-slate-950/95 backdrop-blur-xl rounded-3xl shadow-[0_24px_70px_rgba(15,23,42,0.95)] p-8 md:p-10 border border-slate-800/80">
            {/* Mobile Logo */}
            <div className="md:hidden text-center mb-6">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <div className="bg-gradient-to-br from-sky-500 to-indigo-600 p-3 rounded-xl shadow-[0_0_30px_rgba(56,189,248,0.55)]">
                  <Activity className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <h1 className="text-3xl font-semibold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
                  AlphaWell
                </h1>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-50 mb-2">
                Sign In
              </h2>
              <p className="text-slate-400">Enter your credentials to continue.</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${inputBase} pl-12 pr-4 py-3`}
                    placeholder="your.email@company.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputBase} pl-12 pr-12 py-3`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-4 top-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 text-white py-4 rounded-xl font-semibold hover:from-sky-600 hover:via-indigo-600 hover:to-fuchsia-600 transition-all duration-300 shadow-[0_18px_45px_rgba(56,189,248,0.45)] hover:shadow-[0_22px_55px_rgba(129,140,248,0.6)] transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-slate-950/95 text-slate-400 font-medium">
                    Quick Demo Access
                  </span>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                {demoAccounts.map((account) => (
                  <button
                    key={account.role}
                    type="button"
                    onClick={() => fillDemo(account.email)}
                    className="group flex items-center justify-between p-4 border border-slate-700 rounded-xl hover:border-sky-500/70 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-md cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`bg-gradient-to-br ${account.color} p-2 rounded-lg shadow-[0_10px_25px_rgba(15,23,42,0.7)]`}
                      >
                        <account.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-slate-50">
                          {account.role}
                        </p>
                        <p className="text-xs text-slate-400">
                          {account.email}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all duration-300" />
                  </button>
                ))}
              </div>

              <p className="text-xs text-slate-500 text-center mt-4">
                Password: <span className="font-mono font-semibold">demo123</span>
              </p>
            </div>

            <div className="mt-6 text-center text-sm text-slate-400">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="text-sky-400 hover:text-sky-300 font-semibold cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes blob {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          @keyframes pulse-slow {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.5; }
          }
          .animate-blob { animation: blob 12s ease-in-out infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
          .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        `}
      </style>
    </div>
  );
}
