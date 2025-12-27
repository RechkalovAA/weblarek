import './scss/styles.scss';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { API_URL } from './utils/constants';
import { ProductCatalog } from './components/Models/ProductCatalog';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { WebLarekAPI } from './components/WebLarekAPI';
import { apiProducts } from './utils/data';
import { ensureElement, cloneTemplate } from './utils/utils';
import { CatalogCard } from './components/view/CatalogCard';
import { PreviewCard } from './components/view/PreviewCard';
import { BasketItem } from './components/view/BasketItem';
import { BasketView } from './components/view/BasketView';
import { Gallery } from './components/view/Gallery';
import { Modal } from './components/view/Modal';
import { Header } from './components/view/Header';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { OrderSuccess } from './components/view/OrderSuccess';
import { IProduct, IOrder, IBuyer, TBuyerErrors } from './types/index';

const events = new EventEmitter();
const api = new Api(API_URL);
const webLarekAPI = new WebLarekAPI(api);

const catalog = new ProductCatalog(events);
const basket = new Basket(events);
const buyer = new Buyer(events);

const header = new Header(ensureElement<HTMLElement>('header.header'), events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const gallery = new Gallery(ensureElement<HTMLElement>('main.gallery'));

const orderForm = new OrderForm(cloneTemplate<HTMLElement>('#order'), events);
const contactsForm = new ContactsForm(cloneTemplate<HTMLElement>('#contacts'), events);
const successView = new OrderSuccess(cloneTemplate<HTMLElement>('#success'), events);
const previewCard = new PreviewCard(events, cloneTemplate<HTMLDivElement>('#card-preview'));
const basketView = new BasketView(cloneTemplate<HTMLElement>('#basket'), events);

const templateCatalogCard = () => cloneTemplate<HTMLButtonElement>('#card-catalog');
const templateBasketItem = () => cloneTemplate<HTMLLIElement>('#card-basket');

// Состояние открытых форм
let activeForm: 'order' | 'contacts' | null = null;

// Вспомогательные функции для устранения дублирования кода

/**
 * Преобразует объект ошибок валидации в массив строк
 * @param validationErrors - объект с ошибками валидации
 * @param fields - опциональный массив полей для фильтрации (если не указан, возвращаются все ошибки)
 * @returns массив строк с ошибками валидации
 */
function getValidationErrors(
    validationErrors: TBuyerErrors,
    fields?: (keyof IBuyer)[]
): string[] {
    if (fields) {
        // Если указаны конкретные поля, проверяем только их
        return fields
            .map(field => validationErrors[field])
            .filter(Boolean) as string[];
    }
    // Иначе возвращаем все ошибки
    return Object.values(validationErrors).filter(Boolean) as string[];
}

function renderCatalog(products: IProduct[]) {
    const cards = products.map((product) => {
        const card = new CatalogCard(events, templateCatalogCard(), {
            onClick: () => {
                catalog.setPreview(product);
            }
        });
        return card.render({
            title: product.title,
            price: product.price,
            ...(product.category && { category: product.category }),
            ...(product.image && { image: product.image }),
        });
    });
    gallery.render({ items: cards });
}

function renderPreview(product: IProduct) {
    const inBasket = basket.hasProduct(product.id);
    const unavailable = product.price === null;
    const buttonText = unavailable
        ? 'Недоступно'
        : inBasket
            ? 'Удалить из корзины'
            : 'Купить';
    
    const cardNode = previewCard.render({
        title: product.title,
        price: product.price,
        ...(product.category && { category: product.category }),
        ...(product.image && { image: product.image }),
        ...(product.description && { description: product.description }),
        ...(inBasket !== undefined && { inBasket }),
        ...(buttonText && { buttonText }),
        ...(unavailable !== undefined && { disabled: unavailable }),
    });
    modal.render({ content: cardNode, open: true });
}


function renderOrderForm() {
    const data = buyer.getData();
    const validationErrors = buyer.validate();
    const errors = getValidationErrors(validationErrors, ['payment', 'address']);

    const formNode = orderForm.render({
        payment: data.payment ?? null,
        address: data.address ?? '',
        valid: errors.length === 0,
        errors: errors.join('. ') || '',
    });
    modal.render({ content: formNode, open: true });
}

function renderContactsForm() {
    const data = buyer.getData();
    const validationErrors = buyer.validate();
    const errors = getValidationErrors(validationErrors, ['email', 'phone']);

    const formNode = contactsForm.render({
        email: data.email ?? '',
        phone: data.phone ?? '',
        valid: errors.length === 0,
        errors: errors.join('. ') || '',
    });
    modal.render({ content: formNode, open: true });
}

function renderSuccess(total: number) {
    const content = successView.render({ total });
    modal.render({ content, open: true });
}

// Модельные события
events.on('catalog:changed', () => renderCatalog(catalog.getItems()));

events.on('catalog:preview', () => {
    const product = catalog.getPreview();
    if (!product) return;
    renderPreview(product);
});

// Обработка клика на кнопку в PreviewCard
events.on('preview:click', () => {
    // Получаем выбранный товар из модели каталога
    const product = catalog.getPreview();
    if (!product) return;
    
    const unavailable = product.price === null;
    const inBasket = basket.hasProduct(product.id);
    
    if (unavailable) return;
    if (inBasket) {
        basket.removeItem(product.id);
    } else {
        basket.addItem(product);
    }
    modal.close();
});

events.on('basket:changed', () => {
    // Всегда обновляем счетчик и содержимое корзины
    header.render({ counter: basket.getCount() });
    const items = basket.getItems().map((product, index) => {
        const item = new BasketItem(events, templateBasketItem(), {
            onRemove: () => {
                basket.removeItem(product.id);
            }
        });
        return item.render({
            title: product.title,
            price: product.price,
            index: index + 1,
        });
    });
    const total = basket.getTotalPrice();
    basketView.render({ items, total });
});

// События представлений
events.on('basket:open', () => {
    // Корзина всегда актуальная, просто открываем модальное окно
    modal.render({ content: basketView.getContainer(), open: true });
});

events.on('basket:checkout', () => {
    if (basket.getCount() > 0) {
        renderOrderForm();
        activeForm = 'order';
    }
});

events.on('order:payment', ({ payment }: { payment: string }) => {
    buyer.setField('payment', payment as IOrder['payment']);
});

events.on('order:address', ({ address }: { address: string }) => {
    buyer.setField('address', address);
});

events.on('order:next', () => {
    renderContactsForm();
    activeForm = 'contacts';
});

events.on('order:contacts', ({ email, phone }: { email?: string; phone?: string }) => {
    if (email !== undefined) buyer.setField('email', email);
    if (phone !== undefined) buyer.setField('phone', phone);
});

events.on('modal:close', () => {
    activeForm = null;
});

events.on('buyer:changed', () => {
    const validationErrors = buyer.validate();
    const data = buyer.getData();
    
    if (activeForm === 'order') {
        const errors = getValidationErrors(validationErrors, ['payment', 'address']);
        orderForm.render({
            payment: data.payment ?? null,
            address: data.address ?? '',
            valid: errors.length === 0,
            errors: errors.join('. ') || '',
        });
    }
    
    if (activeForm === 'contacts') {
        const errors = getValidationErrors(validationErrors, ['email', 'phone']);
        contactsForm.render({
            email: data.email ?? '',
            phone: data.phone ?? '',
            valid: errors.length === 0,
            errors: errors.join('. ') || '',
        });
    }
});

events.on('order:submit', () => {
    const validationErrors = buyer.validate();
    const errors = getValidationErrors(validationErrors);
    
    if (errors.length) {
        contactsForm.render({ valid: false, errors: errors.join('. ') || '' });
        return;
    }

    const data = buyer.getData();
    // После валидации все поля гарантированно заполнены
    if (!data.payment || !data.address || !data.email || !data.phone) {
        contactsForm.render({ valid: false, errors: 'Ошибка валидации данных' });
        return;
    }

    const order: IOrder = {
        payment: data.payment,
        address: data.address,
        email: data.email,
        phone: data.phone,
        total: basket.getTotalPrice(),
        items: basket.getItems().map((item) => item.id),
    };

    webLarekAPI.orderProducts(order)
        .then((response) => {
            basket.clear();
            buyer.clear();
            renderSuccess(response.total);
        })
        .catch((error) => {
            contactsForm.render({ errors: String(error) || '', valid: false });
        });
});

events.on('order:success-close', () => {
    modal.close();
});

// Старт приложения
webLarekAPI.getProductList()
    .then((products) => catalog.setItems(products))
    .catch(() => catalog.setItems(apiProducts.items))
    .finally(() => {
        // Инициализация состояния корзины
        basket.clear();
    });
