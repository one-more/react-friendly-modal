import React from 'react';
import {mount} from 'enzyme';
import DOM from 'react-dom';
import Modal from './index';
import {activeModals} from './utils';

jest.mock('./HOC', () => (...args) => {
    expect(args).toEqual([
        expect.any(Function),
        {
            appSelector: 'body [data-reactroot]',
            parentSelector: 'body',
            isOpen: expect.any(Boolean),
            className: '',
            style: {
                width: 200
            },
            animation: '',
            isAnimated: false,
            styleName: 'test CN',
            children: <div>1</div>,
            onRequestClose: expect.any(Function)
        }
    ]);
    return require.requireActual('./HOC').default(...args);
});

describe('Modal', () => {
    const props = {
        appSelector: 'body [data-reactroot]',
        parentSelector: 'body',
        isOpen: true,
        className: 'test CN',
        animation: '',
        isAnimated: false,
        style: {
            width: 200
        }
    };

    it('initial rendering', () => {
        const spyQS = jest.spyOn(document, 'querySelector');
        const spyDOM = jest.spyOn(DOM, 'unmountComponentAtNode');
        const wrapper = mount(<Modal {...props} >
            <div>1</div>
        </Modal>);
        expect(spyQS).toHaveBeenCalledWith(props.parentSelector);

        wrapper.setProps({
            isOpen: false
        });
        expect(spyQS).toHaveBeenCalledWith(props.parentSelector);

        wrapper.unmount();
        expect(spyDOM).toHaveBeenCalled();
        // parent node was removed
        expect(document.body.innerHTML).toEqual('');

        wrapper.unmount();
    });

    it('on update', () => {
        const POSITION_FIXED = 'fixed';
        const root = document.createElement('div');
        root.id = 'root';
        root.setAttribute('data-reactroot', '');
        document.body.appendChild(root);
        const wrapper = mount(<Modal {...props} isOpen={false} >
            <div>1</div>
        </Modal>);
        expect(document.querySelector('#root').style.position).toEqual('');
        expect(document.documentElement.scrollTop).toEqual(0);

        const scrollTop = 123;
        document.documentElement.scrollTop = scrollTop;
        wrapper.setProps({
            isOpen: true
        });
        const app = document.querySelector('#root');
        expect(app.style.position).toEqual(POSITION_FIXED);
        expect(app.style.top).toEqual(`-${scrollTop}px`);

        wrapper.setProps({
            isOpen: false
        });
        expect(document.querySelector('#root').style.position).toEqual('');
        expect(document.documentElement.scrollTop).toEqual(scrollTop);

        const styleTop = 321;
        app.style.top = `${styleTop}px`;
        app.style.position = POSITION_FIXED;
        wrapper.setProps({
            isOpen: true
        });
        expect(app.style.top).toEqual(`-${styleTop}px`);

        wrapper.setProps({
            isOpen: false
        });
        expect(document.querySelector('#root').style.position).toEqual(POSITION_FIXED);
        expect(document.documentElement.scrollTop).toEqual(styleTop);

        wrapper.unmount();
    });

    it('close on esc', () => {
        const wrapper = mount(<Modal {...props} >
            <div>1</div>
        </Modal>);
        expect(activeModals.modals).toHaveLength(1);
        wrapper.unmount();
        expect(activeModals.modals).toHaveLength(0);

        const first = mount(<Modal
            {...props}
            isOpen={false}
            onRequestClose={() => first.setProps({isOpen: false})}
        >
            <div>1</div>
        </Modal>);
        expect(activeModals.modals).toHaveLength(0);
        first.setProps({
            isOpen: true
        });
        expect(activeModals.modals).toHaveLength(1);
        const second = mount(<Modal
            {...props}
            onRequestClose={() => second.setProps({isOpen: false})}
        >
            <div>1</div>
        </Modal>);
        expect(activeModals.modals).toHaveLength(2);

        const event = new window.KeyboardEvent('keydown', {
            keyCode: 27
        });
        document.dispatchEvent(event);
        expect(activeModals.modals).toHaveLength(1);
        document.dispatchEvent(event);
        expect(activeModals.modals).toHaveLength(0);
    });
});
