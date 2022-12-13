import jsonwebtoken from "jsonwebtoken";
const { verify } = jsonwebtoken;

const JWT_SECRET = process.env.JWT_SECRET;

export const isAuth = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ errors: "autherization denied" });
  }

  try {
    const payload = verify(token, JWT_SECRET);
    req.body.userId = payload._id;
    next();
  } catch (err) {
    res.status(500).json({ errors: { msg: err.message } });
  }
};
