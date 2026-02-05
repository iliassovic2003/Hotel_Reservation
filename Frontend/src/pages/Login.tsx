import '../styles/global.css';
import LiquidEther from '../components/animations/LiquidEther';
import styles from './Login.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Login = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string): string => {
    if (!email)
      return '';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.includes('@'))
      return 'Email must contain @ symbol';
    if (!emailRegex.test(email))
      return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password: string): string => {
    if (!password)
        return '';
    if (password.length < 8)
        return 'Password must be at least 8 characters';
    return '';
  };

  useEffect(() => {
    const error = validateEmail(email);
    setEmailError(error);
  }, [email]);

  useEffect(() => {
    const error = validatePassword(password);
    setPasswordError(error);
  }, [password]);

  const isEmailValid = emailError === '';
  const isPasswordValid = passwordError === '';
  const isFormValid = isEmailValid && isPasswordValid && 
                      email.trim() !== '' && password.trim() !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      alert("Please enter your email and password");
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
          // place for remember me
        })
      });
      
      const data = await response.json();
      
      if (!response.ok)
      {
        if (response.status === 401)
          throw new Error('Invalid email or password');
        else if (response.status === 400)
          throw new Error(data.message || 'Invalid request');
        else
          throw new Error(data.message || `Login failed (${response.status})`);
      }
      
      console.log('Login successful:', data);
      
      if (data.token) {
          const storage = rememberMe ? localStorage : sessionStorage;
          storage.setItem('token', data.token);
          storage.setItem('user', JSON.stringify({
            userId: data.userId,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role
          }));
        }
      alert('Login successful!');
      
      if (data.role === 'ADMIN')
        navigate('/admin/dashboard');
      else
        navigate('/');
      
    } catch (error) {
        console.error('Login error:', error);
        alert(error instanceof Error ? error.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main>
        <div className={styles.login}>
          <Link to="/" className={styles.backButton}>
            <img src="./src/assets/icons/left-arrow.svg" className={styles.backIcon} />
            <span className={styles.backText}>Back to Home</span>
          </Link>
          <div className={styles.liquidBackground}>
            <LiquidEther
              colors={['#D4AF37', '#B8860B', '#8B0000', '#FFD700']}
              mouseForce={15}
              cursorSize={120}
              isViscous
              viscous={15}
              iterationsViscous={36}
              iterationsPoisson={36}
              resolution={0.35}
              isBounce={false}
              autoDemo={true}
              autoSpeed={0.4}
              autoIntensity={2.5}
              takeoverDuration={0.3}
              autoResumeDelay={2000}
              autoRampDuration={0.8}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                opacity: 0.75
              }}
            />
          </div>
          <div className={styles.info}>
            <div className={styles.logo}></div>
            <h2>Welcome Back</h2>
            <text>Plenty more destinations are waiting...</text>

            <div className={styles.bubble}>
              <img src="./src/assets/icons/verified_gold.svg" alt="Verified"/>
              <div className={styles.bubbleContent}>
                <div>Exclusivity</div>
                <text>We have exclusive rights to more rooms and offers than competition services.</text>
              </div>
            </div>

            <div className={styles.bubble}>
              <img src="./src/assets/icons/pleasure_gold.svg" alt="Pleasure"/>
              <div className={styles.bubbleContent}>
                <div>Pleasure</div>
                <text>100% guarantee service satisfaction.</text>
              </div>
            </div>

            <div className={styles.bubble}>
              <img src="./src/assets/icons/award_gold.svg" alt="Award"/>
              <div className={styles.bubbleContent}>
                <div>Loyalty points</div>
                <text>We offer out loyal clients loyalty points rewards that can be redeemed into free vacancy nights.</text>
              </div>
            </div>

          </div>
          <div className={styles.card}>
            <div className={styles.auth}>
              <text>Login with </text>
              <div className={styles.socialButtons}>
                <div className={styles.external}><img src="./src/assets/icons/google.svg" alt="Google"/></div>
                <div className={styles.external}><img src="./src/assets/icons/github.svg" alt="GitHub"/></div>
                <div className={styles.external}><img src="./src/assets/icons/gitlab.svg" alt="GitLab"/></div>
                <div className={styles.external}><img src="./src/assets/icons/twitter.svg" alt="Twitter"/></div>
              </div>
            </div>
            
            <div className={styles.credential}>
              <text>Or</text>
              <div className={styles.data} data-label="Email">
                <input 
                  type="email"
                  className={`${styles.inputing} ${emailError ? styles.inputError : ''}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {emailError && (
                  <div className={styles.emailError}>
                    {emailError}
                  </div>
                )}
              </div>
              <div className={styles.data} data-label="Password">
                <input 
                  type="password"
                  className={`${styles.inputing} ${passwordError ? styles.inputError : ''}`}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  minLength={8}
                  required
                />
                {passwordError && (
                  <div className={styles.emailError}>
                    {passwordError}
                  </div>
                )}
              </div>
              
              <div className={styles.options}>
                <label className={styles.rememberMe}>
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className={styles.rememberCheckbox}
                  />
                  <span className={styles.rememberText}>Remember me</span>
                </label>
                
                <Link to="/forgot-password" className={styles.forgotPassword}>
                  Forgot password?
                </Link>
              </div>
            </div>
            
            <div className={styles.buttonContainer}>
              <button 
                onClick={handleSubmit}
                className={`${styles.button} ${!isFormValid ? styles.buttonDisabled : ''}`}
                type="button"
                disabled={!isFormValid}
              >
                Sign In
              </button>
            </div>
            
            <div className={styles.change}>
              new user ? <Link to="/register">Sign up</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Login;