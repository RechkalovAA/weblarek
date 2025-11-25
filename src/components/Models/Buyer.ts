import { IBuyer, TPayment } from '../../types/index';

/**
 * Тип для ошибок валидации данных покупателя
 * Ключами могут быть только поля интерфейса IBuyer
 */
type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

/**
 * Класс модели данных для хранения и валидации данных покупателя
 * Отвечает за хранение данных покупателя при оформлении заказа
 */
export class Buyer {
    protected payment: TPayment | null = null;
    protected address: string = '';
    protected email: string = '';
    protected phone: string = '';

    /**
     * Установить значение одного поля покупателя
     * Не затирает значения других полей
     * @param field - название поля для установки
     * @param value - значение для установки
     */
    setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
        switch (field) {
            case 'payment':
                this.payment = value as TPayment;
                break;
            case 'address':
                this.address = value as string;
                break;
            case 'email':
                this.email = value as string;
                break;
            case 'phone':
                this.phone = value as string;
                break;
        }
    }

    /**
     * Получить все данные покупателя
     * @returns объект с данными покупателя
     */
    getData(): Partial<IBuyer> {
        return {
            payment: this.payment ?? undefined,
            address: this.address,
            email: this.email,
            phone: this.phone
        };
    }

    /**
     * Очистить все данные покупателя
     */
    clear(): void {
        this.payment = null;
        this.address = '';
        this.email = '';
        this.phone = '';
    }

    /**
     * Валидация данных покупателя
     * Поле считается валидным, если оно не пустое
     * @returns объект с ошибками валидации (пустой объект = нет ошибок)
     */
    validate(): TBuyerErrors {
        const errors: TBuyerErrors = {};

        if (!this.payment) {
            errors.payment = 'Не выбран вид оплаты';
        }

        if (!this.address?.trim()) {
            errors.address = 'Укажите адрес доставки';
        }

        if (!this.email?.trim()) {
            errors.email = 'Укажите емэйл';
        }

        if (!this.phone?.trim()) {
            errors.phone = 'Укажите телефон';
        }

        return errors;
    }
}

