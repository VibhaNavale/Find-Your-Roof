'use client';
import React from 'react';
import styles from './homepageCard.module.css';
import Button from '../Button/button';

interface HomepageCardProps {
    imgLink: string;
    title: string;
    text: string;
    buttonVal: string;
    altText: string;
}

const HomepageCard: React.FC<HomepageCardProps> = (content) => {
    const handleClick = () => {
        // temporary
        console.log('Clicked!');
    };

    return (
        <div className={styles.cardContainer}>
            <img
                className={styles.featuresImage}
                src={content.imgLink}
                alt={content.altText}
            ></img>
            <h2 className={styles.featuresHeading}>{content.title}</h2>
            <p className={styles.featuresText}>{content.text}</p>
            <Button onClick={handleClick}>{content.buttonVal}</Button>
        </div>
    );
};

export default HomepageCard;
