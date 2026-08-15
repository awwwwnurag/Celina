// @desc    Simulate sending promotional or system notification
// @route   POST /api/notifications
// @access  Private/Admin
export const sendNotification = async (req, res, next) => {
  const { type, title, message, targetUser } = req.body;

  if (!type || !title || !message) {
    res.status(400);
    return next(new Error('Type, title, and message are required'));
  }

  try {
    // In a production system, this could integrate with Firebase Cloud Messaging, Twilio, or Nodemailer.
    // For this Website Management System, we will return a detailed success message.
    console.log(`Notification sent: Type: ${type}, Title: ${title}, Target: ${targetUser || 'All Users'}`);
    
    res.json({
      success: true,
      message: `Notification "${title}" of type ${type} dispatched successfully to ${targetUser || 'all registered customers'}.`
    });
  } catch (error) {
    next(error);
  }
};
