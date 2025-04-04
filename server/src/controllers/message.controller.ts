import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Message from '../models/Message';

export const sendMessage = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { recipient, content, attachments } = req.body;
    
    const message = new Message({
      sender: new mongoose.Types.ObjectId(req.user.id),
      recipient: new mongoose.Types.ObjectId(recipient),
      content,
      attachments,
    });

    await message.save();
    
    // Populate sender details
    await message.populate('sender', 'name picture');
    
    res.status(201).json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const messages = await Message.find({
      $or: [
        { sender: new mongoose.Types.ObjectId(req.user.id), recipient: new mongoose.Types.ObjectId(userId) },
        { sender: new mongoose.Types.ObjectId(userId), recipient: new mongoose.Types.ObjectId(req.user.id) },
      ],
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('sender', 'name picture')
      .populate('recipient', 'name picture');

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { messageId } = req.params;
    const message = await Message.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(messageId),
        recipient: new mongoose.Types.ObjectId(req.user.id),
      },
      { read: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(message);
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
};

export const getContacts = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userId = new mongoose.Types.ObjectId(req.user.id);
    // Get all users who have exchanged messages with the current user
    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: userId },
            { recipient: userId },
          ],
        },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', userId] },
              '$recipient',
              '$sender',
            ],
          },
          lastMessage: { $last: '$$ROOT' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: '$user._id',
          name: '$user.name',
          picture: '$user.picture',
          lastMessage: {
            content: '$lastMessage.content',
            createdAt: '$lastMessage.createdAt',
            unread: {
              $and: [
                { $eq: ['$lastMessage.recipient', userId] },
                { $eq: ['$lastMessage.read', false] },
              ],
            },
          },
        },
      },
      { $sort: { 'lastMessage.createdAt': -1 } },
    ]);

    res.json(contacts);
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ error: 'Failed to get contacts' });
  }
};
