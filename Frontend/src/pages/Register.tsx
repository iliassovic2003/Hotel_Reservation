import '../styles/global.css';
import LiquidEther from '../components/animations/LiquidEther';
import styles from './Register.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Register = () => {
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
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

    const validatePassword = (pass: string) => {
        const errors = [];
        
        if (pass.length < 8)
            errors.push('At least 8 characters');
        if (!/[A-Z]/.test(pass))
            errors.push('At least one uppercase letter');
        if (!/[a-z]/.test(pass))
            errors.push('At least one lowercase letter');
        if (!/\d/.test(pass))
            errors.push('At least one number');
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass))
            errors.push('At least one special character');
        return errors;
    };

    useEffect(() => {
      if (email) {
        const error = validateEmail(email);
        setEmailError(error);
      } else
        setEmailError('');
    }, [email]);

    useEffect(() => {
        if (password)
            setPasswordErrors(validatePassword(password));
        else
            setPasswordErrors([]);
    }, [password]);

    const isPasswordValid = passwordErrors.length === 0;
    const passwordsMatch = password === password2;
    const isEmailValid = emailError === '';
    const isFormValid = isEmailValid && isPasswordValid && passwordsMatch && agreeTerms && 
                    fname.trim() !== '' && lname.trim() !== '' && 
                    email.trim() !== '' && password.trim() !== '' && 
                    password2.trim() !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      alert("Please Fill With Valid Values.");
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fname: fname,
          lname: lname,
          email: email,
          password: password,
          password2: password2
        })
      });
      
      const data = await response.json();
      
      if (!response.ok)
      {
        if (response.status === 401)
          throw new Error('Invalid Information');
        else if (response.status === 400)
          throw new Error(data.message || 'Invalid request');
        else
          throw new Error(data.message || `Register failed (${response.status})`);
      }
      
      console.log('Register successful:', data);
      
      alert('Register successful!');
      
      if (data.role === 'ADMIN')
        navigate('/admin/dashboard');
      else
        navigate('/');
      
    } catch (error) {
        console.error('Register error:', error);
        alert(error instanceof Error ? error.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

    return (
        <>
          <main>
            <div className={styles.register}>
              <Link to="/" className={styles.backButton}>
                <img src="./src/assets/icons/left-arrow.svg" className={styles.backIcon} />
                <span className={styles.backText}>Back to Home</span>
              </Link>
            <div className={styles.liquidBackground}>
              <LiquidEther
                colors={['#5C0000', '#7A0000', '#8B0000', '#A30000']}
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
                  <h2>One more step...</h2>
                  <text>Why creating an account ?</text>

                  <div className={styles.bubble}>
                    <img src="./src/assets/icons/verified_crimson.svg" alt="Verified"/>
                    <div className={styles.bubbleContent}>
                      <div>Exclusivity</div>
                      <text>We have exclusive rights to more rooms and offers than competition services.</text>
                    </div>
                  </div>

                  <div className={styles.bubble}>
                    <img src="./src/assets/icons/pleasure_crimson.svg" alt="Pleasure"/>
                    <div className={styles.bubbleContent}>
                      <div>Pleasure</div>
                      <text>100% guarantee service satisfaction.</text>
                    </div>
                  </div>

                  <div className={styles.bubble}>
                    <img src="./src/assets/icons/award_crimson.svg" alt="Award"/>
                    <div className={styles.bubbleContent}>
                      <div>Loyalty points</div>
                      <text>We offer out loyal clients loyalty points rewards that can be redeemed into free vacancy nights.</text>
                    </div>
                  </div>

                </div>
                <div className={styles.card}>
                  <div className={styles.credential}>
                    <div className={styles.fullname}>

                    <div className={styles.firstname} data-label="First Name">
                      <input 
                        className={styles.inputing}
                        value={fname}
                        onChange={(e) => setFname(e.target.value)}
                        required
                      />
                    </div>

                      <div className={styles.lastname} data-label="Last Name">
                        <input 
                          className={styles.inputing}
                          value={lname}
                          onChange={(e) => setLname(e.target.value)}
                          required
                        />
                      </div>

                    </div>

                    <div className={styles.data} data-label="Email">
                      <input 
                        className={`${styles.inputing} ${emailError ? styles.inputError : ''}`}
                        type="email"
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
                        className={styles.inputing} 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                      />
                      
                      {password && (
                        <div className={styles.passwordStrength}>
                          <div className={styles.strengthBar}>
                            <div 
                              className={`${styles.strengthFill} ${
                                passwordErrors.length <= 2 ? styles.medium : 
                                passwordErrors.length === 0 ? styles.strong : 
                                styles.weak
                              }`}
                              style={{ width: `${Math.max(10, 100 - (passwordErrors.length * 20))}%` }}
                            ></div>
                          </div>
                          
                          <ul className={styles.passwordRequirements}>
                            <li className={password.length >= 8 ? styles.valid : styles.invalid}>
                               At least 8 characters
                            </li>
                            <li className={/[A-Z]/.test(password) ? styles.valid : styles.invalid}>
                               One uppercase letter
                            </li>
                            <li className={/[a-z]/.test(password) ? styles.valid : styles.invalid}>
                               One lowercase letter
                            </li>
                            <li className={/\d/.test(password) ? styles.valid : styles.invalid}>
                               One number
                            </li>
                            <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? styles.valid : styles.invalid}>
                               One special character
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className={styles.data} data-label="Repeat Password">
                      <input 
                        className={styles.inputing} 
                        type="password"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        required
                      />
                      
                      {password2 && (
                        <div className={passwordsMatch ? styles.matchSuccess : styles.matchError}>
                          {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                        </div>
                      )}
                    </div>
                    
                    <div className={styles.termsContainer}>
                      <label className={styles.termsLabel}>
                        <input 
                          type="checkbox"
                          className={styles.termsCheckbox}
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          required
                        />
                        <span className={styles.checkmark}></span>
                        <span className={styles.termsText}>
                          I agree to the <Link to="/terms" className={styles.termsLink}>Terms of Service</Link> and <Link to="/privacy" className={styles.termsLink}>Privacy Policy</Link>
                        </span>
                      </label>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit} className={styles.form}>
                    <button
                      type="submit"
                      className={styles.button}
                      disabled={!isFormValid}
                    >
                      Sign Up
                    </button>
                  </form>
                  <div className={styles.change}>already with us ? <Link to="/login">log in</Link></div>
                </div>
            </div>
          </main>
        </>
    );
};

export default Register;