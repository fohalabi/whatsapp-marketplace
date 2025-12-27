'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';

const AuthForm: React.FC = () => {
  const router = useRouter();
  const [isPanelActive, setIsPanelActive] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   // Redirect to dashboard if already authenticated
  //   if (authService.isAuthenticated()) {
  //     const user = authService.getUser();
  //     if (user?.role === 'MERCHANT') {
  //       router.push('/merchant/dashboard');
  //     } else {
  //       router.push('/admin/dashboard');
  //     }
  //   }
  // }, [router]);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleRegisterClick = () => {
    setIsPanelActive(true);
    setError('');
  };

  const handleLoginClick = () => {
    setIsPanelActive(false);
    setError('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(loginData);
      
      if (response.success) {
        authService.saveAuth(response.data.token, response.data.user);
        
        if (response.data.user.role === 'MERCHANT') {
          router.push('/merchant/dashboard');
        } else {
          router.push('/admin/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.register({
        email: registerData.email,
        password: registerData.password,
        role: 'MERCHANT',
      });
      
      if (response.success) {
        authService.saveAuth(response.data.token, response.data.user);
        router.push('/merchant/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-gradient-to-br from-gray-100 to-gray-300">
      <div className={`relative bg-white rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] w-[850px] max-w-full min-h-[550px] overflow-hidden transition-all duration-600 ${isPanelActive ? 'panel-active' : ''}`}>
        
        {/* Login Form */}
        <div className={`absolute top-0 left-0 h-full w-1/2 transition-all duration-[0.6s] ease-in-out z-[2] ${isPanelActive ? 'translate-x-full' : 'translate-x-0'} max-md:static max-md:w-full max-md:transform-none ${isPanelActive ? 'max-md:hidden' : 'max-md:block'}`}>
          <div className="bg-white flex items-center justify-center flex-col px-[50px] py-0 h-full text-center max-md:px-[25px] max-md:py-[30px] max-md:h-auto">
            <h1 className="font-bold m-0 text-[28px] max-md:text-[22px] max-md:mb-[10px]">Sign In</h1>
            
            {error && !isPanelActive && (
              <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm w-full">
                {error}
              </div>
            )}
            
            <span className="text-[13px] text-gray-600 mt-5">Enter your credentials to continue</span>
            
            <form onSubmit={handleLoginSubmit} className="w-full">
              <input 
                type="email" 
                placeholder="Email Address" 
                required 
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="bg-gray-100 border-2 border-transparent rounded-xl px-[18px] py-[14px] my-2 w-full text-[14px] transition-all duration-300 focus:outline-none focus:border-gray-700 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,0,0,0.1)] max-md:px-[15px] max-md:py-[12px]" 
              />
              
              <input 
                type="password" 
                placeholder="Password" 
                required 
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="bg-gray-100 border-2 border-transparent rounded-xl px-[18px] py-[14px] my-2 w-full text-[14px] transition-all duration-300 focus:outline-none focus:border-gray-700 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,0,0,0.1)] max-md:px-[15px] max-md:py-[12px]" 
              />
              
              <a href="#" className="text-gray-700 text-[14px] no-underline my-[15px] transition-colors duration-300 hover:text-black">Forgot your password?</a>
              
              <div className='w-full flex justify-center mt-4'>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="rounded-[25px] border-none bg-gradient-to-r from-gray-700 to-black text-white text-[13px] font-semibold px-[50px] py-[14px] tracking-[1px] uppercase transition-all duration-300 cursor-pointer shadow-[0_4px_15px_rgba(0,0,0,0.4)] hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(0,0,0,0.6)] active:translate-y-0 focus:outline-none max-md:px-[40px] max-md:py-[12px] max-md:text-[12px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </div>
            </form>
            
            <div className="hidden max-md:block mt-5 text-gray-700 text-[14px]">
              <p className="my-[10px] text-[14px]">Don't have an account?</p>
              <button onClick={handleRegisterClick} className="bg-transparent text-gray-700 border-2 border-gray-700 px-[30px] py-[10px] mt-[10px] shadow-none rounded-[25px] font-semibold text-[13px] uppercase tracking-[1px] transition-all duration-300 hover:bg-gray-700 hover:text-white">Sign Up</button>
            </div>
          </div>
        </div>

        {/* Register Form */}
        <div className={`absolute top-0 left-0 h-full w-1/2 opacity-0 z-[1] transition-all duration-[0.6s] ease-in-out ${isPanelActive ? 'translate-x-full opacity-100 z-[5] animate-show' : 'translate-x-0'} max-md:static max-md:w-full max-md:opacity-100 max-md:transform-none max-md:z-[1] ${isPanelActive ? 'max-md:block' : 'max-md:hidden'}`}>
          <div className="bg-white flex items-center justify-center flex-col px-[50px] py-0 h-full text-center max-md:px-[25px] max-md:py-[30px] max-md:h-auto">
            <h1 className="font-bold m-0 text-[28px] max-md:text-[22px] max-md:mb-[10px]">Create Account</h1>
            
            {error && isPanelActive && (
              <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm w-full">
                {error}
              </div>
            )}
            
            <span className="text-[13px] text-gray-600 mt-5">Fill in your details to get started</span>
            
            <form onSubmit={handleRegisterSubmit} className="w-full">
              <input 
                type="text" 
                placeholder="Full Name" 
                required 
                value={registerData.name}
                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                className="bg-gray-100 border-2 border-transparent rounded-xl px-[18px] py-[14px] my-2 w-full text-[14px] transition-all duration-300 focus:outline-none focus:border-gray-700 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,0,0,0.1)] max-md:px-[15px] max-md:py-[12px]" 
              />
              
              <input 
                type="email" 
                placeholder="Email Address" 
                required 
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                className="bg-gray-100 border-2 border-transparent rounded-xl px-[18px] py-[14px] my-2 w-full text-[14px] transition-all duration-300 focus:outline-none focus:border-gray-700 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,0,0,0.1)] max-md:px-[15px] max-md:py-[12px]" 
              />
              
              <input 
                type="password" 
                placeholder="Password" 
                required 
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                className="bg-gray-100 border-2 border-transparent rounded-xl px-[18px] py-[14px] my-2 w-full text-[14px] transition-all duration-300 focus:outline-none focus:border-gray-700 focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,0,0,0.1)] max-md:px-[15px] max-md:py-[12px]" 
              />
              
              <div className='w-full flex justify-center mt-4'>
                <button 
                  type="submit"
                  disabled={loading}
                  className="rounded-[25px] border-none bg-gradient-to-r from-gray-700 to-black text-white text-[13px] font-semibold px-[50px] py-[14px] tracking-[1px] uppercase transition-all duration-300 cursor-pointer shadow-[0_4px_15px_rgba(0,0,0,0.4)] hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(0,0,0,0.6)] active:translate-y-0 focus:outline-none max-md:px-[40px] max-md:py-[12px] max-md:text-[12px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
              </div>
            </form>
            
            <div className="hidden max-md:block mt-5 text-gray-700 text-[14px]">
              <p className="my-[10px] text-[14px]">Already have an account?</p>
              <button onClick={handleLoginClick} className="bg-transparent text-gray-700 border-2 border-gray-700 px-[30px] py-[10px] mt-[10px] shadow-none rounded-[25px] font-semibold text-[13px] uppercase tracking-[1px] transition-all duration-300 hover:bg-gray-700 hover:text-white">Sign In</button>
            </div>
          </div>
        </div>

        {/* Slide Panel Wrapper */}
        <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-[0.6s] ease-in-out z-[100] ${isPanelActive ? '-translate-x-full' : 'translate-x-0'} max-md:hidden`}>
          <div className={`bg-gradient-to-br from-gray-700 to-black bg-cover bg-center text-white relative -left-full h-full w-[200%] transition-transform duration-[0.6s] ease-in-out ${isPanelActive ? 'translate-x-1/2' : 'translate-x-0'}`}>
            
            {/* Left Panel Content */}
            <div className={`absolute flex items-center justify-center flex-col px-[50px] py-0 text-center top-0 h-full w-1/2 transition-transform duration-[0.6s] ease-in-out ${isPanelActive ? 'translate-x-0' : '-translate-x-[20%]'}`}>
              <h1 className="font-bold m-0 text-[28px]">Welcome Back!</h1>
              <p className="text-[15px] font-light leading-6 tracking-[0.5px] my-5 mx-0">Login to access your merchant dashboard and manage your products</p>
              <button onClick={handleLoginClick} className="bg-transparent border-2 border-white shadow-none rounded-[25px] text-white text-[13px] font-semibold px-[50px] py-[14px] tracking-[1px] uppercase transition-all duration-300 cursor-pointer hover:bg-white/10 focus:outline-none">Sign In</button>
            </div>

            {/* Right Panel Content */}
            <div className={`absolute right-0 flex items-center justify-center flex-col px-[50px] py-0 text-center top-0 h-full w-1/2 transition-transform duration-[0.6s] ease-in-out ${isPanelActive ? 'translate-x-[20%]' : 'translate-x-0'}`}>
              <h1 className="font-bold m-0 text-[28px]">Join Our Marketplace!</h1>
              <p className="text-[15px] font-light leading-6 tracking-[0.5px] my-5 mx-0">Create your merchant account and start selling your products today</p>
              <button onClick={handleRegisterClick} className="bg-transparent border-2 border-white shadow-none rounded-[25px] text-white text-[13px] font-semibold px-[50px] py-[14px] tracking-[1px] uppercase transition-all duration-300 cursor-pointer hover:bg-white/10 focus:outline-none">Sign Up</button>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes show {
            0%, 49.99% {
              opacity: 0;
              z-index: 1;
            }
            50%, 100% {
              opacity: 1;
              z-index: 5;
            }
          }
          
          .animate-show {
            animation: show 0.6s;
          }
        `}</style>
      </div>
    </div>
  );
};

export default AuthForm;