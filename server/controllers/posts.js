import User from "../models/User.js";
import Post from "../models/posts.js";


export const createPost = async (req, res) =>{

    try {
        const {description, picturePath, userId} =req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            description,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []
        });
         await newPost.save();
         const post = await Post.find()
        res.status(201).json(post);

    } catch (error) {
        res.status(409).json({error: error.message});
    }
}

export const getFeedPosts = async (req, res) => {

    try {
        const post = await Post.find()
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({error: error.message});
    }
}

export const getUserPosts = async (req, res) => {

    try {
        const {userId} =  req.params;
        const post = await Post.find({userId});
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({error: error.message});
    }
}

export const likePost = async (req, res) => {

    try {
        const {postId} = req.params;
        const {userId} = req.body;
        const post = await Post.findById(postId);
        const isLiked = post.likes.get(userId);
        if(isLiked){
            post.likes.delete(userId);
        }else{
            post.likes.set(userId, true)
        }
        const updatedPost = await Post.findByIdAndUpdate(postId, {likes: post.likes}, {new: true})
        await post.save();
            res.status(200).json(updatedPost);
    } catch (error) {
        res.status(404).json({error: error.message});
    }
}