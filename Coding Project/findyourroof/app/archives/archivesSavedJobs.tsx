'use client';
import React, { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';
import './archivesSavedJobs.css';

interface ArchivesSavedJobsProps {
    userId: String;
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

const ArchivesSavedJobs: React.FC<ArchivesSavedJobsProps> = ({ userId }) => {
    const [savedJobsList, setSavedJobsList] = useState<SavedJob[]>([]);

    useEffect(() => {
        const fetchSavedJobs = async () => {
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
                const jobsPromises = savedJobsData.map(
                    async (savedJob: SavedJob) => {
                        const { data: jobData, error: jobError } =
                            await supabase
                                .from('JobData')
                                .select('jobTitle, employerName')
                                .eq('jobID', savedJob.jobID)
                                .single();

                        if (jobError) {
                            console.error(
                                'Error fetching job data:',
                                jobError.message
                            );
                            return null;
                        }

                        if (jobData) {
                            return {
                                ...savedJob,
                                jobTitle: jobData.jobTitle,
                                employerName: jobData.employerName,
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
            }
        };

        fetchSavedJobs();
    }, [userId]);

    const handleRemove = async (jobID: string) => {
        try {
            // Delete the job from the SavedJobsData table
            const { error } = await supabase
                .from('SavedJobsData')
                .delete()
                .eq('userID', userId)
                .eq('jobID', jobID);

            if (error) {
                throw error;
            }

            setSavedJobsList(
                savedJobsList.filter((job) => job.jobID !== jobID)
            );
        } catch (error: any) {
            console.error('Error removing job:', error);
        }
    };

    return (
        <div className="archives-table-container">
            <h1>Your Saved Jobs</h1>
            <table className="archives-table">
                <thead>
                    <tr>
                        <th>Job Title</th>
                        <th>Company Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {savedJobsList.map((job, index) => (
                        <tr
                            key={index}
                            className={index % 2 === 0 ? 'even-row' : 'odd-row'}
                        >
                            <td>{job.jobTitle}</td>
                            <td>{job.employerName}</td>
                            <td>
                                <button onClick={() => handleRemove(job.jobID)}>
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ArchivesSavedJobs;
