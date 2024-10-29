const notesModel = require("../models/notes")
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });


const searchNotes = async (req, res) => {
    try {
      const input = req.query.data;
      const cacheKey = `notes-${input}`; // Unique key for caching
  
      // Check if the query result is in cache
      let notes = cache.get(cacheKey);
  
      if (!notes) {
        console.log('Cache miss! Fetching notes from the database...');
        const regex = new RegExp(`^${input}`, 'i');
        notes = await notesModel.find({ title: regex });
  
        // If there are notes, format the dates
        if (notes.length > 0) {
          notes.forEach((note) => {
            const dateObj = new Date(note.date);
            const monthNames = [
              '', 'January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December'
            ];
  
            const day = dateObj.getDate();
            const monthName = monthNames[dateObj.getMonth() + 1];
            const year = dateObj.getFullYear();
  
            note.formattedDate = `${monthName} ${day}, ${year}`;
          });
        }
  
        // Store the result in cache
        cache.set(cacheKey, notes);
      } else {
        res.status(403).json('Cache hit! Serving notes from cache...');
      }
  
      res.json(notes);
    } catch (err) {
      res.status(500).render('server');
    }
  };


module.exports = searchNotes;