// Code.gs

// 1. Serve the HTML page
function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Wedding Invitation - Layla & Omar')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

var html = HtmlService.createHtmlOutputFromFile('Index');
  
  // Replace the URL below with a link to your image (must be a direct link)
  html.setFaviconUrl("https://www.example.com/my-icon.png");
  html.setTitle("My Web App Title");
  
// 2. Handle the RSVP Form Submission
function processRSVP(formData) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('RSVP');
    
    // If the sheet doesn't exist, create it
    if (!sheet) {
      throw new Error("Sheet 'RSVP' not found. Please create a tab named 'RSVP'.");
    }

    // Get values from the form object
    // formData matches the 'name' attributes in your HTML inputs
    const name = formData.name;
    const attendance = formData.attending;
    const guests = formData.guests || "1"; // Default to 1 if hidden/empty
    const timestamp = new Date();

    // Append to the sheet
    sheet.appendRow([timestamp, name, attendance, guests]);

    return { success: true, message: "RSVP Received successfully!" };

  } catch (error) {
    Logger.log(error);
    return { success: false, message: error.toString() };
  }
}
