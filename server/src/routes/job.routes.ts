import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get all jobs
router.get('/', async (req: Request, res: Response) => {
  try {
    const Job = require('../models/job.model').default;
    const jobs = await Job.find({}).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching jobs' });
  }
});

// Get job by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const Job = require('../models/job.model').default;
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching job details' });
  }
});

// Post a new job (accept frontend format, adapt to backend model)
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    // Accept frontend format and adapt to backend model
    const {
      title,
      company,
      location,
      type,
      category,
      salary, // string, e.g. "$50k - $70k"
      description,
      requirements, // array of strings
      benefits, // array (optional)
      applicationDeadline,
      startDate,
    } = req.body;

    // If company is missing or empty, fetch from recruiter profile
    let companyName = company;
    if (!companyName || companyName.trim() === '') {
      // Try to fetch company name from CompanyProfile
      try {
        const CompanyProfile = require('../models/company.model').default;
        const companyProfile = await CompanyProfile.findOne({ recruiter: userId });
        if (companyProfile && companyProfile.name) {
          companyName = companyProfile.name;
        } else if (req.user && req.user.name) {
          companyName = req.user.name;
        } else {
          companyName = 'Unknown Company';
        }
      } catch (profileErr) {
        console.error('Error fetching company profile:', profileErr);
        companyName = 'Unknown Company';
      }
    }

    // Convert salary string to min/max/currency (very basic parsing)
    let salaryObj = { min: 0, max: 0, currency: 'USD' };
    if (typeof salary === 'string') {
      // Try to extract min/max from string like "$50k - $70k"
      const match = salary.match(/\$?(\d+)[kK]?\s*-\s*\$?(\d+)[kK]?/);
      if (match) {
        salaryObj.min = parseInt(match[1]) * 1000;
        salaryObj.max = parseInt(match[2]) * 1000;
      }
    }

    // Convert requirements array to string
    let requirementsStr = '';
    if (Array.isArray(requirements)) {
      requirementsStr = requirements.join('\n');
    } else if (typeof requirements === 'string') {
      requirementsStr = requirements;
    }

    // Convert benefits array to string
    let benefitsStr = '';
    if (Array.isArray(benefits)) {
      benefitsStr = benefits.join('\n');
    } else if (typeof benefits === 'string') {
      benefitsStr = benefits;
    }

    // Use applicationDeadline as deadline (convert to Date)
    let deadline = applicationDeadline ? new Date(applicationDeadline) : new Date();

    // Build job object for backend
    const jobData = {
      title,
      company: companyName,
      location,
      type,
      category,
      salary: salaryObj,
      description,
      requirements: requirementsStr,
      benefits: benefitsStr,
      skills: [], // Not provided by frontend yet
      deadline,
      postedBy: userId,
      status: 'open',
      applicants: [],
      // Optionally add startDate, etc. as needed
    };

    const Job = require('../models/job.model').default;
    const newJob = await Job.create(jobData);
    res.status(201).json(newJob);
  } catch (error: any) {
    console.error('Error posting job:', error);
    res.status(500).json({ error: error.message || 'Error posting job' });
  }
});

// Apply for a job
router.post('/:id/apply', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { coverLetter, portfolioLinks, availability, expectedSalary } = req.body;
    const userId = req.user?._id;
    const Application = require('../models/application.model').default;

    // Save application to database
    const application = await Application.create({
      applicant: userId,
      job: id,
      coverLetter,
      portfolioLinks,
      availability,
      expectedSalary,
      status: 'pending',
      appliedAt: new Date(),
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: 'Error submitting application' });
  }
});

// Get user's job applications
router.get('/applications/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const Application = require('../models/application.model').default;
    // Fetch applications for the user and populate job details
    const applications = await Application.find({ applicant: userId }).populate('job');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching applications' });
  }
});

// Get all jobs posted by the current recruiter
router.get('/recruiter/jobs', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const Job = require('../models/job.model').default;
    const jobs = await Job.find({ postedBy: userId }).sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (error: any) {
    console.error('Error fetching recruiter jobs:', error);
    res.status(500).json({ error: error.message || 'Error fetching recruiter jobs' });
  }
});

// Get all applications for jobs posted by the recruiter (for AllApplicants page)
router.get('/applications/all', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const Application = require('../models/application.model').default;
    const Job = require('../models/job.model').default;
    // Find all jobs posted by this recruiter
    const jobs = await Job.find({ postedBy: userId });
    const jobIds = jobs.map((job: any) => job._id);
    // Find all applications for these jobs, and populate applicant and job details
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('applicant')
      .populate('job');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching applicants' });
  }
});

// Update application status (recruiter only)
router.put('/applications/:applicationId/status', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { applicationId } = req.params;
    const { status } = req.body;
    const Application = require('../models/application.model').default;
    const Job = require('../models/job.model').default;
    // Find the application and ensure the recruiter owns the job
    const application = await Application.findById(applicationId).populate('job');
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    if (String(application.job.postedBy) !== String(userId)) {
      return res.status(403).json({ error: 'Unauthorized to update this application' });
    }
    if (!['pending', 'reviewed', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    application.status = status;
    await application.save();
    res.json({ success: true, application });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

export default router;
