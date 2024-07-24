import React, { useState } from 'react';
import styles from './toggle.module.css';

interface ToggleProps {
    toggleTextLeft: string;
    toggleTextRight: string;
    onToggle: (selected: string) => void;
}

const Toggle: React.FC<ToggleProps> = ({
    toggleTextLeft,
    toggleTextRight,
    onToggle,
}) => {
    const [selected, setSelected] = useState(toggleTextLeft);

    const handleToggle = (option: string) => {
        setSelected(option);
        onToggle(option);
    };

    return (
        <div className={styles.toggleContainer}>
            <button
                className={`${styles.toggleLeft} ${selected === toggleTextLeft ? styles.active : ''}`}
                onClick={() => handleToggle(toggleTextLeft)}
            >
                {toggleTextLeft}
            </button>
            <button
                className={`${styles.toggleRight} ${selected === toggleTextRight ? styles.active : ''}`}
                onClick={() => handleToggle(toggleTextRight)}
            >
                {toggleTextRight}
            </button>
        </div>
    );
};

export default Toggle;
