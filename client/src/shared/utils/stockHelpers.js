export const getColorByStock = (stock) => {
    const STOCK_COLOR = [
        { limit: 5, styles: 'bg-(--danger-bg) text-(--danger-text) border-(--danger-border)' },
        { limit: 10, styles: 'bg-(--warning-bg) text-(--warning-text) border-(--warning-border)' }
    ]

    let firstValid = STOCK_COLOR.find(item => stock < item.limit)
    return firstValid?.styles || 'bg-(--success-bg) text-(--success-text) border-(--success-border)'
}
