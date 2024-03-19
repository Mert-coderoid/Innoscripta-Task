import React, {useEffect, useState} from 'react';
import {toast} from 'react-toastify';

const UserProfile = () => {
    const token = localStorage.getItem('token');

    const [profile, setProfile] = useState(null);
    const [preferences, setPreferences] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeEditSection, setActiveEditSection] = useState(null); // 'profile' or 'preferences'
    const [loading, setLoading] = useState(true);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPassword_repeat, setNewPassword_repeat] = useState('');

    const [editedProfile, setEditedProfile] = useState({
        name: '',
        email: ''
    });
    const [editedPreferences, setEditedPreferences] = useState({
        sources: [],
        categories: [],
        keywords: [],
        authors: []
    });

    useEffect(() => {
        if (!token) {
            window.location.href = '/login';
            return;
        } else {
        }

        const fetchData = async () => {
            const profileResponse = await fetch(process.env.REACT_APP_BASE_URL + '/api/user', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const preferencesResponse = await fetch(process.env.REACT_APP_BASE_URL + '/api/preferences', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (profileResponse.ok) {
                const profileData = await profileResponse.json();
            
                // API'den gelen yanıtın doğru bir şekilde işlenmesi için düzeltme
                setProfile(profileData.data.user); // `user` objesi doğrudan state'e aktarılıyor.
            } else {
                if (profileResponse.status === 401 || preferencesResponse.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            }
            
            if (preferencesResponse.ok) {
                const preferencesData = await preferencesResponse.json();

                setPreferences(preferencesData);

                setEditedPreferences({
                    sources: safeParse(preferencesData.sources),
                    categories: safeParse(preferencesData.categories),
                    keywords: safeParse(preferencesData.keywords),
                    authors: safeParse(preferencesData.authors),
                });
            } else {
                console.error('Something went wrong:', preferencesResponse);
            }

            setLoading(false); // Data fetch complete
        };

        fetchData();
    }, []);

    const handleUpdateProfile = async () => {
        setActiveEditSection('profile');
        setIsModalOpen(true);
    };


    const handleUpdatePreferences = async () => {
        setActiveEditSection('preferences');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setActiveEditSection(null);
    };

    const handleProfileChange = (e) => {
        const {name, value} = e.target;
        setEditedProfile(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handlePreferencesChange = (e) => {
        const {name, value} = e.target;
        setEditedPreferences(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const submitProfile = async () => {
        // API call to save the edited profile...
        const token = localStorage.getItem('token');

        const response = await fetch(process.env.REACT_APP_BASE_URL + '/api/user-update', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editedProfile),
        });
        var result = await response.json();

        if (result.email) {
            setProfile(prevState => ({
                ...prevState,
                name: editedProfile.name,
                email: editedProfile.email
            }));
            closeModal();
        } else {
            toast.error(result.message);
        }
    };

    const submitPreferences = async () => {
        // API call to save the edited preferences...
        const token = localStorage.getItem('token');

        const data = {
            sources: JSON.stringify(editedPreferences.sources),
            categories: JSON.stringify(editedPreferences.categories),
            keywords: JSON.stringify(editedPreferences.keywords),
            authors: JSON.stringify(editedPreferences.authors),
        };

        const response = await fetch(process.env.REACT_APP_BASE_URL + '/api/preferences', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                setPreferences(prevState => ({
                    ...prevState,
                    sources: JSON.stringify(editedPreferences.sources),
                    categories: JSON.stringify(editedPreferences.categories),
                    keywords: JSON.stringify(editedPreferences.keywords),
                    authors: JSON.stringify(editedPreferences.authors),
                }));

                closeModal();

            } else {
                toast.error(data.message);

            }
        }
        closeModal();
    };

    const handlePasswordChange = () => {
        const token = localStorage.getItem('token');

        if (oldPassword === '' || newPassword === '' || newPassword_repeat === '') {
            alert('Lütfen tüm alanları doldurun.');
            return;
        }

        if (newPassword !== newPassword_repeat) {
            alert('Şifreler uyuşmuyor.');
            return;
        }

        fetch(process.env.REACT_APP_BASE_URL + '/api/change-password', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({old_password: oldPassword, password: newPassword}),
        }).then((data) => data.json())
            .then((data) => {

                if (data.error) {
                    toast.error(data.error);
                }

                if (data.email) {
                    toast.success('password changed');
                    setOldPassword('');
                    setNewPassword('');
                    setNewPassword_repeat('');
                }
            })
            .catch((error) => {
                toast.error('Something went wrong:', error);
            } );
    };

    const removeFolow = (type, value) => {
        const updatedPreferences = safeParse(preferences[type]).filter(item => item !== value);

        const data = {[type]: JSON.stringify(updatedPreferences)};
        const token = localStorage.getItem('token');

        fetch(process.env.REACT_APP_BASE_URL + '/api/preferences', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
            .then((data) => {
                if (data.ok) {
                    setPreferences(prevState => ({
                        ...prevState,
                        [type]: JSON.stringify(updatedPreferences)
                    }));
                } else {
                    console.error('Something went wrong:', data);
                }
            })
            .catch((error) => console.error('Something went wrong:', error));
    };
    const safeParse = (data) => {
        try {
            // Gereksiz boşlukları ve hatalı tırnak işaretlerini temizleyin
            const cleanedData = data.trim().replace(/"\s*\[\s*"\]/, '[]');
            return JSON.parse(cleanedData);
        } catch {
            return [];
        }
    }

    const PreferenceSection = ({ title, items, removeFn }) => (
        <div className="flex flex-wrap mb-4">
            <p className="text-xl w-full mb-2">{title}:</p>
            {items.map(item => (
                <div key={item} className="bg-green-500 text-white rounded-full px-4 py-2 m-1 flex items-center">
                    <span>{item}</span>
                    <button className="ml-2" onClick={(e) => {
                        e.preventDefault();
                        removeFn(item);
                    }}>X
                    </button>
                </div>
            ))}
        </div>
    );
    return (
        <>
            {loading ? (
                <div className="flex justify-center items-center h-screen loading">Loading...</div>
            ) : (
                <div className="container mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
                    <h1 className="text-4xl font-bold mb-10 text-center text-blue-700">Profile</h1>

                    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">User Info</h2>
                        <p className="text-xl my-3">Username: <span className="text-blue-600">{profile?.name}</span></p>
                        <p className="text-xl mb-6">E-mail: <span className="text-blue-600">{profile?.email}</span></p>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={handleUpdateProfile}>Update Profile
                        </button>
                    </div>
                    {isModalOpen && (
                        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
                            <div className="bg-white rounded p-8 w-1/2">
                                <h2 className="text-2xl mb-4">Update: {activeEditSection === 'profile' ? 'Profile' : 'Preferences'}</h2>
                                {activeEditSection === 'profile' && (
                                    <>
                                        <input
                                            name="name"
                                            value={editedProfile.name}
                                            onChange={handleProfileChange}
                                            className="border p-2 w-full mb-3"
                                            placeholder="Your name"
                                        />
                                        <input
                                            name="email"
                                            value={editedProfile.email}
                                            onChange={handleProfileChange}
                                            className="border p-2 w-full mb-3"
                                            placeholder="E-mail"
                                        />
                                        <button onClick={submitProfile} className="bg-blue-500 text-white py-2 px-4 rounded">Update</button>
                                    </>
                                )}

                                {activeEditSection === 'preferences' && (
                                    <>
                                        {/* Örnek olarak sadece kaynaklar için bir giriş ekledim, diğer tercihleri de ekleyebilirsiniz. */}
                                        <input
                                            name="sources"
                                            value={editedPreferences.sources}
                                            onChange={handlePreferencesChange}
                                            className="border p-2 w-full mb-3"
                                            placeholder="Kaynaklar (Virgülle ayrılmış)"
                                        />
                                        <button onClick={submitPreferences} className="bg-blue-500 text-white py-2 px-4 rounded">Update</button>
                                    </>
                                )}
                                <button onClick={closeModal} className="bg-red-500 text-white py-2 px-4 rounded mt-4 float-right">Close</button>
                            </div>
                        </div>
                    )}
                    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Password Change</h2>
                        <div className="flex flex-wrap justify-center mb-6">
                            <div className="password-change-area w-full max-w-md">
                                <input
                                    type="password"
                                    placeholder="Old Password"
                                    value={oldPassword}
                                    onChange={e => setOldPassword(e.target.value)}
                                    className="mb-3 border rounded p-2 w-full"
                                />
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    className="mb-3 border rounded p-2 w-full"
                                />
                                <input
                                    type="password"
                                    placeholder="New Password Again"
                                    value={newPassword_repeat}
                                    onChange={e => setNewPassword_repeat(e.target.value)}
                                    className="mb-3 border rounded p-2 w-full"
                                />
                            </div>
                        </div>
                        <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={handlePasswordChange}>Change Password
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Preferences</h2>
                        <PreferenceSection title="Sources" items={safeParse(preferences?.sources || '[]')} removeFn={(item) => removeFolow('sources', item)} />
                        <PreferenceSection title="Categories" items={safeParse(preferences?.categories || '[]')} removeFn={(item) => removeFolow('categories', item)} />
                        <PreferenceSection title="Authors" items={safeParse(preferences?.authors || '[]')} removeFn={(item) => removeFolow('authors', item)} />
                    </div>
                </div>
            )}

        </>
    );
};

export default UserProfile;

