import { Router } from 'express';
import {
	createUserProfile,
	followUser,
	getFollower,
	getFollowing,
	getUser,
	unfollowUser,
} from '../controllers/user.controler.js';
import authenticate from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);
router.post('/create-user-profile', createUserProfile);
router.post('/follow', followUser);
router.delete('/unfollow', unfollowUser);
router.post('/get-follower', getFollower);
router.post('/get-following', getFollowing);
router.post('/get-user', getUser);

export default router;