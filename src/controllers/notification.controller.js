const ExcelJS = require('exceljs');
const Notification = require('../models/notification.model');
const CIF = require('../models/cif.model');
const crypto = require('crypto');
const fs = require('fs/promises');


const extractCIFsFromExcel = async (filePath) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const sheet = workbook.worksheets[0];
  const cifList = []; // you can make this a Set if you want to avoid duplicates 
  

  sheet.eachRow((row) => {
    row.eachCell((cell) => {
      const value = cell.value?.toString().trim();
      if (/^\d{8}$/.test(value)) {
        cifList.push({ value });
      }
    });
  });

  // Remove duplicates 
  //no need for this if you are using a Set
  const uniqueCIFs = Array.from(new Map(cifList.map(item => [item.value, item])).values());

  return uniqueCIFs;
};

const hashCIF = (value) => {
  return crypto.createHash('sha256').update(value).digest('hex');
};


const uploadNotification = async (req, res) => {
  try {
    const { title, content, tags, schedule } = req.body;
    const filePath = req.file.path;

    const extractedCIFs = await extractCIFsFromExcel(filePath);

    // ✅ Delete the uploaded Excel file after extracting data
    try {
      await fs.unlink(filePath);
      console.log(`🗑️ Deleted uploaded file: ${filePath}`);
    } catch (unlinkErr) {
      console.warn(`⚠️ Could not delete file ${filePath}:`, unlinkErr.message);
    }

    const newNotification = new Notification({      
      title,
      content,
      tags: tags?.split(',') || [],
      schedule: new Date(schedule),
      createdBy: req.user.id,
      cifs: []
    });

    // Save notification early to get the _id
    await newNotification.save();

    let addedCIFs = 0;

    for (const cif of extractedCIFs) {
      const hash = hashCIF(cif.value);

      // Check if CIF already exists globally
      let existingCIF = await CIF.findOne({ hash });

      if (!existingCIF) {
        existingCIF = await CIF.create({
          value: cif.value,
          hash
        });
        console.log(`✅ Created new CIF: ${cif.value}`);
      } else {
        console.log(`♻️ Reusing existing CIF: ${cif.value}`);
      }

      // Add CIF to this notification if not already linked
      if (!newNotification.cifs.includes(existingCIF._id)) {
        newNotification.cifs.push(existingCIF._id);
        addedCIFs++;
      }
    }

    await newNotification.save();

    res.status(201).json({
      message: '✅ Notification created successfully',
      count: addedCIFs,
      notification: newNotification
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
//make the pagination generic with helper functions
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      Notification.find({ createdBy: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments({ createdBy: userId })
    ]);

    const withCIFs = await Promise.all(notifications.map(async (notif) => {
      const cifs = await CIF.find({ notification: notif._id }).lean();
      return { ...notif, cifs };
    }));

    res.json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: withCIFs
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      createdBy: req.user.id // no need to check if user you can return any notification regardless of user
    }).lean();

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    const cifs = await CIF.find({ notification: notification._id }).lean();

    res.json({ ...notification, cifs });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateNotification = async (req, res) => {
  try {
    //need to update the file and cifs if they are provided too (check if file exists in req and extract the cifs and update the cifs group )
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

    await CIF.deleteMany({ notification: deleted._id });

    res.json({ message: 'Notification and associated CIFs deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const searchNotifications = async (req, res) => {
  try {
    const search = req.query.q?.trim();

    if (!search) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const regex = new RegExp(search, 'i'); // case-insensitive match

    const notifications = await Notification.find({
      $or: [      
        { title: regex },
        { tags: regex }
      ]
    }).sort({ createdAt: -1 }).lean();

    const resultsWithCIFs =
      notifications.map(async (notif) => {
        const cifs = await CIF.find({ notification: notif._id }).lean(); //return plain JavaScript objects
        return { ...notif, cifs };
      })
    

    res.status(200).json(resultsWithCIFs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// you can comments this out till you add sendNotification firebase config again 
const sendNotificationHandler = async (req, res) => {
  try {
    const { token, title, body } = req.body;
    
    if (!token || !title || !body) {
      return res.status(400).json({ message: 'Missing token, title or body in request.' });
    }


    const response = await sendNotification(token, { title, body });

    res.status(200).json({
      message: '✅ Notification sent successfully',
      firebaseResponse: response,
    });
  } catch (error) {
    console.error('❌ Error in sendNotificationHandler:', error.message);
    res.status(500).json({ message: 'Failed to send notification', error: error.message });
  }
};




module.exports = {
  uploadNotification,
  getAllNotifications,
  getNotificationById,
  updateNotification,
  searchNotifications,
  deleteNotification
};
