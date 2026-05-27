import { useEffect, useState } from 'react'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { clearError, clearMessage, loginUser } from '../../../redux/userSlice'
import { toast } from 'react-toastify'

// import css
import './login.css'

// import component
import Seo from '../../seo/seo.jsx'
import Bubbles from '../../utility/bubbles/bubbles'

const Login = (props) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const {isLoading} = useSelector(state => state.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const {message, error, isAuthenticated} = useSelector(state => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return toast.warn("Fields cannot be empty!");
    dispatch(loginUser({email, password, remember}));
  }

  useEffect(() => {
    if(isAuthenticated){
      toast.success(message);
      dispatch(clearMessage());
      
      // Redirect the user to the checkout page if the 'redirect' query parameter is set.
      const params = new URLSearchParams(location.search);
      const redirect = params.get('redirect');
      if (redirect === 'checkout') {
        navigate('/checkout');
      } else {
        navigate('/');
      }
    }

    if(error){
      toast.error(error);
      dispatch(clearError());
    }
  }, [dispatch, message, error, navigate, isAuthenticated, location.search])
  
  return (
    <>
      <Seo title='Login Page' descripion='Page for logging in already registered users.' />

      <div className='loginContainer'>
        {/* Floating Lavender Floral SVGs */}
        <div className="floral-decoration left-flora">
          <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M40 110 C50 80, 55 50, 60 20" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
            <path d="M40 110 C35 75, 30 45, 25 25" stroke="#a78bfa" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
            <path d="M40 110 C60 85, 75 60, 85 35" stroke="#a78bfa" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
            <circle cx="25" cy="25" r="4.5" fill="#c084fc" opacity="0.8"/>
            <circle cx="21" cy="30" r="4" fill="#a78bfa" opacity="0.8"/>
            <circle cx="29" cy="30" r="4" fill="#e9d5ff" opacity="0.9"/>
            <circle cx="23" cy="38" r="4.5" fill="#c084fc" opacity="0.8"/>
            <circle cx="27" cy="38" r="4.5" fill="#a78bfa" opacity="0.8"/>
            <circle cx="25" cy="46" r="5" fill="#d8b4fe" opacity="0.85"/>
            <circle cx="60" cy="20" r="4.5" fill="#c084fc" opacity="0.85"/>
            <circle cx="55" cy="26" r="4.5" fill="#a78bfa" opacity="0.9"/>
            <circle cx="65" cy="26" r="4.5" fill="#d8b4fe" opacity="0.9"/>
            <circle cx="58" cy="34" r="5" fill="#c084fc" opacity="0.85"/>
            <circle cx="62" cy="34" r="5" fill="#a78bfa" opacity="0.85"/>
            <circle cx="60" cy="44" r="5.5" fill="#e9d5ff" opacity="0.9"/>
            <circle cx="85" cy="35" r="4.5" fill="#a78bfa" opacity="0.8"/>
            <circle cx="81" cy="41" r="4" fill="#c084fc" opacity="0.8"/>
            <circle cx="89" cy="41" r="4" fill="#d8b4fe" opacity="0.9"/>
            <circle cx="83" cy="49" r="4.5" fill="#c084fc" opacity="0.85"/>
            <circle cx="87" cy="49" r="4.5" fill="#a78bfa" opacity="0.85"/>
            <circle cx="85" cy="57" r="5" fill="#e9d5ff" opacity="0.9"/>
            <circle cx="35" cy="85" r="3" fill="#fbbf24" opacity="0.6"/>
          </svg>
        </div>
        <div className="floral-decoration right-flora">
          <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M80 110 C70 80, 65 50, 60 20" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
            <path d="M80 110 C85 75, 90 45, 95 25" stroke="#a78bfa" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
            <path d="M80 110 C60 85, 45 60, 35 35" stroke="#a78bfa" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
            <circle cx="95" cy="25" r="4.5" fill="#c084fc" opacity="0.8"/>
            <circle cx="99" cy="30" r="4" fill="#a78bfa" opacity="0.8"/>
            <circle cx="91" cy="30" r="4" fill="#e9d5ff" opacity="0.9"/>
            <circle cx="97" cy="38" r="4.5" fill="#c084fc" opacity="0.8"/>
            <circle cx="93" cy="38" r="4.5" fill="#a78bfa" opacity="0.8"/>
            <circle cx="95" cy="46" r="5" fill="#d8b4fe" opacity="0.85"/>
            <circle cx="60" cy="20" r="4.5" fill="#c084fc" opacity="0.85"/>
            <circle cx="65" cy="26" r="4.5" fill="#a78bfa" opacity="0.9"/>
            <circle cx="55" cy="26" r="4.5" fill="#d8b4fe" opacity="0.9"/>
            <circle cx="62" cy="34" r="5" fill="#c084fc" opacity="0.85"/>
            <circle cx="58" cy="34" r="5" fill="#a78bfa" opacity="0.85"/>
            <circle cx="60" cy="44" r="5.5" fill="#e9d5ff" opacity="0.9"/>
            <circle cx="35" cy="35" r="4.5" fill="#a78bfa" opacity="0.8"/>
            <circle cx="39" cy="41" r="4" fill="#c084fc" opacity="0.8"/>
            <circle cx="31" cy="41" r="4" fill="#d8b4fe" opacity="0.9"/>
            <circle cx="37" cy="49" r="4.5" fill="#c084fc" opacity="0.85"/>
            <circle cx="33" cy="49" r="4.5" fill="#a78bfa" opacity="0.85"/>
            <circle cx="35" cy="57" r="5" fill="#e9d5ff" opacity="0.9"/>
            <circle cx="85" cy="85" r="3" fill="#fbbf24" opacity="0.6"/>
          </svg>
        </div>

        <form className="loginForm">
          <label className="formHeader">
            <h2>Log In</h2>
            <p className="formSubtitle">Welcome back to MetArt</p>
          </label>
 
          <label className="inputGroup">
            <i className="fa-regular fa-envelope inputIcon"></i>
            <input type="email" placeholder="Email Address" value={email}  onChange={e=>setEmail(e.target.value)} autoComplete="new-password" required/>
          </label>
 
          <label className="inputGroup">
            <i className="fa-solid fa-lock inputIcon"></i>
            <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="new-password" required/>
          </label>
 
          <label className='moreOptions'>
            <div className="rememberMe">
              <input type="checkbox" id="remember" checked={remember} onChange={e=>setRemember(!remember)} />
              <label htmlFor="remember">Keep logged in</label>
            </div>
 
            <div className="forgotPassword">
              <Link to='/password/forget'>Forgot Password?</Link>
            </div>
          </label>	
 
          <label className="submitGroup">
            <button type="submit" onClick={handleSubmit}>{isLoading ? <Bubbles /> : "Submit"}</button>
          </label>

          <p className="redirectText">New to MetArt? <Link to="/register">Create an Account</Link></p>
        </form>
      </div>
    </>
  );
}
  
export default Login