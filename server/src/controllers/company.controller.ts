import { Request, Response } from 'express';
import CompanyProfile from '../models/company.model';

// Get company profile by recruiter
export const getCompanyProfile = async (req: Request, res: Response) => {
  try {
    const recruiterId = req.user?._id || req.query.recruiterId;
    if (!recruiterId) return res.status(400).json({ error: 'Recruiter ID required' });
    const profile = await CompanyProfile.findOne({ recruiter: recruiterId });
    if (!profile) return res.status(404).json({ error: 'Company profile not found' });
    res.json(profile);
  } catch (err) {
    console.error('[COMPANY PROFILE] Error fetching company profile:', err);
    res.status(500).json({ error: 'Error fetching company profile' });
  }
};

// Create or update company profile by recruiter
export const upsertCompanyProfile = async (req: Request, res: Response) => {
  try {
    const recruiterId = req.user?._id;
    if (!recruiterId) return res.status(400).json({ error: 'Recruiter ID required' });
    console.log('[COMPANY PROFILE] Upsert request body:', req.body);
    const data = { ...req.body, recruiter: recruiterId };
    const profile = await CompanyProfile.findOneAndUpdate(
      { recruiter: recruiterId },
      data,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    console.log('[COMPANY PROFILE] Upserted profile:', profile);
    res.json(profile);
  } catch (err) {
    console.error('[COMPANY PROFILE] Error saving company profile:', err);
    res.status(500).json({ error: 'Error saving company profile' });
  }
};
