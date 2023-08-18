import React, { useState, useEffect } from 'react';

const NewsFeed = () => {
    const token = localStorage.getItem('token');

    const [isLoading, setIsLoading] = useState(true);

    const [articles, setArticles] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [filters, setFilters] = useState({
        keyword: '',
        category: '',
        sources: '',
        start_date: '',
        end_date: '',
        sort_by: '',
        sort_order: 'desc'
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        nextPageUrl: null,
        prevPageUrl: null,
    });

    const [paginationLinks, setPaginationLinks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [sources, setSources] = useState([]);
    const [preferences, setPreferences] = useState({
        authors: [], categories: [], sources: []
    });
    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters(prevState => ({ ...prevState, [name]: value }));
    };
    const parseJSONSafely = (value) => {
        try {
            return JSON.parse(value.replace(/'/g, "\""));
        } catch (e) {
            return [];
        }
    };
    const applyFilters = (page = 1) => {
        
        const query = new URLSearchParams();
        for (const [key, value] of Object.entries(filters)) {
            if (value) {
                query.append(key, value);
            }
        }
        fetch(process.env.REACT_APP_BASE_URL+`/api/personalized-articles?page=${page}&${query.toString()}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error === 'Preferences not found for user') {
                    setErrorMessage('No preferences found. Please update your preferences.');
                    setArticles([]);
                } else if (!data.data || data.data.length === 0) {
                    setErrorMessage('No articles found. Please update your preferences.');
                } else {
                    setErrorMessage('');
                    setArticles(data.data);
                }
                // ... pagination logic ...
                setPaginationLinks(data.links);
                
            })
            .catch((error) => {
                console.error('Something went wrong:', error);
                setErrorMessage('Something went wrong. Please try again later.');
            })
            .finally(() => {
                setIsLoading(false);
            });

    };
    const handlePageChange = (url) => {
        const page = new URL(url).searchParams.get("page");
        applyFilters(page);
    };

    useEffect(() => {
        
        if (!token) {
            window.location.href = '/login';
            return;
        } else {
            console.log('Token:', token);
        }
        applyFilters();
        fetch(process.env.REACT_APP_BASE_URL+'/api/preferences', {
            method: 'GET', headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                let categories = data.categories ? parseJSONSafely(data.categories) : [];
                let sources = data.sources ? parseJSONSafely(data.sources) : [];
                let authors = data.authors ? parseJSONSafely(data.authors) : [];
                console.log('Preferences:', data)
                setPreferences({
                    authors: authors, categories: categories, sources: sources
                });
                
            })
            .catch((error) => {
                console.error('Something went wrong:', error);
                
            } );
        fetch(process.env.REACT_APP_BASE_URL+'/api/categories')
            .then((response) => response.json())
            .then((data) => {
                setCategories(data);
            })
            .catch((error) => {
                console.error('Categories loading failed:', error);
                
            });

        fetch(process.env.REACT_APP_BASE_URL+'/api/sources')
            .then((response) => response.json())
            .then((data) => {
                setSources(data);
                
            })
            .catch((error) => {
                console.error('Sources loading failed:', error);
                
            });

    }, [token]);
    const handleFollow = (type, value) => {
        // Daha önce takip edilip edilmediğini kontrol et
        const isFollowed = preferences[type].includes(value);
        const updatedPreferences = isFollowed ? preferences[type].filter(item => item !== value) : [...preferences[type], value];

        const data = {[type]: JSON.stringify(updatedPreferences)};

        fetch(process.env.REACT_APP_BASE_URL+'/api/preferences', {
            method: 'POST', headers: {
                'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'
            }, body: JSON.stringify(data),
        })
            .then(() => {
                setPreferences(prev => ({
                    ...prev, [type]: updatedPreferences
                }));
            })
            .catch((error) => console.error('Something went wrong:', error));
    };

    return (
        <div className={`container mx-auto p-4 bg-pastelBej text-pastelGri ${isLoading ? 'loading' : ''}`}>
            <svg id='patternId' width='100%' height='70%'
                 style={{position: 'absolute', top: 0, left: 0, zIndex: -1}}
                 xmlns='http://www.w3.org/2000/svg'>
                {/* ... (SVG içeriği) ... */}
            </svg>
            <h1 className="text-4xl font-bold text-center mb-4">News Feed</h1>
            {errorMessage && (
                <div className="text-center my-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {errorMessage}
                </div>
            )}
            <div className="mb-8 bg-pastelGri p-4 rounded-lg">
                <input type="text" name="keyword" placeholder="Search" onChange={handleFilterChange}
                       className="border p-2 rounded mr-2 mb-2 bg-white"/>
                <select name="category" onChange={handleFilterChange} className="border p-2 rounded mr-2 mb-2 bg-white">
                    <option value="">All Categories</option>
                    {categories.map((category, index) => (
                        <option key={index} value={category.category}>
                            {category.category}
                        </option>
                    ))}
                </select>
                <select name="sources" onChange={handleFilterChange} className="border p-2 rounded mr-2 mb-2 bg-white">
                    <option value="">All Sources</option>
                    {sources.map((source, index) => (
                        <option key={index} value={source.source}>
                            {source.source}
                        </option>
                    ))}
                </select>
                <input type="date" name="start_date" onChange={handleFilterChange}
                       className="border p-2 rounded mr-2 mb-2 bg-white"/>
                <input type="date" name="end_date" onChange={handleFilterChange}
                       className="border p-2 rounded mr-2 mb-2 bg-white"/>
                <button onClick={() => applyFilters(1)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Filter
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {articles.map((article) => (
                    <div key={article.id} className="border rounded-lg p-4 shadow-md flex flex-col justify-between">
                        <div>
                            <img src={article.image_url} alt={article.title}
                                 className="w-full h-48 object-cover rounded mb-4"/>
                            <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                            <p className="text-sm mb-2">{article.description}</p>
                            {article.author && (
                                <div className="flex items-center space-x-2 mb-2">
                                    <i className="fas fa-user"></i>
                                    <p className="text-sm">
                                        {article.author}
                                    </p>
                                    <div className="flex items-center space-x-2">
                                        {preferences.authors.includes(article.author) ? (
                                            <button onClick={() => handleFollow('authors', article.author)}
                                                    className="text-red-400 ml-1"><i
                                                className="fas fa-user-minus text-xs"></i></button>) : (
                                            <button onClick={() => handleFollow('authors', article.author)}
                                                    className="text-green-600 ml-2"><i
                                                className="fas fa-user-plus text-xs"></i></button>)}
                                    </div>
                                </div>
                            )}
                            {article.source && (
                                <div className="flex items-center space-x-2 mb-2">
                                    <i className="fas fa-newspaper"></i>
                                    <p className="text-sm">
                                        {article.source}
                                    </p>
                                    <div className="flex items-center space-x-2">
                                        {preferences.sources.includes(article.source) ? (
                                            <button onClick={() => handleFollow('sources', article.source)}
                                                    className="text-red-400 ml-1"><i
                                                className="fas fa-user-minus text-xs"></i></button>) : (
                                            <button onClick={() => handleFollow('sources', article.source)}
                                                    className="text-green-600 ml-2"><i
                                                className="fas fa-user-plus text-xs"></i></button>)}


                                    </div>
                                </div>
                            )}

                            {article.date && (
                                <div className="flex items-center space-x-2 mb-2">
                                    <i className="fas fa-calendar"></i>,
                                    <p className="text-sm">
                                        {article.date}
                                    </p>

                                </div>
                            )}

                            {article.category && (
                                <div className="flex items-center space-x-2 mb-2">
                                    <i className="fas fa-tag"></i>
                                    <p className="text-sm">
                                        {article.category}
                                    </p>
                                    <div className="flex items-center space-x-2">
                                        {preferences.categories.includes(article.category) ? (

                                            <button onClick={() => handleFollow('categories', article.category)}
                                                    className="text-red-400 ml-1"><i
                                                className="fas fa-user-minus text-xs"></i></button>) : (
                                            <button onClick={() => handleFollow('categories', article.category)}
                                                    className="text-green-600 ml-2"><i
                                                className="fas fa-user-plus text-xs"></i></button>)}

                                    </div>
                                </div>
                            )}
                            <p className="text-sm mb-2">
                                Published: {new Date(article.published_at).toLocaleDateString()}
                            </p>

                        </div>
                        <a href={article.url} target="_blank" rel="noopener noreferrer"
                           className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 self-end mt-4">Read
                            more</a>
                    </div>
                ))}
            </div>
            <div className="flex justify-center mt-4 space-x-2">
                {paginationLinks && paginationLinks.map((link, index) => {
                    return (
                        <button
                            key={index}
                            onClick={() => link.url && handlePageChange(link.url)}
                            disabled={!link.url}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`
                    px-3 py-1 rounded
                    ${link.url ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-300 cursor-not-allowed'}
                `}
                        >
                        </button>
                    )
                })}
            </div>

        </div>
    );
};

export default NewsFeed;
