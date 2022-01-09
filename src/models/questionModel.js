const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId
const questionSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    tag: {
      type: [String],
    },

    askedBy: {
      type: ObjectId,
      ref:'user'
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("question", questionSchema);
