const router = require(express).Router()
const Paystack = require('paystack').process.env.PAYSTACK_KEY


router.post('/payment', (req, res)=>{
    Paystack.charges.create({
        source: req.body.tokenId,
        currency: 'usd',
        amount: req.body.amount,
    }, (paystackErr, paystackRes)=>{
        if(paystackErr){
            res.status(500).json(paystackErr)
        }else{
            res.status(200).json(paystackRes)
        }
    })
})


module.exports = router