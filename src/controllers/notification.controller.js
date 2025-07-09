const ExcelJS = require('exceljs');
const Notification = require('../models/notification.model');

const extractCIFsFromExcel = async (filePath) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const sheet = workbook.worksheets[0];
  const cifList = [];

  sheet.eachRow((row) => {
    row.eachCell((cell) => {
      const value = cell.value?.toString().trim();
      if (/^\d{8}$/.test(value)) {
        cifList.push({ value });
      }
    });
  });

  // Remove duplicate objects based on 'value'
  const uniqueCIFs = Array.from(new Map(cifList.map(item => [item.value, item])).values());

  return uniqueCIFs;
};

const uploadNotification = async (req, res) => {
  try {
    const { schemaName, campaignName, title, content, tags, schedule } = req.body;
    const filePath = req.file.path;

    const cifs = await extractCIFsFromExcel(filePath);

    const newNotification = new Notification({
      schemaName,
      campaignName,
      title,
      content,
      tags: tags?.split(',') || [],
      cifs,
      schedule: new Date(schedule),
      createdBy: req.user.id,
    });

    await newNotification.save();

    res.status(201).json({
      message: '✅ Notification created successfully',
      count: cifs.length,
      notification: newNotification,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ Server error', error: err.message });
  }
};

const getAllNotifications = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: No user ID' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      Notification.find({ createdBy: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments({ createdBy: userId })
    ]);

    res.json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: notifications
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateNotification = async (req, res) => {
  try {
    const updated = await Notification.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Notification not found or not yours' });
    }

    res.json({ message: 'Updated successfully', notification: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const deleted = await Notification.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Notification not found or not yours' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  uploadNotification,
  getAllNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification
};
