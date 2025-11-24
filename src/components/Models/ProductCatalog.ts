import { IProduct } from '../../types/index';

/**
 * Класс модели данных для хранения каталога товаров
 * Отвечает за хранение всех товаров магазина и выбранного для просмотра товара
 */
export class ProductCatalog {
    protected items: IProduct[] = [];
    protected preview: IProduct | null = null;

    /**
     * Сохранить массив товаров в каталог
     * @param items - массив товаров для сохранения
     */
    setItems(items: IProduct[]): void {
        this.items = items;
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
        this.preview = product;
    }

    /**
     * Получить товар, выбранный для детального просмотра
     * @returns товар для просмотра или null
     */
    getPreview(): IProduct | null {
        return this.preview;
    }
}

