let favorites = [1, 4, 25];

export function listFavorites() {
    return [...favorites];
}

export function hasFavorite(id) {
    return favorites.includes(id);
}

export function addFavorite(id) {
    favorites = [...favorites, id];
}

export function removeFavorite(id) {
    favorites = favorites.filter((favId) => favId !== id);
}

export function resetFavorites(next = [1, 4, 25]) {
    favorites = [...next];
}
