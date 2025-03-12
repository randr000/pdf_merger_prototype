const { PDFDocument } = PDFLib;

const dropZone1 = document.getElementById('drop-zone-1');
const dropZone2 = document.getElementById('drop-zone-2');
const downloadLink = document.getElementById('download-link');

let file1 = null;
let file2 = null;

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone1.addEventListener(eventName, preventDefaults, false);
    dropZone2.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Highlight drop zone when item is dragged over it
['dragenter', 'dragover'].forEach(eventName => {
    dropZone1.addEventListener(eventName, highlight, false);
    dropZone2.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone1.addEventListener(eventName, unhighlight, false);
    dropZone2.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
    e.target.classList.add('drag-over');
}

function unhighlight(e) {
    e.target.classList.remove('drag-over');
}

// Handle dropped files
dropZone1.addEventListener('drop', handleDrop1, false);
dropZone2.addEventListener('drop', handleDrop2, false);

function handleDrop1(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles1(files);
}

function handleDrop2(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles2(files);
}

function handleFiles1(files) {
    if (files.length > 0 && files[0].type === 'application/pdf') {
        file1 = files[0];
        dropZone1.innerHTML = `<p>${file1.name}</p>`;
        checkAndMerge();
    } else {
      alert("Please only drop pdf files.");
    }
}

function handleFiles2(files) {
    if (files.length > 0 && files[0].type === 'application/pdf') {
        file2 = files[0];
        dropZone2.innerHTML = `<p>${file2.name}</p>`;
        checkAndMerge();
    } else {
      alert("Please only drop pdf files.");
    }
}

async function mergePDFs(pdfBytes1, pdfBytes2) {
    const pdfDoc = await PDFDocument.create();

    const pdf1 = await PDFDocument.load(pdfBytes1);
    const pdf2 = await PDFDocument.load(pdfBytes2);

    const copiedPages1 = await pdfDoc.copyPages(pdf1, pdf1.getPageIndices());
    copiedPages1.forEach((page) => pdfDoc.addPage(page));

    const copiedPages2 = await pdfDoc.copyPages(pdf2, pdf2.getPageIndices());
    copiedPages2.forEach((page) => pdfDoc.addPage(page));

    const mergedPdfBytes = await pdfDoc.save();
    return mergedPdfBytes;
}

async function checkAndMerge() {
    if (file1 && file2) {
        const reader1 = new FileReader();
        const reader2 = new FileReader();

        reader1.onload = async (event) => {
            const pdfBytes1 = event.target.result;

            reader2.onload = async (event) => {
                const pdfBytes2 = event.target.result;

                const mergedPdfBytes = await mergePDFs(pdfBytes1, pdfBytes2);

                const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);

                downloadLink.href = url;
                downloadLink.style.display = 'block';
                downloadLink.download = 'merged.pdf';
            };

            reader2.readAsArrayBuffer(file2);
        };

        reader1.readAsArrayBuffer(file1);
    }
}
