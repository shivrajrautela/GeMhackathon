const fs = require('fs');
const path = require('path');

const rawFile = path.join(__dirname, 'data', 'raw_gov_data.txt');
const outFile = path.join(__dirname, 'data', 'gov_database.json');

const lines = fs.readFileSync(rawFile, 'utf8').split('\n').filter(l => l.trim().length > 0);

const records = lines.map(line => {
    // Regex to split by 2 or more spaces, or carefully split.
    // The format from the PDF OCR is roughly:
    // 1 Sharma Industrial Solutions Ankit Sharma +91 90000 10001 email City State PIN GST PAN Udyam Desc Turnover Emp Category
    // Since it's single-space separated in the paste, we'll use a regex to pick out the predictable fixed patterns (Mobile, email, GST, PAN, etc.)

    // Find email
    const emailMatch = line.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
    const email = emailMatch ? emailMatch[1] : '';

    // Find GST, PAN, UDYAM
    const gstMatch = line.match(/(DEMO-GST-\d+)/);
    const gst = gstMatch ? gstMatch[1] : '';

    const panMatch = line.match(/(DEMO-PAN-\d+)/);
    const pan = panMatch ? panMatch[1] : '';

    const udyamMatch = line.match(/(DEMO-UDYAM-\d+)/);
    const udyam = udyamMatch ? udyamMatch[1] : '';

    // PIN code
    const pinMatch = line.match(/ (\d{6}) /);
    const pin = pinMatch ? pinMatch[1] : '';

    // Extract Company Name and Owner before mobile number (+91)
    const mobileMatch = line.indexOf('+91');
    let companyName = "Unknown";
    let ownerName = "Unknown";
    if (mobileMatch > -1) {
        const prefix = line.substring(0, mobileMatch).trim();
        // Remove the leading number "1 " or "12 "
        const cleanPrefix = prefix.replace(/^\d+\s+/, '');
        // We know owner name is usually last 2 words before mobile
        const words = cleanPrefix.split(' ');
        if (words.length > 2) {
            ownerName = words.slice(-2).join(' ');
            companyName = words.slice(0, -2).join(' ');
        } else {
            companyName = cleanPrefix;
        }
    }

    // Extract synthetic data for the other 7 APIs
    const baseNum = pan.replace('DEMO-PAN-', '');
    
    return {
        id: baseNum,
        // 1. PAN Details
        pan_number: pan,
        pan_details: {
            name: companyName,
            status: "Active",
            category: "Company",
            last_return_filed: "2025-11-10"
        },

        // 2. GST Details
        gstin: gst,
        gst_details: {
            legal_name: companyName,
            status: "Active",
            taxpayer_type: "Regular",
            date_of_registration: "2018-04-12"
        },

        // 3. Udyam Registration
        udyam_number: udyam,
        udyam_details: {
            enterprise_name: companyName,
            enterprise_type: "Micro/Small/Medium",
            date_of_incorporation: "2015-08-20"
        },

        // 4. Company Registration (Incorporation)
        cin_number: `U72900MH2015PTC${baseNum}123`,
        incorporation_details: {
            company_name: companyName,
            date_of_incorporation: "2015-08-20",
            status: "Active",
            roc_code: "RoC-Mumbai"
        },

        // 5. MCA Details
        mca_status: {
            filing_status: "Up to Date",
            directors: [ownerName],
            paid_up_capital: "1,000,000"
        },

        // 6. EPFO
        epfo_number: `EPFO-${baseNum}999`,
        epfo_details: {
            establishment_name: companyName,
            status: "Active",
            total_employees: 45
        },

        // 7. ESIC
        esic_number: `ESIC-${baseNum}888`,
        esic_details: {
            employer_name: companyName,
            status: "Active",
            insured_persons: 40
        },

        // 8. BIS License
        bis_license: `CM/L-${baseNum}777`,
        bis_details: {
            status: "Valid",
            valid_upto: "2028-12-31"
        },

        // 9. Startup India
        startup_india_cert: `DIPP${baseNum}666`,
        startup_details: {
            recognition_status: "Recognized",
            date_of_recognition: "2021-02-15"
        },

        // 10. NSIC
        nsic_cert: `NSIC-${baseNum}555`,
        nsic_details: {
            status: "Active",
            monetary_limit: "Rs. 500 Lakhs",
            valid_upto: "2027-06-30"
        }
    };
});

fs.writeFileSync(outFile, JSON.stringify(records, null, 2));
console.log(`Successfully generated 10 Government API mock profiles for ${records.length} bidders in gov_database.json!`);
