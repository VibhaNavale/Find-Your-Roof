import React, { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';
import './savedjobs.css';
import { User } from '@supabase/supabase-js';

interface Props {
    user: User;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    updateSavedJobsList: (jobID: string) => void;
}

interface SavedJob {
    jobID: string;
    userID: string;
    jobTitle: string;
    employerName: string;
    city: string;
    state: string;
    postedDate: Date;
}

const SavedJobs: React.FC<Props> = ({
    user,
    setIsModalOpen,
    updateSavedJobsList,
}) => {
    const [savedJobsList, setSavedJobsList] = useState<SavedJob[]>([]);
    const [isSavedJobsModalOpen, setIsSavedJobsModalOpen] = useState(true);
    const [loading, setLoading] = useState(true);

    const closeSavedJobsModal = () => {
        setIsSavedJobsModalOpen(false);
        setIsModalOpen(false);
    };

    const handleRemove = async (jobID: string) => {
        try {
            // Delete the job from the SavedJobsData table
            const { error } = await supabase
                .from('SavedJobsData')
                .delete()
                .eq('userID', user.id)
                .eq('jobID', jobID);

            if (error) {
                throw error;
            }

            setSavedJobsList(
                savedJobsList.filter((job) => job.jobID !== jobID)
            );
            updateSavedJobsList(jobID);
        } catch (error: any) {
            console.error('Error removing job:', error);
        }
    };

    useEffect(() => {
        const fetchSavedJobs = async () => {
            const userId = user.id;

            const { data: savedJobsData, error } = await supabase
                .from('SavedJobsData')
                .select('*')
                .eq('userID', userId)
                .order('saved_at', { ascending: false });

            if (error) {
                console.error('Error fetching saved jobs:', error.message);
                return;
            }

            if (savedJobsData) {
                // Fetch job information for each saved job
                const jobsPromises = savedJobsData.map(
                    async (savedJob: SavedJob) => {
                        const { data: jobData, error: jobError } =
                            await supabase
                                .from('JobData')
                                .select(
                                    'jobTitle, employerName, postedDate, city, state'
                                )
                                .eq('jobID', savedJob.jobID)
                                .single();

                        if (jobError) {
                            console.error(
                                'Error fetching job data:',
                                jobError.message
                            );
                            setLoading(false);
                            return null;
                        }

                        if (jobData) {
                            return {
                                ...savedJob,
                                jobTitle: jobData.jobTitle,
                                employerName: jobData.employerName,
                                postedDate: new Date(jobData.postedDate),
                                city: jobData.city,
                                state: jobData.state,
                            };
                        }

                        return null;
                    }
                );
                const resolvedJobs = await Promise.all(jobsPromises);

                // Filtering out null values (failed fetches) and update state
                setSavedJobsList(
                    resolvedJobs.filter(
                        (job): job is SavedJob => job !== null
                    ) as SavedJob[]
                );
                setLoading(false);
            }
        };

        fetchSavedJobs();
    }, [user.id, setIsModalOpen]);

    return (
        <div className="saved-jobs">
            {isSavedJobsModalOpen && (
                <div className="savedjobs-modal-overlay">
                    {loading ? (
                        <div className="loading">
                            <div className="lds-ripple">
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                    ) : (
                        <div className="savedjobs-modal-content">
                            <div className="savedjobs-header">
                                <h1>Your Saved Jobs</h1>
                                <button
                                    className="savedjobs-close-button"
                                    onClick={closeSavedJobsModal}
                                >
                                    X
                                </button>
                            </div>
                            <div className="jobs-list">
                                {savedJobsList.map((job, index) => (
                                    <div key={index} className="job-item">
                                        <h2>{job.jobTitle}</h2>
                                        <h3>{job.employerName}</h3>
                                        <h3 className="light-font">
                                            {job.city}, {job.state}
                                        </h3>
                                        <h3 className="light-font">
                                            {job.postedDate.toLocaleString(
                                                'en-US',
                                                {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                }
                                            )}
                                        </h3>
                                        <button
                                            onClick={() =>
                                                handleRemove(job.jobID)
                                            }
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SavedJobs;
