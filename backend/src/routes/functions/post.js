import { Router } from "express";
import path from "path";
import multer from "multer";
import fs from "fs-extra";

//validate
import { isLogged } from "../../helpers/middlewares";
import { check, validationResult } from "express-validator";
import { serverUri } from "../../keys";

//mongo
import { user, post, follows, comment } from "../../models/mongo";

const upload = multer({
  dest: path.join(__dirname, "../../public/images/upload/temp"),
});

const router = Router();
router.post("/post", isLogged, upload.single("post"), async (req, res) => {
  const decoded = req.token;
  if (req.file) {
    try {
      const imageTemPath = req.file.path;
      const ext = path.extname(req.file.originalname);

      await fs.mkdir(`src/public/images/upload/${decoded._id}/`, (e) => {
        if (!e || (e && e.code === "EEXIST")) {
          console.log("existe el archivo");
        } else {
          console.log("no existe el archivo");
        }
      });

      const targetPath = path.resolve(
        `src/public/images/upload/${decoded._id}/${req.file.filename + ext}`
      );

      const PathImages = `${serverUri}/images/upload/${decoded._id}/${
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
        const newPost = new post({
          idUser: decoded._id,
          images: PathImages,
          description: req.body.description,
        });
        newPost.save(async (err, room) => {
          if (err) {
            throw "your post was not saved";
          }
          const updateUser = await user.updateOne(
            { _id: decoded._id },
            { $push: { posts: room._id } }
          );
          res.json({ message: "post save", success: true });
        });
      } else {
        await fs.unlink(imageTemPath);
        res.json({ message: "only images are allowed", success: false });
      }
    } catch (error) {
      return res.json({ message: error, success: false });
    }
  } else {
    res.json({ message: "file does not exist", success: false });
  }
});

router.post("/posts", async (req, res) => {
  const { id } = req.body;
  try {
    const posts = await post.find({ idUser: id }).sort({ timestamp: -1 });
    if (posts != null) {
      return res.json({
        posts,
        message: "data user",
        success: true,
      });
    }
    return res.json({
      message: "user is no defined",
      success: false,
    });
  } catch (error) {
    res.json({
      message: "internal error",
      success: false,
    });
  }
});

router.post("/postsOfFollow", isLogged, async (req, res) => {
  const decoded = req.token;
  try {
    const myFollows = await follows.findOne({ idUser: decoded._id });
    const data = [];
    for (const id of myFollows.follows) {
      let posts = await user.findOne({ _id: id }).populate("posts");

      data.push(posts);
    }
    res.json({ posts: data, success: true });
  } catch (error) {
    res.json({ message: "get error posts", success: false, error });
  }
});

router.post("/likePost", isLogged, async (req, res) => {
  const decoded = req.token;
  const { idPost } = req.body;

  try {
    const findPost = await post.findOne({ _id: idPost });
    const findUserId = findPost.reactions.findIndex((element) => {
      return String(element) == String(decoded._id);
    });

    if (findUserId < 0) {
      const likeData = await post.updateOne(
        { _id: idPost },
        { $push: { reactions: decoded._id } }
      );
      if (likeData.nModified) {
        return res.json({ message: "like", success: true, isLike: true });
      }
      return res.json({ message: "like", success: false });
    } else {
      const updateLike = await post.updateOne(
        { _id: idPost },
        { $pull: { reactions: decoded._id } },
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
    //check("postId").isEmpty().not().withMessage("postId is required "),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ success: false, errors: errors.array() });
    }

    const decoded = req.token;
    const { commentData, postId } = req.body;
    try {
      const newcomment = new comment({
        author: decoded._id,
        comment: commentData,
        postId,
      });
      await newcomment.save();
      return res.json({ message: "comment added ", success: true });
    } catch (error) {
      return res.json({ message: "no comment", success: false });
    }
  }
);

router.post("/getComments", isLogged, async (req, res) => {
  const { postId } = req.body;
  try {
    let response = await comment
      .find({ postId: postId })
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
