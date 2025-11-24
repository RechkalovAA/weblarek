import { IProduct } from '../../types/index';

/**
 * Класс модели данных для управления корзиной покупок
 * Отвечает за хранение товаров, выбранных покупателем для покупки
 */
export class Basket {
    protected items: IProduct[] = [];

    /**
     * Получить массив товаров, находящихся в корзине
     * @returns копия массива товаров корзины
     */
    getItems(): IProduct[] {
        return [...this.items];
    }

    /**
     * Добавить товар в корзину
     * @param product - товар для добавления
     */
    addItem(product: IProduct): void {
        this.items.push(product);
    }

    /**
     * Удалить товар из корзины по его идентификатору
     * @param productId - идентификатор товара для удаления
     */
    removeItem(productId: string): void {
        this.items = this.items.filter(item => item.id !== productId);
    }

    /**
     * Очистить корзину от всех товаров
     */
    clear(): void {
        this.items = [];
    }

    /**
     * Получить общую стоимость всех товаров в корзине
     * Товары с price: null не учитываются в общей стоимости
     * @returns общая стоимость товаров
     */
    getTotalPrice(): number {
        return this.items.reduce((sum, item) => {
            return sum + (item.price ?? 0);
        }, 0);
    }

    /**
     * Получить количество товаров в корзине
     * @returns количество товаров
     */
    getCount(): number {
        return this.items.length;
    }

    /**
     * Проверить наличие товара в корзине по его идентификатору
     * @param productId - идентификатор товара для проверки
     * @returns true, если товар есть в корзине, иначе false
     */
    hasProduct(productId: string): boolean {
        return this.items.some(item => item.id === productId);
    }
}

