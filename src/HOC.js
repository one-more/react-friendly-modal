// @flow

import React, {PureComponent} from 'react';
import noop from 'lodash/noop';
import styled, {keyframes} from 'styled-components';
import StateMachine from 'javascript-state-machine';
import ContextTypes from './types/contextTypes';

const animations = {
    rightToLeft: 'right-to-left'
};

const states = {
    requestOpen: 'requestOpen',
    open: 'open',
    requestClose: 'requestClose',
    close: 'close'
};

const rightToLeftTranslates = {
    from: 'translateX(100%)',
    to: 'translateX(0)'
};

type State = {
    children: any,
    onRequestClose: Function,
    className: string,
    style: Object,
    isOpen: boolean,
    animation: string,
    state?: string,
    closeOnOverlayClick?: boolean
};

export default function modalComponentHOC(subscribe: Function, initialProps: State) {
    return class extends PureComponent {
        static defaultProps = {
            className: ''
        };

        static childContextTypes = ContextTypes;

        getChildContext() {
            return {
                closeModal: this.state.onRequestClose
            };
        }

        mapCloseToNextState = () => {
            const {animation} = this.state;
            return animation ? states.requestOpen : states.open;
        };

        mapOpenToNextState = () => {
            const {animation} = this.state;
            return animation ? states.requestClose : states.close;
        };

        stateMachine: Object = new StateMachine({
            init: states.close,
            transitions: [
                {name: 'next', from: states.close, to: this.mapCloseToNextState},
                {name: 'next', from: states.requestOpen, to: states.open},
                {name: 'next', from: states.open, to: this.mapOpenToNextState},
                {name: 'next', from: states.requestClose, to: states.close}
            ]
        });

        constructor(props: Object, ctx: Object) {
            super(props, ctx);
            this.state = Object.assign(this.state, initialProps);
            subscribe(this.handleChanges);
        }

        state: State = {
            elementStyleName: noop,
            children: null,
            onRequestClose: noop,
            className: '',
            style: {},
            isOpen: false,
            animation: '',
            state: this.stateMachine.state,
            closeOnOverlayClick: false
        };

        onContentClick = (e: SyntheticEvent) => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
        };

        handleChanges = (nextProps: State) => {
            const {isOpen} = this.state;
            const {isOpen: nextIsOpen} = nextProps;
            if (isOpen !== nextIsOpen) {
                this.nextState();
            }
            this.setState(nextProps);
        };

        nextState = () => {
            const {stateMachine} = this;
            stateMachine.next();
            this.setState({
                state: stateMachine.state
            });
        };

        render() {
            const {
                children,
                onRequestClose,
                style,
                animation,
                state,
                closeOnOverlayClick,
                className,
                isOpen
            } = this.state;

            return (
                <Modal
                    state={state}
                    data-selenium="modal"
                >
                    <ModalOverlay
                        data-selenium="modal-overlay"
                    />
                    <ModalBody
                        data-selenium="modal-body"
                        onClick={closeOnOverlayClick ? onRequestClose : noop}
                    >
                        <ModalContent
                            className={className}
                            style={style}
                            data-selenium="modal-content"
                            onClick={this.onContentClick}
                            animation={animation}
                            state={state}
                            onAnimationEnd={this.nextState}
                        >
                            {isOpen && children}
                        </ModalContent>
                    </ModalBody>
                </Modal>
            );
        }
    };
}

const Modal = styled.div`
    display: ${props => (props.state === states.close ? 'none' : 'table')};
    height: 100%;
    left: 0;
    position: absolute;
    right: 0;
    table-layout: fixed;
    top: 0;
    width: 100%;
    z-index: 120;
`;
const ModalOverlay = styled.div`
    background-color: rgba(0, 0, 0, 0.4);
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
`;
const ModalBody = styled.div`
    display: table-cell;
    margin-bottom: 20px;
    padding: 24px 0;
    position: relative;
    text-align: center;
    vertical-align: middle;
    width: 100%;
`;
const ModalContent = styled.div`
    background: #fff;
    border-radius: 2px;
    display: inline-block;
    min-height: 150px;
    min-width: 200px;
    ${props => mapAnimationToStyles(props.state, props.animation)}
`;

function mapAnimationToStyles(state: string, animation: string) {
    switch (animation) {
        case animations.rightToLeft:
            // $FlowIgnore
            return `
                bottom: 0;
                overflow: auto;
                position: fixed;
                right: 0;
                top: 0;
                transform: ${mapStateToTransform(state)};
                animation: ${mapStateToAnimation(state, animation)} .5s linear;
                
                @media screen and (max-width: 600px) {
                    left: 0;
                }
                
                @media print {
                    left: 0;
                    overflow: visible;
                }
            `;
        default:
            return '';
    }
}

function mapStateToTransform(state: string) {
    switch (state) {
        case states.open:
            return rightToLeftTranslates.to;
        case states.close:
            return rightToLeftTranslates.from;
        default:
            return undefined;
    }
}

function mapStateToAnimation(state: string, animation: string) {
    switch (state) {
        case states.requestOpen:
            return mapAnimationToKeyFrame(animation, true);
        case states.requestClose:
            return mapAnimationToKeyFrame(animation, false);
        default:
            return undefined;
    }
}

const RightToLeftKeyFrameOpen = keyframes`
    from {
        transform: ${rightToLeftTranslates.from};
    }
    
    to {
        transform: ${rightToLeftTranslates.to};
    }
`;

const RightToLeftKeyFrameClose = keyframes`
    from {
        transform: ${rightToLeftTranslates.to};
    }
    
    to {
        transform: ${rightToLeftTranslates.from};
    }
`;

function mapAnimationToKeyFrame(animation: string, open: boolean) {
    switch (animation) {
        case animations.rightToLeft:
            return open ? RightToLeftKeyFrameOpen : RightToLeftKeyFrameClose;
        default:
            return undefined;
    }
}

