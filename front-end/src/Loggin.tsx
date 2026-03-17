import { Routes, Route, Link} from "react-router-dom"
import { useState } from "react"

function Navbar() {
	return (
		<header
			style={{
				padding: "1rem 0.5rem",
				marginBottom: "1rem",
				borderBottom: "1px solid #e5e7eb",
				display: "flex",
				justifyContent: "space-between"
			}}>
			<nav style={{ display: "flex", gap: "1rem"}}>
				<Link to="/">Home</Link>
				<Link to="/profile">Profile</Link>
			</nav>

			<div>
				<Link to="/login">Login</Link>
			</div>
		</header>
	)
}

function HomePage() {
	return (
		<div style={{ padding: "0 1.5rem" }}>
			<h1>Home</h1>

			<p>You are not logged in. Go to the login page to sign in.</p>
		</div>
	)
}

function ProfilePage() {
	return (
		<div style={{ padding: "0 1.5 rem" }}>
			<h1>Profile</h1>
			<p>Name: [name will go here]</p>
			<p>Here you could show more user info from the context.</p>
		</div>
	)
}

function LoginPage() {
	const [name, setName] = useState("")
	const  [user, setUser] = useState({ name: "", isAuth: false} )

	function handleSubmit(e: any) {
		e.preventDefault();
		if (!name.trim()) return;

		setUser({ name: name, isAuth: true })
	}

	return (
		<div style={{ padding: "0 1.5rem" }}>
			<h1>Login</h1>
			<form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
				<label>
					Name
					<input
						type="text"
						placeholder='Type any name...'
						value={name}
						onChange={(e) => setName(e.target.value)}
						style={{ marginLeft: "0.5rem" }}
					/>
				</label>
				<button type="submit" style={{ marginLeft: "0.5 rem" }}>
					Log in
				</button>
			</form>

			{user.isAuth ? <p>User "<b>{name}</b>" logged in</p> : <p></p>}
		</div>
	)
}


function MainPage() {
    return (
        <>
            <Navbar />

			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/profile" element={<ProfilePage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route 
					path="*"
					element={<h1 style={{ padding: "0 1.5rem" }}>404 NOT FOUND</h1>} 
				/>
			</Routes>
        </>
    )
}

export default MainPage