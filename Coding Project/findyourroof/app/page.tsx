'use client';
import Button from './components/Button/button';
import Footer from './components/Footer/footer';
import HomepageCard from './components/HomepageCard/homepageCard';
import styles from './page.module.css';
import Carousel from './components/Carousel/carousel';
import React from 'react';
import Organizations from './nonprofit/organizations';
import Link from 'next/link';

export default function Home() {
    const handleClick = () => {
        // temporary
        console.log('Clicked!');
    };
    const carouselSlides = [
        {
            backgroundImage:
                'url(https://img.freepik.com/premium-photo/night-view-house-with-blue-windows-suburbs-city_124507-85076.jpg)',
            title: 'FIND YOUR HOME',
            subtitle: 'Safe and Affordable Housing Solutions',
            text: 'Explore a variety of housing options tailored to your needs. Our platform connects you with safe and affordable places to live, ensuring you find a home that fits your preferences and budget.',
        },
        {
            backgroundImage:
                'url(https://career4schoolleavers.files.wordpress.com/2023/04/dream-jobs-are-overrated.png?w=1024)',
            title: 'UNLOCK JOB OPPORTUNITIES',
            subtitle: 'Connecting Talent with Opportunities',
            text: 'Discover job opportunities tailored to your interests and skills. Our platform helps you navigate the job market, connecting you with employers seeking your unique talents. Start your journey to stable employment and a brighter future.',
        },
        {
            backgroundImage:
                'url(https://flowdog.io/wp-content/uploads/2021/11/System-DMS.png)',
            title: 'SECURE DOCUMENT MANAGEMENT',
            subtitle: 'Upload, Access, and Protect Your Documents',
            text: "Store your important documents securely in our database. Whether it's identification, certifications, or other essential papers, our platform allows you to manage and access your documents with confidence.",
        },
    ];

    return (
        <main className={styles.main}>
            <Carousel slides={carouselSlides} />
            <div className={styles.aboutContainer}>
                <p className="subheading"> --- WHO WE ARE ---</p>
                <h2 className="heading">ABOUT US</h2>
                <p className="subheading">
                    ____________________________________________
                </p>
                <p className={styles.bodyText}>
                    Welcome to FindYourRoof! We&apos;re dedicated to addressing
                    homelessness in the US by providing a comprehensive
                    solution. Our platform connects individuals with housing,
                    job opportunities, and mentorship, fostering sustainable
                    independence. By facilitating collaboration between
                    stakeholders, including employers and non-profits, we drive
                    lasting change. Join us in creating a future where everyone
                    has a place to call home. Together, we can make a
                    difference!
                </p>
                <Button onClick={handleClick}>Explore More</Button>
            </div>

            <p className="subheading"> --- NONPROFIT ORGANIZATIONS ---</p>
            <h2 className="heading">OUR PARTNERS</h2>
            <p className="subheading">
                ____________________________________________
            </p>
            <Organizations />

            <div className={styles.featuresContainer}>
                <p className="subheading"> --- HOW WE WORK ---</p>
                <h2 className="heading">SERVICES WE OFFER</h2>
                <p className="subheading">
                    ____________________________________________
                </p>

                <div className={styles.featuresGrid}>
                    <Link href="/housing">
                        <HomepageCard
                            imgLink="/houseIcon.png"
                            altText="House Icon Image"
                            title="Real-Time House Listings"
                            text="Search for safe and comfortable places to live that fits your needs, preferences, and budget in Chicago."
                            buttonVal="Learn More"
                        />
                    </Link>
                    <Link href="/job">
                        <HomepageCard
                            imgLink="/jobIcon.png"
                            altText="Job Icon Image"
                            title="Real-Time Job Listings"
                            text="Connect with job opportunities to help you secure stable employment in order to build a brighter future."
                            buttonVal="Learn More"
                        />
                    </Link>
                </div>
            </div>

            <Footer />
        </main>
    );
}
