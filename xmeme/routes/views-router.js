const router = require('express').Router();

//Home Page
router.get("/",async (req,res)=>{
    return res.render('pages/index');
});
//Top 10 Page
router.get("/top",async (req,res)=>{
    return res.render('pages/top10');
});

module.exports = router;