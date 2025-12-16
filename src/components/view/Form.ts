import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface FormState {
    valid?: boolean;
    errors?: string;
}

export abstract class Form<T extends FormState> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(container: HTMLElement, protected readonly events: IEvents) {
        super(container);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
        this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
        });
    }

    set valid(value: boolean | undefined) {
        if (value !== undefined) {
            this.submitButton.disabled = !value;
        }
    }

    set errors(value: string | undefined) {
        if (value !== undefined) {
            this.errorsElement.textContent = value;
        }
    }
}

