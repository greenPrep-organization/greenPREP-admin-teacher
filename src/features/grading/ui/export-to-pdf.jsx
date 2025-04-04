import { Button } from 'antd'
import { jsPDF } from 'jspdf'
import studentMockData from '@features/grading/constants/studentMockData'
import writingMockData from '@features/grading/constants/writingmockdata'
import PropTypes from 'prop-types'

const ExportToPdfButton = ({ studentId, activePart }) => {
  const exportToPDF = () => {
    const doc = new jsPDF()
    const student = studentMockData.find(s => s.id === studentId)
    const writingData = writingMockData[studentId][activePart]

    if (!student || !writingData) {
      console.error('Student or writing data not found')
      return
    }

    doc.setFontSize(18)
    doc.text('Student Writing Report', 10, 10)

    doc.setFontSize(12)
    doc.text('Student Information:', 10, 30)
    doc.text(`Name: ${student.name}`, 10, 40)
    doc.text(`ID: ${student.id}`, 10, 50)
    doc.text(`Class: ${student.class}`, 10, 60)
    doc.text(`Email: ${student.email}`, 10, 70)
    doc.text(`Phone: ${student.phone}`, 10, 80)

    doc.text(`Writing - ${activePart.toUpperCase()}`, 10, 110)
    doc.setFontSize(10)
    doc.text(writingData.instructions, 10, 120, { maxWidth: 190 })

    let yPos = 140
    writingData.questions.forEach((question, index) => {
      doc.text(`Question ${index + 1}: ${question}`, 10, yPos, { maxWidth: 190 })
      yPos += 10
      doc.text(`Answer: ${writingData.answers[index] || 'No answer submitted'}`, 10, yPos, { maxWidth: 190 })
      yPos += 15
    })

    const pdfBlob = doc.output('blob')
    const blobUrl = URL.createObjectURL(pdfBlob)

    const newTab = window.open()
    if (newTab) {
      newTab.document.write(`
                <html>
                <head>
                    <title>Preview PDF</title>
                </head>
                <body style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
                    <iframe src="${blobUrl}" width="100%" height="90%" style="border: none;"></iframe>
                    <br/>
                    <a href="${blobUrl}" download="${student.name}_${activePart}_writing.pdf">
                        <button style="padding: 10px 20px; background-color: #003087; color: white; border: none; border-radius: 5px; cursor: pointer;">
                            Download PDF
                        </button>
                    </a>
                </body>
                </html>
            `)
    } else {
      alert('Please allow popups for this site.')
    }
  }

  return (
    <Button
      type="default"
      onClick={exportToPDF}
      className="h-10 w-full rounded-lg border-[#003087] text-[#003087] hover:bg-[#f0f5ff]"
    >
      Export to PDF
    </Button>
  )
}

ExportToPdfButton.propTypes = {
  studentId: PropTypes.string.isRequired,
  activePart: PropTypes.string.isRequired
}

export default ExportToPdfButton
