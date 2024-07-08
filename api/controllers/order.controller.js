import createError from "../utils/createError.js";
import Order from "../models/order.model.js";
import Gig from "../models/gig.model.js";

export const createOrder = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.gigId);
    console.log("gig",gig);
    if (!gig) {
      return next(createError(404, "Gig not found"));
    }

    const newOrder = new Order({
      gigId: gig._id,
      img: gig.cover,
      title: gig.title,
      buyerId: req.userId,
      sellerId: gig.userId,
      price: gig.price,
      payment_intent: "temp",
    });

    await newOrder.save();
    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};

// export const getOrders = async (req, res, next) => {
//   try {
//     const orders = await Order.find({
//             ...(req.isSeller ? {sellerId : req.userId} : {buyerId: req.userId}),

//             isCompleted: true,
//     });
//     res.status(200).send(orders);
//   } catch (err) {
//     next(err);
//   }
// };

export const getOrders = async (req, res, next) => {
    try {
      const orders = await Order.find({
        ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
        isCompleted: true,
      });
  
      res.status(200).send(orders);
    } catch (err) {
      next(err);
    }
  };