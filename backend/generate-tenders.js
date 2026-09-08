const fs = require('fs');
const path = require('path');

const rawData = `1|Supply of Desktop Computers and Workstations|Ministry of Electronics & IT|Rs. 2.40 Cr|30 Sep 2026|150 desktops, 30 workstations, 3-year warranty
2|Cybersecurity Monitoring Platform|Ministry of Electronics & IT|Rs. 7.25 Cr|15 Dec 2026|SIEM, threat monitoring and SOC integration
3|Digital Identity Verification System|Ministry of Electronics & IT|Rs. 8.20 Cr|03 Apr 2027|Biometric devices, software and data centre integration
4|National Cloud Computing Infrastructure|Ministry of Electronics & IT|Rs. 10.50 Cr|15 Apr 2027|Cloud servers, storage and data migration services
5|Procurement of Medical Diagnostic Equipment|Ministry of Health & Family Welfare|Rs. 4.75 Cr|05 Oct 2026|Diagnostic equipment, installation and staff training
6|Government Hospital Furniture & Equipment|Ministry of Health & Family Welfare|Rs. 3.15 Cr|30 Jan 2027|Hospital beds, furniture and medical equipment
7|Mobile Health Clinics for Rural Areas|Ministry of Health & Family Welfare|Rs. 5.80 Cr|20 Apr 2027|Mobile clinic vans, medical kits and staffing
8|Vaccine Cold Chain Storage Systems|Ministry of Health & Family Welfare|Rs. 3.40 Cr|28 Apr 2027|Cold chain units, refrigerated transport and monitoring
9|Secure Network Infrastructure Procurement|Ministry of Defence|Rs. 6.80 Cr|28 Oct 2026|Routers, switches, firewalls and deployment
10|Modern Firefighting Equipment|Ministry of Defence|Rs. 3.45 Cr|20 Dec 2026|Fire tenders, extinguishers and protective equipment
11|Coastal Surveillance Radar Systems|Ministry of Defence|Rs. 11.20 Cr|14 Feb 2027|Radar units, control systems and installation
12|Military Barracks Renovation Project|Ministry of Defence|Rs. 9.60 Cr|05 May 2027|Renovation, furnishing and utility upgrades
13|Tactical Communication Equipment|Ministry of Defence|Rs. 6.30 Cr|12 May 2027|Encrypted radios, satellite links and field kits
14|Construction Equipment for Highway Projects|Ministry of Road Transport & Highways|Rs. 8.50 Cr|18 Oct 2026|Excavators, compactors and road machinery
15|Public Transport Technology Platform|Ministry of Road Transport & Highways|Rs. 9.80 Cr|12 Jan 2027|Transport software, GPS, analytics and dashboard
16|Highway Toll Automation System|Ministry of Road Transport & Highways|Rs. 4.90 Cr|18 May 2027|FASTag readers, toll software and camera systems
17|Road Safety Signage and Barriers|Ministry of Road Transport & Highways|Rs. 2.70 Cr|24 May 2027|Reflective signage, crash barriers and installation
18|Laboratory Equipment for Government Institutes|Ministry of Education|Rs. 1.85 Cr|22 Oct 2026|Laboratory instruments and calibration certificates
19|Smart Classroom Infrastructure|Ministry of Education|Rs. 5.40 Cr|30 Nov 2026|Interactive displays, computers and networking
20|National School Digital Learning Equipment|Ministry of Education|Rs. 6.25 Cr|25 Jan 2027|Tablets, smart displays and digital learning systems
21|University Library Modernization Project|Ministry of Education|Rs. 2.95 Cr|30 May 2027|Digital catalogue, e-books and reading infrastructure
22|Agricultural Machinery Procurement|Ministry of Agriculture & Farmers Welfare|Rs. 2.75 Cr|10 Nov 2026|Tractors, harvesters and agricultural equipment
23|Agricultural Irrigation Systems|Ministry of Agriculture & Farmers Welfare|Rs. 2.90 Cr|28 Dec 2026|Drip irrigation, pumps and controllers
24|Cold Storage Infrastructure for Farmers|Ministry of Agriculture & Farmers Welfare|Rs. 5.10 Cr|28 Mar 2027|Cold storage units, refrigeration and transport
25|Farm Produce Warehousing Project|Ministry of Agriculture & Farmers Welfare|Rs. 4.20 Cr|05 Jun 2027|Warehouse construction, racking and logistics systems
26|Energy-Efficient Street Lighting|Ministry of Power|Rs. 3.85 Cr|10 Dec 2026|2,000 LED streetlights and controllers
27|Renewable Energy Grid Integration Systems|Ministry of Power|Rs. 4.50 Cr|08 Feb 2027|Grid-tie inverters, monitoring and integration
28|Smart Electricity Metering Project|Ministry of Power|Rs. 6.70 Cr|10 Jun 2027|Smart meters, communication modules and installation
29|Substation Modernization Programme|Ministry of Power|Rs. 8.90 Cr|16 Jun 2027|Transformer upgrades, control systems and safety equipment
30|Electric Buses for Urban Transport|Ministry of Heavy Industries|Rs. 12.50 Cr|02 Nov 2026|25 electric buses, charging stations and maintenance
31|Procurement of Industrial Generators|Ministry of Heavy Industries|Rs. 5.60 Cr|18 Jan 2027|Diesel generators, installation and maintenance
32|Government Fleet Electrification|Ministry of Heavy Industries|Rs. 7.80 Cr|16 Mar 2027|Electric vehicles, charging infrastructure and AMC
33|Heavy Machinery for Public Works|Ministry of Heavy Industries|Rs. 9.30 Cr|22 Jun 2027|Cranes, loaders and construction machinery
34|Industrial Automation Equipment Upgrade|Ministry of Heavy Industries|Rs. 6.45 Cr|28 Jun 2027|PLC systems, robotics and automation software`;

const tenders = rawData.split('\n').filter(line => line.trim() !== '').map(line => {
    const [idNum, title, department, budget, deadline, requirement] = line.split('|');
    
    // Generate some realistic mock data for dynamic metrics
    const statuses = ['Active', 'Active', 'Active', 'Under Review', 'Closed'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomBidsCount = randomStatus === 'Closed' ? Math.floor(Math.random() * 20) + 10 : Math.floor(Math.random() * 15);
    const randomRiskScore = Math.floor(Math.random() * 60) + 10; // 10 to 70

    return {
        id: `TND-2026-${idNum.padStart(3, '0')}`,
        title: title.trim(),
        department: department.trim(),
        budget: budget.trim().replace('Rs.', '₹'),
        deadline: deadline.trim(),
        description: requirement.trim(),
        bidsCount: randomBidsCount,
        avgRiskScore: randomRiskScore,
        status: randomStatus
    };
});

fs.writeFileSync(path.join(__dirname, 'data', 'tenders.json'), JSON.stringify(tenders, null, 2));
console.log('Successfully generated 34 tenders in data/tenders.json');
