import { Router } from "express";

import { requireAuth } from "../../shared/middleware/auth.middleware.js";
import * as c from "./notifications.controller.js";

export const notificationsRouter = Router();

notificationsRouter.use(requireAuth);

notificationsRouter.get("/", c.list);
notificationsRouter.get("/unread-count", c.unreadCount);
notificationsRouter.get("/stream", c.stream);
notificationsRouter.get("/push-status", c.pushStatus);
notificationsRouter.post("/push-token", c.registerPushToken);
notificationsRouter.delete("/push-token", c.unregisterPushToken);
notificationsRouter.patch("/:notificationId/read", c.markRead);
notificationsRouter.patch("/read-all", c.markAllRead);
