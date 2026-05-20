import i18next from 'i18next';

export const formatearPrecioTexto = (precio) => {
    return precio.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export const formatearStockTexto = (stock) => {
    if (stock > 1) return `${stock} ${i18next.t('components.units')}`
    if (stock === 1) return `${stock} ${i18next.t('components.unit')}`
    return i18next.t('components.out_of_stock')
}
