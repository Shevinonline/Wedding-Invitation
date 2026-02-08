/* 
Google Apps Script for Wedding RSVP

INSTRUCTIONS:
1. Go to your Google Drive and create a New Google Sheet.
2. In the Sheet, go to Extensions > Apps Script.
3. Delete any code in the editor and paste the code below.
4. Save the project (e.g., "WeddingRSVP").
5. Click on the "Deploy" button (top right) -> "New deployment".
6. Click the "Select type" gear icon -> "Web app".
7. Description: "Wedding RSVP API"
8. Execute as: "Me" (your email)
9. Who has access: "Anyone" (IMPORTANT!)
10. Click "Deploy".
11. Authorize the app (might say "unsafe", click Advanced -> Go to ... (unsafe)).
12. Copy the "Web app URL" (starts with https://script.google.com/macros/s/...).
13. Send this URL to your developer to put in the website code.

*/

function doPost(e) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Parse the JSON data sent from the website
    var data = JSON.parse(e.postData.contents);

    // Get/Create Headers if sheet is empty
    if (sheet.getLastRow() === 0) {
        sheet.appendRow(["Timestamp", "Name", "Email", "Attendance", "Guests", "Diet", "Other Diet", "Message"]);
    }

    // Append the data
    sheet.appendRow([
        new Date(),
        data.name,
        data.email,
        data.attendance,
        data.guests,
        data.diet ? data.diet.join(", ") : "", // Join array if multiple selected
        data.otherDiet,
        data.message
    ]);

    // Return success response
    return ContentService.createTextOutput(JSON.stringify({ "result": "success", "data": data }))
        .setMimeType(ContentService.MimeType.JSON);
}
