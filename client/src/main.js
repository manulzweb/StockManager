import { getProducts } from './services/product.service';
import { renderRows } from './shared/components/Tablerow';
import { showToast } from './shared/components/Toast';
import './styles/globals.css';

const init = async () => {
    try {
        const data = getProducts().then(res=> res);
        renderRows(data);

    } catch {
        showToast('No hay productos','error');
        
    }
}

init()