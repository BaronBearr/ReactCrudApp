const importAll = (r) => {
    let images = {};
    r.keys().forEach((item) => {
        const imageName = item.replace('./', '');
        images[imageName] = r(item);
    });
    return images;
};

const images = importAll(require.context('../Товары автосервиса', false, /\.(png|jpe?g|svg)$/));

export const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/200x200';

    if (imagePath.startsWith('http')) {
        return imagePath;
    }

    const fileName = imagePath.split('\\').pop();

    if (images[fileName]) {
        return images[fileName];
    }
    
    return 'https://via.placeholder.com/200x200';
}; 