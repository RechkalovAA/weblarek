import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface ModalState {
    content: HTMLElement | null;
    open: boolean;
}

export class Modal extends Component<ModalState> {
    protected content: HTMLElement;
    protected closeButton: HTMLButtonElement;
    private keydownHandler: ((event: KeyboardEvent) => void) | null = null;
    private isKeydownHandlerAttached: boolean = false;

    constructor(container: HTMLElement, private readonly events: IEvents) {
        super(container);
        this.content = ensureElement<HTMLElement>('.modal__content', this.container);
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

    set contentNode(value: HTMLElement | null) {
        this.content.replaceChildren(value ?? '');
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

    render(data?: Partial<ModalState>): HTMLElement {
        if (data?.content !== undefined) {
            this.contentNode = data.content;
        }
        if (data?.open !== undefined) {
            this.open = data.open;
        }
        return super.render(data);
    }
}
