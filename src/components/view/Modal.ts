import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface ModalState {
    content: HTMLElement | null;
    open: boolean;
}

export class Modal extends Component<ModalState> {
    protected contentElement: HTMLElement;
    protected closeButton: HTMLButtonElement;
    private keydownHandler: ((event: KeyboardEvent) => void) | null = null;
    private isKeydownHandlerAttached: boolean = false;

    constructor(container: HTMLElement, private readonly events: IEvents) {
        super(container);
        this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

        this.closeButton.addEventListener('click', () => this.close());
        this.container.addEventListener('mousedown', (event: MouseEvent) => {
            if (event.target === this.container) {
                this.close();
            }
        });
        
        this.keydownHandler = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && this.container.classList.contains('modal_active')) {
                this.close();
            }
        };
    }

    set content(value: HTMLElement | null) {
        if (value && value.parentNode === this.contentElement) {
            // Элемент уже является дочерним - не пересоздаем его, чтобы избежать проблем со стилями и шрифтами
            return;
        }
        this.contentElement.replaceChildren(value ?? '');
    }

    set open(value: boolean) {
        this.container.classList.toggle('modal_active', value);
        if (this.keydownHandler) {
            if (value && !this.isKeydownHandlerAttached) {
                document.addEventListener('keydown', this.keydownHandler);
                this.isKeydownHandlerAttached = true;
            } else if (!value && this.isKeydownHandlerAttached) {
                document.removeEventListener('keydown', this.keydownHandler);
                this.isKeydownHandlerAttached = false;
            }
        }
    }

    close() {
        this.open = false;
        this.events.emit('modal:close');
    }
}
