import { useEffect, useState } from "react";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import "./App.css";

function App() {
	const [text, setText] = useState("");
	const [tokens, setTokens] = useState([]);
	const [tokenizer, setTokenizer] = useState(null);

	useEffect(() => {
		// akses global kuromoji dari window
		window.kuromoji
			.builder({
				dicPath: "https://unpkg.com/kuromoji@0.1.2/dict/",
			})
			.build((err, tokenizer) => {
				if (err) {
					console.error(err);
				} else {
					setTokenizer(tokenizer);
				}
			});
	}, []);

	// helper: katakana → hiragana
	const kataToHira = (str) =>
		str.replace(/[\u30a1-\u30f6]/g, (ch) =>
			String.fromCharCode(ch.charCodeAt(0) - 0x60)
		);

	const handleTextChange = (e) => {
		const value = e.target.value;
		setText(value);
		if (tokenizer) {
			const result = tokenizer.tokenize(value);
			console.log("result", result);
			setTokens(result);
		}
	};

	const renderRuby = () => {
		console.log("tokesn", tokens);

		return tokens.map((t, i) =>
			t.reading && t.reading !== t.surface_form ? (
				<ruby key={i} style={{ marginRight: 4 }}>
					{t.surface_form}
					<rt style={{ fontSize: "0.6em" }}>{kataToHira(t.reading)}</rt>
				</ruby>
			) : (
				<span key={i}>{t.surface_form}</span>
			)
		);
	};

	// TODO: Add SDKs for Firebase products that you want to use
	// https://firebase.google.com/docs/web/setup#available-libraries

	// Your web app's Firebase configuration
	// For Firebase JS SDK v7.20.0 and later, measurementId is optional
	const firebaseConfig = {
		apiKey: "AIzaSyAkNUfEbkZmFjZRy3Y_9y1wulrvqpOaOQc",
		authDomain: "umbrella-project-29.firebaseapp.com",
		projectId: "umbrella-project-29",
		storageBucket: "umbrella-project-29.firebasestorage.app",
		messagingSenderId: "225204036052",
		appId: "1:225204036052:web:ea7c57d1e9241867b87641",
		measurementId: "G-1KP1D5WLNT",
	};

	// Initialize Firebase
	const app = initializeApp(firebaseConfig);
	getAnalytics(app);
	return (
		<div style={{ maxWidth: 600, margin: "20px auto", fontFamily: "sans-serif" }}>
			<h2>Input Jepang dengan Furigana Otomatis</h2>
			<input
				value={text}
				onChange={handleTextChange}
				placeholder="contoh: 日本語を勉強します"
				style={{ width: "100%", padding: 8, fontSize: 16 }}
			/>

			<div style={{ marginTop: 20, fontSize: "1.5rem", lineHeight: 1.8 }}>
				{text ? (
					renderRuby()
				) : (
					<span style={{ color: "#999" }}>Belum ada input</span>
				)}
			</div>
		</div>
	);
}

export default App;
