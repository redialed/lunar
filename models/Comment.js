const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
	{
		id: { type: String, required: true, unique: true },
		from: { type: String, required: true},
		to: { type: String, required: true },
		likes: { type: Number, required: true, default: 0 },
		content: { type: String, required: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);