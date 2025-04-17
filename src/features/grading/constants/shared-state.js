export const sharedState = {
  // Format: draft_<sessionParticipantId>
  drafts: {},

  getDraftKey: sessionParticipantId => `draft_${sessionParticipantId}`,

  getDraft: sessionParticipantId => {
    const key = sharedState.getDraftKey(sessionParticipantId)
    if (sharedState.drafts[key]) {
      return sharedState.drafts[key]
    }
    const savedDraft = localStorage.getItem(key)
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft)
        sharedState.drafts[key] = parsedDraft
        return parsedDraft
      } catch (error) {
        console.error('Error parsing saved draft:', error)
      }
    }
    return {
      speaking: {},
      writing: {},
      score: { speaking: null, writing: null }
    }
  },

  saveDraft: (sessionParticipantId, data) => {
    const key = sharedState.getDraftKey(sessionParticipantId)
    const currentDraft = sharedState.getDraft(sessionParticipantId)
    const updatedDraft = {
      ...currentDraft,
      ...data,
      score: {
        ...currentDraft.score,
        ...(data.score || {})
      }
    }
    sharedState.drafts[key] = updatedDraft
  },

  updateFeedback: (sessionParticipantId, skill, part, questionIndex, feedback, studentAnswerId) => {
    const draft = sharedState.getDraft(sessionParticipantId)
    const updatedDraft = {
      ...draft,
      [skill]: {
        ...draft[skill],
        [part]: {
          ...draft[skill][part],
          [questionIndex]: {
            messageContent: feedback || null,
            studentAnswerId: studentAnswerId || null
          }
        }
      }
    }
    sharedState.saveDraft(sessionParticipantId, updatedDraft)
  },

  updateScore: (sessionParticipantId, skill, score) => {
    const draft = sharedState.getDraft(sessionParticipantId)
    const updatedDraft = {
      ...draft,
      score: {
        ...draft.score,
        [skill]: score === '' ? null : score
      }
    }
    sharedState.saveDraft(sessionParticipantId, updatedDraft)
  },

  persistDraft: sessionParticipantId => {
    const key = sharedState.getDraftKey(sessionParticipantId)
    const draft = sharedState.getDraft(sessionParticipantId)
    console.log('Attempting to persist draft:', { key, draft })
    try {
      localStorage.setItem(key, JSON.stringify(draft))
      console.log('Successfully saved draft to localStorage')
      return true
    } catch (error) {
      console.error('Error saving draft to localStorage:', error)
      return false
    }
  },

  clearDraft: sessionParticipantId => {
    const key = sharedState.getDraftKey(sessionParticipantId)
    delete sharedState.drafts[key]
    localStorage.removeItem(key)
  },

  getFeedbackWithStudentAnswerId: (sessionParticipantId, skill) => {
    const draft = sharedState.getDraft(sessionParticipantId)
    const feedback = draft[skill] || {}
    const studentAnswers = []
    Object.keys(feedback).forEach(part => {
      Object.keys(feedback[part]).forEach(questionIndex => {
        const entry = feedback[part][questionIndex]
        studentAnswers.push({
          studentAnswerId: entry?.studentAnswerId || null,
          messageContent: entry?.messageContent || null
        })
      })
    })
    return studentAnswers
  }
}
