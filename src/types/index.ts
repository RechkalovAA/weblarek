export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Тип способа оплаты
export type TPayment = 'card' | 'cash';

// Интерфейс товара
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

// Интерфейс покупателя
export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

// Ответ API со списком товаров
export interface IProductListResponse {
    total: number;
    items: IProduct[];
}

// Данные заказа для отправки на сервер
export interface IOrder extends IBuyer {
    total: number;
    items: string[]; // массив ID товаров
}

// Ответ сервера после оформления заказа
export interface IOrderResponse {
    id: string;
    total: number;
}
