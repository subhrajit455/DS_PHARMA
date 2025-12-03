import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthCard, InputField, SocialLogin } from '@/components/features/auth';
import Button from '@/components/ui/Button';

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setIsLoading(true);
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                console.log('Login successful', formData);
                navigate('/'); // Redirect to home after login
            } catch (err) {
                console.error(err);
                setErrors({ submit: 'Failed to sign in. Please try again.' });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <AuthCard
            title="Welcome Back"
            subtitle="Sign in to your account to continue"
        >
            <form onSubmit={handleSubmit} className="space-y-6" style={{ padding: '10px 10px 0px 10px' }}>
                <InputField
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                />

                <div className="space-y-1">
                    <InputField
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                    />
                    <div className="flex justify-end">
                        <Link
                            to="/forgot-password"
                            className="text-sm font-medium text-orange-600 hover:text-orange-500"
                            style={{ textDecoration: 'none' }}
                        >
                            Forgot password?
                        </Link>
                    </div>
                </div>

                <div className="flex items-center" style={{ paddingBottom: '10px' }}>
                    <div className="flex items-center h-5" style={{ padding: ' 0px 5px' }}>
                        <input
                            id="remember-me"
                            name="rememberMe"
                            type="checkbox"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                    </div>
                    <div className="ml-2 text-sm" style={{ padding: '2px', marginTop: '3px' }}>
                        <label htmlFor="remember-me" className="block text-gray-900">
                            Remember me
                        </label>
                    </div>
                </div>

                {errors.submit && (
                    <div className="text-sm text-red-600 text-center bg-red-50 p-2 rounded">
                        {errors.submit}
                    </div>
                )}

                <Button
                    type="submit"
                    variant="primary"
                    size="full"
                    disabled={isLoading}
                >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
            </form>

            <SocialLogin />

            <div className="mt-6 text-center text-sm" style={{ padding: '10px' }}>
                <span className="text-gray-600">Don't have an account? </span>
                <Link
                    to="/signup"
                    className="font-medium text-orange-600 hover:text-orange-500"
                    style={{ textDecoration: 'none' }}
                >
                    Sign Up
                </Link>
            </div>
        </AuthCard>
    );
};

export default LoginPage;
