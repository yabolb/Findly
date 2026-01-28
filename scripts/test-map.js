
function mapCategory(rawCategory, productName) {
    if (rawCategory) {
        const catLower = rawCategory.toLowerCase();
        if (catLower.match(/música|music|cd|vinyl|disco|grabaciones|album/)) return 'music';
        if (catLower.match(/libros|books|literatura|novela|comic|manga/)) return 'books';
        if (catLower.match(/dvd|movies|pelicula|cine|blu-ray|streaming/)) return 'movies';
        if (catLower.match(/electronics|computers|phones|tecnologia|informatica|electronica|audio|video|consolas|gaming|videojuegos|informatica/)) return 'tech-electronics';
        if (catLower.match(/apparel|clothing|shoes|accessories|ropa|moda|calzado|accesorios|joyeria|jewelry|relojes|watches/)) return 'fashion';
        if (catLower.match(/home|garden|furniture|kitchen|hogar|jardin|muebles|cocina|decoracion|bricolaje/)) return 'home-garden';
        if (catLower.match(/toys|baby|games|juguetes|bebe|ninos|infantil/)) return 'baby-kids';
        if (catLower.match(/sports|fitness|deportes|gimnasio|aire libre|camping/)) return 'sports-outdoors';
        if (catLower.match(/arts|hobbies|crafts|arte|ocio|coleccionismo|papeleria/)) return 'collectibles-art';
        if (catLower.match(/tools|hardware|herramientas/)) return 'diy';
        if (catLower.match(/belleza|beauty|perfume|cosmetica|maquillaje/)) return 'beauty-personal-care';
        if (catLower.match(/motor|coche|moto|car|motorcycle|recambios/)) return 'motor-accessories';
        if (catLower.match(/viajes|travel|hotel|vuelo|experiencias|escapadas/)) return 'travel-experiences';
    }

    const text = (rawCategory + ' ' + productName).toLowerCase();
    if (text.match(/\b(iphone|laptop|macbook|samsung|pixel|tablet|ordenador|portatil|gaming|switch|ps5|xbox|monitor)\b/)) return 'tech-electronics';
    if (text.match(/\b(shirt|dress|jeans|jacket|sneakers|shoes|bag|watch|ropa|camiseta|vestido|zapatos|bolso|reloj|joya)\b/)) return 'fashion';
    if (text.match(/\b(sofa|chair|table|lamp|bed|furniture|home|hogar|mueble|mesa|decoracion)\b/)) return 'home-garden';
    if (text.match(/\b(bike|bicycle|gym|fitness|yoga|sports|deporte|bici|gimnasio|futbol|tenis)\b/)) return 'sports-outdoors';
    if (text.match(/\b(toy|lego|doll|baby|juguete|bebe|nino|nina)\b/)) return 'baby-kids';
    if (text.match(/\b(book|libro|novela|comic)\b/)) return 'books';
    if (text.match(/\b(cd|vinyl|music|album|musica|disco)\b/)) return 'music';
    if (text.match(/\b(dvd|movie|pelicula|cine)\b/)) return 'movies';
    if (text.match(/\b(art|painting|collectible|arte|pintura|coleccion)\b/)) return 'collectibles-art';
    if (text.match(/\b(makeup|maquillaje|perfume|crema|beauty|belleza)\b/)) return 'beauty-personal-care';

    return null;
}

console.log('Rachmaninov:', mapCategory('', 'Rachmaninov: Sinfonía n. 2 / Vocalise (CD).'));
console.log('Nino Rota:', mapCategory('', 'Nino Rota: Guerra y paz (CD).'));
console.log('Music for kids:', mapCategory('', 'Music for kids (CD)'));
console.log('Rachmaninov with category:', mapCategory('Música y Ocio', 'Rachmaninov (CD)'));
