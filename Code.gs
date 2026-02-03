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
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  } catch (e) {
    Logger.log('doGet Error: ' + e.toString());
    return HtmlService.createHtmlOutput(
      '<h1>Backend Error</h1>' +
      '<p>The script encountered an error while trying to load the page.</p>' +
      '<p><b>Possible Reason:</b> You might not have a file named "index" (HTML) in your project sidebar, or there is a syntax error in your HTML code.</p>' +
      '<pre>' + e.toString() + '</pre>'
    );
  }
}

/**
 * DEBUG FUNCTION: Run this manually in the Apps Script editor (press "Run")
 * to check if your spreadsheet and index file are properly configured.
 */
function checkSetup() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      Logger.log("❌ ERROR: Spreadsheet not found. Is this script bound to a Google Sheet?");
    } else {
      Logger.log("✅ SUCCESS: Found Spreadsheet: " + ss.getName());
    }
    
    try {
      HtmlService.createTemplateFromFile('index');
      Logger.log("✅ SUCCESS: Found 'index.html' file.");
    } catch(e) {
      Logger.log("❌ ERROR: Could not find 'index.html'. Please create an HTML file and name it 'index'.");
    }
  } catch (e) {
    Logger.log("❌ CRITICAL ERROR: " + e.toString());
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
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return [];
    
    const sheet = ss.getSheetByName('Submissions');
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
