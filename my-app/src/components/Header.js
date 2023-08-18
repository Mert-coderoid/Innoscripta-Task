import React, { useEffect, useState } from 'react';

function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token')); // İlk değer olarak token'in var olup olmadığı kontrol edilir

    useEffect(() => {
        const resizeListener = () => {
            if (window.innerWidth > 768) {
                setIsOpen(false);
            }
        }
        window.addEventListener('resize', resizeListener);
        return () => window.removeEventListener('resize', resizeListener); // cleanup
    }, []);

    const logout = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(process.env.REACT_APP_BASE_URL+'/api/logout', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });
            if (response.ok) {
                localStorage.removeItem('token');
                setIsAuthenticated(false);  // Kullanıcının çıkış yaptığını belirtmek için
                window.location.href = '/';
            } else {
                const data = await response.json();
                if (data.message === 'Unauthorized.') {
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                    window.location.href = '/';
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <header className="bg-primary p-4">
            <nav className="container mx-auto flex flex-wrap items-center justify-between">
                <div className="flex items-center">
                    <img src="/logo_white.png"
                         alt="Logo" className="w-10 h-10 mr-2"
                         style={{ width: 50, height: 50 }} />
                    <a href="/" className="text-white text-lg font-semibold">GAZENEWS</a>
                </div>

                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-white">
                        {/* ... (Menu iconu için SVG) */}
                    </button>
                </div>
                <div className={`absolute w-full bg-primary ${isOpen ? 'block mt-60' : 'hidden'} md:relative md:flex md:w-auto md:bg-transparent position-left-0`}>

                    {/* Giriş yapmadıysa bu bağlantıları göster */}
                    {!isAuthenticated && (
                        <>
                            <a href="/login" className="text-white px-2 md:px-4 block py-1"><i className="fas fa-sign-in-alt mr-2"></i>Login</a>
                            <a href="/register" className="text-white px-2 md:px-4 block py-1"><i className="fas fa-user-plus mr-2"></i>Register</a>
                        </>
                    )}

                    {/* Giriş yaptıysa bu bağlantıyı göster */}
                    {isAuthenticated && (
                        <>
                            <a href="/feed" className="text-white px-2 md:px-4 block py-1"><i className="fas fa-newspaper mr-2"></i>Feed</a>
                            <a href="/profile" className="text-white px-2 md:px-4 block py-1"><i className="fas fa-user mr-2"></i>Profile</a>
                            <a href="/" onClick={logout} className="text-white px-2 md:px-4 block py-1"><i className="fas fa-sign-out-alt mr-2"></i>Logout</a>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default Header;
