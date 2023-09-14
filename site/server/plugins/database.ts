import mongoose from "mongoose";

export default async () => {
  try {
    if (!process.env.NUXT_MONGO_URL) {
      return createError({
        statusCode: 500,
        statusMessage: "NUXT_MONGO_URL is not set",
      });
    }
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.NUXT_MONGO_URL);
  } catch (error) {
    return createError({
      statusCode: 500,
      statusMessage: "Something went wrong.",
    });
  }
};
