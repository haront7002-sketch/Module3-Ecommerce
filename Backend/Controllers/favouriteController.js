import { postFavouritesDb, checkFavouritesDb, getUserFavouritesDb, deleteFavouritesDb } from '../Models/favouriteModel.js';

const postFavouriteCon = async (req, res) => {
    try {
        const { user_id, event_id } = req.body;
        
        // Validation
        if (!user_id || !event_id) {
            return res.status(400).json({ 
                message: 'user_id and event_id are required' 
            });
        }
        
        // Check if already in favourites
        const existing = await checkFavouritesDb(user_id, event_id);
        
        if (existing.length > 0) {
            return res.status(400).json({ 
                message: 'Event already in favourites' 
            });
        }
        
        // Add to favourites
        const result = await postFavouritesDb(user_id, event_id);
        
        res.status(201).json({ 
            message: 'Added to favourites successfully',
            favourite_id: result.insertId
        });
        
    } catch (error) {
        console.error('Error adding to favourites:', error);
        res.status(500).json({ 
            message: error.message 
        });
    }
};

const getFavouritesCon = async (req, res) => {
    try {
        const user_id = req.params.user_id || req.query.user_id;

        if (!user_id) {
            return res.status(400).json({
                message: 'user_id is required'
            });
        }
        
        const favourites = await getUserFavouritesDb(user_id);
        
        res.status(200).json({ 
            favourites: favourites 
        });
        
    } catch (error) {
        console.error('Error fetching favourites:', error);
        res.status(500).json({ 
            message: 'Error fetching favourites' 
        });
    }
};

// DELETE /favourites - Remove from favourites
const deleteFavouriteCon = async (req, res) => {
    try {
        const { user_id, event_id } = req.body;
        
        if (!user_id || !event_id) {
            return res.status(400).json({ 
                message: 'User ID and Event ID are required' 
            });
        }
        
        const result = await deleteFavouritesDb(user_id, event_id);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                message: 'Favourite not found' 
            });
        }

        res.status(200).json({ 
            message: 'Removed from favourites successfully' 
        });
        
    } catch (error) {
        console.error('Error in removeUserFavourite:', error);
        res.status(500).json({ 
            message: 'Error removing from favourites',
            error: error.message 
        });
    }
};

export { getFavouritesCon, postFavouriteCon, deleteFavouriteCon };
