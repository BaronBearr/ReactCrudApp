import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const History = () => {
    const [sales, setSales] = useState([]);
    const [product, setProduct] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const data = require('../data/data.json');
        const productData = data.product.find(p => p.id === parseInt(id));
        const productSales = data.productsale.filter(sale => sale.productid === parseInt(id));
        
        setProduct(productData);
        setSales(productSales);
    }, [id]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="history-container">
            <button className="back-button" onClick={() => navigate('/')}>
                Назад
            </button>
            
            {product && (
                <h2>История продаж: {product.title}</h2>
            )}

            <div className="sales-list">
                {sales.length > 0 ? (
                    <table className="sales-table">
                        <thead>
                            <tr>
                                <th>Дата продажи</th>
                                <th>Количество</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map(sale => (
                                <tr key={sale.id}>
                                    <td>{formatDate(sale.saledate)}</td>
                                    <td>{sale.quantity} шт.</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="no-sales">История продаж отсутствует</p>
                )}
            </div>
        </div>
    );
};

export default History;
