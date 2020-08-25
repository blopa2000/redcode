import { Router } from "express";
import path from "path";
import multer from "multer";
import fs from "fs-extra";
import filesystem from "fs";
//validate
import { isLogged } from "../../helpers/middlewares";
import { check, validationResult } from "express-validator";
import { serverUri } from "../../keys";

//mongo
import { user, publication, follows, comment } from "../../models/mongo";

const upload = multer({
  dest: path.join(__dirname, "../../public/images/upload/temp"),
});

const router = Router();
router.post(
  "/publication",
  isLogged,
  upload.single("publicData"),
  async (req, res) => {
    const dataUser = req.token;
    if (req.file) {
      try {
        const imageTemPath = req.file.path;
        const ext = path.extname(req.file.originalname);

        await filesystem.mkdir(`src/public/images/upload/${dataUser._id}/`);

        const targetPath = path.resolve(
          `src/public/images/upload/${dataUser._id}/${req.file.filename + ext}`
        );

        const PathImages = `${serverUri}/images/upload/${dataUser._id}/${
          req.file.filename + ext
        }`;

        if (
          ext == ".png" ||
          ext == ".jpg" ||
          ext == ".jpeg" ||
          ext == ".gif" ||
          ext == ".mp3"
        ) {
          await fs.rename(imageTemPath, targetPath);
          const newPublication = new publication({
            idUser: dataUser._id,
            images: PathImages,
            description: req.body.description,
          });
          newPublication.save(async (err, room) => {
            if (err) {
              throw "your post was not saved";
            }
            const updateUser = user.updateOne(
              { _id: dataUser._id },
              { $push: { publications: room._id } }
            );
            res.json({ message: "publication save", success: true });
          });
        } else {
          await fs.unlink(imageTemPath);
          res
            .status(401)
            .json({ message: "only images are allowed", success: false });
        }
      } catch (error) {
        return res
          .status(500)
          .json({ message: error, success: false });
      }
    } else {
      res.json({ message: "no existe el file", success: false });
    }
  }
);

router.get("/publication", async (req, res) => {
  const {id} = req.body
  const profile = await user
    .find({ "_id": id })
    .sort({ timestamp: -1 }).populate("publications");
  if (profile.length) {
    return res.json({
      profile,
      message: "data user",
      success: true,
    });
  }
  return res.json({
    info: ownPublications,
    message: "user is no defined",
    success: false,
  });
});














router.post("/publicationsOfFollow", isLogged, async (req, res) => {
  const dataUser = req.token;
  try {
    const myFollows = await follows.findOne({ idUser: dataUser._id });
    let publicationFollow = [];
    for (const id of myFollows.follows) {
      let publicationOfUser = await publication
        .find({ idUser: id })
        .sort({ timestamp: -1 });
      let userFollow = await user.findOne({ _id: id });
      publicationFollow.push({ publicationOfUser, userFollow });
    }
    res.json({
      message: "follow-up posts are successful",
      publicationFollow,
      success: true,
    });
  } catch (error) {
    res.json({ message: "get error publicationser", success: false, error });
  }
});















router.post("/likePublication", isLogged, async (req, res) => {
  const dataUser = req.token;
  const { idPublication } = req.body;

  try {
    const publicationData = await publication.findOne({ _id: idPublication });
    const findUserId = publicationData.reactions.findIndex(
      (element) => element == dataUser._id
    );

    if (findUserId < 0) {
      const likeData = await publication.updateOne(
        { _id: idPublication },
        { $push: { reactions: dataUser._id } }
      );
      if (likeData.nModified) {
        return res.json({ message: "like", success: true, isLike: true });
      }
      return res.json({ message: "like", success: false });
    } else {
      const updateLike = await publication.updateOne(
        { _id: idPublication },
        { $pull: { reactions: dataUser._id } },
        { multi: true }
      );
      if (updateLike.nModified) {
        return res.json({ message: "unlike", success: true, isLike: false });
      }
      return res.json({ message: "unlike", success: false });
    }
  } catch (error) {
    res.json({ message: "error like", success: false, error });
  }
});

router.post(
  "/comment",
  isLogged,
  [
    check("commentData").not().isEmpty().withMessage("comment  is required "),
    check("publicationId")
      .not()
      .isEmpty()
      .withMessage("publicationId is required "),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ success: false, errors: errors.array() });
    }

    const dataUser = req.token;
    const { commentData, publicationId } = req.body;
    try {
      const newcomment = new comment({
        author: dataUser._id,
        comment: commentData,
        publicationId,
      });
      await newcomment.save();
      return res.json({ message: "comment added ", success: true });
    } catch (error) {
      return res.json({ message: "no comment", success: false });
    }
  }
);

router.post("/getComments", isLogged, async (req, res) => {
  const { publicationId } = req.body;
  try {
    let response = await comment
      .find({ publicationId: publicationId })
      .sort({ timestamp: -1 });
    let comments = [];
    for (const item of response) {
      const userComment = await user.findOne({ _id: item.author });
      comments.push({
        dataComment: item,
        avatar: userComment.avatar,
        username: userComment.username,
      });
    }
    return res.json({ comments, message: "all comments ", success: true });
  } catch (error) {
    return res.json({ message: "not comments", success: false });
  }
});
module.exports = router;
