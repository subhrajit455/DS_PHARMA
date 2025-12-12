import React from 'react';
import { motion as Motion } from 'framer-motion';

const AuthCard = ({ children, title, subtitle, className = '' }) => {
    return (
        <div 
            className="min-h-screen flex items-center justify-center relative overflow-hidden"
            style={{
                background: 'linear-gradient(108deg, #E6D4F1 0%, #C4EBF5 50%, #A8EEDF 100%)',
            }}
        >
            {/* Background Pattern - Premium Overlay */}
            <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            
            {/* Ambient Gradients - Floating Orbs for extra premium feel */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <Motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.4, 0.6, 0.4],
                        rotate: [0, 45, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute -top-[10%] -left-[5%] w-[60vh] h-[60vh] rounded-full bg-white/40 blur-[80px] mix-blend-overlay"
                />
                <Motion.div 
                    animate={{
                        scale: [1, 1.1, 1],
                        x: [0, 30, 0],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute top-[40%] -right-[10%] w-[50vh] h-[50vh] rounded-full bg-purple-100/40 blur-[80px] mix-blend-overlay"
                />
            </div>

            <Motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1] 
                }}
                className="w-full max-w-2xl px-4 relative z-10"
            >
                {/* Premium Glass Card */}
                <div 
                    className={`
                        backdrop-blur-3xl
                        rounded-[32px]
                        shadow-[0_8px_32px_rgba(31,38,135,0.07)]
                        border border-white/60
                        p-8 sm:p-10 md:p-12
                        relative overflow-hidden
                        ring-1 ring-white/50
                        ${className}
                    `}
                    style={{
                        background: 'linear-gradient(to bottom right, rgba(255,255,255,), rgba(255,255,255,)), linear-gradient(108deg, #E6D4F1 0%, #C4EBF5 50%, #A8EEDF 100%)',
                        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.6)'
                    }}
                >
                     {/* Top Premium Shine */}
                     <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                     <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
                     
                    <div className="text-center mb-8" style={{ padding: '10px 0px' }}>
                        {/* Title */}
                        <h2
                            className="text-3xl font-bold text-gray-900 tracking-tight mb-2"
                            style={{ fontFamily: 'Gyrotrope' }}
                        >
                            {title}
                        </h2>
                        {subtitle && (
                            <p
                                className="text-gray-600 font-medium text-base"
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
