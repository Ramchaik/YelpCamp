import { Campground } from "../models/campground";
import { Review } from "../models/review";
import { Request, Response } from "express";
import { ExpressReqWithSession } from "../types";

const createReview = async (req: ExpressReqWithSession, res: Response) => {
  const campground = await Campground.findById(req.params.id);
  const review = Review.build({ ...req.body.review, author: req.user._id });
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "Created a new review!");
  res.redirect(`/campgrounds/${campground._id}`);
};

const deleteReview = async (req: Request, res: Response) => {
  const { id, reviewId } = req.params;
  // @ts-ignore
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted the review!");
  res.redirect(`/campgrounds/${id}`);
};

export default {
  createReview,
  deleteReview,
};
