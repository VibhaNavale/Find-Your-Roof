import React from 'react';
import styles from './card.module.css';

interface CardProps {
    children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
    return <div className={styles.container}>{children}</div>;
};

export default Card;
