import { useState, useEffect } from 'react';
import { getImageUrl } from '../utils/imageUtils';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [manufacturers, setManufacturers] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedManufacturer, setSelectedManufacturer] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [manufacturersResponse, productsResponse] = await Promise.all([
                    fetch('http://localhost:8000/manufacturer'),
                    fetch('http://localhost:8000/product')
                ]);

                const manufacturersData = await manufacturersResponse.json();
                const productsData = await productsResponse.json();

                setManufacturers(manufacturersData);
                setProducts(productsData);
                setFilteredProducts(productsData);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            }
        };

        fetchData();
    }, []);

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        filterProducts(query, selectedManufacturer);
    };

    const handleManufacturerFilter = (event) => {
        const manufacturer = event.target.value;
        setSelectedManufacturer(manufacturer);
        filterProducts(searchQuery, manufacturer);
    };

    const filterProducts = (query, manufacturer) => {
        let filtered = products;
        
        if (query) {
            filtered = filtered.filter(product => 
                (product.title?.toLowerCase().includes(query) || 
                 product.description?.toLowerCase().includes(query))
            );
        }
        
        if (manufacturer) {
            filtered = filtered.filter(product => 
                product.manufacturerid.toString() === manufacturer
            );
        }
        
        if (sortOrder === 'asc') {
            filtered.sort((a, b) => a.cost - b.cost);
        } else if (sortOrder === 'desc') {
            filtered.sort((a, b) => b.cost - a.cost);
        }
        
        setFilteredProducts(filtered);
    };

    const handleSort = (order) => {
        if (order === sortOrder) {
            setSortOrder('');
            setFilteredProducts([...products]);
            return;
        }

        setSortOrder(order);
        let sorted = [...filteredProducts];
        
        if (order === 'asc') {
            sorted.sort((a, b) => a.cost - b.cost);
        } else if (order === 'desc') {
            sorted.sort((a, b) => b.cost - a.cost);
        }
        
        setFilteredProducts(sorted);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB'
        }).format(price);
    };

    const openForm = () => {
        console.log("Открытие формы добавления товара");
    };

    const handleEdit = (productId) => {
        navigate(`/edit/${productId}`);
    };

    const handleHistory = (productId) => {
        navigate(`/history/${productId}`);
    };

    return (
        <div className="container">
            <h1>Список товаров</h1>
            
            <div className="controls">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Поиск по названию..."
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>
                
                <div className="filter-box">
                    <select 
                        value={selectedManufacturer}
                        onChange={handleManufacturerFilter}
                    >
                        <option value="">Все производители</option>
                        {manufacturers.map(manufacturer => (
                            <option 
                                key={manufacturer.id} 
                                value={manufacturer.id}
                            >
                                {manufacturer.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="sort-buttons">
                    <button 
                        className={`sort-button ${sortOrder === 'asc' ? 'active' : ''}`}
                        onClick={() => handleSort('asc')}
                        title="Нажмите повторно для сброса сортировки"
                    >
                        По возрастанию цены ↑
                    </button>
                    <button 
                        className={`sort-button ${sortOrder === 'desc' ? 'active' : ''}`}
                        onClick={() => handleSort('desc')}
                        title="Нажмите повторно для сброса сортировки"
                    >
                        По убыванию цены ↓
                    </button>
                </div>

                <button className="add-button" onClick={openForm}>
                    Добавить товар
                </button>
            </div>

            <div className="results-count">
                Показано {filteredProducts.length} из {products.length} товаров
            </div>

            <div id="product-list" className="product-grid">
                {filteredProducts.map(product => (
                    <div key={product.id} className={`product-card ${!product.isactive ? 'inactive-product' : ''}`}>
                        <img 
                            src={getImageUrl(product.mainimagepath)} 
                            alt={product.title}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/200x200";
                            }}
                        />
                        <div className="product-info">
                            <h3 title={product.title}>{product.title}</h3>
                            <p className="price">{formatPrice(product.cost)}</p>
                            {product.description && 
                                <p className="description" title={product.description}>
                                    {product.description}
                                </p>
                            }
                            <p className="status">
                                {product.isactive ? 
                                    <span className="active">Активен</span> : 
                                    <span className="inactive">Не активен</span>
                                }
                            </p>
                            <div className="product-actions">
                                <button className="edit-button" onClick={() => handleEdit(product.id)}>
                                    Редактировать
                                </button>
                                <button className="history-button" onClick={() => handleHistory(product.id)}>
                                    История
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;