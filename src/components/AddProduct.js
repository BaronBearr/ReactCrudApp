import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';

const AddProduct = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        cost: '',
        description: '',
        mainimagepath: '',
        manufacturerid: '',
        isactive: true
    });
    const [manufacturers, setManufacturers] = useState([]);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        const fetchManufacturers = async () => {
            try {
                const response = await fetch('http://localhost:8000/manufacturer');
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке производителей');
                }
                const data = await response.json();
                setManufacturers(data);
            } catch (error) {
                console.error('Ошибка загрузки производителей:', error);
                alert('Ошибка при загрузке списка производителей. Пожалуйста, обновите страницу.');
                navigate('/');
            }
        };

        fetchManufacturers();
    }, [navigate]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!/^\d+(\.\d+)?$/.test(formData.cost) || parseFloat(formData.cost) <= 0) {
                throw new Error("Цена товара должна быть положительным числом.");
            }

            const newProduct = {
                title: formData.title.trim(),
                cost: parseFloat(formData.cost),
                description: formData.description?.trim() || null,
                mainimagepath: formData.mainimagepath?.trim(),
                manufacturerid: parseInt(formData.manufacturerid),
                isactive: formData.isactive ? 1 : 0
            };

            const response = await fetch('http://localhost:8000/product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            });

            if (!response.ok) {
                throw new Error('Ошибка при создании товара');
            }

            alert('Товар успешно добавлен!');
            navigate('/');
        } catch (error) {
            console.error('Ошибка операции:', error);
            alert(error.message || 'Произошла ошибка при создании товара. Пожалуйста, проверьте введенные данные.');
        }
    };

    return (
        <div className="edit-container">
            <button className="back-button" onClick={() => navigate('/')}>
                Назад
            </button>
            
            <h2>Добавление нового товара</h2>
            
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
                        onChange={handleChange}
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

                <div className="form-group checkbox">
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
                    Добавить товар
                </button>
            </form>
        </div>
    );
};

export default AddProduct;