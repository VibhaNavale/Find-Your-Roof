'use client';
import React, { FC, useEffect, useState } from 'react';
import './signup.css';
import { Auth, ForgottenPassword } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import supabase from '../config/supabaseClient';

interface SignUpProps {
    onClose: () => void;
}

export const SignUp: FC<SignUpProps> = ({ onClose }) => {
    const [loginTop, setLoginTop] = useState<string>('87%');
    const [loginBorderRadius, setLoginBorderRadius] = useState<string>('300px');
    const [showForgottenPassword, setShowForgottenPassword] =
        useState<boolean>(false);

    useEffect(() => {
        const handleAuthStateChange = (event: string, session: any) => {
            if (event === 'SIGNED_IN') {
                handleSignIn(session.user);
            }
        };
        // Subscribe to the authentication state change event
        supabase.auth.onAuthStateChange(handleAuthStateChange);
    }, []);

    const openLogin = () => {
        setLoginTop('11%');
        setLoginBorderRadius('200px');
        setShowForgottenPassword(false);
    };

    const closeLogin = () => {
        setLoginTop('87%');
        setLoginBorderRadius('300px');
        setShowForgottenPassword(false);
    };

    const forgottenPassword = () => {
        setShowForgottenPassword(true);
    };

    const handleSignIn = (user: any) => {
        window.location.href = window.location.href;
        onClose();
    };

    return (
        <div className="signup-container">
            <div className="signup-section" id="signup-section">
                <header id="signup" onClick={closeLogin}>
                    Signup
                    <button className="close-button" onClick={onClose}>
                        X
                    </button>
                </header>
                <Auth
                    supabaseClient={supabase}
                    view="sign_up"
                    providers={[]}
                    localization={{
                        variables: {
                            sign_up: {
                                confirmation_text:
                                    'Sign up successful! You can now log in to your account.',
                                loading_button_label: 'Signing up...',
                            },
                        },
                    }}
                    appearance={{
                        theme: ThemeSupa,
                        className: {
                            button: 'supabase-auth-button',
                        },
                    }}
                    showLinks={false}
                />
                <div className="supabase-auth-anchor">
                    <a onClick={openLogin} className="signup">
                        Already have an account? Log in
                    </a>
                </div>
            </div>

            <div
                className="login-section"
                id="login-section"
                style={{ top: loginTop, borderRadius: loginBorderRadius }}
            >
                <header id="login" onClick={openLogin}>
                    Login
                </header>
                {showForgottenPassword ? (
                    <ForgottenPassword supabaseClient={supabase} />
                ) : (
                    <Auth
                        supabaseClient={supabase}
                        view="sign_in"
                        providers={[]}
                        localization={{
                            variables: {
                                sign_in: {
                                    button_label: 'Log in',
                                    loading_button_label: 'Logging in...',
                                },
                            },
                        }}
                        appearance={{
                            theme: ThemeSupa,
                            className: {
                                button: 'supabase-auth-button',
                            },
                        }}
                        showLinks={false}
                    />
                )}
                <div className="supabase-auth-anchor">
                    {!showForgottenPassword && (
                        <div>
                            <a onClick={forgottenPassword} className="login">
                                Forgot your password?
                            </a>
                            <a onClick={closeLogin} className="login">
                                Don&apos;t have an account? Sign up
                            </a>
                        </div>
                    )}
                    {showForgottenPassword && (
                        <a onClick={openLogin} className="login">
                            Back to Login
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};
