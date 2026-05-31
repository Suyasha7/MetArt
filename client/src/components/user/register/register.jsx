import {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {toast} from 'react-toastify'
import { registerUser, clearError, clearMessage } from '../../../redux/userSlice';

// import css and components
import './register.css'
import Seo from '../../seo/seo';
import Bubbles from '../../utility/bubbles/bubbles';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {isLoading} = useSelector(state => state.user)
  const { message, error, isAuthenticated} = useSelector(state => state.user)
  const [user, setUser] = useState({name: "", email: "", password: "", confirmPassword: "", role: ""});

  const handleChange = (e) => {return setUser({...user, [e.target.name]: e.target.value})};
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user.name || !user.email || !user.password || !user.confirmPassword) return toast.warn("Fields cannot be empty!");
    if (user.password !== user.confirmPassword) return toast.warn("Password do not match!");
    dispatch(registerUser(user));
  };

  useEffect(() => {
    if(isAuthenticated){
      toast.success(message);
			dispatch(clearMessage());
      navigate('/');
    }

		if(error){
			toast.error(error);
			dispatch(clearError());
		}
	}, [dispatch, navigate, message, error, isAuthenticated]);

  return (
    <>
      <Seo title="Register Page" description="Page for user registration." />
      <div className='registerContainer'>
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

        <form className="registerForm">
          <label className="formHeader">
            <h2>Register</h2>
            <p className="formSubtitle">Create your MetArt profile</p>
          </label>

          <label className="inputGroup">
            <i className="fa-regular fa-user inputIcon"></i>
            <input type="text" name="name" value={user.name} placeholder='Full Name' autoComplete="new-password"  onChange={handleChange} required />
          </label>

          <label className="inputGroup">
            <i className="fa-regular fa-envelope inputIcon"></i>
            <input type="email" name="email" value={user.email} placeholder="Email Address" autoComplete="new-password"  onChange={handleChange} required/>
          </label>

          <label className="inputGroup">
            <i className="fa-solid fa-lock inputIcon"></i>
            <input type="password" name="password" value={user.password} placeholder="Create Password" autoComplete="new-password"  onChange={handleChange} required/>
          </label>

          <label className="inputGroup">
            <i className="fa-solid fa-lock inputIcon"></i>
            <input type="password" name="confirmPassword" value={user.confirmPassword} placeholder="Confirm Password" autoComplete="new-password"  onChange={handleChange} required/>
          </label>

          <label className="roleSelectGroup">
              <p className="roleLabel">Select your Account Type:</p>
              <div className="selectWrapper">
                <i className="fa-solid fa-paintbrush selectIcon"></i>
                <select name="role" value={user.role} onChange={handleChange} required>
                  <option value="" disabled>Select Role</option>
                  <option value='user'>Buyer (Art Collector)</option>
                  <option value='painter'>Artist - Painter (Paintings)</option>
                  <option value='sketcher'>Artist - Sketcher (Sketching)</option>
                  <option value='sculptor'>Artist - Sculptor (Sculptures)</option>
                  <option value='photographer'>Artist - Photographer (Photography)</option>
                </select>
              </div>
          </label>

          <label className="submitGroup">
            <button type="submit" onClick={handleSubmit}>{isLoading ? <Bubbles /> : "Register"}</button>
          </label>

          <p className="redirectText">Already have an account? <Link to="/login">Log In</Link></p>
        </form>
      </div>
    </>
  );
}

export default Register;