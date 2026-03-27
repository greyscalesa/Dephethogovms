export function exportToCSV(data: any[], filename: string) {
    if (!data || !data.length) return;

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj =>
        Object.values(obj).map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')
    );

    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function exportToPDF() {
    // In a real app, this would use a library like jsPDF.
    // For now, we'll trigger the browser's print dialog.
    window.print();
}
