import React, { useState } from 'react';

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
        if (!username) newErrors.username = "Kullanıcı adı gereklidir.";
        if (username.length < 3) newErrors.username = "Kullanıcı adı en az 3 karakter olmalıdır.";
        if (!email) newErrors.email = "E-posta gereklidir.";
        if (!password) newErrors.password = "Şifre gereklidir.";
        if (password.length < 6) newErrors.password = "Şifre en az 6 karakter olmalıdır.";
        if (!passwordConfirm) newErrors.passwordConfirm = "Şifre tekrar alanı gereklidir.";
        if (password !== passwordConfirm) newErrors.passwordConfirm = "Şifreler eşleşmiyor.";

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

        const data = await response.json();

        if (response.ok) {
            console.log('Kayıt başarılı!', data);
            // Token'ı kaydet
            localStorage.setItem('token', data.token);

            window.location.href = '/login';
        } else {
                const data = await response.json();
                if (data.message === 'Unauthorized.') {
                    localStorage.removeItem('token');
                    window.location.href = '/';
                }
            setErrors(data.errors || {});
        }
    };

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
                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}

            </div>
        </div>
    );
};

export default SignupPage;
