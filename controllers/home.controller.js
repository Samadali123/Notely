const userModel = require("../models/users")
const notesModel = require("../models/notes")
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });


const home = async (req, res, next) => {
  try {
      // Check if notes are available in cache
      let allnotes = cache.get('allnotes');

      if (!allnotes) {
          console.log('Cache miss! Fetching notes from the database...');

          // Fetch notes from the database
          allnotes = await notesModel.find();

          // Format the date for each note
          allnotes = allnotes.map(note => ({
              ...note._doc, // Spread the original note properties
              formattedDate: formatDate(note.date) // Use helper function to format date
          }));

          // Store the fetched and formatted notes in cache
          cache.set('allnotes', allnotes);
      } else {
          console.log('Cache hit! Serving notes from cache...');
      }

      // Render the home view with notes
      res.render('home', { allnotes });
  } catch (err) {
      console.error(err); // Log the error for debugging
      res.status(500).render('server', { message: "An error occurred while fetching notes." });
  }
};

// Helper function to format date
const formatDate = (date) => {
  const monthNames = [
      '', 'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const monthName = monthNames[dateObj.getMonth() + 1];
  const year = dateObj.getFullYear();

  return `${monthName} ${day}, ${year}`;
};

  

module.exports = home;