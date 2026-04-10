import { Router } from "express";
import { adminRouter } from "./modules/admin.routes.js";
import { authRouter } from "./modules/auth.routes.js";
import { communityRouter } from "./modules/community.routes.js";
import { eventRouter } from "./modules/event.routes.js";
import { messageRouter } from "./modules/message.routes.js";
import { questionRouter } from "./modules/question.routes.js";
import { resourceRouter } from "./modules/resource.routes.js";
import { searchRouter } from "./modules/search.routes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/questions", questionRouter);
apiRouter.use("/communities", communityRouter);
apiRouter.use("/resources", resourceRouter);
apiRouter.use("/events", eventRouter);
apiRouter.use("/messages", messageRouter);
apiRouter.use("/search", searchRouter);
apiRouter.use("/admin", adminRouter);
