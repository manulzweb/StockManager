import { tableRow, formatStockText, getColorByStock, formatPriceText } from "../shared/components/tableRow"
import { showToast, showConfirm } from "../shared/components/Toast"
import { statCard } from "../shared/components/statsCard"
import { pagination } from "../shared/components/paginationFooter"
import i18next from 'i18next'


export class InventoryController {
    constructor(containerSelector, formSelector, model) {
        this.model = model
        this.tableBody = document.querySelector(containerSelector)
        this.form = document.querySelector(formSelector)
        this.paginationContainer = document.querySelector('#pagination')
        this._initFormListener()
        this._initSearchBarListener()
    }

    render(products) {
        if (!products) {
            throw new Error(i18next.t('table.empty'))
        }
        this.model.setProducts(products)
        this._renderTable()
        this._renderStats()
    }

    _renderTable() {
        let tableRows = ''
        const itemsToShow = this.model.getPaginatedProducts()

        itemsToShow.forEach(product => {
            tableRows += tableRow(product)
        })
        this.tableBody.innerHTML = tableRows
        this._attachEventListeners()
        this._renderPaginationUI()
    }

    _renderPaginationUI() {
        const totalItems = this.model.getTotalItems()
        const start = totalItems === 0 ? 0 : (this.model.currentPage - 1) * this.model.itemsPerPage + 1
        const end = Math.min(this.model.currentPage * this.model.itemsPerPage, totalItems)
        const hasPrev = this.model.currentPage > 1
        const hasNext = this.model.currentPage < Math.ceil(totalItems / this.model.itemsPerPage)

        if (this.paginationContainer) {
            this.paginationContainer.innerHTML = pagination({ start, end, total: totalItems, hasPrev, hasNext })
            this._attachPaginationListeners()
        }
    }

    _attachPaginationListeners() {
        const btnPrev = this.paginationContainer.querySelector('#btn-prev')
        const btnNext = this.paginationContainer.querySelector('#btn-next')

        if (btnPrev && !btnPrev.disabled) {
            btnPrev.addEventListener('click', () => {
                if (this.model.prevPage()) {
                    this._renderTable()
                }
            })
        }

        if (btnNext && !btnNext.disabled) {
            btnNext.addEventListener('click', () => {
                if (this.model.nextPage()) {
                    this._renderTable()
                }
            })
        }
    }

    _attachEventListeners() {
        const editButtons = this.tableBody.querySelectorAll('.edit-btn')
        const deleteButtons = this.tableBody.querySelectorAll('.delete-btn')

        editButtons.forEach((editBtn) => {
            editBtn.addEventListener('click', (event) => {
                const idProduct = event.currentTarget.dataset.id
                const product = this.model.getProduct(idProduct)
                this._handleEdit(product)
            })
        })

        deleteButtons.forEach((delBtn) => {
            delBtn.addEventListener('click', (event) => {
                const idProduct = event.currentTarget.dataset.id
                const product = this.model.getProduct(idProduct)
                if (product) this._handleDelete(product)
            })
        })
    }

    _handleEdit(product) {
        this.form.querySelector('#nombre').value = product.nombre || ''
        this.form.querySelector('#precio').value = product.precio || ''
        this.form.querySelector('#stock').value = product.stock || 0
        this.form.querySelector('#descripcion').value = product.descripcion || ''

        const formTitle = document.querySelector('#form-title')
        formTitle.setAttribute('data-i18n', 'form.title_edit')
        formTitle.textContent = i18next.t('form.title_edit')
        
        const submitBtn = this.form.querySelector('#btn-submit')
        submitBtn.setAttribute('data-i18n', 'form.btn_update')
        submitBtn.textContent = i18next.t('form.btn_update')

        this.form.dataset.mode = 'edit'
        this.form.dataset.editId = product.id
    }

    _initSearchBarListener() {
        const bar = document.querySelector('#search-bar')
        if (!bar) return
        
        bar.addEventListener('input', (event) => this._searchProduct(event.target.value.trim() || '')
        )
    }

