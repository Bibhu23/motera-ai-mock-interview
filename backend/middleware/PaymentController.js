import userModel from "../model/userModel.js";

export const handlePayment = async (userId) => {

    const user = await userModel.findById(userId);
    if (!user) {
        throw new Error("User not found or unauthorized");
    }


    if (user.creditBalance <= 0) {
        throw new Error("Not enough credit balance");
    }


    user.creditBalance -= 1;
    await user.save();


    return user.creditBalance;
};