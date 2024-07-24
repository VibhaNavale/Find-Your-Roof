import React, { useEffect } from 'react';
import styles from './toast.module.css';
import { setTimeout } from 'timers';

interface ToastProps {
    text: string;
    setZeroResults: any;
    zeroResults: any;
}

const Toast: React.FC<ToastProps> = ({ text, setZeroResults, zeroResults }) => {
    useEffect(() => {
        if (zeroResults) {
            const removeToast = () => {
                setZeroResults(false);
            };

            const timeout = setTimeout(removeToast, 3000);

            () => clearTimeout(timeout);
        }
    }, [zeroResults]);

    return (
        <div className={styles['toast']}>
            <p>{text}</p>
        </div>
    );
};

export default Toast;
