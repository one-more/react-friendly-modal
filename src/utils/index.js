// @flow

import type {ModalProps} from '../types/ModalProps';

type Modal = {
    props: ModalProps
}

export const activeModals = {
    modals: [],

    isActive(modal: Modal) {
        return modal.props.isOpen;
    },

    pushIfActive(modal: Modal) {
        if (this.isActive(modal)) {
            this.modals.push(modal);
        }
    },

    toggle(modal: Modal) {
        if (this.isActive(modal)) {
            this.pop(modal);
        } else {
            this.modals.push(modal);
        }
    },

    pop(modal: Modal) {
        this.modals = this.modals.filter(el => modal !== el);
    },

    isOnTop(modal: Modal) {
        return this.modals.slice(-1)[0] === modal;
    }
};
