'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './navbar.module.css';
import { SignUp } from '../../signup/signup';
import '../../signup/signup.css';
import supabase from '../../config/supabaseClient';

const NavBar: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMobile, setisMobile] = useState(0);
    const [user, setUser] = useState<any>(null); // Initialize user state as null

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const pathname = usePathname();
    const isRootPage = pathname === '/';

    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = await supabase.auth.getUser();
            setUser(currentUser);
        };
        fetchUser();
    }, []);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.log('Error while signing out: ', error.message);
        }
        window.location.href = window.location.href;
    };

    useEffect(() => {
        const handleResize = () => {
            setisMobile(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        // Initial window width
        setisMobile(window.innerWidth);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        const navList = document.getElementById('navList');
        if (navList != null) {
            if (!isMenuOpen) {
                navList.style.right = '0';
            } else {
                navList.style.right = '-100%';
            }
        }
    };

    return (
        <div
            className={`${styles.navContainer} ${isMobile < 1100 ? styles.mobileNavbar : isRootPage ? styles.absoluteNavbar : styles.fixedNavbar}`}
        >
            <Link href={'/'} className={styles.logo}>
                <img src="/logo.png" alt="FindYourRoof" />
            </Link>
            <div className={styles.mobileMenu} onClick={toggleMenu}>
                <div
                    className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <div id="navList" className={styles.navList}>
                <Link className={styles.navElem} href="/housing">
                    Housing
                </Link>
                <Link className={styles.navElem} href="/job">
                    Job
                </Link>
                <Link className={styles.navElem} href="/archives">
                    Archives
                </Link>
                {user?.data?.user ? ( // Check if user is logged in
                    <button className={styles.navElem} onClick={signOut}>
                        Sign Out
                    </button>
                ) : (
                    <button className={styles.navElem} onClick={openModal}>
                        Login/Sign Up
                    </button>
                )}
            </div>
            {isModalOpen && (
                <div className="modalOverlay">
                    <div className="modalContent">
                        <SignUp onClose={closeModal} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default NavBar;
