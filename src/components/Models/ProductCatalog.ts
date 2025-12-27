import { IProduct } from '../../types/index';
import { IEvents } from '../base/Events';

/**
 * Класс модели данных для хранения каталога товаров
 * Отвечает за хранение всех товаров магазина и выбранного для просмотра товара
 */
export class ProductCatalog {
    constructor(private readonly events?: IEvents) {}

    protected items: IProduct[] = [];
    protected preview: IProduct | null = null;

    /**
     * Сохранить массив товаров в каталог
     * @param items - массив товаров для сохранения
     */
    setItems(items: IProduct[]): void {
        this.items = items;
        this.events?.emit('catalog:changed');
    }

    /**
     * Получить массив всех товаров из каталога
     * @returns массив всех товаров
     */
    getItems(): IProduct[] {
        return this.items;
    }

    /**
     * Установить товар для детального просмотра
     * @param product - товар для просмотра
     */
    setPreview(product: IProduct): void {
        this.preview = product;
        // Презентер при необходимости запросит актуальные данные через getPreview()
        this.events?.emit('catalog:preview');
    }

    /**
     * Получить товар, выбранный для детального просмотра
     * @returns товар для просмотра или null
     */
    getPreview(): IProduct | null {
        return this.preview;
    }
}

