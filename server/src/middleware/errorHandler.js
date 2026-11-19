export function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.code === 11000) {
    return res.status(409).json({ message: "Email already registered" });
  }

  res.status(err.status || 500).json({
    message: err.status ? err.message : "Something went wrong on the server",
  });
}
