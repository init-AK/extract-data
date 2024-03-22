const extractTableData = () => {
    const data = [];
    // Query the table body
    const tableRows = document.querySelectorAll("#tablepress-11 tbody.row-hover tr");

    // Loop through each row in the tbody
    tableRows.forEach(row => {
        const cells = row.querySelectorAll("td");
        // Assuming first name is in the first column and last name is in the second
        const firstName = cells[0].textContent.trim();
        const lastName = cells[1].textContent.trim();
        data.push({ firstName, lastName });
    });

    return data;
};

const convertToCSV = (data) => {
    const csvRows = ["First Name, Last Name"]; // CSV header
    // Convert each object to a CSV row
    data.forEach(({ firstName, lastName }) => {
        csvRows.push(`${firstName}, ${lastName}`);
    });

    return csvRows.join("\n");
};

const downloadCSV = (csvString) => {
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "names.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};


async function scrapeAllPages() {
    let data = [];
    let hasNextPage = true;

    while (hasNextPage) {
        // Extract data from the current page
        data = data.concat(extractTableData());
        
        // Attempt to click the "Next" button
        const nextPageButton = document.querySelector('.paginate_button.next:not(.disabled)');
        if (nextPageButton) {
            nextPageButton.click();
            
            // Wait for the new page content to load
            await new Promise(resolve => setTimeout(resolve, 2000)); // Adjust time based on actual page load time
        } else {
            hasNextPage = false;
        }
    }

    // Once all data is collected, convert to CSV and download
    const csvString = convertToCSV(data);
    downloadCSV(csvString);
}

// Run the function
scrapeAllPages();
