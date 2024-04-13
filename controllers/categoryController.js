import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";

// create category
export const createCategoryController = async (req,res) => {
    try{
        const {name} = req.body
        if(!name){
            return res.status(401).send({message:'Name is required'})
        }
        // check category already exist or not
        const existingCategory = await categoryModel.findOne({name});
        if(existingCategory){
            return res.status(201).send({
                success:true,
                message:'Category Already Exists'
            })
        }
        // if not ,save category in DB
        const category = await new categoryModel({name, slug:slugify(name)}).save();

        // sending category created msg to server-console
        console.log('created Category saved successfully in DB'.bgGreen.white);

        // Category-API (used in FE)
        res.status(200).send({
            success:true,
            message:"New Category Created",
            category:category,
        })

    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error in Category'
        })
    }
}

// update category controller
export const updateCategoryController = async (req,res) => {
    try{
        const {name} =req.body;
        const {id} = req.params;
        const category = await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})
        // response to server console
        console.log("Category Updated Successfully".bgGreen.white)
        // updated category API
        res.status(200).send({
            success:true,
            message: "Category Updated Successfully",
            category,
        })
    }catch(error){
        console.log(error);
        res.status(401).send({
            success:false,
            message: "Error in updating category",
            error
        })
    }
}

// GEt(REad) All Category
export const categoryController = async (req,res) => {
    try{
        const category = await categoryModel.find({});
        // All-category API
        res.status(200).send({
            success:true,
            message:"All Categories List",
            category
        })
    }catch(error){
        console.log(error);
        res.status(401).send({
            success:false,
            message: "Error while getting all categories",
            error
        })
    }
}

// Get(read) single category
export const singleCategoryController = async (req,res) => {
    try{
        const category = await categoryModel.findOne({slug: req.params.slug})
        // API
        res.status(200).send({
            success:true,
            message:"Get Single Category Successfully",
            category,
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error while getting single category",
            error
        })
    }
}

// DElete category
export const deleteCategoryController = async (req,res) => {
    try{
        const {id} = req.params;
        await categoryModel.findByIdAndDelete(id)
        // not need to store deleted data and send through API
        // API
        res.status(200).send({
            success:true,
            message: "Category Deleted Successfully",
        });
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:true,
            message: "Error in deleting a category",
            error
        })
    }
}