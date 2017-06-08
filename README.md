# react-friendly-modal

modal component for react

## install

````
npm i -S react-friendly-modal 
````

## demo
[link](https://one-more.github.io/react-friendly-modal/)

## usage
````jsx harmony
import Modal from 'react-friendly-modal';

<Modal 
    isOpen="true"
    onRequestClose={onClose}
>
    <div>
        modal content
    </div>
</Modal>     
````

## props
| name | default value |
|------|---------------|
| isOpen | false|
| onRequestClose | empty function |
| className | empty string |
| appSelector | body [data-reactroot] |
| style | {} |
| parentSelector | body |
| overlayProps | {} |
