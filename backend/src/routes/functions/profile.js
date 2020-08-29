import { Router } from "express";
import path from "path";
import multer from "multer";
import fs from "fs-extra";

//validate
import { isLogged } from "../../helpers/middlewares";
import { check, validationResult } from "express-validator";
import { serverUri } from "../../keys";

//mongo
import { user, follows } from "../../models/mongo";

var upload = multer({
  dest: path.join(__dirname, "../../public/images/upload/temp"),
});
const router = Router();
router.post(
  "/saveAvatar",
  isLogged,
  upload.single("avatar"),
  async (req, res) => {
    const decoded = req.token;
    const imageTemPath = req.file.path;
    const ext = path.extname(req.file.originalname);

    await fs.mkdir(`src/public/images/icons/${decoded._id}/`, (e) => {
      if (!e || (e && e.code === "EEXIST")) {
        console.log("existe el archivo");
      } else {
        console.log("no existe el archivo");
      }
    });

    const targetPath = path.resolve(
      `src/public/images/icons/${decoded._id}/${req.file.filename + ext}`
    );
    const PathImages = `${serverUri}/images/icons/${decoded._id}/${
      req.file.filename + ext
    }`;

    if (ext == ".png" || ext == ".jpg" || ext == ".jpeg" || ext == ".gif") {
      await fs.rename(imageTemPath, targetPath);
      const updateAvatarUser = await user.findOneAndUpdate(
        { _id: decoded._id },
        { avatar: PathImages },
        { new: true }
      );
      if (updateAvatarUser != null) {
        return res.status(200).json({ message: "avatar save", success: true,avatar:updateAvatarUser.avatar });
      }
      return res.json({ message: "internar error", success: false });
    } else {
      await fs.unlink(imageTemPath);
      res.status(500).json({ error: "only images are allowed" });
    }
  }
);

router.post(
  "/updateUserInfo",
  isLogged,
  [
    check("username").not().isEmpty().withMessage("user name is required"),
    check("firstName").not().isEmpty().withMessage("fist name is required"),
    check("lastName").not().isEmpty().withMessage("last name is required"),
    check("email").not().isEmpty().withMessage("email is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .json({ success: false, status: 404, errors: errors.array() });
    }
    const decoded = req.token;
    try {

      const updateUser = await user.updateOne({ _id: decoded._id }, {
        username:req.body.username,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email,
        dateBirth:req.body.dateBirth,
        sex:req.body.sex,
        description:req.body.description
      });

      if (updateUser.nModified) {
        return res.json({
          success: true,
          message: "update information successfully",
        });
      }
      return res
        .json({ success: false, message: "update failed information" });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "internar error", error });
    }
  }
);

//para visitar perfiles
router.post("/getProfile/:id", async (req, res) => {
  const decoded = req.params.id
  try {
    const profile = await user.findOne({ _id: decoded });
    if (profile != null) {
      return res.json({message:"user found",success:true,profile})
    }
    return res.json({message:"user not found",success:false})
  } catch (error) {
    res.json({message:"internal error",success:false})
  }
});

router.put("/follow", isLogged, async (req, res) => {
  const decoded = req.token;
  const { idFollow } = req.body;
  try {
    const resultFollow = await follows.updateOne(
      { idUser: decoded._id },
      { $push: { follows: idFollow } }
    );
    return res.json({
      resultFollow,
      message: "satisfactorily following a user",
      success: true,
    });
  } catch (error) {
    return res.json({ info: 0, message: "user is no defined", success: false });
  }
});

router.put("/unFollow", isLogged, async (req, res) => {
  const decoded = req.token;
  const { idFollow } = req.body;
  try {
    const resultFollow = await follows.updateOne(
      { idUser: decoded._id },
      { $pull: { follows: idFollow } },
      { multi: true }
    );
    return res.json({
      resultFollow,
      message: "Unfollow a user",
      success: true,
    });
  } catch (error) {
    return res.json({ info: 0, message: "user is no defined", success: false });
  }
});

router.post("/isFollowing", isLogged, async (req, res) => {
  const decoded = req.token;
  const { idFollow } = req.body;

  try {
    const isFollowing = await follows.findOne({
      idUser: decoded._id,
      follows: { $all: [idFollow] },
    });

    if (isFollowing) {
      return res.json({ message: "is following", success: true });
    }
    return res.json({ message: "is not following", success: false });
  } catch (error) {
    return res.json({ message: "internal error", success: false });
  }
});

module.exports = router;
