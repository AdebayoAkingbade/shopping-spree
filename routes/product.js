const { verifyTokenAndAdmin } = require("./verification");
const Product = require('../models/Product')

const router = require("express").Router();

router.post('/', verifyTokenAndAdmin, async (req, res)=>{
    const newProduct = new Product(req.body)
    try{
      const savedProduct = await newProduct.save();
      res.status(200).json(savedProduct)
    }catch(err){
        res.status(500).json({error: err.message})
    }
})

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, {
            $set: req.body,
        },
            { new: true }
        );
        console.log(updatedProduct)
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status.json("Product deleted")
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.get('/find/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        return res.status(200).json(product)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.get("/", async (req, res) => {
    const newQ = req.query.new;
    const categoryQ = req.query.category
    try {
        let product;
        if(newQ){
            product = await Product.find().sort({createdAt: -1}).limit(1)
        }else if(categoryQ){
            product = await Product.find({categories:{
                $in: [categoryQ]
        },
       });
        }else{
            product = await Product.find()
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err)
    }
});


module.exports = router