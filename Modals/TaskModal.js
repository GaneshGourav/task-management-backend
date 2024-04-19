const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
    userId: { type: String, required: true },
    title: {
        type: String,
        required: true,
      },
    
      description: {
        type: String,
        required: true,
      },
    
      dueDate: {
        type: Date,
        required: true,
      },
    
      status: {
        type: String,
        default: "pending",
      },
    
      priority: {
        type: String,
        default: "low",
      },
    
      createdAt: {
        type: Date,
        default: Date.now,
      },
    
      updatedAt: {
        type: Date,
        default: Date.now,
      },
})

const TaskModal = mongoose.model("task", taskSchema)

module.exports = {
    TaskModal
}
