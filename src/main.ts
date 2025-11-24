import './scss/styles.scss';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { ProductCatalog } from './components/Models/ProductCatalog';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { WebLarekAPI } from './components/WebLarekAPI';
import { apiProducts } from './utils/data';

// Объявление переменных
const catalog = new ProductCatalog();
const basket = new Basket();
const buyer = new Buyer();
const api = new Api(API_URL);
const webLarekAPI = new WebLarekAPI(api);
const productId = '854cef69-976d-4c2a-a18c-2aa45046c390';

// === ТЕСТИРОВАНИЕ ProductCatalog ===
console.log('=== ТЕСТИРОВАНИЕ ProductCatalog ===');
catalog.setItems(apiProducts.items);
console.log('1. setItems() + getItems() - каталог товаров:', catalog.getItems());
console.log('2. getProductById() - товар по ID:', catalog.getProductById(productId));
catalog.setPreview(apiProducts.items[0]);
console.log('3. setPreview() + getPreview() - товар для просмотра:', catalog.getPreview());

// === ТЕСТИРОВАНИЕ Basket ===
console.log('\n=== ТЕСТИРОВАНИЕ Basket ===');
basket.addItem(apiProducts.items[0]);
basket.addItem(apiProducts.items[1]);
console.log('1. addItem() - добавлены 2 товара');
console.log('2. getItems() - товары в корзине:', basket.getItems());
console.log('3. getCount() - количество товаров:', basket.getCount());
console.log('4. getTotalPrice() - общая стоимость:', basket.getTotalPrice());
console.log('5. hasProduct() - проверка наличия товара:', basket.hasProduct(productId));
basket.removeItem(productId);
console.log('6. removeItem() - после удаления товара:', basket.getItems());
basket.clear();
console.log('7. clear() - после очистки корзины:', basket.getItems());

// === ТЕСТИРОВАНИЕ Buyer ===
console.log('\n=== ТЕСТИРОВАНИЕ Buyer ===');
console.log('1. validate() - валидация пустых данных:', buyer.validate());
buyer.setField('email', 'test@test.ru');
console.log('2. setField(email) - установлен email:', buyer.getData());
buyer.setField('phone', '+79991234567');
buyer.setField('payment', 'card');
buyer.setField('address', 'Москва, ул. Ленина, 1');
console.log('3. getData() - все данные покупателя:', buyer.getData());
console.log('4. validate() - валидация полных данных:', buyer.validate());
buyer.clear();
console.log('5. clear() - после очистки данных:', buyer.getData());

// === РАБОТА С API СЕРВЕРА ===
console.log('\n=== WebLarekAPI - Запрос к серверу ===');

webLarekAPI.getProductList()
  .then(products => {
    console.log('getProductList() - товары с сервера:', products);
    catalog.setItems(products);
    console.log('Каталог обновлён из API:', catalog.getItems());
  })
  .catch(error => {
    console.error('Ошибка загрузки товаров с сервера:', error);
  });
