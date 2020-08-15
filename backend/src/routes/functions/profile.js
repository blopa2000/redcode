const Router = require("express").Router();
const path = require("path");
const multer = require("multer");
const fs = require("fs-extra");
const jwt = require('jsonwebtoken');
const filesystem = require('fs');
//validate
const {isLogged} = require("../../helpers/middlewares")
const {check, validationResult } = require('express-validator');
const {serverUri,tokenKey} = require("../../keys");

//mongo
const {user,follows} = require("../../models/mongo");

var upload = multer({ dest: path.join(__dirname , "../../public/images/upload/temp")});

Router.post("/saveAvatar",isLogged,upload.single("avatar"),async (req,res)=>{
    const dataUser = req.token
    const imageTemPath = req.file.path;
    const ext = path.extname(req.file.originalname);
    
    await filesystem.mkdir(`src/public/images/icons/${dataUser._id}/`,(e) => {
        if(!e || (e && e.code === 'EEXIST')){ 
            console.log("existe el archivo"); 
        } else { 
            console.log("no existe el archivo");
        }
    });

    const targetPath = path.resolve(`src/public/images/icons/${dataUser._id}/${req.file.filename + ext}`);
    const PathImages = `${serverUri}/images/icons/${dataUser._id}/${req.file.filename + ext}`;

    if (ext == ".png" || ext == ".jpg" || ext == ".jpeg" || ext == ".gif") {
        await fs.rename(imageTemPath ,targetPath);
        const updateAvatarUser = await user.update({"_id":dataUser._id},{"avatar":PathImages})
        if(updateAvatarUser.nModified){
            const userLogin = await user.findOne({"_id":dataUser._id});
            const token = jwt.sign({
                data:userLogin
            },tokenKey,{expiresIn:60 * 60 * 24 * 30})

            return res.json({token,message:"avatar save",success:true})
        }
        return res.json({message:"internar error",success:false})
    }else{
        await fs.unlink(imageTemPath);
        res.status(500).json({error:"only images are allowed"})
    }
});

Router.post("/updateUserInfo",isLogged,[
    check('username').not().isEmpty().withMessage('user name is required'),
    check('firstName').not().isEmpty().withMessage('fist name is required'),
    check('lastName').not().isEmpty().withMessage('last name is required'),
    check('email').not().isEmpty().withMessage('email is required'),
    check('dateBirth').not().isEmpty().withMessage('date birth is required'),
    check('sex').not().isEmpty().withMessage('sex is required')
],async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(401).json({success:false,status:401, errors: errors.array() });
    }
    const dataUser = req.token
    try {
        const updateUser = await user.update({"_id":dataUser._id},req.body)
        if(updateUser.nModified){
            const userLogin = await user.findOne({"_id":dataUser._id});
            const token = jwt.sign({
                data:userLogin
            },tokenKey,{expiresIn:60 * 60 * 24 * 30})
            return res.json({token,success:true,message:"update information successfully"})
        }
        return res.json({success:false,message:"update failed information"})
    } catch (error) {
        return res.json({success:false,message:"internar error",error})
    }
});

//para visitar otros perfiles No BORRAR
Router.post("/otherUserPosts",async (req,res)=>{
    const {idUser} = req.body
    try {
        const userData = await user.findOne({"_id":idUser})
        console.log(userData);
        
        if(userData != null){
            return res.json({message:"another user",success:true,userData})
        }
        return res.json({message:"that user is not found",success:false})
    } catch (error) {
        return res.json({message:"internar error",success:false,error})
    }
})

Router.put("/follow",isLogged,async(req,res)=>{
    const dataUser = req.token
    const {idFollow} =  req.body;
    try {
        const resultFollow = await follows.update({"idUser":dataUser._id},{$push:{"follows":idFollow}});
        return res.json({resultFollow,message:"satisfactorily following a user",success:true});
    } catch (error) {
        return res.json({info:0,message:"user is no defined",success:false});
    }
});

Router.put("/unFollow",isLogged,async(req,res)=>{
    const dataUser = req.token
    const {idFollow} =  req.body;
    try {
        const resultFollow = await follows.update({"idUser":dataUser._id},{$pull:{"follows":idFollow}},{multi:true});
        return res.json({resultFollow,message:"Unfollow a user",success:true});
    } catch (error) {
        return res.json({info:0,message:"user is no defined",success:false});
    }
});

Router.post("/isFollowing",isLogged,async (req,res)=>{
    const dataUser = req.token
    const {idFollow} = req.body
    
    try {
        const isFollowing = await follows.findOne({"idUser":dataUser._id,"follows":{$all:[idFollow]}})

        if (isFollowing) {
            return res.json({message:"is following",success:true});
        }
        return res.json({message:"is not following",success:false});
    } catch (error) {
        return res.json({message:"internal error",success:false});
    }
})


module.exports = Router;