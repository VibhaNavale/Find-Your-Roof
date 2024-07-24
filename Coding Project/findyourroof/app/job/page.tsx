import Footer from '../components/Footer/footer';
import { JobList } from './job';
import './job.css';

export default async function Job() {
    return (
        <div>
            <div className="root-container">
                {' '}
                <JobList />{' '}
            </div>
            <Footer />
        </div>
    );
}
