// @flow

export type ModalProps = {
    parentSelector: string,
    isOpen: boolean,
    onRequestClose: Function,
    className: string,
    appSelector: string,
    style: Object,
    children?: any,
    animation: string,
    closeOnOverlayClick?: boolean
}
