import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, TrendingUp, Zap, Shield, ArrowRight, BarChart3, Cpu, Globe } from 'lucide-react';

const Homepage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-gray-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* Logo & Brand with Animation */}
          <div className={`flex items-center justify-center space-x-4 mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-30 rounded-full animate-pulse-slow"></div>
              <div className="relative bg-gradient-to-br mt-10 from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-2xl transform hover:rotate-12 transition-transform duration-500">
                <Activity className="w-16 h-16 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl mt-10 font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
              AlphaWell
            </h1>
          </div>

          {/* Subtitle with Staggered Animation */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-2xl sm:text-3xl lg:text-4xl text-blue-700 font-semibold mb-6 tracking-wide">
              Intelligence Platform
            </p>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-4 max-w-3xl mx-auto leading-relaxed">
              AI-Driven Production & Economic Decisioning
            </p>
            <p className="text-base sm:text-lg text-gray-600 mb-16 max-w-2xl mx-auto">
              Transforming the future of industry through advanced artificial intelligence, real-time analytics, and intelligent automation
            </p>
          </div>

          {/* CTA Buttons with Animation */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-6 mb-20 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="group relative w-full sm:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-lg font-semibold shadow-2xl shadow-blue-500/40 hover:shadow-blue-600/60 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
              <span className="relative flex items-center justify-center gap-2">
                Sign in to Continue
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="group w-full sm:w-auto px-10 py-5 rounded-2xl border-2 border-blue-600 text-blue-700 text-lg font-semibold hover:bg-blue-50 transition-all duration-500 backdrop-blur-sm bg-white/80 transform hover:scale-105 hover:-translate-y-1 shadow-lg"
            >
              <span className="flex items-center justify-center gap-2">
                Create Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>
          </div>

          {/* Stats Section */}
          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-20 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {[
              { value: '99.9%', label: 'Uptime', icon: Shield },
              { value: '250+', label: 'Enterprises', icon: Globe },
              { value: '45%', label: 'Cost Reduction', icon: TrendingUp },
              { value: '24/7', label: 'AI Support', icon: Cpu }
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-blue-200 hover:border-blue-400 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-200/50"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <stat.icon className="w-8 h-8 text-blue-600 mb-3 mx-auto" />
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Feature Cards */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {[
              {
                icon: TrendingUp,
                title: 'Smart Analytics',
                description: 'Harness the power of real-time data analytics to make informed decisions. Our AI-driven insights help you stay ahead of market trends and optimize operations.',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Zap,
                title: 'AI-Powered Automation',
                description: 'Advanced machine learning algorithms that continuously learn and adapt to your production environment, maximizing efficiency and minimizing downtime.',
                gradient: 'from-indigo-500 to-blue-500'
              },
              {
                icon: BarChart3,
                title: 'Economic Intelligence',
                description: 'Sophisticated economic modeling and forecasting tools that help you navigate complex market dynamics and make strategic investment decisions.',
                gradient: 'from-purple-500 to-indigo-500'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white/80 backdrop-blur-lg rounded-3xl p-8 border border-gray-200 hover:border-blue-300 transition-all duration-700 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-200/50"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-indigo-50/0 group-hover:from-blue-50/50 group-hover:to-indigo-50/50 rounded-3xl transition-all duration-700"></div>
                <div className="relative">
                  <div className={`bg-gradient-to-br ${feature.gradient} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-500`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className={`relative py-20 px-4 transition-all duration-1000 delay-1100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Ready to Transform Your Operations?
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Join leading enterprises leveraging AI for competitive advantage
          </p>

          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="group px-12 py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold shadow-2xl shadow-blue-500/40 hover:shadow-blue-600/60 transition-all duration-500 transform hover:scale-105"
          >
            <span className="flex items-center justify-center gap-2">
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </button>
        </div>
      </div>

      {/* NOTE: use plain <style>, not <style jsx> (Next.js) */}
      <style>
        {`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }
        .animate-blob {
          animation: blob 12s ease-in-out infinite;
        }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        `}
      </style>
    </div>
  );
};

export default Homepage;
