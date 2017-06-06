import React from 'react';
import {mount} from 'enzyme';
import HOC from './HOC';

let updateComponent = null;
const onRequestClose = jest.fn();
const style = {
    textAlign: 'center'
};
const className = 'testCN';
const styleName = 'modal';
const initialProps = {
    children: <div>
        <div id="1">1</div>
        <div id="2">2</div>
        <div id="3">3</div>
    </div>,
    styleName,
    onRequestClose,
    className,
    style
};
const Component = HOC(onChange => (updateComponent = onChange), initialProps);

describe('Modal HOC', () => {
    it('initial rendering', () => {
        const wrapper = mount(<Component />);
        for (let i = 1; i < 4; i += 1) {
            expect(wrapper.find(`#${i}`)).toHaveLength(1);
        }
        expect(wrapper.find('.modal__content').props().className).toContain(className);
        expect(wrapper.find('.modal__body').props().style).toEqual(style);
        wrapper.find('.modal__body').simulate('click');
        expect(onRequestClose).toHaveBeenCalled();

        updateComponent({
            children: <div>
                <div id="4">4</div>
            </div>
        });
        expect(wrapper.find('#4')).toHaveLength(1);
        for (let i = 1; i < 4; i += 1) {
            expect(wrapper.find(`#${i}`)).toHaveLength(0);
        }
    });
});
