import './style.css'
import * as pdfjsLib from 'pdfjs-dist'

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

class PDFViewer {
  constructor() {
    this.pdfDoc = null
    this.currentPage = 1
    this.totalPages = 0
    this.scale = 1.0
    this.canvas = document.getElementById('pdf-canvas')
    this.ctx = this.canvas.getContext('2d')
    this.renderTask = null
    
    this.initializeEventListeners()
    this.updateUI()
    
    // Auto-load main.pdf if it exists
    this.loadDefaultPDF()
  }

  async loadDefaultPDF() {
    try {
      // Try to load main.pdf from the public directory
      const response = await fetch('/main.pdf')
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer()
        await this.loadPDFFromBuffer(arrayBuffer)
        console.log('main.pdf loaded automatically')
      } else {
        // Show no-pdf state if main.pdf doesn't exist
        this.showNoPDF(true)
        this.showLoading(false)
      }
    } catch (error) {
      console.log('main.pdf not found or could not be loaded:', error.message)
      // Show no-pdf state if main.pdf doesn't exist
      this.showNoPDF(true)
      this.showLoading(false)
    }
  }

  initializeEventListeners() {
    // File input
    document.getElementById('file-input').addEventListener('change', (e) => {
      const file = e.target.files[0]
      if (file && file.type === 'application/pdf') {
        this.loadPDF(file)
      }
    })

    // Navigation buttons
    document.getElementById('prev-page').addEventListener('click', () => {
      if (this.currentPage > 1) {
        this.currentPage--
        this.renderPage()
        this.updateUI()
      }
    })

    document.getElementById('next-page').addEventListener('click', () => {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        this.renderPage()
        this.updateUI()
      }
    })

    // Zoom controls
    document.getElementById('zoom-in').addEventListener('click', () => {
      this.scale = Math.min(this.scale * 1.2, 3.0)
      this.renderPage()
      this.updateUI()
    })

    document.getElementById('zoom-out').addEventListener('click', () => {
      this.scale = Math.max(this.scale / 1.2, 0.5)
      this.renderPage()
      this.updateUI()
    })

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (!this.pdfDoc) return

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault()
          if (this.currentPage > 1) {
            this.currentPage--
            this.renderPage()
            this.updateUI()
          }
          break
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault()
          if (this.currentPage < this.totalPages) {
            this.currentPage++
            this.renderPage()
            this.updateUI()
          }
          break
        case '+':
        case '=':
          e.preventDefault()
          this.scale = Math.min(this.scale * 1.2, 3.0)
          this.renderPage()
          this.updateUI()
          break
        case '-':
          e.preventDefault()
          this.scale = Math.max(this.scale / 1.2, 0.5)
          this.renderPage()
          this.updateUI()
          break
      }
    })
  }

  async loadPDF(file) {
    try {
      this.showLoading(true)
      this.showError(false)
      this.showNoPDF(false)

      const arrayBuffer = await file.arrayBuffer()
      await this.loadPDFFromBuffer(arrayBuffer)
      
      console.log(`PDF loaded successfully: ${this.totalPages} pages`)
    } catch (error) {
      console.error('Error loading PDF:', error)
      this.showError(true)
      this.showLoading(false)
      this.showNoPDF(false)
    }
  }

  async loadPDFFromBuffer(arrayBuffer) {
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
    
    this.pdfDoc = await loadingTask.promise
    this.totalPages = this.pdfDoc.numPages
    this.currentPage = 1
    
    await this.renderPage()
    this.updateUI()
    this.showLoading(false)
    this.showNoPDF(false)
  }

  async renderPage() {
    if (!this.pdfDoc) return

    try {
      // Cancel any existing render task
      if (this.renderTask) {
        this.renderTask.cancel()
      }

      const page = await this.pdfDoc.getPage(this.currentPage)
      const viewport = page.getViewport({ scale: this.scale })

      // Set canvas dimensions
      this.canvas.width = viewport.width
      this.canvas.height = viewport.height

      // Render the page
      const renderContext = {
        canvasContext: this.ctx,
        viewport: viewport
      }

      this.renderTask = page.render(renderContext)
      await this.renderTask.promise
      this.renderTask = null

    } catch (error) {
      if (error.name !== 'RenderingCancelledException') {
        console.error('Error rendering page:', error)
        this.showError(true)
      }
    }
  }

  updateUI() {
    // Update page info
    document.getElementById('page-info').textContent = 
      `Page ${this.currentPage} of ${this.totalPages}`

    // Update zoom level
    document.getElementById('zoom-level').textContent = 
      `${Math.round(this.scale * 100)}%`

    // Update button states
    document.getElementById('prev-page').disabled = this.currentPage <= 1
    document.getElementById('next-page').disabled = this.currentPage >= this.totalPages
  }

  showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none'
  }

  showError(show) {
    document.getElementById('error').style.display = show ? 'block' : 'none'
  }

  showNoPDF(show) {
    document.getElementById('no-pdf').style.display = show ? 'block' : 'none'
  }
}

// Initialize the PDF viewer when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new PDFViewer()
})

// Show instructions to the user
console.log('PDF Viewer loaded! Click "Choose File" to select a PDF file to view.')
console.log('Use arrow keys or navigation buttons to navigate pages.')
console.log('Use +/- keys or zoom buttons to zoom in/out.')
