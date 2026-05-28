import React, { useEffect, useRef } from 'react'
import {useDispatch, useSelector}  from 'react-redux'
import { NavLink, Outlet, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getUserProfile } from '../../../redux/profileSlice'
import { clearError, clearMessage, updateAvatar } from '../../../redux/profileSlice'

// import css and components
import './profile.css'
import Seo from '../../seo/seo'
import Spinner from '../../utility/spinner/spinner'
import HireDialog from '../../dialogs/hire/hireDialog'
import Khalti from '../../dialogs/khalti/khalti'

// import banner image
import profileBanner from '../../../assets/images/profile_banner.png'

// roles
const roles = ['painter', 'sculptor', 'photographer', 'drawer', 'sketcher']

const Profile = () => {
    const { id } = useParams()
    const menuRef = useRef(null)
    const dispatch = useDispatch();
    const { myData } = useSelector(state => state.user);
    const { userData, message, error, isLoading } = useSelector(state => state.profile);

    // scroll to top
    const handleScroll = (mnu) => {
        menuRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    const handleAvatarChange = async (e) => {
        e.preventDefault();
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = async () => {
            if(reader.readyState === 2) {
                dispatch(updateAvatar({ avatar: reader.result }));
            }
        }
    }

    useEffect(() => {
        dispatch(getUserProfile(id))

        if(message){
            toast.success(message);
            dispatch(clearMessage());
        }
    
        if(error){
            toast.error(error);
            dispatch(clearError());
        }

    }, [dispatch, error, message, id]);

    return (
        <>
            <Seo title={`Profile of ${userData?.name}`} description="Profile page of user." />

            {/* Premium Profile Cover Banner */}
            <div className="profileBannerContainer">
                <img src={profileBanner} alt="profile-banner" className="profileBannerImg" />
                <div className="bannerOverlay"></div>
            </div>

            <section className='profileSection'>
                {/* Floating lavender and beige flower SVGs */}
                <div className="profile-flora profile-flora-left">
                    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M40 110 C50 80, 55 50, 60 20" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" opacity="0.12"/>
                        <path d="M40 110 C35 75, 30 45, 25 25" stroke="#a78bfa" strokeWidth="1.2" strokeLinecap="round" opacity="0.12"/>
                        <circle cx="25" cy="25" r="4.5" fill="#c084fc" opacity="0.3"/>
                        <circle cx="21" cy="30" r="4" fill="#a78bfa" opacity="0.3"/>
                        <circle cx="29" cy="30" r="4" fill="#e9d5ff" opacity="0.4"/>
                        <circle cx="60" cy="20" r="4.5" fill="#c084fc" opacity="0.3"/>
                        <circle cx="55" cy="26" r="4.5" fill="#a78bfa" opacity="0.4"/>
                        <circle cx="65" cy="26" r="4.5" fill="#d8b4fe" opacity="0.4"/>
                    </svg>
                </div>
                <div className="profile-flora profile-flora-right">
                    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M80 110 C70 80, 65 50, 60 20" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" opacity="0.12"/>
                        <path d="M80 110 C85 75, 90 45, 95 25" stroke="#a78bfa" strokeWidth="1.2" strokeLinecap="round" opacity="0.12"/>
                        <circle cx="95" cy="25" r="4.5" fill="#c084fc" opacity="0.3"/>
                        <circle cx="99" cy="30" r="4" fill="#a78bfa" opacity="0.3"/>
                        <circle cx="91" cy="30" r="4" fill="#e9d5ff" opacity="0.4"/>
                        <circle cx="60" cy="20" r="4.5" fill="#c084fc" opacity="0.3"/>
                        <circle cx="65" cy="26" r="4.5" fill="#a78bfa" opacity="0.4"/>
                        <circle cx="55" cy="26" r="4.5" fill="#d8b4fe" opacity="0.4"/>
                    </svg>
                </div>

                <div className="profileCard">
                    <div className="avatar">
                        {myData && userData._id === myData._id && 
                            <label htmlFor='avatar'>
                                {isLoading ? <Spinner /> : (
                                    <>
                                        <i className="fa-solid fa-plus"></i>
                                        <input id="avatar" type="file" name='avatar' accept='image/*' onChange={handleAvatarChange}/>
                                    </>
                                )}
                            </label>
                        }
                        {userData && userData.avatar && userData.avatar.url !== "" && <img src={userData.avatar.url} alt='avatar' />}
                        {userData && !userData.avatar && userData.name && Object.keys(userData).length !== 0 && <p>{userData.name[0]}</p>}
                    </div>

                    <div className="profileMeta">
                        <h1 className="profileName">{userData && userData.name}</h1>
                        <div className="profileBadges">
                            {userData?.role && (
                                <span className="profileBadge roleBadge">
                                    <i className="fa-solid fa-palette"></i> {userData.role}
                                </span>
                            )}
                            <span className="profileBadge emailBadge">
                                <i className="fa-regular fa-envelope"></i> {userData && userData.email}
                            </span>
                        </div>
                    </div>

                    <div className="buttons">
                        {(userData._id !== myData?._id) && (userData.role !== 'admin') && <HireDialog />}
                        {(userData._id !== myData?._id) && (userData?.donation?.khalti?.public_key && userData?.donation?.khalti?.secret_key) && <Khalti />}
                    </div>
                </div>

                <div className="profileOptions">
                    <nav ref={menuRef} onClick={handleScroll} className="profileTabNav">
                        <NavLink to='artworks' className="profileTabLink">Artworks</NavLink>
                        {myData && userData._id === myData._id && <NavLink to='likes' className="profileTabLink">Likes</NavLink>}
                        {myData && userData._id === myData._id && <NavLink to='detail' className="profileTabLink">Detail</NavLink>}
                        {
                            myData && 
                            userData._id === myData._id && 
                            roles.includes(myData.role) && 
                            <NavLink to='orders' className="profileTabLink">Orders</NavLink>
                        }
                        {myData && userData._id === myData._id && myData?.role!=="user" &&  <NavLink to='upload' className="profileTabLink">Upload</NavLink>}
                    </nav>

                    <div className="profileOutletContainer">
                        <Outlet />
                    </div>
                </div>
            </section>
        </>
    )
}

export default Profile;