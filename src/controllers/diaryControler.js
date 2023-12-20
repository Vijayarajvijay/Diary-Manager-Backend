import diaryModel from "../models/disry.js";

const createDiary = async(req,res)=>{
    try {
        const {title,date,description} = req.body
        if(title && date && description)
        {
            await diaryModel.create({
                title,
                date,
                description,
                createdBy:req.headers.userId
             
            })
            res.status(201).send({
                message:'diary created successfully'
            
            })
        }
        else{
            res.status(404).send({
                message:"Title,date,description is required"
            })
        }
    } catch (error) {
        res.status(500).send({
            message:"Internal Server Error",
            error:error.message
        })
    }
}

const editDiary = async(req,res)=>{
    try {
        const diaryId = req.params.id
        if(diaryId)
        {
            const {title,date,description} = req.body
            let diary = await diaryModel.findById(diaryId)
            diary.title = title
            diary.date = date
            diary.description = description
            diary.editedAt = Date.now()

            await diary.save()

            res.status(200).send({
                message:"diary updated successfully"
            })
            
        }

        else{
            res.status(400).send({
                message:'diary id not found'
            })
        }
    } catch (error) {
        res.status(500).send({
            message:"Internal Server Error",
            error:error.message
        })
    }
}

const getDiarysById = async(req,res)=>{
try {
    const diaryId = req.params.id
    if(diaryId)
    {
        let diary = await diaryModel.findById(req.params.id)
        res.statusf(200).send({
            message:"diary fetched successfully",
            diary
        })
    }
    else{
        res.status(400).send({
            message:"diary id not found"
        })
    }
} catch (error) {
    res.status(500).send({
        message:"Internal Server Error",
        error:error.message
    })
}
} 

const getDiaryByUser = async (req, res) => {
    try {
        let diaries = await diaryModel
            .find({ createdBy: req.headers.userId }, { _id: 1,  date: 1, title: 1, description:1, createdAt: 1 })
            .sort({ createdAt: 1 });

        res.status(200).send({
            message: "Diaries fetched successfully",
            diaries // Corrected variable name
        });
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message
        });
    }
};


const getAllDiarys = async(req,res)=>{
    try {
        let diary = await diaryModel.find({},{_id:1,title:1,description:1,createdAt:1}).sort({createdAt:1})
    res.status(200).send({
        message:"diarys fetched successfully",
        diary
    })
    } catch (error) {
        res.status(500).send({
            message:"Internal Server Error",
            error:error.message
        })
    }
}

export default{
    createDiary,
    editDiary,
    getDiarysById,
    getDiaryByUser,
    getAllDiarys
}