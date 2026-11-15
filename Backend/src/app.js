import express from "express";
import userRouter from "./routes/user.routes.js";
import listingRouter from "./routes/listing.routes.js";
import { errorHandler } from "./middlewares/error.middlewares.js";
import cors from "cors";

const app = express();

const allowedOrigins = [
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.send("CampusKart backend running successfully!");
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/listings", listingRouter);

app.use(errorHandler);

export default app;
