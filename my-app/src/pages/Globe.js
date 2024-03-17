import React, { useEffect, useState } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Scene from '../components/Globe';

const Globe = () => {
    const token = localStorage.getItem('token');
    const [isLoading, setIsLoading] = useState(true);

    if (!token) {
        window.location.href = '/login';
    } else {
        console.log('Token:', token);
    }

    const [articles, setArticles] = useState([]);
    const [filters, setFilters] = useState({
        keyword: '', category: '', sources: '', start_date: '', end_date: '', sort_by: '', sort_order: 'published_at'
    });

    const [pagination, setPagination] = useState({
        currentPage: 1, lastPage: 1, nextPageUrl: null, prevPageUrl: null,
    });
    const [paginationLinks, setPaginationLinks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [sources, setSources] = useState([]);
    const [preferences, setPreferences] = useState({
        authors: [], categories: [], sources: []
    });
    const [locationArticles, setLocationArticles] = useState([]);
    const [noPhotoArticles, setNoPhotoArticles] = useState([]);

    const parseJSONSafely = (value) => {
        try {
            return JSON.parse(value.replace(/'/g, "\""));
        } catch (e) {
            return [];
        }
    };
    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters(prevState => ({ ...prevState, [name]: value }));
    };

    const applyFilters = (page = 1) => {
        const query = new URLSearchParams();
        filters.has_image = "yes";
        for (const [key, value] of Object.entries(filters)) {
            if (value) {
                query.append(key, value);
            }
        }
        fetch(process.env.REACT_APP_BASE_URL + `/api/filter-articles?page=${page}&${query.toString()}&sort_order=${filters.sort_order}`, {
            method: 'GET', headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setArticles(data.data);
                setPagination({
                    currentPage: data.current_page,
                    lastPage: data.last_page,
                    nextPageUrl: data.next_page_url,
                    prevPageUrl: data.prev_page_url,
                });
                setPaginationLinks(data.links);
                console.log('Articles:', data)


            })
            .catch((error) => {
                console.error('Sources loading failed:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const fetchNoPhotoArticles = (page = 1) => {
        const query = new URLSearchParams();
        filters.has_image = "no";
        for (const [key, value] of Object.entries(filters)) {
            if (value) {
                query.append(key, value);
            }
        }
        fetch(process.env.REACT_APP_BASE_URL + `/api/filter-articles?page=${page}&${query.toString()}&sort_order=${filters.sort_order}`, {
            method: 'GET', headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setNoPhotoArticles(data.data);
                console.log('No Photo Articles:', data)
            })
            .catch((error) => {
                console.error('Sources loading failed:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    const handlePageChange = (url) => {
        const page = new URL(url).searchParams.get("page");
        applyFilters(page);
    };

    useEffect(() => {
        applyFilters();
        fetchNoPhotoArticles();

        fetch(process.env.REACT_APP_BASE_URL + '/api/preferences', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message === 'Unauthorized.') {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }

                setPreferences({
                    authors: parseJSONSafely(data.authors),
                    categories: parseJSONSafely(data.categories),
                    sources: parseJSONSafely(data.sources),
                });
            })
            .catch((error) => {
                console.error('Preferences loading failed:', error);
            });
        fetch(process.env.REACT_APP_BASE_URL + '/api/categories')
            .then((response) => response.json())
            .then((data) => {
                setCategories(data);


            })
            .catch((error) => {
                console.error('Sources loading failed:', error);

            });
        fetch(process.env.REACT_APP_BASE_URL + '/api/sources')
            .then((response) => response.json())
            .then((data) => {
                setSources(data);


            })
            .catch((error) => {
                console.error('Sources loading failed:', error);

            });
    }, [token]);

    const handlePreferencesUpdate = (type, value) => {


        const updatedPreferences = [...preferences[type], value];
        const data = { [type]: JSON.stringify(updatedPreferences) };

        fetch(process.env.REACT_APP_BASE_URL + '/api/preferences', {
            method: 'POST', headers: {
                'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'
            }, body: JSON.stringify(data),
        })
            .then(() => {
                setPreferences(prev => ({
                    ...prev, [type]: updatedPreferences
                }));


            })
            .catch((error) => {
                console.error('Sources loading failed:', error);

            });
    };

    const handleFollow = (type, value) => {

        // Daha önce takip edilip edilmediğini kontrol et
        const isFollowed = preferences[type].includes(value);
        const updatedPreferences = isFollowed ? preferences[type].filter(item => item !== value) : [...preferences[type], value];

        const data = { [type]: JSON.stringify(updatedPreferences) };

        fetch(process.env.REACT_APP_BASE_URL + '/api/preferences', {
            method: 'POST', headers: {
                'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'
            }, body: JSON.stringify(data),
        })
            .then(() => {
                setPreferences(prev => ({
                    ...prev, [type]: updatedPreferences
                }));


            })
            .catch((error) => {
                console.error('Sources loading failed:', error);

            });
    };
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        nextArrow: <SlickArrowRight />,
        prevArrow: <SlickArrowLeft />
    };    

    function SlickArrowLeft({ className, style, onClick }) {
        return (
          <div
            className={`${className} custom-left-arrow`}
            style={{ ...style, display: "block" }}
            onClick={onClick}
          />
        );
      }
      
      function SlickArrowRight({ className, style, onClick }) {
        return (
          <div
            className={`${className} custom-right-arrow`}
            style={{ ...style, display: "block" }}
            onClick={onClick}
          />
        );
      }

      
    return (
        // Scene
        <div>
            <div className={`container mx-auto p-4 text-left ${isLoading ? 'loading' : ''}`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-lg p-4">
                        <TopArticles articles={articles} />
                    </div>
                    <div className="rounded-lg p-4">
                        {/* bir div içinde live anlamına gelen <span className="live-dot-shining"></span> ve yanından Live News yazısı gelecek */}
                        <div className="live-news-container text-center">
                            <span className="live-dot-shining" style={{ marginRight: '30px', padding: '5px' }}></span>
                            <span className="live-news-text font-semibold">Live News</span>
                        </div>
                        <Scene newsLocations={locationArticles} />
                    </div>
                    <div className="rounded-lg p-4">
                        {noPhotoArticles.slice(0, 5).map((article) => (
                            // show no photo articles here with link to read more
                            <div key={article.id} className="mb-4">
                                <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                                <p className="text-sm mb-2">{article.description}</p>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm mb-3 article-published-at">
                                        Published: {new Date(article.published_at).toLocaleDateString()}
                                    </p>
                                    <a href={article.url} target="_blank"
                                        className=" px-4 py-2 rounded hover:bg-blue-600">Read More
                                    </a>
                                    </div>

                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="bg-black p-4 rounded-lg mx-auto">
                    <Slider {...sliderSettings} className="slider">
                        {articles.slice(Math.max(articles.length - 5, 1)).map((article) => (
                            <div key={article.id} className="text-white">
                                <div className="flex justify-center items-center mb-4">
                                    <img
                                        src={article.image_url || 'default-image.jpg'}
                                        alt={article.title}
                                        className="object-cover rounded mb-4"
                                        style={{ height: "12rem", width: "auto" }} 
                                    />
                                </div>
                                <div className="text-center">
                                <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                                <p className="text-sm mb-2">{article.description}</p>
                                <p className="text-sm mb-2">
                                    Published: {new Date(article.published_at).toLocaleDateString()}
                                </p>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
                


                <div className="mb-8 p-4 rounded-lg text-center">
                    <h1 className="text-3xl font-semibold mb-4 p-4 rounded-lg all-upper-cool-font">
                        You can find the latest news here.
                    </h1>
                    <input type="text" name="keyword" placeholder="Search"
                        onChange={handleFilterChange}
                        onKeyPress={(event) => {
                            if (event.key === 'Enter') {
                                applyFilters(1);
                            }
                        }}
                        className="border p-2 rounded mr-2 mb-2 bg-white" />
                    <select name="category" onChange={handleFilterChange} className="border p-2 rounded mr-2 mb-2 bg-white">
                        <option value="">All Categories</option>
                        {categories.map((category, index) => (category.category ? (
                            <option key={index} value={category.category}>
                                {category.category}
                            </option>) : null))}
                    </select>
                    <select name="sources" onChange={handleFilterChange} className="border p-2 rounded mr-2 mb-2 bg-white">
                        <option value="">All Sources</option>
                        {sources.map((source, index) => (source.source ? (<option key={index} value={source.source}>
                            {source.source}
                        </option>) : null))}
                    </select>
                    <input type="date" name="start_date" onChange={handleFilterChange}
                        className="border p-2 rounded mr-2 mb-2 bg-white" />
                    <input type="date" name="end_date" onChange={handleFilterChange}
                        className="border p-2 rounded mr-2 mb-2 bg-white" />

                    <select name="sort_by" onChange={handleFilterChange} className="border p-2 rounded mr-2 mb-2 bg-white">
                        <option value="">Sort By</option>
                        {['Published At',
                            'Title',
                            'Author',
                            'Source',
                            'Category',
                        ].map((item, index) => (
                            <option key={index} value={item}>
                                {item}
                            </option>))}

                    </select>
                    <button onClick={() => applyFilters(1)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Search
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {articles.map((article) => (
                        <div key={article.id} className="rounded-lg p-4 flex flex-col justify-between">
                            <div>
                                <img src={article.image_url || 'default-image.jpg'} alt={article.title}
                                    className="w-full h-48 object-cover rounded mb-4" />
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
                                {/* bir div içerisinde solda published tarihi sağda ise read more butonu olacak */}

                                <div className="flex justify-between items-center">
                                    <p className="text-sm mb-3 article-published-at">
                                        Published: {new Date(article.published_at).toLocaleDateString()}
                                    </p>
                                    <a href={article.url} target="_blank"
                                        className=" px-4 py-2 rounded hover:bg-blue-600">Read More
                                    </a>
                                </div>        

                            </div>

                        </div>))}
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
        </div>
    );
};

const TopArticles = ({ articles }) => {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="top-articles-container">
      {articles.slice(0, 2).map((article) => (
        <div key={article.id} className="mb-4">
          <img src={article.image_url || 'default-image.jpg'} alt={article.title} className="w-full h-48 object-cover rounded mb-4" />
          <div className="article-content">
            <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
            <p className="text-sm">{article.description}</p>
            <p className="article-published-at">
              Published: {new Date(article.published_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Globe;

