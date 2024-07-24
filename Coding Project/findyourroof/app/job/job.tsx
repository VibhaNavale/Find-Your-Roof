'use client';
import React, { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';
import './job.css';
import Button from '../components/Button/button';
import { SearchWrapper } from './SearchWrapper';
import {
    JobDataLS,
    SearchDataType,
    constructSearchParameters,
    filterSearchResultsOnQuery,
} from '../util/model';
import Toast from '../components/Toast/toast';
import { SignUp } from '../signup/signup';
import SavedJobs from './savedjobs';

interface SavedJob {
    jobID: string;
    userID: string;
    jobTitle: string;
    employerName: string;
    city: string;
    state: string;
    postedDate: Date;
}

export const JobList: React.FC = () => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [selectedJob, setSelectedJob] = useState<any>(null);
    const [displayedJobs, setDisplayedJobs] = useState<any[]>([]);
    const jobsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [clickedNum, setClickedNum] = useState(-1);
    const [zeroResults, setZeroResults] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState<any>({});
    const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
    const [jobAlreadySaved, setJobAlreadySaved] = useState(false);

    const openModal = async () => {
        setIsModalOpen(true);

        if (!jobAlreadySaved) {
            saveJobToDatabase();
        } else {
            unsaveJobFromDatabase();
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        const fetchUser = async () => {
            const user = await supabase.auth.getUser();
            setUser(user);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 4000);
    }, []);

    useEffect(() => {
        document.addEventListener(JobDataLS, (e: any) => {
            const prepQuery = constructSearchParameters(
                e.detail.searchQuery,
                'job-filters',
                SearchDataType.JobDataLS
            );
            let cur = filterSearchResultsOnQuery(prepQuery);

            if (cur.length === 0) {
                setZeroResults(true);
            } else {
                setJobs(cur);
                setDisplayedJobs(cur.slice(0, jobsPerPage));
                const totalPages = Math.ceil(cur.length / jobsPerPage);
                setTotalPages(totalPages);
                setCurrentPage(0);
                setClickedNum(-1);
                setSelectedJob(null);
            }
        });

        const getJobData = async () => {
            let { data, error } = await supabase.from('JobData').select('*');

            if (error != null) {
                console.log('Failed to fetch Job Data from Supabase');
                return;
            }

            if (data) {
                setClickedNum(-1);
                setSelectedJob(null);
                localStorage?.setItem(JobDataLS, JSON.stringify(data)!);
                setJobs(data);
                setDisplayedJobs(data.slice(0, jobsPerPage));
                setTotalPages(Math.ceil(data.length / jobsPerPage));
            }
        };
        getJobData();
    }, []);

    useEffect(() => {
        const fetchSavedJobs = async () => {
            const { data: savedJobsData, error } = await supabase
                .from('SavedJobsData')
                .select('*')
                .eq('userID', user?.data?.user?.id)
                .order('saved_at', { ascending: false });

            if (error) {
                console.error('Error fetching saved jobs:', error.message);
                return;
            }
            setSavedJobs(savedJobsData);
        };

        fetchSavedJobs();
    }, [user?.data?.user?.id]);

    useEffect(() => {
        const isJobAlreadySaved = savedJobs.some(
            (job) => job.jobID === selectedJob?.jobID
        );
        setJobAlreadySaved(isJobAlreadySaved);
    }, [savedJobs, selectedJob]);

    const jobClickHandler = (key: number) => {
        setSelectedJob(displayedJobs[key]);
        setClickedNum(key);
        // Mobile View Logic
        const details = document.getElementById('job-details');
        const list = document.getElementById('job-listings');
        if (window.innerWidth < 1100 && details != null && list != null) {
            details.style.display = 'block';
            list.style.display = 'none';
        }
    };

    const exitClickHandler = () => {
        const details = document.getElementById('job-details');
        const list = document.getElementById('job-listings');
        if (window.innerWidth < 1100 && details != null && list != null) {
            details.style.display = 'none';
            list.style.display = 'block';
        }
    };

    useEffect(() => {
        // Function to update window width state
        const updateWindowWidth = () => {
            const details = document.getElementById('job-details');
            const list = document.getElementById('job-listings');
            if (window.innerWidth > 1100 && details != null && list != null) {
                details.style.display = 'block';
                list.style.display = 'block';
            } else if (
                window.innerWidth < 1100 &&
                details != null &&
                list != null
            ) {
                details.style.display = 'none'; // Mobile View
                list.style.display = 'block';
            }
        };
        window.addEventListener('resize', updateWindowWidth);

        return () => {
            window.removeEventListener('resize', updateWindowWidth);
        };
    }, []);

    const nextPage = () => {
        if (currentPage + 1 < totalPages) {
            setCurrentPage((prev) => prev + 1);
            updateDisplay(1);
        }
    };

    const backPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prev) => prev - 1);
            updateDisplay(-1);
        }
    };

    // updates the jobs displayed
    const updateDisplay = (num: number) => {
        let startIndex = (currentPage + num) * jobsPerPage;
        setDisplayedJobs(jobs.slice(startIndex, startIndex + jobsPerPage));
        setSelectedJob(jobs[startIndex]);
        setClickedNum(0);
    };

    // Save the selected job to the database
    const saveJobToDatabase = async () => {
        try {
            const { data, error } = await supabase
                .from('SavedJobsData')
                .insert([
                    {
                        userID: user.data.user.id,
                        jobID: selectedJob?.jobID,
                    },
                ]);

            if (error) {
                throw error;
            }
            setSavedJobs([...savedJobs, selectedJob]);
            setJobAlreadySaved(true);
        } catch (error: any) {
            console.error('Error saving job:', error.message);
        }
    };

    // Unsave the selected job from the database
    const unsaveJobFromDatabase = async () => {
        try {
            const { data, error } = await supabase
                .from('SavedJobsData')
                .delete()
                .eq('userID', user.data.user.id)
                .eq('jobID', selectedJob?.jobID);

            if (error) {
                throw error;
            }
            updateSavedJobsList(selectedJob?.jobID);
            setJobAlreadySaved(false);
        } catch (error: any) {
            console.error('Error unsaving job:', error);
        }
    };

    const updateSavedJobsList = (jobID: string) => {
        setSavedJobs(savedJobs.filter((job) => job.jobID !== jobID));
    };

    const showSelectedJob = (): JSX.Element => {
        return selectedJob ? (
            <>
                <img
                    src={
                        selectedJob.employer_logo
                            ? selectedJob.employer_logo
                            : 'default_logo.jpg'
                    }
                    alt="Employer Logo"
                    className="detail-img"
                />
                <p className="job-title-detail">{selectedJob.jobTitle}</p>

                <div className="grid-3">
                    <p className="job-employer-detail">
                        {selectedJob.employerName}
                    </p>
                    <p className="job-employer-detail">
                        {selectedJob.city}, {selectedJob.state}
                    </p>
                    <p className="job-employer-detail">
                        {Math.floor(Math.random() * (50 - 5) + 5)} applicants
                    </p>
                </div>
                <div className="grid-2">
                    <a
                        className="job-link"
                        href={selectedJob.applyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button>Apply</Button>
                    </a>
                    <Button onClick={openModal}>
                        {jobAlreadySaved ? 'Unsave' : 'Save'}
                    </Button>
                </div>
                <div className="grid-2">
                    <div>
                        {selectedJob.occupationType && (
                            <p className="job-info">
                                <span className="bold-span">Occ. Type</span>{' '}
                                {selectedJob.occupationType}
                            </p>
                        )}
                        <p className="job-info">
                            <span className="bold-span">Emp. Type</span>{' '}
                            {selectedJob.employmentType}
                        </p>
                    </div>
                    <p className="job-info">
                        <span className="bold-span">Posted</span>{' '}
                        {selectedJob.postedDate
                            ? selectedJob.postedDate.substring(0, 10)
                            : 'Not stated'}
                    </p>
                </div>
                {selectedJob.desc && (
                    <div>
                        <h2>Description</h2>
                        <p className="job-info">{selectedJob.desc}</p>
                    </div>
                )}

                {selectedJob.resp && (
                    <div>
                        <h2>Responsibilities</h2>
                        <p className="job-info">{selectedJob.resp}</p>
                    </div>
                )}

                {selectedJob.qual && (
                    <div>
                        <h2>Qualifications</h2>
                        <p className="job-info">{selectedJob.qual}</p>
                    </div>
                )}

                {selectedJob.benefits && (
                    <div>
                        <h2>Perks & Benefits</h2>
                        <p className="job-info">{selectedJob.benefits}</p>
                    </div>
                )}
                <a
                    className="job-link"
                    href={selectedJob.employerWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button>Learn More</Button>
                </a>
            </>
        ) : (
            <>
                <div className="select-a-job">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        fill="#000000"
                        viewBox="0 0 256 256"
                    >
                        <path d="M196,88a27.86,27.86,0,0,0-13.35,3.39A28,28,0,0,0,144,74.7V44a28,28,0,0,0-56,0v80l-3.82-6.13A28,28,0,0,0,35.73,146l4.67,8.23C74.81,214.89,89.05,240,136,240a88.1,88.1,0,0,0,88-88V116A28,28,0,0,0,196,88Zm12,64a72.08,72.08,0,0,1-72,72c-37.63,0-47.84-18-81.68-77.68l-4.69-8.27,0-.05A12,12,0,0,1,54,121.61a11.88,11.88,0,0,1,6-1.6,12,12,0,0,1,10.41,6,1.76,1.76,0,0,0,.14.23l18.67,30A8,8,0,0,0,104,152V44a12,12,0,0,1,24,0v68a8,8,0,0,0,16,0V100a12,12,0,0,1,24,0v20a8,8,0,0,0,16,0v-4a12,12,0,0,1,24,0Z"></path>
                    </svg>
                    <p className="">Select a job!</p>
                </div>
            </>
        );
    };

    return (
        <div className="container">
            <SearchWrapper searchFor={'jobs'} />
            {zeroResults ? (
                <Toast
                    text="No results found. Please try a different query!"
                    setZeroResults={setZeroResults}
                    zeroResults={zeroResults}
                />
            ) : (
                <></>
            )}
            {loading ? (
                <div className="loading">
                    <div className="lds-ripple">
                        <div></div>
                        <div></div>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="job-container">
                        <div className="job-listings" id="job-listings">
                            <ul>
                                {displayedJobs.map((job, key) => {
                                    return (
                                        <li
                                            onClick={() => jobClickHandler(key)}
                                            key={key}
                                            className="job-item"
                                            style={{
                                                backgroundColor:
                                                    clickedNum === key
                                                        ? 'lightblue'
                                                        : 'white',
                                            }}
                                        >
                                            <div className="jobHeader">
                                                <img
                                                    src={
                                                        job.employer_logo
                                                            ? job.employer_logo
                                                            : 'default_logo.jpg'
                                                    }
                                                    alt="Employer Logo"
                                                    style={{
                                                        width: '90%',
                                                        display: 'block',
                                                        margin: 'auto',
                                                    }}
                                                />
                                                <div>
                                                    <p className="job-title">
                                                        {job.jobTitle}
                                                    </p>
                                                    <p className="job-employer">
                                                        {job.employerName}
                                                    </p>
                                                    <p className="job-info">
                                                        {job.city}, {job.state}
                                                    </p>
                                                    <p className="job-info">
                                                        Posted:{' '}
                                                        {job.postedDate.substring(
                                                            0,
                                                            10
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                        <div className="job-details" id="job-details">
                            <button
                                className="mobile-exit"
                                onClick={() => exitClickHandler()}
                            >
                                ×
                            </button>
                            {showSelectedJob()}
                        </div>
                    </div>
                    <div className="grid-3 pageDiv">
                        <span className="job-arrow" onClick={backPage}>
                            &larr;
                        </span>
                        <p className="job-info">
                            <span className="bold-span">Page:</span>{' '}
                            {currentPage + 1} of {totalPages}
                        </p>
                        <span className="job-arrow" onClick={nextPage}>
                            &rarr;
                        </span>
                    </div>
                </div>
            )}
            {isModalOpen && user.data.user == null && (
                <div className="modalOverlay">
                    <div className="modalContent">
                        <SignUp onClose={closeModal} />
                    </div>
                </div>
            )}
            {isModalOpen && user.data.user !== null && (
                <SavedJobs
                    user={user.data.user}
                    setIsModalOpen={setIsModalOpen}
                    updateSavedJobsList={updateSavedJobsList}
                />
            )}
        </div>
    );
};

export default JobList;
