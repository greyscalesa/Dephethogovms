export function exportToCSV(data: any[], filename: string) {
    if (!data || !data.length) {
        console.warn('No data provided for export');
        return;
    }

    // Capture all keys as headers, but prioritize common ones
    const allKeys = Array.from(new Set(data.flatMap(obj => Object.keys(obj))));
    const headers = allKeys.join(',');
    
    const rows = data.map(obj => {
        return allKeys.map(key => {
            let val = obj[key];
            if (val === null || val === undefined) val = '';
            
            // Format dates if they look like ISO strings
            if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(val)) {
                try {
                    val = new Date(val).toLocaleString();
                } catch (e) {
                    // fall back to original
                }
            }
            
            // Escape double quotes and wrap in quotes
            return `"${String(val).replace(/"/g, '""')}"`;
        }).join(',');
    });

    const csvContent = headers + "\n" + rows.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export function exportToPDF() {
    /**
     * PRODUCTION NOTE: For a high-scale municipal system, 
     * consider using a server-side PDF generator (like Puppeteer or a dedicated service)
     * if the PDF needs to be a legal document or highly formatted.
     * Browser print is an excellent, light-weight interactive alternative.
     */
    window.print();
}
