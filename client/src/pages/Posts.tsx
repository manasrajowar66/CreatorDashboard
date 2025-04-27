import React, { useCallback, useEffect, useState } from "react";
import { IPost } from "../types";
import { useNavigate, useParams } from "react-router-dom";
import PostList from "../components/Dashboard/PostList";
import axiosInstance, {
  CustomAxiosRequestConfig,
} from "../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import {
  hideGlobalLoader,
  showGlobalLoader,
} from "../store/reducers/globalLoader";

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [postType, setPostType] = useState("");
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const fetchPosts = useCallback(
    async (type: string) => {
      try {
        dispatch(showGlobalLoader());
        const response = await axiosInstance.get(`post/${type}`, {
          showSuccessToast: false,
        } as CustomAxiosRequestConfig);
        setPosts(response.data.posts);
      } catch (error) {
        console.error("Error in fetching posts", error);
      } finally {
        dispatch(hideGlobalLoader());
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const { type } = params;
    if (type) {
      if (type !== "saved" && type !== "reported") {
        navigate("/", { replace: true });
      }
      setPostType(type as "saved" | "reported");
      fetchPosts(type as string);
    }
  }, [params, navigate, fetchPosts]);

  return (
    <PostList
      posts={posts}
      totalCount={posts.length}
      type={postType as "saved" | "reported"}
      showViewMoreButton={false}
    />
  );
};

export default Posts;
