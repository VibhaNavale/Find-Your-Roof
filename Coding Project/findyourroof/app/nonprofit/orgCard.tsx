import React from 'react';
import styles from './orgCard.module.css';
import Button from '../components/Button/button';

interface CardProps {
    data: {
        name: string;
        pic: string;
        link: string;
        number: string;
        description: string;
    }[];
}

const Card: React.FC<CardProps> = ({ data }) => {
    return (
        <div className={styles.orgContainer}>
            {data.map(({ name, pic, link, number, description }, index) => (
                <div key={index} className={styles.orgWrapper}>
                    <div className={styles.centerDiv}>
                        <h1 className={styles.title}>{name}</h1>
                        <p className={styles.desc}>{'"' + description + '"'}</p>
                        <p className={styles.number}>{'Call Us: ' + number}</p>
                        <div className={styles.flexBox}>
                            <a href={link} target="_blank">
                                <Button>Learn More</Button>
                            </a>
                            <img
                                src={pic}
                                className={styles.image}
                                alt="Org Image"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Card;
