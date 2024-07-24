import Card from './orgCard';
import styles from './organization.module.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { orgs } from './data';

export default function Organizations() {
    return (
        <div className={styles.container} style={{ overflowX: 'auto' }}>
            <PerfectScrollbar
                className={styles.wrapperContainer}
                options={{ suppressScrollX: true, suppressScrollY: false }}
            >
                <div className={styles.wrapper}>
                    <Card data={orgs} />
                    {/* <Card data={orgs}/> */}
                </div>
            </PerfectScrollbar>
        </div>
    );
}
