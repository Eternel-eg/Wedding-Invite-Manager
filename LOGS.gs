/**
 * Serves the HTML file to the browser.
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('LOGOS')
    .setTitle('Eternel Design Portal')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Handles the data submission from the React frontend.
 * This saves the data to the active Google Sheet.
 */
function processForm(formData) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Submissions');
    
    // Create the sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet('Submissions');
      sheet.appendRow([
        'Timestamp', 'Bride Name', 'Groom Name', 'Wedding Date', 
        'Languages', 'Hashtag', 'Hero Image', 'Drive Link', 
        'RSVP Deadline', 'Special Notes'
      ]);
      sheet.getRange(1, 1, 1, 10).setFontWeight('bold').setBackground('#fff1f2');
    }

    // Append the new row
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
    return { success: false, error: error.toString() };
  }
}

/**
 * Fetches all submissions to show in the Admin panel.
 */
function getSubmissions() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Submissions');
    if (!sheet) return [];
    
    const data = sheet.getDataRange().getValues();
    const headers = data.shift(); // Remove headers
    
    return data.map(row => {
      let obj = {};
      headers.forEach((header, i) => {
        obj[header.replace(/\s+/g, '')] = row[i];
      });
      return obj;
    }).reverse(); // Most recent first
  } catch (e) {
    return [];
  }
}
