import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link, useLocation } from "react-router-dom";

import { useSendLogoutMutation } from "../features/auth/authApiSlice";

const DASH_REGEX = /^\/dash(\/)?$/;
const NOTES_REGEX = /^\/dash\/notes(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

const DashHeader = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const [sendLogout, { isLoading, isSuccess, isError, error }] =
		useSendLogoutMutation();

	useEffect(() => {
		if (isSuccess) {
			navigate("/");
		}
	}, [isSuccess, navigate]); 

	if (isLoading) return <p>Logging Out...</p>;

	if (isError) return <p>Error: {error.data?.message}</p>;

	let dashClass = null;
	if (
		!DASH_REGEX.test(pathname) &&
		!NOTES_REGEX.test(pathname) &&
		!USERS_REGEX.test(pathname)
	) {
		dashClass = "dash-header__container--small";
	}

	const handleLogout = async (e) => {
		e.preventDefault();
		try {
			await sendLogout().unwrap(); // waits for mutation success
			navigate("/"); // navigate immediately after successful logout
		} catch (err) {
			console.error("Logout failed", err);
		}
	};


	const logoutButton = (
		<button className="icon-button" title="Logout" onClick={handleLogout}>
			<FontAwesomeIcon icon={faRightFromBracket} />
		</button>
	);

	const content = (
		<header className="dash-header">
			<div className={`dash-header__container ${dashClass}`}>
				<Link to="/dash">
					<h1 className="dash-header__title">techNotes</h1>
				</Link>
				<nav className="dash-header__nav">{logoutButton}</nav>
			</div>
		</header>
	);

	return content;
};

export default DashHeader;
