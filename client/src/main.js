import { getProducts } from './services/product.service';
import { showToast } from './shared/components/Toast';
import { InventoryController } from "./controllers/InventoryController";
import './styles/globals.css';

const init = async () => {
    try {
        const data = await getProducts()
        const inventoryController = new InventoryController('#inventory-list', '#product-form')
        inventoryController.render(data)
    } catch (e) {
        showToast('No hay productos', 'error');
        console.log(e);

    }
}

init()