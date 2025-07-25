import { useState, useEffect } from "react";
import { useUpdateNoteMutation, useDeleteNoteMutation } from "./notesApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const EditNoteForm = ({ note, users }) => {
	const [updateNote, { isLoading, isSuccess, isError, error }] =
		useUpdateNoteMutation();
	const [
		deleteNote,
		{ isSuccess: isDelSuccess, isError: isDelError, error: delerror },
	] = useDeleteNoteMutation();

	const navigate = useNavigate();

	const [userId, setUserId] = useState(note.user || "");
	const [title, setTitle] = useState(note.title || "");
	const [text, setText] = useState(note.text || "");
	const [completed, setCompleted] = useState(note.completed || false);

	useEffect(() => {
		if (isSuccess || isDelSuccess) {
			setTitle("");
			setText("");
			setUserId("");
			navigate("/dash/notes");
		}
	}, [isSuccess, isDelSuccess, navigate]);

	const onSaveNoteClicked = async () => {
		if (canSave) {
			await updateNote({ id: note._id, user: userId, title, text, completed });
		}
	};

	const onDeleteNoteClicked = async () => {
		await deleteNote({ id: note._id });
	};

	const onTitleChange = (e) => setTitle(e.target.value);
	const onTextChange = (e) => setText(e.target.value);
	const onUserIdChange = (e) => setUserId(e.target.value);

	const canSave = [note._id, userId, title, text].every(Boolean) && !isLoading;

	const errClass = isError || isDelError ? "errmsg" : "offscreen";
	const errContent = error?.data?.message || delerror?.data?.message || "";

	const validTitleClass = !title ? "form__input--incomplete" : "";
	const validTextClass = !text ? "form__input--incomplete" : "";

	const options = users.map((user) => (
		<option key={user.id} value={user.id}>
			{user.username}
		</option>
	));

	return (
		<>
			<p className={errClass}>{errContent}</p>

			<form className="form" onSubmit={(e) => e.preventDefault()}>
				<div className="form__title-row">
					<h2>Edit Note</h2>
					<div className="form__action-buttons">
						<button
							className="icon-button"
							title="Save"
							onClick={onSaveNoteClicked}
							disabled={!canSave}
						>
							<FontAwesomeIcon icon={faSave} />
						</button>
						<button
							className="icon-button"
							title="Delete"
							onClick={onDeleteNoteClicked}
						>
							<FontAwesomeIcon icon={faTrashCan} />
						</button>
					</div>
				</div>

				<label className="form__label" htmlFor="title">
					Title:
				</label>
				<input
					className={`form__input ${validTitleClass}`}
					id="title"
					name="title"
					type="text"
					autoComplete="off"
					value={title}
					onChange={onTitleChange}
				/>

				<label className="form__label" htmlFor="text">
					Text:
				</label>
				<textarea
					className={`form__input ${validTextClass}`}
					id="text"
					name="text"
					value={text}
					onChange={onTextChange}
				/>

				<label
					className="form__label form__checkbox-container"
					htmlFor="note-completed"
				>
					COMPLETED:
					<input
						className="form__checkbox"
						id="note-completed"
						name="note-completed"
						type="checkbox"
						checked={completed}
						onChange={(e) => setCompleted(e.target.checked)}
					/>
				</label>

				<label className="form__label" htmlFor="userId">
					ASSIGNED TO:
				</label>
				<select
					id="userId"
					name="userId"
					className="form__select"
					value={userId}
					onChange={onUserIdChange}
				>
					{options}
				</select>
			</form>
		</>
	);
};

export default EditNoteForm;
