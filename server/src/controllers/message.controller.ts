import { Request, Response } from 'express';
import Message from '../models/message.model';
import Conversation from '../models/conversation.model';
import User from '../models/user.model';

// Get all conversations for a user
export const getConversations = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate('participants', 'name profilePicture')
      .sort({ updatedAt: -1 })
      .exec();

    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Error fetching conversations' });
  }
};

// Get messages for a conversation
export const getMessages = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    if (!req.user?._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Verify user is part of the conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id,
    }).exec();

    if (!conversation) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const messages = await Message.find({ conversationId })
      .populate('sender', 'name profilePicture')
      .sort({ createdAt: 1 })
      .exec();

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Error fetching messages' });
  }
};

// Send a message
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { conversationId, content } = req.body;
    if (!req.user?._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Verify user is part of the conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id,
    }).exec();

    if (!conversation) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Create and save the message
    const message = await Message.create({
      conversationId,
      sender: req.user._id,
      content,
    });

    // Update conversation's lastMessage and updatedAt
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      updatedAt: new Date(),
    }).exec();

    // Populate sender info before sending response
    await message.populate('sender', 'name profilePicture');

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Error sending message' });
  }
};

// Create a new conversation
export const createConversation = async (req: Request, res: Response) => {
  try {
    const { participantId } = req.body;
    if (!req.user?._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      participants: { $all: [req.user._id, participantId] },
    })
      .populate('participants', 'name profilePicture')
      .exec();

    if (existingConversation) {
      return res.json(existingConversation);
    }

    // Create new conversation
    const conversation = await Conversation.create({
      participants: [req.user._id, participantId],
    });

    // Populate participant info before sending response
    await conversation.populate('participants', 'name profilePicture');

    res.status(201).json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: 'Error creating conversation' });
  }
};

// Helper to get or create a conversation between two users
export const getOrCreateConversation = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const recipientId = req.body.recipientId;
    if (!userId || !recipientId || userId === recipientId) {
      return res.status(400).json({ error: 'Invalid recipient' });
    }
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, recipientId], $size: 2 },
    });
    if (!conversation) {
      conversation = new Conversation({ participants: [userId, recipientId] });
      await conversation.save();
    }
    res.json({ conversationId: conversation._id });
  } catch (error) {
    console.error('Error getting/creating conversation:', error);
    res.status(500).json({ error: 'Error getting/creating conversation' });
  }
};

// Get message contacts
export const getMessageContacts = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Find all users who are mutual followers with current user
    const mutuals = await User.find({
      _id: { $ne: req.user._id },
      followers: req.user._id,
      following: req.user._id,
    }).select('name profilePicture');

    res.json(mutuals.map((u: any) => ({
      _id: u._id,
      name: u.name,
      picture: u.profilePicture,
    })));
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Error fetching contacts' });
  }
};
