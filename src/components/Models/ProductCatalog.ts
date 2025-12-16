import { IProduct } from '../../types/index';
import { IEvents } from '../base/Events';

/**
 * Класс модели данных для хранения каталога товаров
 * Отвечает за хранение всех товаров магазина и выбранного для просмотра товара
 */
export class ProductCatalog {
    constructor(private readonly events?: IEvents) {}

    protected items: IProduct[] = [];

    /**
     * Сохранить массив товаров в каталог
     * @param items - массив товаров для сохранения
     */
    setItems(items: IProduct[]): void {
        this.items = items;
        this.events?.emit('catalog:changed', { items });
    }

    /**
     * Получить массив всех товаров из каталога
     * @returns массив всех товаров
     */
    getItems(): IProduct[] {
        return this.items;
    }

    /**
     * Найти товар по его идентификатору
     * @param id - идентификатор товара
     * @returns найденный товар или undefined
     */
    getProductById(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }

    /**
     * Установить товар для детального просмотра
     * @param product - товар для просмотра
     */
    setPreview(product: IProduct): void {
        this.events?.emit('catalog:preview', { product });
    }
}

