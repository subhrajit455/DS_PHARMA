import React from 'react';
import { motion as Motion } from 'framer-motion';

const AuthCard = ({ children, title, subtitle, className = '' }) => {
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50" >
            {/* Background Pattern - Subtle Dot Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            
            {/* Ambient Gradients - Soft & Modern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[70vh] h-[70vh] rounded-full bg-emerald-100/40 blur-[100px]" />
                <div className="absolute top-[20%] -right-[10%] w-[60vh] h-[60vh] rounded-full bg-teal-100/40 blur-[100px]" />
                <div className="absolute -bottom-[20%] left-[20%] w-[60vh] h-[60vh] rounded-full bg-cyan-100/40 blur-[100px]" />
            </div>

            <Motion.div
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                    duration: 0.4,
                    ease: "easeOut" 
                }}
                className="w-full max-w-2xl px-4 relative z-10"
            >
                {/* Modern White Card */}
                <div className={`
                    bg-white
                    rounded-3xl
                    shadow-[0_20px_60px_-15px_rgba(16,185,129,0.15)]
                    border border-emerald-100/50
                    p-8 sm:p-10 md:p-12
                    relative overflow-hidden
                    ${className}
                `}>
                    {/* Premium Top Gradient Accent */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500" />
                    <div className="text-center mb-8" style={{ paddingTop: '10px' }}>
                        {/* Title */}
                        <h2
                            className="text-3xl font-bold text-gray-900 tracking-tight mb-2"
                            style={{ fontFamily: 'Gyrotrope' }}
                        >
                            {title}
                        </h2>
                        {subtitle && (
                            <p
                                className="text-gray-500 font-medium text-base"
                                style={{ fontFamily: 'Gyrotrope' }}
                            >
                                {subtitle}
                            </p>
                        )}
                    </div>
                    
                    {children}
                </div>
            </Motion.div>
        </div>
    );
};

export default AuthCard;
