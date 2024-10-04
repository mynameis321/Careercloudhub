const Category = require('../models/Category');

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

//create a category
exports.createCategory = async(req,res) =>{
    try{
        //fetch data
        const {name,description} = req.body;

        //validate
        if(!name){
            return res.status(400).json({
                success: false,
                message:"Category Not Found. Please enter category"
            });
        }

        //entry in db
        const categoryDetails = await Category.create({
            name,
            description
        });
        // console.log("category: ",categoryDetails);

        //return response
        res.status(200).json({
            success: true,
            message: "Category created successfully"
        });

    }catch(err){
        console.log("Category not created");
        console.log(err);
        
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

//get All categories
exports.showAllCategories = async(req,res) =>{
    try{
        //it will return array of tags containing name and description only for each tags
        const allCategories = await Category.find(
            {},
            {
                name: true, 
                description:true,
            });

        if(!allCategories){
            return res.status(400).json({
                success: false,
                message: "No Categories Found"
            });
        }

        res.status(200).json({
            success: true,
            allCategories,
            message: "Categories fetched successfully"
        });

    }catch(err){
        console.log("Categories not fetched");
        console.log(err);
        
        res.status(500).json({
            success: false,
            message: err.message
        });        
    }
}
