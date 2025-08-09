const Note = require("../models/Note");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// @desc Get all Notes
// @route GET /notes
// @access Private
const getAllNotes = asyncHandler(async (req, res) => {
	// Get all Notes from MongoDB
	const notes = await Note.find().lean();

	// If no notes are found
	if (!notes?.length) {
		return res.status(400).json({ message: "No notes found" });
	}

	// Add username to each note before sending the response
	const notesWithUser = await Promise.all(
		notes.map(async (note) => {
			const user = await User.findById(note.user).lean().exec();
			return { ...note, username: user.username };
		})
	);

	res.json(notesWithUser);
});

// @desc Create new note
// @route POST /notes
// @access Private
const createNewNote = asyncHandler(async (req, res) => {
	const { user, title, text } = req.body;

	// Confirm data
	if (!user || !title || !text) {
		return res.status(400).json({ message: "All fields are required" });
	}

	// Check for duplicate
	const duplicate = await Note.findOne({ title })
		.collation({ locale: "en", strength: 2 })
		.lean()
		.exec();

	if (duplicate) {
		return res.status(400).json({ message: "Dulpicate note title" });
	}

	const note = await Note.create({user, title, text});

	if (note) {
		return res.status(201).json({ message: "New Note created" });
	} else {
		return res.status(400).json({ message: "Invalid note data received" });
	}
});

// @desc Update note
// @route PATCH /notes
// @access Private
const updateNote = asyncHandler(async (req, res) => {
	const { id, user, title, text, completed } = req.body;

	// Confirm Data
	if (!id || !user || !title || !text || typeof completed !== "boolean") {
		return res.status(400).json({ message: "All fields area required" });
	}

	// Confirm note exists to update
	const note = await Note.findOne({_id :id}).exec();

	if (!note) {
		return res.status(400).json({ message: "Note not found" });
	}

	// Check for duplicate title
	const duplicate = await Note.findOne({ title })
		.collation({ locale: "en", strength: 2 })
		.lean()
		.exec();

	// Allow renaming of the original note
	if (duplicate && duplicate?._id.toString() !== id) {
		return res.status(400).json({ message: "Duplicate note title" });
	}

	note.user = user;
	note.title = title;
	note.text = text;
	note.completed = completed;

	const updateNote = await note.save();

	res.json(`${updateNote.title} updated`);
});

// @desc Delete note
// @route DELETE /notes
// @access Private

const deleteNote = asyncHandler(async (req, res) => {
	const { id } = req.body;

	// Confirm data
	if (!id) {
		return res.status(400).json({ message: "Note ID Required" });
	}

	// Confirm note exists to delete
	const note = await Note.findById(id).exec();

	if (!note) {
		return res.status(400).json({ message: "Note not found" });
	}

	const result = await note.deleteOne();

	const reply = `Note '${note.title}' with ID ${note._id} deleted`;

	res.json(reply);
});

module.exports = {
	getAllNotes,
	createNewNote,
	updateNote,
	deleteNote,
};
