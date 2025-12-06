import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthCard, InputField } from '@/components/features/auth';
import Button from '@/components/ui/Button';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { motion as Motion } from 'framer-motion';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Email is required');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsSubmitted(true);
        } catch (err) {
            console.error(err);
            setError('Failed to send reset link. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <AuthCard
                title="Check your email"
                subtitle="We have sent a password reset link to your email address."
            >
                <div className="w-full text-center space-y-6">
                    <div className='w-full flex justify-center items-center'>
                        <Motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                    >
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </Motion.div>
                    </div>

                    <p className="text-sm text-gray-600">
                        Did not receive the email? Check your spam filter, or
                        <button
                            onClick={() => setIsSubmitted(false)}
                            className="text-emerald-600 hover:text-emerald-500 font-medium ml-1"
                        >
                            try another email address
                        </button>
                    </p>

                    <div className="text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
                            style={{textDecoration:'none'}}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            <p style={{ padding: '5px 0px', marginTop: '3px' }}>Back to Sign In</p>
                        </Link>
                    </div>
                </div>
            </AuthCard>
        );
    }

    return (
        <AuthCard
            title="Forgot Password?"
            subtitle="No worries, we'll send you reset instructions."
        >
            <form onSubmit={handleSubmit} className="space-y-6" style={{ padding: '10px 10px 0px 10px' }}>
                <InputField
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                    }}
                    error={error}
                />

                <Button
                    type="submit"
                    variant="primary"
                    size="full"
                    disabled={isLoading}
                >
                    {isLoading ? 'Sending Link...' : 'Send Reset Link'}
                </Button>

                <div className="text-center">
                    <Link
                        to="/login"
                        className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
                        style={{textDecoration:'none'}}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        <p style={{ padding: '5px 0px', marginTop: '3px' }}>Back to Sign In</p>
                    </Link>
                </div>
            </form>
        </AuthCard>
    );
};

export default ForgotPasswordPage;
