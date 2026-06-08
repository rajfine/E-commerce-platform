import Razorpay from "razorpay"
import { config } from "../config/config.js"


//inctance of razorpay
export const razorpay = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID,
  key_secret: config.RAZORPAY_KEY_SECRET
})

export const createOrder = async ({amount, currency = "INR"}) => {
  const option = {
    amount: amount * 100, //coz razorpay works on paise (means the smallest unit 1rs = 100paise)
    currency,
  }

  const order = await razorpay.orders.create(option)
  return order
}