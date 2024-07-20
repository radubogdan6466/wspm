import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import PostList from "./PostList";
import AddPost from "./AddPost";
import PostDetails from "./PostDetails";
import "../styles/PostBox.css";

const PostBox = ({ displayName }) => {
  const [isAddingPost, setIsAddingPost] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Verifică dacă URL-ul s-a schimbat și setează starea corespunzătoare
    if (location.pathname === "/posts") {
      setIsAddingPost(false);
    }
  }, [location.pathname]);

  const handleAddPostClick = () => {
    setIsAddingPost(true);
  };

  const handlePostSelect = (postId) => {
    navigate(`/post/${postId}`);
  };

  const handleCloseAddPost = () => {
    setIsAddingPost(false);
  };

  return (
    <div className="PostBox">
      {!isAddingPost && (
        <button className="add-post-button" onClick={handleAddPostClick}>
          Add Post
        </button>
      )}
      {isAddingPost && (
        <AddPost displayName={displayName} onClose={handleCloseAddPost} />
      )}
      <Routes>
        <Route
          path="/"
          element={
            <PostList
              onSelectPost={handlePostSelect}
              displayName={displayName}
            />
          }
        />
        <Route
          path="/post/:postId"
          element={<PostDetails displayName={displayName} />}
        />
      </Routes>
    </div>
  );
};

export default PostBox;
