import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Input from '@/components/ui/Input';

const InputField = ({
    label,
    type = 'text',
    error,
    placeholder,
    className = '',
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="relative w-full" style={{ paddingBottom: '10px' }}>
            <Input
                label={label}
                type={isPassword ? (showPassword ? 'text' : 'password') : type}
                error={error}
                placeholder={placeholder}
                className={`${className} ${isPassword ? 'pr-10' : ''}`}
                {...props}
                style={{ padding: '2px 5px' }}
            />

            {isPassword && (
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-[25px] text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? (
                        <EyeOff size={20} />
                    ) : (
                        <Eye size={20} />
                    )}
                </button>
            )}
        </div>
    );
};

export default InputField;
