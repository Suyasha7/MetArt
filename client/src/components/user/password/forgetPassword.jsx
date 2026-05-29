import { useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import axios from 'axios';

// import css and components
import './forgetPassword.css';
import Seo from "../../seo/seo";
import Bubbles from "../../utility/bubbles/bubbles.jsx"

const ForgetPassword = () => { 
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading]  = useState(false);
    const [resetLink, setResetLink] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const handleForgetPassword = async (body) => {
        try{
            setIsLoading(true);
            setResetLink(null);
            setSuccessMessage('');
            const {data} = await axios.post('/api/v1/password/forget', body);
            setIsLoading(false);
            if(data.success) {
                toast.success("Password reset request processed!", { autoClose: 3000 });
                setSuccessMessage(data.message);

                // Extract the reset link from the DEV MODE response
                const linkMatch = data.message?.match(/Reset Link:\s*(http\S+)/);
                if (linkMatch && linkMatch[1]) {
                    setResetLink(linkMatch[1]);
                }
            }
        }catch(err){
            setIsLoading(false);
            const errorMsg = err.response?.data?.message || "Something went wrong. Please try again.";
            return toast.error(errorMsg);
        }
    } 

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) return toast.warn("Please, provide email!");
        handleForgetPassword({email})
    } 

    return (
        <>
            <Seo title="Forget Password" />
           
            <div className="forgetPasswordContainer">
                <form onSubmit={handleSubmit}>
                    <label>
                        <h2>Forgot Password ?</h2>
                    </label>

                    <label>
                        <input type='text' name="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email..." autoComplete="off" required/>
                    </label>

                    <div>
                        <button type="submit">{isLoading ? <Bubbles /> : "Submit"}</button>
                    </div>
                </form>

                {successMessage && (
                    <div className="resetSuccessBox">
                        {resetLink ? (
                            <>
                                <p className="devModeLabel">🔧 Dev Mode — Email sending is disabled (dummy credentials).</p>
                                <p>Use this link to reset your password:</p>
                                <Link to={resetLink.replace('http://localhost:3000', '')} className="resetLinkBtn">
                                    🔑 Reset My Password
                                </Link>
                            </>
                        ) : (
                            <p className="emailSentMsg">✅ {successMessage}</p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

export default ForgetPassword;