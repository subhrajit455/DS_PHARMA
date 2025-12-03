import React from 'react';
import Card from '@/components/ui/Card';
import { motion as Motion } from 'framer-motion';

const AuthCard = ({ children, title, subtitle, className = '' }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md space-y-8"
            >
                <div className="text-center mb-8">
                    <h2
                        className="text-3xl font-bold text-gray-900"
                        style={{ fontFamily: 'Gyrotrope' }}
                    >
                        {title}
                    </h2>
                    {subtitle && (
                        <p
                            className="mt-2 text-sm text-gray-600"
                            style={{ fontFamily: 'Gyrotrope', paddingBottom: '5px' }}
                        >
                            {subtitle}
                        </p>
                    )}
                </div>

                <Card className={`p-10 ${className}`} variant="default">
                    {children}
                </Card>
            </Motion.div>
        </div>
    );
};

export default AuthCard;
