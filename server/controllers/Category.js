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

exports.editCategory = async(req,res) =>{
    try{
        //fetch data and file
        const updates = req.body;
        const {categoryId} = req.body;

        // console.log(req.body);
        
        //validate category
        const categoryDetails = await Category.findById({_id:categoryId});
        if(!categoryDetails){
            return res.status(401).json({
                success: false,
                message: "Invalid Category"
            });
        }
        

        //inserting entry in db
        const updatedCategory = await Category.findByIdAndUpdate(
            {_id: categoryDetails?._id},
            updates,
            {new: true}
        )
        .exec();

        // return response
        return res.status(200).json({
            success: true,
            data: updatedCategory,
            message: "Category updated Successfully"
        });

    }catch(err){
        console.log("Could not update Category");
        console.log(err);
		res.status(500).json({
			success: false,
			message: "Something went wrong. Please try again later"
		});
    }
}

exports.getCategoryDetails = async(req,res)=>{
    try {
        const {categoryId} = req.body;

        if(!categoryId){
            return res.status(401).json({
                success:false,
                message:"Details not found"
            });
        }

        const categoryDetails = await Category.findById(categoryId);
        if(!categoryDetails){
            return res.status(404).json({
                success: false,
                message: `Category not found`
            })
        }
        // console.log(categoryDetails)

        res.status(200).json({
            success: true,
            message: "Category details fetched successfully",
            data: categoryDetails
        })

    } catch (err) {
        console.log("Could not fetch category details",err);
        res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later"
        })
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
