const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema ({
    user : {
        type : String,
        required : true
    },

    items : [
        {
            product : String, 
            category : String,
            price : Number,
            quantity : Number,

        },
    ],
    totalPrice : Number,
    date : {
        type : Date , 
        default  :Date.now
    }
})

module.exports = mongoose.model('Order' , OrderSchema);
