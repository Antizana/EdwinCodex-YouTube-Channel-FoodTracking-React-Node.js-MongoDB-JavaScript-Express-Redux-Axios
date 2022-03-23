module.exports = (mongoose) => {
  const Foods = mongoose.model(
    "foods",
    mongoose.Schema(
      {
        user: String,
        dateTimeFoodTaken: Date,
        productName: String,
        calorieValue: Number,
        price: Number,
      },
      { timestamps: true }
    )
  );
  return Foods;
};
