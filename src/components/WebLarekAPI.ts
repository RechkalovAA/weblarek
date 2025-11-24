import { IApi, IProduct, IProductListResponse, IOrder, IOrderResponse } from '../types/index';

/**
 * Класс для взаимодействия с API сервера "Веб-Ларёк"
 * Использует композицию с базовым классом Api для выполнения HTTP запросов
 */
export class WebLarekAPI {
    private api: IApi;

    /**
     * Конструктор класса
     * @param api - экземпляр класса, реализующего интерфейс IApi
     */
    constructor(api: IApi) {
        this.api = api;
    }

    /**
     * Получить список товаров с сервера
     * Выполняет GET запрос на эндпоинт /product/
     * @returns промис с массивом товаров
     */
    getProductList(): Promise<IProduct[]> {
        return this.api.get<IProductListResponse>('/product/')
            .then(response => response.items);
    }

    /**
     * Отправить заказ на сервер
     * Выполняет POST запрос на эндпоинт /order
     * @param order - данные заказа для отправки
     * @returns промис с ответом сервера
     */
    orderProducts(order: IOrder): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>('/order', order);
    }
}

