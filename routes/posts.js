// routes>posts.js

const express = require("express");
const router = express.Router();

// 게시글 생성 API (POST)
const Posts = require("../schemas/post.js");

router.post("/posts", async (req, res) => {
	const { user, password, title, content } = req.body;

  try {
    await Posts.create({
      user: user, 
      password: password, 
      title: title, 
      content: content
    });

    res.status(201).json({
      message: "게시글을 생성하였습니다."
    });
  // try-catch
  } catch (error) {
    return res.status(400).json({
      message: "데이터 형식이 올바르지 않습니다."
    });
  }
});

// 게시글 조회 API (GET)
router.get("/posts", async (req, res) => {
	const posts = await Posts.find({}, { _id: 1, user: 1, title: 1, createdAt: 1 });
    res.json({
      "data": posts
    });
});

// 게시글 상세 조회 API (GET)
router.get("/posts/:_id", async (req, res) => {
  const { _id } = req.params;

  try {
    const detail = await Posts.findById(_id, { _id: 1, user: 1, title: 1, content: 1, createdAt: 1 });

    res.json({
      data: detail
    });
  // try-catch
  } catch (error) {
    res.status(400).json({
      message: "데이터 형식이 올바르지 않습니다."
    });
  }
});

// 게시글 수정 API
router.put("/posts/:_id", async (req, res) => {
  const { _id } = req.params;
  const { password, title, content } = req.body;

  try {
    const postToUpdate = await Posts.findById(_id);
    if (!postToUpdate) {
      return res.status(404).json({
        message: "게시글 조회에 실패하였습니다."
      })
    }

    if (password !== postToUpdate.password) {
      return res.status(401).json({
        message: "비밀번호가 일치하지 않습니다."
      });
    }

    await Posts.findByIdAndUpdate(_id, 
      { title: title, content: content },
      { new: true }
    );

    res.json({
      message: "게시글을 수정하였습니다."
    });
  // try-catch
  } catch (error) {
    res.status(400).json({
      message: "데이터 형식이 올바르지 않습니다."
    });
  }
});

// 게시글 삭제 API
router.delete("/posts/:_id", async (req, res) => {
  const { _id } = req.params;
  const { password } = req.body;

  try {
    const postToDelete = await Posts.findById(_id);
    if (!postToDelete) {
      return res.status(404).json({
        message: "게시글 조회에 실패하였습니다."
      })
    }

    if (password !== postToDelete.password) {
      return res.status(401).json({
        message: "비밀번호가 일치하지 않습니다."
      });
    }

    await Posts.deleteOne({
      _id: _id
    })

    res.json({
      message: "게시글을 삭제하였습니다."
    });
  // try-catch
  } catch (error) {
    res.status(400).json({
      message: "데이터 형식이 올바르지 않습니다."
    });
  }
});

module.exports = router
