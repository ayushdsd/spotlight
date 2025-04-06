import { Request, Response } from 'express';
import User from '../models/user.model';
import Job from '../models/job.model';

interface SearchFilters {
  query?: string;
  location?: string;
  skills?: string[];
  role?: 'artist' | 'recruiter';
  type?: string;
  category?: string;
  minSalary?: number;
  maxSalary?: number;
}

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const { query, role } = req.query;
    const searchQuery: any = {};

    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ];
    }

    if (role) {
      searchQuery.role = role;
    }

    const users = await User.find(searchQuery)
      .select('name email role profilePicture bio')
      .limit(20)
      .exec();

    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Error searching users' });
  }
};

export const searchArtists = async (req: Request, res: Response) => {
  try {
    const filters: SearchFilters = req.query;
    const query: any = { role: 'artist' };

    // Add search filters
    if (filters.query) {
      query.$or = [
        { name: { $regex: filters.query, $options: 'i' } },
        { bio: { $regex: filters.query, $options: 'i' } },
        { skills: { $in: [new RegExp(filters.query, 'i')] } },
      ];
    }

    if (filters.location) {
      query.location = { $regex: filters.location, $options: 'i' };
    }

    if (filters.skills && filters.skills.length > 0) {
      query.skills = { $all: filters.skills };
    }

    // Execute search with pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [artists, total] = await Promise.all([
      User.find(query)
        .select('name email profilePicture location bio skills portfolioImages')
        .skip(skip)
        .limit(limit)
        .exec(),
      User.countDocuments(query),
    ]);

    res.json({
      artists,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Search artists error:', error);
    res.status(500).json({ error: 'Error searching artists' });
  }
};

export const searchJobs = async (req: Request, res: Response) => {
  try {
    const filters: SearchFilters = req.query;
    const query: any = {};

    // Add search filters
    if (filters.query) {
      query.$or = [
        { title: { $regex: filters.query, $options: 'i' } },
        { description: { $regex: filters.query, $options: 'i' } },
        { company: { $regex: filters.query, $options: 'i' } },
        { skills: { $in: [new RegExp(filters.query, 'i')] } },
      ];
    }

    if (filters.location) {
      query.location = { $regex: filters.location, $options: 'i' };
    }

    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.skills && filters.skills.length > 0) {
      query.skills = { $all: filters.skills };
    }

    if (filters.minSalary || filters.maxSalary) {
      query.salary = {};
      if (filters.minSalary) query.salary.$gte = filters.minSalary;
      if (filters.maxSalary) query.salary.$lte = filters.maxSalary;
    }

    // Execute search with pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate('postedBy', 'name email profilePicture')
        .skip(skip)
        .limit(limit)
        .exec(),
      Job.countDocuments(query),
    ]);

    res.json({
      jobs,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Search jobs error:', error);
    res.status(500).json({ error: 'Error searching jobs' });
  }
};
