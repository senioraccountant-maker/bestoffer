import * as repo from "./notifications.repo.js";

export async function listUserNotifications(userId, query) {
  const unreadOnly =
    query?.unreadOnly === true ||
    query?.unreadOnly === "true" ||
    query?.unreadOnly === "1";
  const limit = Number(query?.limit || 50);

  return repo.listUserNotifications(userId, {
    unreadOnly,
    limit,
  });
}

export async function unreadCount(userId) {
  const unreadCount = await repo.countUnreadNotifications(userId);
  return { unreadCount };
}

export async function markRead(userId, notificationId) {
  const ok = await repo.markNotificationRead(userId, notificationId);
  if (!ok) {
    const err = new Error("NOTIFICATION_NOT_FOUND");
    err.status = 404;
    throw err;
  }
}

export async function markAllRead(userId) {
  return repo.markAllNotificationsRead(userId);
}

export async function registerPushToken(userId, body) {
  const token = String(body?.token || "").trim();
  if (!token) {
    const err = new Error("PUSH_TOKEN_REQUIRED");
    err.status = 400;
    throw err;
  }

  await repo.upsertPushToken({
    userId,
    token,
    platform: body?.platform || null,
    appVersion: body?.appVersion || null,
    deviceModel: body?.deviceModel || null,
  });
}

export async function unregisterPushToken(userId, body) {
  const token = String(body?.token || "").trim();
  if (!token) {
    const err = new Error("PUSH_TOKEN_REQUIRED");
    err.status = 400;
    throw err;
  }

  await repo.deactivatePushToken(userId, token);
}

export async function pushStatus(userId) {
  const base = repo.getPushConfigStatus();
  const activeTokens = await repo.listActivePushTokens(userId);
  return {
    ...base,
    activeTokens: activeTokens.length,
  };
}
