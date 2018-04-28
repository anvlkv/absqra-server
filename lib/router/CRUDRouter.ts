export const CRUDRouter = {
    getAllProjects: {
        path: '/projects',
        params: [],
    },
    getProject: {
        path: '/projects/:projectId',
        params: ['projectId'],
    },
    newProject: {
        path: '/projects',
        params: [],
    },
    saveProject: {
        path: '/projects/:projectId',
        params: ['projectId'],
    },
    updateProject: {
        path: '/projects/:projectId',
        params: ['projectId'],
    },
    deleteProject: {
        path: '/projects/:projectId',
        params: ['projectId'],
    },
    getAllResponsesOfProject: {
        path: '/projects/:projectId/responses',
        params: ['projectId'],
    },
    getResponseOfProject: {
        path: '/projects/:projectId/responses/:responseId',
        params: ['projectId', 'responseId'],
    },
    newResponseOfProject: {
        path: '/projects/:projectId/responses',
        params: ['projectId'],
    },
    saveResponseOfProject: {
        path: '/projects/:projectId/responses/:responseId',
        params: ['projectId', 'responseId'],
    },
    updateResponseOfProject: {
        path: '/projects/:projectId/responses/:responseId',
        params: ['projectId', 'responseId'],
    },
    deleteResponseOfProject: {
        path: '/projects/:projectId/responses/:responseId',
        params: ['projectId', 'responseId'],
    },
    getAllStepResponsesOfResponseOfProject: {
        path: '/projects/:projectId/responses/:responseId/stepResponses',
        params: ['projectId', 'responseId'],
    },
    getStepResponseOfResponseOfProject: {
        path: '/projects/:projectId/responses/:responseId/stepResponses/:stepResponseId',
        params: ['projectId', 'responseId', 'stepResponseId'],
    },
    newStepResponseOfResponseOfProject: {
        path: '/projects/:projectId/responses/:responseId/stepResponses',
        params: ['projectId', 'responseId'],
    },
    saveStepResponseOfResponseOfProject: {
        path: '/projects/:projectId/responses/:responseId/stepResponses/:stepResponseId',
        params: ['projectId', 'responseId', 'stepResponseId'],
    },
    updateStepResponseOfResponseOfProject: {
        path: '/projects/:projectId/responses/:responseId/stepResponses/:stepResponseId',
        params: ['projectId', 'responseId', 'stepResponseId'],
    },
    deleteStepResponseOfResponseOfProject: {
        path: '/projects/:projectId/responses/:responseId/stepResponses/:stepResponseId',
        params: ['projectId', 'responseId', 'stepResponseId'],
    },
    getAllSequences: {
        path: '/sequences',
        params: [],
    },
    getSequence: {
        path: '/sequences/:sequenceId',
        params: ['sequenceId'],
    },
    newSequence: {
        path: '/sequences',
        params: [],
    },
    saveSequence: {
        path: '/sequences/:sequenceId',
        params: ['sequenceId'],
    },
    updateSequence: {
        path: '/sequences/:sequenceId',
        params: ['sequenceId'],
    },
    deleteSequence: {
        path: '/sequences/:sequenceId',
        params: ['sequenceId'],
    },
    getAllStepsOfSequence: {
        path: '/sequences/:sequenceId/steps',
        params: ['sequenceId'],
    },
    getStepOfSequence: {
        path: '/sequences/:sequenceId/steps/:stepId',
        params: ['sequenceId', 'stepId'],
    },
    newStepOfSequence: {
        path: '/sequences/:sequenceId/steps',
        params: ['sequenceId'],
    },
    saveStepOfSequence: {
        path: '/sequences/:sequenceId/steps/:stepId',
        params: ['sequenceId', 'stepId'],
    },
    updateStepOfSequence: {
        path: '/sequences/:sequenceId/steps/:stepId',
        params: ['sequenceId', 'stepId'],
    },
    deleteStepOfSequence: {
        path: '/sequences/:sequenceId/steps/:stepId',
        params: ['sequenceId', 'stepId'],
    },
    getAllSteps: {
        path: '/steps',
        params: [],
    },
    getStep: {
        path: '/steps/:stepId',
        params: ['stepId'],
    },
    newStep: {
        path: '/steps',
        params: [],
    },
    saveStep: {
        path: '/steps/:stepId',
        params: ['stepId'],
    },
    updateStep: {
        path: '/steps/:stepId',
        params: ['stepId'],
    },
    deleteStep: {
        path: '/steps/:stepId',
        params: ['stepId'],
    },
    getAllQuestions: {
        path: '/questions',
        params: [],
    },
    getQuestion: {
        path: '/questions/:questionId',
        params: ['questionId'],
    },
    newQuestion: {
        path: '/questions',
        params: [],
    },
    saveQuestion: {
        path: '/questions/:questionId',
        params: ['questionId'],
    },
    updateQuestion: {
        path: '/questions/:questionId',
        params: ['questionId'],
    },
    deleteQuestion: {
        path: '/questions/:questionId',
        params: ['questionId'],
    },
    getAllFormatConstraintsOfQuestion: {
        path: '/questions/:questionId/formatConstraints',
        params: ['questionId'],
    },
    getFormatConstraintOfQuestion: {
        path: '/questions/:questionId/formatConstraints/:formatConstraintId',
        params: ['questionId', 'formatConstraintId'],
    },
    newFormatConstraintOfQuestion: {
        path: '/questions/:questionId/formatConstraints',
        params: ['questionId'],
    },
    saveFormatConstraintOfQuestion: {
        path: '/questions/:questionId/formatConstraints/:formatConstraintId',
        params: ['questionId', 'formatConstraintId'],
    },
    updateFormatConstraintOfQuestion: {
        path: '/questions/:questionId/formatConstraints/:formatConstraintId',
        params: ['questionId', 'formatConstraintId'],
    },
    deleteFormatConstraintOfQuestion: {
        path: '/questions/:questionId/formatConstraints/:formatConstraintId',
        params: ['questionId', 'formatConstraintId'],
    },
    getAllQuestionAssetsOfQuestion: {
        path: '/questions/:questionId/questionAssets',
        params: ['questionId'],
    },
    getQuestionAssetOfQuestion: {
        path: '/questions/:questionId/questionAssets/:questionAssetId',
        params: ['questionId', 'questionAssetId'],
    },
    newQuestionAssetOfQuestion: {
        path: '/questions/:questionId/questionAssets',
        params: ['questionId'],
    },
    saveQuestionAssetOfQuestion: {
        path: '/questions/:questionId/questionAssets/:questionAssetId',
        params: ['questionId', 'questionAssetId'],
    },
    updateQuestionAssetOfQuestion: {
        path: '/questions/:questionId/questionAssets/:questionAssetId',
        params: ['questionId', 'questionAssetId'],
    },
    deleteQuestionAssetOfQuestion: {
        path: '/questions/:questionId/questionAssets/:questionAssetId',
        params: ['questionId', 'questionAssetId'],
    },
    getAllResponseAssetsOfQuestion: {
        path: '/questions/:questionId/responseAssets',
        params: ['questionId'],
    },
    getResponseAssetOfQuestion: {
        path: '/questions/:questionId/responseAssets/:responseAssetId',
        params: ['questionId', 'responseAssetId'],
    },
    newResponseAssetOfQuestion: {
        path: '/questions/:questionId/responseAssets',
        params: ['questionId'],
    },
    saveResponseAssetOfQuestion: {
        path: '/questions/:questionId/responseAssets/:responseAssetId',
        params: ['questionId', 'responseAssetId'],
    },
    updateResponseAssetOfQuestion: {
        path: '/questions/:questionId/responseAssets/:responseAssetId',
        params: ['questionId', 'responseAssetId'],
    },
    deleteResponseAssetOfQuestion: {
        path: '/questions/:questionId/responseAssets/:responseAssetId',
        params: ['questionId', 'responseAssetId'],
    },
    getAllResponses: {
        path: '/responses',
        params: [],
    },
    getResponse: {
        path: '/responses/:responseId',
        params: ['responseId'],
    },
    newResponse: {
        path: '/responses',
        params: [],
    },
    saveResponse: {
        path: '/responses/:responseId',
        params: ['responseId'],
    },
    updateResponse: {
        path: '/responses/:responseId',
        params: ['responseId'],
    },
    deleteResponse: {
        path: '/responses/:responseId',
        params: ['responseId'],
    },
    getAllStepResponsesOfResponse: {
        path: '/responses/:responseId/stepResponses',
        params: ['responseId'],
    },
    getStepResponseOfResponse: {
        path: '/responses/:responseId/stepResponses/:stepResponseId',
        params: ['responseId', 'stepResponseId'],
    },
    newStepResponseOfResponse: {
        path: '/responses/:responseId/stepResponses',
        params: ['responseId'],
    },
    saveStepResponseOfResponse: {
        path: '/responses/:responseId/stepResponses/:stepResponseId',
        params: ['responseId', 'stepResponseId'],
    },
    updateStepResponseOfResponse: {
        path: '/responses/:responseId/stepResponses/:stepResponseId',
        params: ['responseId', 'stepResponseId'],
    },
    deleteStepResponseOfResponse: {
        path: '/responses/:responseId/stepResponses/:stepResponseId',
        params: ['responseId', 'stepResponseId'],
    },
    getAllRespondentsLists: {
        path: '/respondentsLists',
        params: [],
    },
    getRespondentsList: {
        path: '/respondentsLists/:respondentsListId',
        params: ['respondentsListId'],
    },
    newRespondentsList: {
        path: '/respondentsLists',
        params: [],
    },
    saveRespondentsList: {
        path: '/respondentsLists/:respondentsListId',
        params: ['respondentsListId'],
    },
    updateRespondentsList: {
        path: '/respondentsLists/:respondentsListId',
        params: ['respondentsListId'],
    },
    deleteRespondentsList: {
        path: '/respondentsLists/:respondentsListId',
        params: ['respondentsListId'],
    },
    getAllRespondentsOfRespondentsList: {
        path: '/respondentsLists/:respondentsListId/respondents',
        params: ['respondentsListId'],
    },
    getRespondentOfRespondentsList: {
        path: '/respondentsLists/:respondentsListId/respondents/:respondentId',
        params: ['respondentsListId', 'respondentId'],
    },
    newRespondentOfRespondentsList: {
        path: '/respondentsLists/:respondentsListId/respondents',
        params: ['respondentsListId'],
    },
    saveRespondentOfRespondentsList: {
        path: '/respondentsLists/:respondentsListId/respondents/:respondentId',
        params: ['respondentsListId', 'respondentId'],
    },
    updateRespondentOfRespondentsList: {
        path: '/respondentsLists/:respondentsListId/respondents/:respondentId',
        params: ['respondentsListId', 'respondentId'],
    },
    deleteRespondentOfRespondentsList: {
        path: '/respondentsLists/:respondentsListId/respondents/:respondentId',
        params: ['respondentsListId', 'respondentId'],
    }
};