    _searchProduct(query){
        this.model.currentPage = 1
        const allProducts = this.model.getAllProducts()
        if (!query) {
            this._renderTable()
            return
        }
        const starts = []
        const contains = []
        const lowerQuery = query.toLowerCase()
        for (const product of allProducts) {
            const name = product.nombre.toLowerCase()
            if (name.startsWith(lowerQuery)) {
                starts.push(product)
            } else if (name.includes(lowerQuery)) {
                contains.push(product)
            }
        }
        const itemsToShow = [...starts, ...contains]
        
        if (!itemsToShow.length) {
       this.tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="py-10 text-center text-slate-500 dark:text-slate-400">
                    ${i18next.t('table.empty')} ${query}
                    </td>
                </tr>
                `
            return
        }
        let tableRows = ''

        itemsToShow.forEach(product => {
            tableRows += tableRow(product)
        })
        this.tableBody.innerHTML = tableRows
        this._attachEventListeners()
        this._renderPaginationUI()
    }

    _initFormListener() {
        const submitBtn = this.form.querySelector('#btn-submit')
        const cancelBtn = this.form.querySelector('#btn-cancel')
        cancelBtn.addEventListener('click', (event) => {
            event.preventDefault()
            this.form.reset()
        })

        submitBtn.addEventListener('click', async (event) => {
            event.preventDefault()

            const mode = this.form.dataset.mode || 'create'

            try {
                if (mode === 'edit') {
                    const id = this.form.dataset.editId
                    await this._handleUpdate(id)
                    showToast(i18next.t('toast.notification'), i18next.t('toast.success_update'))
                    this.form.reset()
                    this.form.dataset.mode = 'create'
                    this.form.removeAttribute('data-edit-id')
                    const formTitle = document.querySelector('#form-title')
                    formTitle.setAttribute('data-i18n', 'form.title_create')
                    formTitle.textContent = i18next.t('form.title_create')
                    
                    submitBtn.setAttribute('data-i18n', 'form.btn_save')
                    submitBtn.textContent = i18next.t('form.btn_save')
                } else {
                    await this._handleCreate()
                    showToast(i18next.t('toast.notification'), i18next.t('toast.success_create'))
                    this.form.reset()
                }
            } catch (error) {
                console.error("Operación cancelada o fallida:", error)
            }
        })

    }

    _validateInputs() {
        const newName = this.form.querySelector('#nombre').value.trim()
        const newPrice = Number(this.form.querySelector('#precio').value)
        const stockInput = this.form.querySelector('#stock').value
        const newStock = Number(stockInput)
        let newDescription = this.form.querySelector('#descripcion').value.trim()

        if (!newName) {
            showToast(i18next.t('toast.warning'), i18next.t('toast.error_name'), 'warning')
            throw new Error('Nombre invalido')
        }

        if (!newPrice || newPrice <= 0) {
            showToast(i18next.t('toast.warning'), i18next.t('toast.error_price'), 'warning')
            throw new Error('Precio invalido')
        }

        if (stockInput === '' || newStock < 0) {
            showToast(i18next.t('toast.warning'), i18next.t('toast.error_stock'), 'warning')
            throw new Error('Stock invalido')
        }

        newDescription = newDescription || 'Sin descripción'

        return {
            nombre: newName,
            precio: newPrice,
            stock: newStock,
            descripcion: newDescription
        }
    }

    async _handleCreate() {
        const newData = this._validateInputs()
        await this.model.addProduct(newData)
        this._renderTable()
        this._renderStats()
    }

    async _handleUpdate(id) {
        const newData = this._validateInputs()
        const updatedProduct = await this.model.updateExistingProduct(id, newData)
        this._updateRowDOM(updatedProduct)
        this._renderStats()
    }

    async _handleDelete(product) {
        const isConfirmed = await showConfirm(
            i18next.t('toast.confirm_delete_title'),
            product,
            null,
            { title: i18next.t('toast.cancel_title'), text: i18next.t('toast.cancel_text') }
        )

        if (isConfirmed) {
            await this.model.removeProduct(product.id)
            this._renderTable()
            showToast(i18next.t('toast.notification'), i18next.t('toast.success_delete'), 'success')
            this._renderStats()
        }
    }

    _updateRowDOM(product) {
        const row = this.tableBody.querySelector(`tr[data-id="${product.id}"]`)
        if (!row) return

        const nameProduct = row.querySelector('.product-name')
        if (nameProduct.textContent !== product.nombre) nameProduct.textContent = product.nombre

        const descriptionProduct = row.querySelector('.product-description')
        if (descriptionProduct.textContent !== product.descripcion) descriptionProduct.textContent = product.descripcion

        const priceProduct = row.querySelector('.product-price')
        const newPrice = `$${formatPriceText(product.precio)}`
        if (priceProduct.textContent !== newPrice) priceProduct.textContent = newPrice

        const stockBadge = row.querySelector('.product-stock')
        const newStockText = formatStockText(product.stock)
        if (stockBadge.textContent !== newStockText) stockBadge.textContent = newStockText

        const newClassName = `product-stock px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight border ${getColorByStock(product.stock)}`
        if (stockBadge.className !== newClassName) stockBadge.className = newClassName
    }

    _renderStats() {
        const stats = this.model.getStats()

        const statsContainer = document.querySelector('#stats')
        if (!statsContainer) return

        statsContainer.innerHTML = `
            ${statCard({
            title: i18next.t('stats.total_sku'),
            value: stats.totalSKU
        })}
            ${statCard({
            title: i18next.t('stats.inventory_value'),
            value: '$' + formatPriceText(stats.totalValue),
            borderStyle: 'border-l-4 border-l-(--brand)'
        })}
            ${statCard({
            title: i18next.t('stats.critical_stock'),
            value: stats.criticalStock,
            borderStyle: 'border-l-4 border-l-(--danger-border)',
            valueColor: 'text-(--danger-text)'
        })}
        `
    }
}
