const ExcelJS = require('exceljs');
const Notification = require('../models/notification.model');
const CIF = require('../models/cif.model');
const crypto = require('crypto');
const fs = require('fs/promises');


const extractCIFsFromExcel = async (filePath) => {
  try {
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

    // Remove duplicates
    const uniqueCIFs = Array.from(new Map(cifList.map(item => [item.value, item])).values());

    // Check if list is empty
    if (uniqueCIFs.length === 0) {
      throw new Error('Invalid CIFs: No valid 8-digit CIFs found in the file.');
    }

    return uniqueCIFs;
  } catch (err) {
    throw new Error(`Failed to extract CIFs: ${err.message}`);
  }
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

    // ✅ If no valid CIFs, don't create notification
    if (!extractedCIFs || extractedCIFs.length === 0) {
      return res.status(400).json({ message: '❌ No valid CIFs found. Notification not created.' });
    }

    let addedCIFs = 0;
    const cifIds = [];

    for (const cif of extractedCIFs) {
      const hash = hashCIF(cif.value);
      let existingCIF = await CIF.findOne({ hash });

      if (!existingCIF) {
        existingCIF = await CIF.create({ value: cif.value, hash });
        console.log(`✅ Created new CIF: ${cif.value}`);
      } else {
        console.log(`♻️ Reusing existing CIF: ${cif.value}`);
      }

      cifIds.push(existingCIF._id);
      addedCIFs++;
    }

    // ✅ Create and save notification only after valid CIFs are ready
    const newNotification = new Notification({
      title,
      content,
      tags: tags?.split(',') || [],
      schedule: new Date(schedule),
      createdBy: req.user.id,
      cifs: cifIds
    });

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

    const resultsWithCIFs = await Promise.all(
      notifications.map(async (notif) => {
        const cifs = await CIF.find({ notification: notif._id }).lean();
        return { ...notif, cifs };
      })
    );
      
      res.status(200).json(resultsWithCIFs);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };

// const sendNotificationHandler = async (req, res) => {
//   try {
//     const { token, title, body } = req.body;
    
//     if (!token || !title || !body) {
//       return res.status(400).json({ message: 'Missing token, title or body in request.' });
//     }


//     const response = await sendNotification(token, { title, body });

//     res.status(200).json({
//       message: '✅ Notification sent successfully',
//       firebaseResponse: response,
//     });
//   } catch (error) {
//     console.error('❌ Error in sendNotificationHandler:', error.message);
//     res.status(500).json({ message: 'Failed to send notification', error: error.message });
//   }
// };




module.exports = {
  uploadNotification,
  getAllNotifications,
  getNotificationById,
  updateNotification,
  searchNotifications,
  deleteNotification
};