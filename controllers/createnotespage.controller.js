const createpage = (req, res) => {
    try {
        // Create a Date object representing the current date and time
        const currentDate = new Date();

        // Define an array of month names
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        // Extract the day, month, and year from the Date object
        const day = currentDate.getDate(); // Gets the day of the month (1-31)
        const month = currentDate.getMonth(); // Gets the month (0-11), array is zero-based
        const year = currentDate.getFullYear(); // Gets the full year (e.g., 2024)

        // Extract the time components (hour and minute)
        let hours = currentDate.getHours(); // Gets the hour (0-23)
        const minutes = currentDate.getMinutes(); // Gets the minutes (0-59)

        // Determine whether the time is "am" or "pm" and convert to 12-hour format
        const period = hours >= 12 ? 'pm' : 'am';
        if (hours > 12) {
            hours -= 12;
        } else if (hours === 0) {
            hours = 12;
        }

        // Format the minutes to be two digits (e.g., "05" instead of "5")
        const formattedMinutes = String(minutes).padStart(2, '0');

        // Format the date and time as "25 April 11:55 pm"
        const formattedDate = `${day} ${monthNames[month]} ${hours}:${formattedMinutes} ${period}`;

        console.log(formattedDate); // Output example: "25 April 11:55 pm"

        res.render('notes', { formattedDate })

    } catch (error) {
        res.status(500).render("server")
    }
}



module.exports = createpage;