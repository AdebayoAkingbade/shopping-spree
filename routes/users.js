const { verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin } = require("./verification");
const User = require('../models/Users')


const router = require("express").Router();

router.put("/:id", verifyTokenAndAuth, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.SECRET_PASS
        ).toString();
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, {
            username: req.body.username,
        },
            { new: true }
        );
        console.log(updatedUser)
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.delete('/:id', verifyTokenAndAuth, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status.json("User deleted")
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const { password, ...others } = user._doc;
        return res.status(200).json(others)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new
    try {
        const users = query ? await User.find().sort({_id: -1}).limit(5):await User.find()
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() -1 ));
    try {
        const data = await User.aggregate([
            {$match: {createdAt: {$gte: lastYear}}},
            {
                $project: {
                    month: {$month: '$createdAt'},
                },
            },
            {
                $group:{
                    _id: '$month',
                    total: { $sum: 1},
                }
            }
        ])
    res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router