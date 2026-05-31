import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { io }  from 'socket.io-client'
import { toast } from 'react-toastify'
import { getChatMessages, sendMessage, getMyChats } from '../../redux/chatSlice';

// import css and components
import "swiper/css";
import './chatDialog.css'
import Message from './message';
import Participant from './participant';
import Dialog from '@mui/material/Dialog';

export default function ChatDialog() {
	const socket = useRef();
	const chatFeedRef = useRef(null);
	const dispatch = useDispatch();
	const [textMessage, setTextMessage] = useState('');
	const [onlineUsers, setOnlineUsers] = useState([]);
	const [currentChat, setCurrentChat] = useState(null);
	const [arrivalMessage, setArrivalMessage] = useState(null);
	const [currentChatMessages, setCurrentChatMessages] = useState([]);

    const [openReviewDialog, setOpenReviewDialog] = useState(false);

	const {chats, chatMessages} = useSelector(state => state.chat);
	const {myData, isAuthenticated} = useSelector(state => state.user);

    const handleClickOpen = () => {setOpenReviewDialog(true)};
    const handleClose = () => {setOpenReviewDialog(false)};


	// get my chats
	useEffect(() => {
		if (myData && myData._id) {
			dispatch(getMyChats(myData._id))
		}
	}, [dispatch, myData]);


	// get messages of specific chat
	useEffect(() =>{
		if(currentChat === null) return;
		dispatch(getChatMessages(currentChat._id));
	}, [currentChat, dispatch]);
	  

	// update current chat message
	useEffect(() => {
		setCurrentChatMessages(chatMessages);
	}, [chatMessages]);


	// socket initialization 
	useEffect(() => {
		socket.current = io('https://metart-backend-zf7h.onrender.com');
		
		socket.current.on('getMessage', ({chatId, sender, receiver, text}) => {
			dispatch(getMyChats(myData._id));
			setArrivalMessage({chatId, sender, receiver, text})
		});
		
	}, [myData, dispatch]);

	// arrival message and current chat messages
	useEffect(() => {
		if (arrivalMessage) {
			if (currentChat && currentChat.participants.includes(arrivalMessage.sender)) {
				// should include this to reflect live change on receiver side
				setCurrentChatMessages(prev => [...prev, arrivalMessage]);
			}

			if (!openReviewDialog || currentChat === null || currentChat._id !== arrivalMessage.chatId) {
				toast.success("New message received.");
				setArrivalMessage(null)
			}

			setArrivalMessage(null)
		}
	}, [arrivalMessage, currentChat, openReviewDialog]);
	  

	// add and get online users
	useEffect(() => {
		if(myData && myData._id){
			socket.current.emit('addOnlineUser', myData?._id);
			socket.current.on('getOnlineUsers', (onlineUsers) => {setOnlineUsers(onlineUsers)})
		}
	}, [myData]);


	// Scroll to the bottom of the chat feed when a new message is received or sent
	useEffect(() => {
		if (chatFeedRef.current) {
			chatFeedRef.current.scrollTop = chatFeedRef.current.scrollHeight;
		}
	}, [currentChatMessages]);


	// handling the message send
	const handleSendMessage = async (e) => {
		e.preventDefault();

		// send message to socket io
		const sender = myData._id;
		const receiver = currentChat.participants.find(id => id !== myData._id);
		const message = {chatId: currentChat._id, sender, receiver, text: textMessage}
		socket.current.emit('sendMessage', message);
		
		// send message to backend
		dispatch(sendMessage(message)).then(() => {dispatch(getMyChats(myData._id));});

		// should include this to reflect live change on sender side
		setCurrentChatMessages(prev => [...prev, {chatId: currentChat._id, sender, receiver, text: textMessage}])

		setTextMessage('');
	}

    return (
        <>
            <button className="chatTriggerBtn" onClick={handleClickOpen}><i className="fa-regular fa-comment-dots"></i></button>
            
            <Dialog className="chatDialogContainer" open={openReviewDialog} onClose={handleClose} BackdropProps={{ invisible: true }}>
				<div className='chatBox'>
					<div className='chatHeading'>					
						<p>Chats</p>
						<i className="fa-solid fa-xmark" onClick={() => handleClose()}></i>
					</div>

					{!isAuthenticated && 
						<div className='loginFirst'>
							Please log in first to access <br /> chat feature.
						</div>
					}
					
					{isAuthenticated && 
						<div className='participants'> 
							{chats && chats.map((chat, index) => {
								return (
									<div onClick={() => setCurrentChat(chat)} key={index} className='participantContainer'>
										<Participant chat={chat} currentChat={currentChat} onlineUsers={onlineUsers}  />	
									</div>
								)
							})}
						</div>
					}

					{isAuthenticated && 
						<div className='chatFeed' ref={chatFeedRef}>
							{/* Floating background lavender stalks for thematic consistency */}
							<div className="chat-bg-flora">
								<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M40 110 C50 80, 55 50, 60 20" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" opacity="0.15"/>
									<path d="M40 110 C35 75, 30 45, 25 25" stroke="#c084fc" strokeWidth="1.2" strokeLinecap="round" opacity="0.15"/>
									<path d="M40 110 C60 85, 75 60, 85 35" stroke="#c084fc" strokeWidth="1.2" strokeLinecap="round" opacity="0.15"/>
									<circle cx="25" cy="25" r="4.5" fill="#c084fc" opacity="0.25"/>
									<circle cx="21" cy="30" r="4" fill="#a78bfa" opacity="0.25"/>
									<circle cx="29" cy="30" r="4" fill="#e9d5ff" opacity="0.3"/>
									<circle cx="23" cy="38" r="4.5" fill="#c084fc" opacity="0.25"/>
									<circle cx="27" cy="38" r="4.5" fill="#a78bfa" opacity="0.25"/>
									<circle cx="25" cy="46" r="5" fill="#d8b4fe" opacity="0.3"/>
									<circle cx="60" cy="20" r="4.5" fill="#c084fc" opacity="0.25"/>
									<circle cx="55" cy="26" r="4.5" fill="#a78bfa" opacity="0.3"/>
									<circle cx="65" cy="26" r="4.5" fill="#d8b4fe" opacity="0.3"/>
									<circle cx="58" cy="34" r="5" fill="#c084fc" opacity="0.25"/>
									<circle cx="62" cy="34" r="5" fill="#a78bfa" opacity="0.25"/>
									<circle cx="60" cy="44" r="5.5" fill="#e9d5ff" opacity="0.3"/>
									<circle cx="85" cy="35" r="4.5" fill="#a78bfa" opacity="0.25"/>
									<circle cx="81" cy="41" r="4" fill="#c084fc" opacity="0.25"/>
									<circle cx="89" cy="41" r="4" fill="#d8b4fe" opacity="0.3"/>
									<circle cx="83" cy="49" r="4.5" fill="#c084fc" opacity="0.25"/>
									<circle cx="87" cy="49" r="4.5" fill="#a78bfa" opacity="0.25"/>
									<circle cx="85" cy="57" r="5" fill="#e9d5ff" opacity="0.3"/>
								</svg>
							</div>

							{(currentChat === null) && <div className='noChat'>Please select the user <br />to send message.</div>}
							{(currentChat !== null) && !currentChatMessages.length && 
								<div className='noMessage'>
									<i className="fa-solid fa-comment-slash"></i>
									<p>No messages yet. <br />Please start typing your message.</p>
								</div>
							}
							{(currentChat !== null) && currentChatMessages.map((message, index) => {return <Message key={index} message={message} />})}
						</div>
					}
					
					<div className='chatInput'>
						<input type='text' placeholder='Message...' value={textMessage} onChange={(e) => setTextMessage(e.target.value)} />
						<button onClick={handleSendMessage} disabled={!currentChat || !textMessage}><i className="fa-solid fa-paper-plane"></i></button>
					</div>
				</div>  
            </Dialog>
        </>
    );
}