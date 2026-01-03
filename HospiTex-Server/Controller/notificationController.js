import { Notification, User } from '../models/schema.js';

// ======================== GET USER NOTIFICATIONS ========================
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    const { unreadOnly = false, limit = 50 } = req.query;

    let query = { user: userId };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const unreadCount = await Notification.countDocuments({ user: userId, isRead: false });

    return res.status(200).json({
      success: true,
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error("Get user notifications error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== MARK NOTIFICATION AS READ ========================
export const markAsRead = async (req, res) => {
  try {
    const userId = req.userId;
    const { notificationId } = req.params;

    const notification = await Notification.findOne({ _id: notificationId, user: userId });
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification
    });
  } catch (error) {
    console.error("Mark as read error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== MARK ALL AS READ ========================
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.userId;

    await Notification.updateMany(
      { user: userId, isRead: false },
      { isRead: true }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read"
    });
  } catch (error) {
    console.error("Mark all as read error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== DELETE NOTIFICATION ========================
export const deleteNotification = async (req, res) => {
  try {
    const userId = req.userId;
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndDelete({ _id: notificationId, user: userId });
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted"
    });
  } catch (error) {
    console.error("Delete notification error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== CREATE NOTIFICATION (Helper function for other controllers) ========================
export const createNotification = async (userId, title, message, type = "info", link = "", relatedId = null) => {
  try {
    const notification = new Notification({
      user: userId,
      title,
      message,
      type,
      link,
      relatedId
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error("Create notification error:", error);
    return null;
  }
};

