// Google Form Entry ID Finder
// Use this script in your browser console to find the correct entry IDs

/*
INSTRUCTIONS TO FIND GOOGLE FORM ENTRY IDs:

1. Open your Google Form in edit mode:
   https://docs.google.com/forms/d/1FAIpQLSehRtlaYF48CJoSZ9aG43yxlTEfpnLisFWurlhbS_F2b0ZbJA/edit

2. Click "Preview" (eye icon) to view the form as users see it

3. Open browser Developer Tools (F12 or right-click -> Inspect)

4. Go to Console tab and paste this script:

```javascript
// Run this in your browser console on the Google Form preview page
function findFormEntryIds() {
  const inputs = document.querySelectorAll('input[name^="entry."], textarea[name^="entry."]');
  const entryIds = {};
  
  inputs.forEach(input => {
    const label = input.closest('.Qr7Oae')?.querySelector('.M7eMe') || 
                  input.closest('.geS5n')?.querySelector('.M7eMe') ||
                  input.previousElementSibling;
    
    const labelText = label ? label.textContent.trim() : 'Unknown';
    const entryId = input.name;
    
    entryIds[labelText] = entryId;
    console.log(`Field: "${labelText}" -> Entry ID: ${entryId}`);
  });
  
  return entryIds;
}

// Run the function
const ids = findFormEntryIds();
console.log('All Entry IDs:', ids);
```

5. The console will show you the mapping like:
   - "Name" -> entry.1234567890
   - "Mobile" -> entry.0987654321
   - "Email" -> entry.1122334455
   - "What feature you want" -> entry.5566778899

6. Copy these entry IDs and update them in JoinPage.tsx

ALTERNATIVE METHOD:
1. Right-click on each form field
2. Select "Inspect Element"
3. Look for name="entry.XXXXXXXX" in the HTML
4. Copy the entry ID numbers

CURRENT FORM FIELDS TO MAP:
- Name (Long answer text)
- Mobile (Long answer text)
- Email (Long answer text)
- Course Registration & Feedback (Long answer text)
*/

// Correct mapping now implemented in JoinPage.tsx:
const correctMapping = {
  name: 'entry.396195895',       // Name field
  mobile: 'entry.1338141041',    // Mobile field
  email: 'entry.786313690',      // Email field
  feedback: 'entry.469946608'    // Course Registration & Feedback field
};

export default exampleMapping;
