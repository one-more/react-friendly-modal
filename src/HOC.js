// @flow

import React, {PureComponent} from 'react';
import noop from 'lodash/noop';
import map from 'lodash/map';

type State = {
    children: any,
    styleName: string,
    onRequestClose: Function,
    className: string,
    style: Object,
    isOpen: boolean
};

export default function modalComponentHOC(subscribe: Function, initialProps: State) {
    return class ModalComponent extends PureComponent {
        constructor(props: Object, ctx: Object) {
            super(props, ctx);
            this.state = Object.assign(this.state, initialProps);
            subscribe(this.handleChanges);
        }

        handleChanges = (nextProps: State) => {
            this.setState(nextProps);
        };

        state: State = {
            children: null,
            styleName: '',
            onRequestClose: noop,
            className: '',
            style: {},
            isOpen: false
        };

        onContentClick = (e: SyntheticEvent) => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
        };

        render() {
            const {
                children, onRequestClose, style, isOpen
            } = this.state;
            const className = {
                modal: true,
                'modal--open': isOpen
            };
            return (
                <div
                    className={map(className, (v,k) => v ? k : undefined).join(' ')}
                >
                    <div
                        className="modal__overlay"
                    />
                    <div
                        className="modal__body"
                        style={style}
                        onClick={onRequestClose}
                    >
                        <div
                            className={`modal__content ${this.state.className}`}
                            onClick={this.onContentClick}
                        >
                            {children}
                        </div>
                    </div>
                </div>
            );
        }
    };
}
