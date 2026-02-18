import { postFavouritesDb, checkFavouritesDb, getUserFavouritesDb } from '../Models/favouriteModel.js';

const postFavouriteCon = async (req, res) => {
    try {
        const { user_id, event_id } = req.body;
        
        // Validation
        if (!user_id || !event_id) {
            return res.status(400).json({ 
                success: false, 
                message: 'user_id and event_id are required' 
            });
        }
        
        // Check if already in favourites
        const existing = await checkFavouritesDb(user_id, event_id);
        
        if (existing.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Event already in favourites' 
            });
        }
        
        // Add to favourites
        const result = await postFavouritesDb(user_id, event_id);
        
        res.status(201).json({ 
            success: true, 
            message: 'Added to favourites successfully',
            favourite_id: result.insertId
        });
        
    } catch (error) {
        console.error('Error adding to favourites:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

const getFavouritesCon = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        
        const favourites = await getUserFavouritesDb(user_id);
        
        res.status(200).json({ 
            success: true, 
            favourites: favourites 
        });
        
    } catch (error) {
        console.error('Error fetching favourites:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching favourites' 
        });
    }
};

export { postFavouriteCon, getFavouritesCon };