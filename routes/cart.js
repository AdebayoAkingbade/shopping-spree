const { verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin } = require("./verification");
const Cart = require('../models/Cart')

const router = require("express").Router();

router.post('/', verifyToken, async (req, res)=>{
    const newCart = new Cart(req.body)
    try{
      const savedCart= newCart.save();
      res.status(200).json(savedCart)
    }catch(err){
        res.status(500).json({error: err.message})
    }
})

router.put("/:id", verifyTokenAndAuth, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id, {
            $set: req.body,
        },
            { new: true }
        );
        console.log(updatedCart)
        res.status(200).json(updatedCart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.delete('/:id', verifyTokenAndAuth, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id)
        res.status.json("Cart deleted")
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.get('/find/:id', verifyTokenAndAuth, async (req, res) => {
    try {
        const cart = await Cart.findOne({id: req.params.id})
        res.status(200).json(cart)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.get("/", verifyTokenAndAdmin, async (req, res) => {
    
    try {
        const carts = await Cart.find()
        res.sendStatus(200).json(carts)
    } catch (err) {
        res.status(500).json(err)
    }
});

module.exports = router