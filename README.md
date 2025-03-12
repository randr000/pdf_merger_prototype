# Free PDF Merger

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Live Site](https://randr000.github.io/pdf_merger_prototype/)

## Description

Free PDF Merger is a simple, client-side web application that allows you to merge multiple PDF and image files into a single PDF document. The application is designed with a strong focus on user privacy and data security.

**Key Features:**

*   **Merge PDFs:** Combine multiple PDF files into one.
*   **Image Support:** Include images (PNG, JPEG) in your merged PDF, with automatic conversion to PDF pages.
*   **Drag-and-Drop:** Easily add files by dragging and dropping them into the designated area.
*   **Reorder Files:** Change the order of the files before merging by dragging and dropping them within the file list.
*   **Custom Filename:** Specify the desired filename for your merged PDF.
*   **Client-Side Processing:** All file processing occurs directly in your web browser.
* **Privacy Focused:** The application does not send your files to a server. They are never saved or stored.

## How to Use

1.  Go to the [Live Site](https://randr000.github.io/pdf_merger_prototype/).
2.  Drag and drop your PDF and/or image files into the "Drag & Drop PDFs Here" area.
3.  Reorder the files by dragging them up or down in the file list. The top file will be the first page(s) of the merged PDF.
4.  Enter the desired filename in the "Filename" input box. If you leave this blank, the merged file will be named `merged.pdf`.
5.  Click the "Download Merged PDF" link.

## Technology Stack

*   **HTML:** For the structure of the web page.
*   **CSS:** For styling and visual presentation.
*   **JavaScript:** For the core application logic and PDF manipulation.
*   **pdf-lib:** A JavaScript library for creating and modifying PDF documents.
*   **jQuery:** A JavaScript library for DOM manipulation and AJAX, in this case, used for drag and drop reordering.
* **JQuery UI:** A JavaScript library used for providing drag and drop reordering.

## Local Development

If you wish to run this project on your local machine:

1.  Clone the repository: `git clone <repository-url>`
2.  Navigate to the project directory: `cd pdf_merger_prototype`
3.  Open `index.html` in your web browser.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Contributing

Contributions are welcome! If you have any ideas for improvements or bug fixes, please open an issue or submit a pull request.

## Contact

If you have any questions or need to contact the developer, please contact randr000.
