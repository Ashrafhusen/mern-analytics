const express = require('express')
const Order = require('../models/Order')
const router = express.Router();



router.get('/total-revenue' , async(req , res) => {
    try {
        const result = await Order.aggregate([
            {
                $group : {
                    _id: null , totalRevenue : {$sum : "$totalPrice"}
                }
            }
        ]);
        res.json(result[0] || {totalRevenue : 0})
        
    } catch (error) {
        res.status(500).json({error : err.message})
        
    }
})

router.get('/monthly-revenue' , async(req , res) => {
    try {
        const result = await Order.aggregate([ {
            $group : {
                _id : { $month : '$date'},
                revenue : {$sum : "$totalPrice"}

                
            }},
            {$sort : {_id : 1}}
        ]);
        res.json(result);
        
    } catch (err) {
        res.status(500).json({error : err.message})
    }
});

router.get('/top-products' , async(req , res) => {
    try {
        const result = await Order.aggregate([
            {$unwind : '$items'},
            {
                $group : {
                    _id : '$items.product',
                    totalSales : {$sum : '$items.quantity'}
                }
            },
            {$sort : {totalSales : -1}},
            {$limit : 5}
        ]);
        res.json(result);
    } catch (error) {
        res.status(500).json({error : err.message})
    }
});


router.get('/sales-by-category' , async(req , res) => {
    try {
        const result = await Order.aggregate([
            {$unwind : '$items'},
            {
                $group : {
                    _id: '$items.category',
                    totalRevenue: {
                        $sum : {
                            $multiply : ['$items.price' , '$items.quantity']
                        }
                    }
                }

            },
            {$sort : {totalRevenue : -1}}
        ]);
        res.json(result);
        
    } catch (error) {
        res.status(500).json({error : err.message})
        
    }
})

module.exports = router;

