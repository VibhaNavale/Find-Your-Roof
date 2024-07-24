'use client';
import { useEffect, useState } from 'react';
import './page.css';
import { DocStorage } from './docStorage';
import Toggle from '../components/Toggle/toggle';
import supabase from '../config/supabaseClient';
import ArchivesSavedJobs from './archivesSavedJobs';
import Footer from '../components/Footer/footer';

export default function Archives() {
    const [selectedToggle, setSelectedToggle] = useState<String>('Documents');
    const [user, setUser] = useState<any>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const {
                    data: { user },
                } = await supabase.auth.getUser();
                if (user !== null) {
                    setUser(user);
                }
            } catch (e) {
                console.log('Error fetching user details: ', e);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    return (
        <>
            <div className="archives-container">
                {JSON.stringify(user) !== '{}' ? (
                    <>
                        <Toggle
                            toggleTextLeft={'Documents'}
                            toggleTextRight={'Saved Jobs'}
                            onToggle={(selected: string): void => {
                                setSelectedToggle(selected);
                            }}
                        />
                        {loading ? (
                            <div className="loading">
                                <div className="lds-ripple">
                                    <div></div>
                                    <div></div>
                                </div>
                            </div>
                        ) : selectedToggle === 'Documents' ? (
                            <DocStorage userId={user.id} />
                        ) : (
                            <ArchivesSavedJobs userId={user.id} />
                        )}
                    </>
                ) : (
                    <div className="authentication-message">
                        Please Sign Up or Log In to access this page.
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}
