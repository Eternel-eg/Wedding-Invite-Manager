/**
 * Serves the HTML file to the browser.
 * Make sure you have a file named "index.html" in the same project.
 */
function doGet() {
  try {
    // We use createTemplateFromFile to allow for potential server-side script tags (<? ?>)
    // which is more robust for Google Apps Script web apps.
    const tmp = HtmlService.createTemplateFromFile('index');
    return tmp.evaluate()
      .setTitle('Eternel Design Portal')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  } catch (e) {
    return HtmlService.createHtmlOutput(
      '<h1>Backend Error</h1>' +
      '<p>The "index.html" file was not found or contains a syntax error.</p>' +
      '<pre>' + e.toString() + '</pre>'
    );
  }
}

/**
 * Helper function to safely get the spreadsheet.
 * Handles cases where the script might not be bound to a sheet.
 */
function getTargetSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error("Spreadsheet not found. Please ensure this script is 'Bound' to a Google Sheet (Created via Extensions > Apps Script inside a Sheet).");
  }
  
  let sheet = ss.getSheetByName('Submissions');
  if (!sheet) {
    sheet = ss.insertSheet('Submissions');
    sheet.appendRow([
      'Timestamp', 'Bride Name', 'Groom Name', 'Wedding Date', 
      'Languages', 'Hashtag', 'Hero Image', 'Drive Link', 
      'RSVP Deadline', 'Special Notes'
    ]);
    sheet.getRange(1, 1, 1, 10)
         .setFontWeight('bold')
         .setBackground('#fff1f2')
         .setVerticalAlignment('middle');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * Handles the data submission from the React frontend.
 */
function processForm(formData) {
  try {
    const sheet = getTargetSheet();

    sheet.appendRow([
      new Date(),
      formData.brideName || '',
      formData.groomName || '',
      formData.weddingDate || '',
      (formData.languages || []).join(', '),
      formData.hashtag || '',
      formData.heroImageUrl || '',
      formData.driveLink || '',
      formData.rsvpDeadline || '',
      formData.specialNotes || ''
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
    const sheet = SpreadsheetApp.getActiveSpreadsheet()?.getSheetByName('Submissions');
    if (!sheet) return [];
    
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return []; // Only headers exist
    
    const headers = data.shift(); 
    
    return data.map(row => {
      let obj = {};
      headers.forEach((header, i) => {
        const key = header.replace(/\s+/g, '');
        obj[key] = row[i];
      });
      return obj;
    }).reverse(); 
  } catch (e) {
    console.error('Fetch error:', e);
    return [];
  }
}
