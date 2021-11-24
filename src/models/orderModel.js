const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({


    userId: mongoose.Schema.Types.ObjectId,
    productId: mongoose.Schema.Types.ObjectId,
    amount: Number,
    isFreeAppUser: Boolean,
    
    

},
      {date: Date},
     { timestamps: true })

module.exports = mongoose.model('order', orderSchema)