import React from 'react';
import { motion as Motion } from 'framer-motion';

const AuthCard = ({ children, title, subtitle, className = '' }) => {
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0A0F1C]">
            {/* Dynamic Gradient Background - Richer & darker */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-teal-900/40 via-slate-950 to-slate-950" />
            
            {/* Animated Background Layer - Vibrant Nebulas */}
            <div className="absolute inset-0 bg-[radial-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent opacity-70" />
            
            {/* Animated Gradient Orbs - Brighter & More Vibrant */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[15%] w-[600px] h-[600px] rounded-full bg-teal-500/20 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[130px] animate-pulse" style={{ animationDelay: '1s' }} />
                {/* Center Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-slate-800/30 blur-[150px]" />
            </div>

            <Motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                    duration: 0.6,
                    ease: "easeOut" 
                }}
                className="w-full max-w-2xl px-4 py-12 sm:px-6 lg:px-8 relative z-10"
            >
                {/* Premium High-Contrast Glass Card */}
                <div className={`
                    relative
                    bg-[#111827]/80
                    backdrop-blur-2xl
                    rounded-[2.5rem]
                    p-6 sm:p-8 md:p-10 lg:p-12
                    shadow-[0_0_50px_-12px_rgba(20,184,166,0.25),0_20px_40px_-15px_rgba(0,0,0,0.7)]
                    border border-teal-500/20
                    overflow-hidden
                    transition-all duration-500 ease-out
                    hover:border-teal-400/30
                    hover:shadow-[0_0_70px_-12px_rgba(20,184,166,0.35),0_25px_50px_-12px_rgba(0,0,0,0.8)]
                    ${className}
                `}>
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-400 via-emerald-500 to-cyan-500" />
                    
                    {/* Corner Glows */}
                    <div className="absolute -top-20 -left-20 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Content */}
                    <div className="relative z-10">
                        <div className="text-center mb-8 md:mb-10">
                            {/* Title */}
                            <h2
                                className="text-3xl sm:text-4xl md:text-[2.5rem] font-bold text-white tracking-tight mb-3 drop-shadow-sm"
                                style={{ fontFamily: 'Gyrotrope', paddingTop: '1rem' }}
                            >
                                {title}
                            </h2>
                            {subtitle && (
                                <p
                                    className="text-slate-300 font-medium text-sm sm:text-base lg:text-lg leading-relaxed px-4"
                                    style={{ fontFamily: 'Gyrotrope' }}
                                >
                                    {subtitle}
                                </p>
                            )}
                        </div>
                        
                        {children}
                    </div>
                </div>
            </Motion.div>
        </div>
    );
};

export default AuthCard;
