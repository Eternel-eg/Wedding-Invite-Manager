/**
 * Serves the HTML file to the browser.
 * Make sure you have a file named "index.html" in the same project.
 */
function doGet() {
  try {
    return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('Eternel Design Portal')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  } catch (e) {
    return HtmlService.createHtmlOutput('<h1>Error: index.html not found</h1><p>Please ensure you have created an HTML file named "index" in your Google Apps Script project.</p>');
  }
}

/**
 * Handles the data submission from the React frontend.
 * This saves the data to the active Google Sheet.
 */
function processForm(formData) {
  try {
    // Open the spreadsheet that the script is attached to
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Submissions');
    
    // Create the sheet and add headers if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet('Submissions');
      sheet.appendRow([
        'Timestamp', 'Bride Name', 'Groom Name', 'Wedding Date', 
        'Languages', 'Hashtag', 'Hero Image', 'Drive Link', 
        'RSVP Deadline', 'Special Notes'
      ]);
      // Format headers: Bold with a light rose background
      sheet.getRange(1, 1, 1, 10)
           .setFontWeight('bold')
           .setBackground('#fff1f2')
           .setVerticalAlignment('middle');
      
      sheet.setFrozenRows(1);
    }

    // Append the client data as a new row
    sheet.appendRow([
      new Date(),
      formData.brideName,
      formData.groomName,
      formData.weddingDate,
      formData.languages.join(', '),
      formData.hashtag,
      formData.heroImageUrl,
      formData.driveLink,
      formData.rsvpDeadline,
      formData.specialNotes
    ]);

    return { success: true };
  } catch (error) {
    console.error('Form processing error:', error);
    return { success: false, error: error.toString() };
  }
}

/**
 * Fetches all submissions from the sheet to display in the Admin panel.
 */
function getSubmissions() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Submissions');
    if (!sheet) return [];
    
    const data = sheet.getDataRange().getValues();
    const headers = data.shift(); // Remove the header row
    
    // Map array of arrays to array of objects for easier React handling
    return data.map(row => {
      let obj = {};
      headers.forEach((header, i) => {
        // Remove spaces from headers to use as keys (e.g., "Bride Name" -> "BrideName")
        const key = header.replace(/\s+/g, '');
        obj[key] = row[i];
      });
      return obj;
    }).reverse(); // Sort so the newest entries appear at the top
  } catch (e) {
    console.error('Fetch error:', e);
    return [];
  }
}

