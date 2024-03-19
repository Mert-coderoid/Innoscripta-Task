import React, { useState } from 'react';
import { toast } from 'react-toastify';

const SignupPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [errors, setErrors] = useState({});

    const handleSignup = async (e) => {
        e.preventDefault();

        const newErrors = {};

        // Form alanlarını kontrol ederek hataları ayarla
        if (!username) newErrors.username = "Username required.";
        if (username.length < 3) newErrors.username = "Username must be at least 3 characters.";
        if (!email) newErrors.email = "E-mail required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid e-mail.";
        if (!password) newErrors.password = "Password required.";
        if (password.length < 6) newErrors.password = "Password must be at least 6 characters.";
        if (!passwordConfirm) newErrors.passwordConfirm = "Password confirm required.";
        if (password !== passwordConfirm) newErrors.passwordConfirm = "Passwords do not match.";

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        // İstek yapmak için gerçek API endpoint'inizle değiştirin
        const response = await fetch(process.env.REACT_APP_BASE_URL+'/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: username, email, password, confirm_password: passwordConfirm }),
        });
        
        if (!response.ok) {
            // Handle the error situation
            const data = await response.json();
            if (data.errors) {
                setErrors(data.errors);
            } else {
                setErrors({ message: data.message });
            }
            toast.error(data.message);
            return;
        } else {
            const data = await response.json();
            localStorage.setItem('token', data.data.token);
            window.location.href = '/';
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
                <h1 className="text-2xl font-bold mb-8 text-center text-gray-700">Register</h1>
                <form className="space-y-4" onSubmit={handleSignup}>
                    <input
                        className="w-full p-2 border rounded bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-500"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        className="w-full p-2 border rounded bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-500"
                        type="text"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="w-full p-2 border rounded bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-500"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        className="w-full p-2 border rounded bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-500"
                        type="password"
                        placeholder="Password Confirm"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                    />
                    <button className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Kayıt Ol</button>
                </form>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                {errors.passwordConfirm && <p className="text-red-500 text-sm mt-1">{errors.passwordConfirm}</p>}
                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}



            </div>
        </div>
    );
};

export default SignupPage;
