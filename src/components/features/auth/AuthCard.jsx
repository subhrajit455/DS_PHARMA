import React from 'react';
import { motion as Motion } from 'framer-motion';

const AuthCard = ({ children, title, subtitle, className = '' }) => {
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600">
            {/* Dynamic Gradient Background - Vibrant Brand Colors */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-teal-400/30 via-transparent to-transparent opacity-50" />
            
            {/* Animated Background Layer - Subtle Texture */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-10" />
            
            {/* Animated Gradient Orbs - Soft Light Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[15%] w-[600px] h-[600px] rounded-full bg-white/10 blur-[100px] animate-pulse" />
                <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-teal-300/20 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
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
                {/* Premium White Glass Card */}
                <div className={`
                    relative
                    bg-white/10
                    backdrop-blur-2xl
                    rounded-[2.5rem]
                    p-6 sm:p-8 md:p-10 lg:p-12
                    shadow-[0_8px_32px_0_rgba(0,0,0,0.2)]
                    border border-white/20
                    overflow-hidden
                    transition-all duration-500 ease-out
                    hover:bg-white/15
                    hover:border-white/30
                    hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.25)]
                    ${className}
                `}>
                    {/* Top Accent Line - White to Transparent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-white/50 to-transparent" />

                    {/* Content */}
                    <div className="relative z-10">
                        <div className="text-center mb-8 md:mb-10">
                            {/* Title */}
                            <h2
                                className="text-3xl sm:text-4xl md:text-[2.5rem] font-bold text-white tracking-tight mb-3 drop-shadow-md"
                                style={{ fontFamily: 'Gyrotrope', paddingTop: '1rem' }}
                            >
                                {title}
                            </h2>
                            {subtitle && (
                                <p
                                    className="text-teal-50 font-medium text-sm sm:text-base lg:text-lg leading-relaxed px-4 drop-shadow-sm"
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
