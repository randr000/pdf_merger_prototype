const { PDFDocument, rgb, degrees, StandardFonts } = PDFLib;

const dropZone = document.getElementById('drop-zone');
const fileList = document.getElementById('file-list');
const downloadLink = document.getElementById('download-link');
const filenameInput = document.getElementById('filename');

let files = [];

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Highlight drop zone when item is dragged over it
['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
    e.target.classList.add('drag-over');
}

function unhighlight(e) {
    e.target.classList.remove('drag-over');
}

// Handle dropped files
dropZone.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const droppedFiles = dt.files;
    handleFiles(droppedFiles);
}

async function handleFiles(droppedFiles) {
  let newFiles = [];
  for (let i = 0; i < droppedFiles.length; i++) {
    if (droppedFiles[i].type === 'application/pdf' || droppedFiles[i].type.startsWith("image/")) {
      newFiles.push(droppedFiles[i]);
    } else {
      alert("Please only drop pdf or image files.");
    }
  }

  files = [...files, ...newFiles];

  updateFileList();
}

function updateFileList() {
    fileList.innerHTML = '';
    files.forEach((file, index) => {
        const listItem = document.createElement('li');
        listItem.setAttribute('data-index', index);
        const nameSpan = document.createElement('span');
        nameSpan.textContent = file.name;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'X';
        removeButton.classList.add('remove-button');
        removeButton.addEventListener('click', () => removeFile(index));
        listItem.appendChild(nameSpan);
        listItem.appendChild(removeButton);
        fileList.appendChild(listItem);
    });

    $( "#file-list" ).sortable({
        update: function(event, ui){
          reorderFiles();
        }
      });
    $( "#file-list" ).disableSelection();
    updateDownloadLink();
}

function removeFile(index) {
  files.splice(index, 1);
  updateFileList();
}

function reorderFiles(){
  const orderedFiles = [];
  const listItems = fileList.querySelectorAll('li');
  listItems.forEach((item) => {
    const index = item.getAttribute('data-index');
    orderedFiles.push(files[index]);
  })
  files = orderedFiles;
  updateFileList();
}

async function mergePDFs(pdfBytesArray) {
    const pdfDoc = await PDFDocument.create();

    for (const pdfBytes of pdfBytesArray) {
      if(typeof pdfBytes === "string"){
        const imageBytes = await fetch(pdfBytes).then((res) => res.arrayBuffer());
        const img = await pdfDoc.embedPng(imageBytes);
        const page = pdfDoc.addPage([img.width, img.height]);
        page.drawImage(img, {
          x: 0,
          y: 0,
          width: img.width,
          height: img.height
        })
      }else{
        const pdf = await PDFDocument.load(pdfBytes);
        const copiedPages = await pdfDoc.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => pdfDoc.addPage(page));
      }
    }

    const mergedPdfBytes = await pdfDoc.save();
    return mergedPdfBytes;
}

function getFilename() {
    let filename = filenameInput.value.trim();
    if (!filename) {
        filename = 'merged';
    }
    return filename + '.pdf';
}

async function checkAndMerge() {
    if (files.length > 0) {
        const readerPromises = files.map((file) => {
            return new Promise(async (resolve, reject) => {
                const reader = new FileReader();
                if(file.type.startsWith("image/")){
                  reader.onload = (event) => {
                    const imageUrl = event.target.result;
                    resolve(imageUrl)
                  }
                  reader.onerror = (error) => {
                    reject(error);
                  };
                  reader.readAsDataURL(file);
                }else{
                  reader.onload = (event) => {
                      resolve(event.target.result);
                  };
                  reader.onerror = (error) => {
                      reject(error);
                  };
                  reader.readAsArrayBuffer(file);
                }
            });
        });

        try {
            const pdfBytesArray = await Promise.all(readerPromises);
            const mergedPdfBytes = await mergePDFs(pdfBytesArray);
            const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            downloadLink.href = url;
            downloadLink.style.display = 'block';
        } catch (error) {
            console.error('Error merging PDFs:', error);
        }
    } else {
      downloadLink.style.display = 'none';
    }
}

function updateDownloadLink(){
  checkAndMerge();
  downloadLink.download = getFilename();
}

// Add an event listener to the filename input
filenameInput.addEventListener('input', () => {
    updateDownloadLink();
});
