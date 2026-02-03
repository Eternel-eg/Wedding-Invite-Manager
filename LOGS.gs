/**
 * Google Apps Script to serve the Wedding Invite Manager
 * * 1. Create a new Google Apps Script project at script.google.com
 * 2. Paste this code into 'Code.gs'
 * 3. Create an 'Index.html' file in the project and paste the HTML content provided in the next file.
 * 4. Click 'Deploy' > 'New Deployment' > 'Web App'
 */

function doGet(e) {
  // serves the Index.html file
  return HtmlService.createTemplateFromFile('LOGOS')
    .evaluate()
    .setTitle('ETERNEL.EG | Design Portal')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Helper function to include other files (CSS/JS) if needed
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

