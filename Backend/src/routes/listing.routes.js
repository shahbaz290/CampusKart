import { Router } from "express";
import { createListing, deleteListing, getAllListings, getListingById, getMyListings, updateListing, updateListingStatus} from "../controllers/listing.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router.post(
    "/create",
    verifyJWT,
    upload.array("images", 5),
    createListing
);
router.get('/', getAllListings)

router.get('/my-listings',verifyJWT,getMyListings)
router.patch('/update/:id',verifyJWT,updateListing)
router.patch('/:id/status',verifyJWT,updateListingStatus)
router.delete('/delete/:id',verifyJWT,deleteListing)

router.get('/:id', getListingById)
export default router