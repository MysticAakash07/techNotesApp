import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import NotesList from "./features/notes/NotesList";
import UsersList from "./features/users/UsersList";
import EditUser from "./features/users/EditUser";
import NewUserForm from "./features/users/NewUserForm";
import EditNote from "./features/notes/EditNote";
import NewNote from "./features/notes/NewNote";
import Prefetch from "./features/auth/Prefetch";
import PersistLogin from "./features/auth/PresistLogin";
import RequireAuth from "./features/auth/requireAuth";
import { ROLES } from "./config/roles";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				{/* public routes */}
				<Route index element={<Public />} />
				<Route path="login" element={<Login />} />

				{/* Protected routes */}
				<Route element={<PersistLogin />}>
					<Route
						element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
					>
						<Route element={<Prefetch />}>
							<Route path="dash" element={<DashLayout />}>
								<Route index element={<Welcome />} />

								<Route
									element={
										<RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />
									}
								>
									<Route path="users">
										<Route index element={<UsersList />} />
										<Route path=":id" element={<EditUser />} />
										<Route path="new" element={<NewUserForm />} />
									</Route>
								</Route>
								{/* End Users */}

								<Route path="notes">
									<Route index element={<NotesList />} />
									<Route path=":id" element={<EditNote />} />
									<Route path="new" element={<NewNote />} />
								</Route>
								{/* End Notes */}
							</Route>
							{/* End Dash */}
						</Route>
						{/* End Prefetch */}
					</Route>
					{/* End Require Auth ...ALL */}
				</Route>
				{/* End PresistLogin */}
				{/* End Protected Routes */}
			</Route>
		</Routes>
	);
}

export default App;
