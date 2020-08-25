import { Router } from "express";
import path from "path";
import multer from "multer";
import fs from "fs-extra";
import filesystem from "fs";

//validate
import { isLogged } from "../../helpers/middlewares";
import { check, validationResult } from "express-validator";
import { serverUri, tokenKey } from "../../keys";

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

    await filesystem.mkdir(`src/public/images/icons/${decoded._id}/`, (e) => {
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
      const updateAvatarUser = await user.updateOne(
        { _id: decoded._id },
        { avatar: PathImages }
      );
      if (updateAvatarUser.nModified) {
        return res.status(200).json({ message: "avatar save", success: true });
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
    check("dateBirth").not().isEmpty().withMessage("date birth is required"),
    check("sex").not().isEmpty().withMessage("sex is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(404)
        .json({ success: false, status: 401, errors: errors.array() });
    }
    const decoded = req.token;
    try {
      const updateUser = await user.updateOne({ _id: decoded._id }, req.body);
      if (updateUser.nModified) {
        return res.json({
          success: true,
          message: "update information successfully",
        });
      }
      return res.status(500).json({ success: false, message: "update failed information" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "internar error", error });
    }
  }
);

//para visitar otros perfiles 
router.post("/otherUserPosts", async (req, res) => {
  const { idUser } = req.body;
  try {
    const userInfo = await user.findOne({ _id: idUser });

    if (userInfo != null) {
      return res.json({ message: "another user", success: true, userInfo });
    }
    return res.json({ message: "that user is not found", success: false });
  } catch (error) {
    return res.json({ message: "internar error", success: false, error });
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
