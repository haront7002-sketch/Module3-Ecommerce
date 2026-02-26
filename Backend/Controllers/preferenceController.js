import { getCategoryIdsFromInterestsDb, saveUserPreferencesDb } from '../Models/preferenceModel.js';

const postPreferencesCon = async (req, res) => {
  try {
    const { user_id, interests } = req.body || {};
    const parsedUserId = Number(user_id);

    if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
      return res.status(400).json({ message: 'user_id must be a positive integer' });
    }

    if (!Array.isArray(interests)) {
      return res.status(400).json({ message: 'interests must be an array' });
    }

    const categoryIds = await getCategoryIdsFromInterestsDb(interests);
    await saveUserPreferencesDb(parsedUserId, categoryIds);

    return res.status(200).json({
      message: 'Preferences saved',
      user_id: parsedUserId,
      category_ids: categoryIds
    });
  } catch (error) {
    console.error('Error saving preferences:', error);
    return res.status(500).json({ message: 'Error saving preferences' });
  }
};

export { postPreferencesCon };

