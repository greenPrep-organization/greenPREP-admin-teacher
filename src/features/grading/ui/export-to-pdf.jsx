import { Button } from 'antd'
import { jsPDF } from 'jspdf'
import studentMockData from '@features/grading/constants/studentMockData'
import writingMockData from '@features/grading/constants/writingmockdata.js'
import PropTypes from 'prop-types'
import logoUniversity from '@assets/images/logoUniversity.png'

const ExportToPdfButton = ({ studentId, activePart }) => {
  const exportToPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()

      const student = studentMockData.find(s => s.id === studentId)
      const writingData = writingMockData[studentId][activePart]

      if (!student || !writingData) {
        console.error('Student or writing data not found')
        return
      }

      const drawBox = (x, y, width, height, options = {}) => {
        const {
          fillColor = [255, 255, 255],
          borderColor = [221, 221, 221],
          borderWidth = 0.5,
          hasBorder = true,
          borderRadius = 0
        } = options

        doc.setFillColor(fillColor[0], fillColor[1], fillColor[2])

        if (hasBorder) {
          doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
          doc.setLineWidth(borderWidth)

          if (borderRadius > 0) {
            doc.roundedRect(x, y, width, height, borderRadius, borderRadius, 'FD')
          } else {
            doc.rect(x, y, width, height, 'FD')
          }
        } else {
          doc.rect(x, y, width, height, 'F')
        }
      }

      // --------- HEADER SECTION ---------
      const logoWidth = 40
      const logoHeight = 20
      doc.addImage(logoUniversity, 'PNG', 10, 10, logoWidth, logoHeight)

      doc.setFontSize(28)
      doc.setFont('helvetica', 'bold')
      const studentName = student.name.toUpperCase()
      const textWidth = doc.getTextWidth(studentName)
      const textX = (pageWidth - textWidth) / 2
      doc.text(studentName, textX, 25)

      doc.setFontSize(18)
      doc.setFont('helvetica', 'normal')
      const studentLabel = 'STUDENT'
      const labelWidth = doc.getTextWidth(studentLabel)
      const labelX = (pageWidth - labelWidth) / 2
      doc.text(studentLabel, labelX, 32)

      // --------- SESSION DETAILS SECTION ---------
      const sectionMargin = 10
      let currentY = 50

      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      doc.text('Session details', sectionMargin, currentY)
      currentY += 10

      const detailsCardX = sectionMargin
      const detailsCardY = currentY
      const detailsCardWidth = pageWidth - sectionMargin * 2
      const detailsCardHeight = 50

      drawBox(detailsCardX, detailsCardY, detailsCardWidth, detailsCardHeight, {
        fillColor: [255, 255, 255],
        borderColor: [221, 221, 221],
        borderWidth: 0.5,
        hasBorder: true,
        borderRadius: 2
      })

      const midX = detailsCardX + detailsCardWidth / 2
      doc.line(midX, detailsCardY, midX, detailsCardY + detailsCardHeight)

      const leftColX = detailsCardX + 10
      let leftColY = detailsCardY + 15

      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(85, 85, 85)
      doc.text('Class Name:', leftColX, leftColY)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(0, 0, 0)
      doc.text('Feb_2025', leftColX + 40, leftColY)
      leftColY += 15

      doc.setFont('helvetica', 'bold')
      doc.setTextColor(85, 85, 85)
      doc.text('Class Key:', leftColX, leftColY)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(0, 0, 0)
      doc.text('GREFEB1', leftColX + 40, leftColY)
      leftColY += 15

      doc.setFont('helvetica', 'bold')
      doc.setTextColor(85, 85, 85)
      doc.text('Status:', leftColX, leftColY)
      const pillX = leftColX + 40
      const pillY = leftColY - 4
      const pillWidth = 25
      const pillHeight = 6
      drawBox(pillX, pillY, pillWidth, pillHeight, {
        fillColor: [215, 243, 234],
        borderColor: [215, 243, 234],
        borderRadius: 1.5
      })
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(76, 163, 137)
      doc.text('Active', pillX + 3, leftColY)

      const rightColX = midX + 10
      let rightColY = detailsCardY + 15

      doc.setFont('helvetica', 'bold')
      doc.setTextColor(85, 85, 85)
      doc.text('Start date:', rightColX, rightColY)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(0, 0, 0)
      doc.text('25/01/2025', rightColX + 50, rightColY)
      rightColY += 15

      doc.setFont('helvetica', 'bold')
      doc.setTextColor(85, 85, 85)
      doc.text('End date:', rightColX, rightColY)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(0, 0, 0)
      doc.text('25/03/2025', rightColX + 50, rightColY)
      rightColY += 15

      doc.setFont('helvetica', 'bold')
      doc.setTextColor(85, 85, 85)
      doc.text('Number of Participants:', rightColX, rightColY)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(0, 0, 0)
      doc.text('50', rightColX + 80, rightColY)

      currentY = detailsCardY + detailsCardHeight + 20

      // --------- ALL SCORE SECTION ---------
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      doc.text('All Score', sectionMargin, currentY)
      currentY += 10

      const scoreCardX = sectionMargin
      const scoreCardY = currentY
      const scoreCardWidth = pageWidth - sectionMargin * 2
      const scoreTableRowHeight = 12
      const scoreTableHeaderHeight = 12
      const scoreTableRowCount = 1
      const scoreCardHeight = scoreTableHeaderHeight + scoreTableRowHeight * scoreTableRowCount

      drawBox(scoreCardX, scoreCardY, scoreCardWidth, scoreCardHeight, {
        fillColor: [255, 255, 255],
        borderColor: [221, 221, 221],
        borderWidth: 0.5,
        hasBorder: true,
        borderRadius: 2
      })

      drawBox(scoreCardX, scoreCardY, scoreCardWidth, scoreTableHeaderHeight, {
        fillColor: [249, 249, 249],
        borderColor: [221, 221, 221],
        hasBorder: false
      })

      const scoreColumns = [
        'Date',
        'Session name',
        'Grammar & Vocab',
        'Listening',
        'Reading',
        'Speaking',
        'Writing',
        'Total',
        'Level'
      ]

      const columnWidthPercentages = [12, 13, 18, 10, 10, 10, 10, 9, 10]
      const columnWidths = columnWidthPercentages.map(percentage => (percentage / 100) * scoreCardWidth)
      let columnPositions = [scoreCardX]
      for (let i = 1; i < columnWidths.length; i++) {
        columnPositions[i] = columnPositions[i - 1] + columnWidths[i - 1]
      }

      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(51, 51, 51)
      scoreColumns.forEach((column, index) => {
        const colX = columnPositions[index] + columnWidths[index] / 2
        doc.text(column, colX - doc.getTextWidth(column) / 2, scoreCardY + 8)
        if (index > 0) {
          doc.setDrawColor(221, 221, 221)
          doc.line(columnPositions[index], scoreCardY, columnPositions[index], scoreCardY + scoreCardHeight)
        }
      })

      const scoreData = ['12/02/2025', 'Feb_2025', '40 | B1', '70 | B2', '80 | C1', '60 | B2', '40 | B1', '40', 'B2']
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(0, 0, 0)
      scoreData.forEach((data, index) => {
        const colX = columnPositions[index] + columnWidths[index] / 2
        const rowY = scoreCardY + scoreTableHeaderHeight + scoreTableRowHeight / 2 + 3
        doc.text(data, colX - doc.getTextWidth(data) / 2, rowY)
      })

      currentY = scoreCardY + scoreCardHeight + 20

      // --------- WRITING ASSESSMENT SECTION ---------
      const assessmentHeaderContainerX = sectionMargin
      const assessmentHeaderContainerY = currentY
      const assessmentHeaderContainerWidth = pageWidth - sectionMargin * 2
      const assessmentHeaderContainerHeight = 30

      drawBox(
        assessmentHeaderContainerX,
        assessmentHeaderContainerY,
        assessmentHeaderContainerWidth,
        assessmentHeaderContainerHeight,
        {
          fillColor: [255, 255, 255],
          borderColor: [221, 221, 221],
          borderWidth: 0.5,
          hasBorder: true,
          borderRadius: 2
        }
      )

      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      doc.text('Writing Assessment Part', assessmentHeaderContainerX + 10, assessmentHeaderContainerY + 15)

      doc.setFontSize(11)
      doc.text(
        'Total Score:',
        assessmentHeaderContainerX + assessmentHeaderContainerWidth - 60,
        assessmentHeaderContainerY + 15
      )

      const scoreBoxX = assessmentHeaderContainerX + assessmentHeaderContainerWidth - 30
      const scoreBoxY = assessmentHeaderContainerY + 10
      const scoreBoxWidth = 20
      const scoreBoxHeight = 10

      drawBox(scoreBoxX, scoreBoxY, scoreBoxWidth, scoreBoxHeight, {
        fillColor: [255, 255, 255],
        borderColor: [221, 221, 221],
        borderWidth: 0.5,
        hasBorder: true,
        borderRadius: 2
      })

      doc.text('40', scoreBoxX + 5, assessmentHeaderContainerY + 15)

      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(153, 153, 153)
      doc.text(
        'Detailed breakdown in the writing assessment',
        assessmentHeaderContainerX + 10,
        assessmentHeaderContainerY + 25
      )

      // Chuyển sang trang mới cho phần câu hỏi và trả lời
      doc.addPage()
      currentY = 20

      // --------- PART SECTION ---------
      const partSectionX = sectionMargin
      const partSectionY = currentY
      const partSectionWidth = pageWidth - sectionMargin * 2

      // Hiển thị tiêu đề "Part 1" (hoặc "Part 2", "Part 3") ở chính giữa trang
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      const partTitle = `Part ${activePart.slice(-1)}`
      const partTitleWidth = doc.getTextWidth(partTitle)
      const partTitleX = (pageWidth - partTitleWidth) / 2
      doc.text(partTitle, partTitleX, partSectionY)

      const partTitleHeight = 20

      // Hiển thị hướng dẫn trong hộp riêng
      const instructionsX = partSectionX + 10
      let instructionsY = partSectionY + partTitleHeight
      const instructionsMaxWidth = partSectionWidth - 20

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      const instructionsText = writingData.instructions
      const instructionsLines = doc.splitTextToSize(instructionsText, instructionsMaxWidth - 10)
      const instructionsTextHeight = instructionsLines.length * 6
      const instructionsHeight = instructionsTextHeight + 15

      drawBox(instructionsX, instructionsY, instructionsMaxWidth, instructionsHeight, {
        fillColor: [240, 244, 248],
        borderColor: [208, 217, 226],
        borderWidth: 0.5,
        hasBorder: true,
        borderRadius: 2
      })

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(0, 0, 0)
      doc.text(instructionsLines, instructionsX + 5, instructionsY + 10)

      if (instructionsText.includes('Recommended time')) {
        doc.setFontSize(8)
        doc.setFont('helvetica', 'italic')
        doc.setTextColor(100, 100, 100)
        doc.text(
          "* You're allowed to write up to 10 words without affecting your grade.",
          instructionsX + 5,
          instructionsY + instructionsHeight - 5
        )
      }

      let currentQuestionY = instructionsY + instructionsHeight + 10

      // Tính toán chiều cao của các câu hỏi
      const questions = writingData.questions
      const answers = writingData.answers
      let questionsHeight = 0
      const questionBlocks = questions.map((question, index) => {
        const answer = answers[index] || 'No answer submitted'
        const questionText = `Question ${index + 1}: ${question}`
        const questionLines = doc.splitTextToSize(questionText, partSectionWidth / 2 - 20)
        const questionTextHeight = questionLines.length * 6
        const questionHeaderHeight = Math.max(8, questionTextHeight + 5)

        doc.setFontSize(10)
        const answerLines = doc.splitTextToSize(answer, partSectionWidth / 2 - 20)
        const answerTextHeight = answerLines.length * 6
        const answerContentHeight = Math.max(15, answerTextHeight + 10)

        const commentContentHeight = 10
        const totalQuestionHeight = questionHeaderHeight + answerContentHeight + 20

        return {
          question,
          questionLines,
          questionHeaderHeight,
          answer,
          answerLines,
          answerContentHeight,
          commentContentHeight,
          totalQuestionHeight
        }
      })

      questionBlocks.forEach(block => {
        questionsHeight += block.totalQuestionHeight + 10
      })

      const partSectionHeight = instructionsHeight + questionsHeight + 20

      // Vẽ khung bao quanh phần hướng dẫn và các câu hỏi
      drawBox(partSectionX, instructionsY, partSectionWidth, partSectionHeight, {
        fillColor: [255, 255, 255],
        borderColor: [221, 221, 221],
        borderWidth: 0.5,
        hasBorder: true,
        borderRadius: 2
      })

      // Hiển thị các câu hỏi
      questionBlocks.forEach(block => {
        if (currentQuestionY + block.totalQuestionHeight > pageHeight - 20) {
          doc.addPage()
          currentQuestionY = 20
          drawBox(partSectionX, 10, partSectionWidth, pageHeight - 20, {
            fillColor: [255, 255, 255],
            borderColor: [221, 221, 221],
            borderWidth: 0.5,
            hasBorder: true,
            borderRadius: 2
          })
        }

        const horizontalPadding = 5
        const gapBetween = 1.5
        const questionContainerWidth = (partSectionWidth - horizontalPadding * 2 - gapBetween) / 2

        // Hiển thị câu hỏi
        const questionContainerX = partSectionX + horizontalPadding
        const questionContainerY = currentQuestionY

        drawBox(questionContainerX, questionContainerY, questionContainerWidth, block.totalQuestionHeight, {
          fillColor: [255, 255, 255],
          borderColor: [221, 221, 221],
          borderWidth: 0.5,
          hasBorder: true,
          borderRadius: 2
        })

        drawBox(questionContainerX, questionContainerY, questionContainerWidth, block.questionHeaderHeight, {
          fillColor: [224, 224, 224],
          borderColor: [221, 221, 221],
          borderWidth: 0.5,
          hasBorder: true,
          borderRadius: 2
        })

        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(0, 0, 0)
        doc.text(block.questionLines, questionContainerX + 5, questionContainerY + 5)

        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text('Student Answer:', questionContainerX + 5, questionContainerY + block.questionHeaderHeight + 10)

        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.text(block.answerLines, questionContainerX + 5, questionContainerY + block.questionHeaderHeight + 20)

        // Hiển thị phần nhận xét
        const commentContainerX = questionContainerX + questionContainerWidth + gapBetween
        const commentContainerY = currentQuestionY

        drawBox(commentContainerX, commentContainerY, questionContainerWidth, block.totalQuestionHeight, {
          fillColor: [255, 255, 255],
          borderColor: [221, 221, 221],
          borderWidth: 0.5,
          hasBorder: true,
          borderRadius: 2
        })

        drawBox(commentContainerX, commentContainerY, questionContainerWidth, block.questionHeaderHeight, {
          fillColor: [224, 224, 224],
          borderColor: [221, 221, 221],
          borderWidth: 0.5,
          hasBorder: true,
          borderRadius: 2
        })

        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text('Comment', commentContainerX + 5, commentContainerY + 10)

        currentQuestionY += block.totalQuestionHeight + 3
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
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('There was an error exporting the PDF. Please try again later.')
    }
  }

  return (
    <Button
      className="rounded-lg bg-red-400 px-8 py-5 text-base font-medium text-white hover:bg-red-500"
      onClick={exportToPDF}
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
