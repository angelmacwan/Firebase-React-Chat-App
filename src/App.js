import React, { useRef } from "react";
import "./App.css";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
	apiKey: "AIzaSyAhLHPsDVMFFW1J0yiLgQoXurtCkSxlBIo",
	authDomain: "vibezchat-f7b0f.firebaseapp.com",
	databaseURL: "https://vibezchat-f7b0f.firebaseio.com",
	projectId: "vibezchat-f7b0f",
	storageBucket: "vibezchat-f7b0f.appspot.com",
	messagingSenderId: "153376265804",
	appId: "1:153376265804:web:3be1c4f204d6278f5146e9",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
	const [user] = useAuthState(auth);
	return (
		<div className='App'>
			<link
				href='https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap'
				rel='stylesheet'
			/>
			<link
				rel='stylesheet'
				href='https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css'
			/>

			<div className='container'>
				<header>
					<h1>Vibez Chat</h1>
					<SignOut />
				</header>

				<section>{user ? <ChatRoom /> : <SignIn />}</section>
			</div>
		</div>
	);
}

function SignIn() {
	const signInWithGoogle = () => {
		const provider = new firebase.auth.GoogleAuthProvider();
		auth.signInWithPopup(provider);
	};

	return (
		<>
			<button className='sign-in' onClick={signInWithGoogle}>
				Sign in with Google
			</button>
		</>
	);
}

function SignOut() {
	return (
		auth.currentUser && (
			<button className='sign-out' onClick={() => auth.signOut()}>
				Sign Out
			</button>
		)
	);
}

function ChatRoom() {
	const dummy = useRef();
	const messagesRef = firestore.collection("messages");
	const query = messagesRef.orderBy("createdAt");

	const [messages] = useCollectionData(query, { idField: "id" });

	const sendText = async () => {
		const { uid, photoURL } = auth.currentUser;
		let msg = document.querySelector("#messageValue").value;

		if (msg !== "") {
			let data = {
				text: msg,
				createdAt: firebase.firestore.FieldValue.serverTimestamp(),
				uid,
				photoURL,
			};

			document.querySelector("#messageValue").value = "";
			await messagesRef.add(data);
			window.location.href = "#btm";
		}
	};

	return (
		<>
			<main>
				{messages &&
					messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

				<span ref={dummy} id='btm'></span>
			</main>

			<form>
				<input
					id='messageValue'
					autoComplete='off'
					placeholder='say something nice'
					onKeyPress={(event) => {
						if (event.key === "Enter") {
							sendText();
						}
					}}
				/>

				<button type='button' onClick={sendText}>
					<svg
						width='1em'
						height='1em'
						viewBox='0 0 16 16'
						className='bi bi-cursor-fill'
						fill='currentColor'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							fillRule='evenodd'
							d='M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z'
						/>
					</svg>
				</button>
			</form>
		</>
	);
}

function ChatMessage(props) {
	const { text, uid, photoURL } = props.message;

	const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

	window.setTimeout(() => {
		window.location.href = "#btm";
	}, 200);

	return (
		<>
			<div
				className={`message ${messageClass} animate__animated animate__bounceIn`}
			>
				<img src={photoURL} alt='!' />
				<p>{text}</p>
			</div>
		</>
	);
}

export default App;
