// routes>comments.js

const express = require("express");
const router = express.Router();

// 댓글 생성 API (POST)
const Comments = require("../schemas/comment.js");

router.post("/comments/:_id", async (req, res) => {
  const { user, password, content } = req.body;
  const postId = req.params;

  if (!content) {
    return res.status(400).json({
      message: "댓글 내용을 입력해주세요."
    })
  }

  try {
    await Comments.create({
      postId: postId, 
      user: user, 
      password: password, 
      content: content
    });

    res.json({
      message: "댓글을 생성하였습니다."
    });
  // try-catch
  } catch (error) {
    return res.status(400).json({
      message: "데이터 형식이 올바르지 않습니다."
    });
  }
});

// 댓글 목록 조회 API (GET)
router.get("/comments/:_id", async (req, res) => {
  const postId = req.params;

  try {
    const comments = await Comments.find({
      postId: postId
    }, { _id: 1, user: 1, content: 1, createdAt: 1 });
    
    res.json({
      "data": comments
    });
  } catch (error) {
    return res.status(400).json({
      message: "데이터 형식이 올바르지 않습니다."
    })
  }
});

// 댓글 수정 API
router.put("/comments/:_id", async (req, res) => {
  const { _id } = req.params;
  const { password, content } = req.body;

  try {
    const commentToUpdate = await Comments.findById(_id);
    if (!commentToUpdate) {
      return res.status(404).json({
        message: "댓글 조회에 실패하였습니다."
      })
    }

    if (password !== commentToUpdate.password) {
      return res.status(401).json({
        message: "비밀번호가 일치하지 않습니다."
      });
    }

    await Comments.findByIdAndUpdate(_id, 
      { content: content },
      { new: true }
    );

    res.json({
      message: "댓글을 수정하였습니다."
    });
  // try-catch
  } catch (error) {
    res.status(400).json({
      message: "데이터 형식이 올바르지 않습니다."
    });
  }
});

// 댓글 삭제 API
router.delete("/comments/:_id", async (req, res) => {
  const { _id } = req.params;
  const { password } = req.body;

  try {
    const commentToDelete = await Comments.findById(_id);
    if (!commentToDelete) {
      return res.status(404).json({
        message: "댓글 조회에 실패하였습니다."
      })
    }

    if (password !== commentToDelete.password) {
      return res.status(401).json({
        message: "비밀번호가 일치하지 않습니다."
      });
    }

    await Comments.deleteOne({
      _id: _id
    })

    res.json({
      message: "댓글을 삭제하였습니다."
    });
  // try-catch
  } catch (error) {
    res.status(400).json({
      message: "데이터 형식이 올바르지 않습니다."
    });
  }
});

module.exports = router
