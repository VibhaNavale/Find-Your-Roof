import React from 'react';
import styles from './button.module.css';

//
//  ----- NOTE FOR BUTTON USE -----
//  When using the onClick property, where you
//  define the eventHandler, add the line to the
//  top of the file:
//  "use client";
//  NEXT13 is set to server by default, so it will
//  not look at what the client enters. The line above
//  overrides this default allowing the user to interact
//  with the button.
//

interface ButtonProps {
    children: string;
    onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
    return (
        <div className={styles.buttonContainer}>
            <button className={styles.button} onClick={onClick}>
                {children}
            </button>
        </div>
    );
};

export default Button;
