import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        cost: '',
        description: '',
        mainimagepath: '',
        manufacturerid: '',
        isactive: false
    });
    const [manufacturers, setManufacturers] = useState([]);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [manufacturersResponse, productResponse] = await Promise.all([
                    fetch('http://localhost:8000/manufacturer'),
                    fetch(`http://localhost:8000/product/${id}`)
                ]);

                if (!manufacturersResponse.ok || !productResponse.ok) {
                    throw new Error('Ошибка при загрузке данных');
                }

                const manufacturersData = await manufacturersResponse.json();
                const productData = await productResponse.json();

                if (!productData) {
                    throw new Error('Товар не найден');
                }

                setManufacturers(manufacturersData);
                setFormData({
                    title: productData.title,
                    cost: productData.cost,
                    description: productData.description || '',
                    mainimagepath: productData.mainimagepath,
                    manufacturerid: productData.manufacturerid,
                    isactive: productData.isactive === 1
                });
                setImagePreview(getImageUrl(productData.mainimagepath));
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
                alert('Ошибка при загрузке данных товара. Возможно, товар не существует.');
                navigate('/');
            }
        };

        fetchData();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (name === 'mainimagepath') {
            setImagePreview(getImageUrl(value));
        }
    };

    const getImageUrl = (path) => {
        if (!path) return 'https://via.placeholder.com/200x200';
        
        // Проверяем, является ли путь URL
        if (path.startsWith('http')) {
            return path;
        }
        
        // Если путь содержит "Товары автосервиса", обрабатываем как локальный файл
        if (path.includes('Товары автосервиса')) {
            return `http://localhost:8000/${path.replace(/\\/g, '/')}`;
        }
        
        return path;
    };

    const handleImageUrlChange = (e) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            mainimagepath: value
        }));
        setImagePreview(getImageUrl(value));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!/^\d+(\.\d+)?$/.test(formData.cost) || parseFloat(formData.cost) <= 0) {
                throw new Error("Цена товара должна быть положительным числом.");
            }

            const updatedProduct = {
                id: parseInt(id),
                title: formData.title.trim(),
                cost: parseFloat(formData.cost),
                description: formData.description?.trim() || null,
                mainimagepath: formData.mainimagepath?.trim(),
                manufacturerid: parseInt(formData.manufacturerid),
                isactive: formData.isactive ? 1 : 0
            };

            const response = await fetch(`http://localhost:8000/product/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedProduct)
            });

            if (!response.ok) {
                throw new Error('Ошибка при обновлении товара');
            }

            alert('Товар успешно обновлен!');
            navigate('/');
        } catch (error) {
            console.error('Ошибка операции:', error);
            alert(error.message || 'Произошла ошибка при обновлении товара. Пожалуйста, проверьте введенные данные.');
        }
    };

    return (
        <div className="edit-container">
            <button className="back-button" onClick={() => navigate('/')}>
                Назад
            </button>
            
            <h2>Редактирование товара</h2>
            
            <form onSubmit={handleSubmit} className="edit-form">
                <div className="form-group">
                    <label>Название:</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Цена:</label>
                    <input
                        type="number"
                        name="cost"
                        value={formData.cost}
                        onChange={handleChange}
                        required
                        step="0.01"
                        min="0"
                    />
                </div>

                <div className="form-group">
                    <label>Описание:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Путь к изображению:</label>
                    <input
                        type="text"
                        name="mainimagepath"
                        value={formData.mainimagepath}
                        onChange={handleImageUrlChange}
                        placeholder="Введите путь к файлу или URL изображения"
                    />
                    <div className="image-preview">
                        {formData.mainimagepath && (
                            <img 
                                src={getImageUrl(formData.mainimagepath)}
                                alt="Предпросмотр"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://via.placeholder.com/200x200";
                                    console.error("Ошибка загрузки изображения:", e);
                                }}
                            />
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label>Производитель:</label>
                    <select
                        name="manufacturerid"
                        value={formData.manufacturerid}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Выберите производителя</option>
                        {manufacturers.map(manufacturer => (
                            <option key={manufacturer.id} value={manufacturer.id}>
                                {manufacturer.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            name="isactive"
                            checked={formData.isactive}
                            onChange={handleChange}
                        />
                        Активен
                    </label>
                </div>

                <button type="submit" className="save-button">
                    Сохранить
                </button>
            </form>
        </div>
    );
};

export default EditProduct;
