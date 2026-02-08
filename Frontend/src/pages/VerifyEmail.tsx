import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styles from './VerifyEmail.module.css';

export default function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('');
    const hasCalled = useRef(false);
    const isVerifying = useRef(false);

    useEffect(() => {
        if (hasCalled.current || isVerifying.current) {
            return;
        }

        const token = searchParams.get('token');
        
        if (!token) {
            setStatus('error');
            setMessage('No verification token found');
            hasCalled.current = true;
            return;
        }

        isVerifying.current = true;
        hasCalled.current = true;
        setMessage('Verifying your email...');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            if (isVerifying.current) {
                controller.abort();
            }
        }, 10000);

        fetch(`http://localhost:8080/api/auth/verify-email?token=${token}`, {
            method: 'GET',
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(async response => {
                if (!isVerifying.current)
                    return;
                
                const data = await response.json();
                
                if (response.ok) {
                    setStatus('success');
                    setMessage(data.message || 'Email verified successfully!');
                    setTimeout(() => navigate('/login'), 4000);
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Verification failed');
                }
            })
            .catch(error => {
                if (!isVerifying.current)
                    return;
                
                if (error.name === 'AbortError')
                    console.log('Request was aborted');
                else {
                    setStatus('error');
                    setMessage('Network error. Please check your connection.');
                }
            })
            .finally(() => {
                clearTimeout(timeoutId);
                isVerifying.current = false;
            });

        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

    const renderContent = () => {
        switch (status) {
            case 'verifying':
                return (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>{message}</p>
                    </div>
                );
            
            case 'success':
                return (
                    <div className={styles.success}>
                        <h3>Email Verified!</h3>
                        <p>{message}</p>
                        <p>Redirecting to login page...</p>
                    </div>
                );
            
            case 'error':
                return (
                    <div className={styles.error}>
                        <h3>Verification Failed</h3>
                        <p>{message}</p>
                        <div className={styles.buttonContainer}>
                            <button 
                                onClick={() => navigate('/register')}
                                className={styles.button}
                            >
                                Register Again
                            </button>
                            <button 
                                onClick={() => window.location.reload()}
                                className={`${styles.button} ${styles.secondary}`}
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                );
            
            default:
                return null;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2>Email Verification</h2>
                {renderContent()}
            </div>
        </div>
    );
}