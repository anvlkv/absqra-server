export const CRUDRouter = {
    getAllProjects: {
        path: '/crud/projects',
        params: [],
    },
    getProject: {
        path: '/crud/projects/:projectId',
        params: ['projectId'],
    },
    newProject: {
        path: '/crud/projects',
        params: [],
    },
    saveProject: {
        path: '/crud/projects/:projectId',
        params: ['projectId'],
    },
    updateProject: {
        path: '/crud/projects/:projectId',
        params: ['projectId'],
    },
    deleteProject: {
        path: '/crud/projects/:projectId',
        params: ['projectId'],
    },
    getAllSequenceResponsesOfProject: {
        path: '/crud/projects/:projectId/sequenceResponses',
        params: ['projectId'],
    },
    getSequenceResponseOfProject: {
        path: '/crud/projects/:projectId/sequenceResponses/:sequenceResponseId',
        params: ['projectId', 'sequenceResponseId'],
    },
    newSequenceResponseOfProject: {
        path: '/crud/projects/:projectId/sequenceResponses',
        params: ['projectId'],
    },
    saveSequenceResponseOfProject: {
        path: '/crud/projects/:projectId/sequenceResponses/:sequenceResponseId',
        params: ['projectId', 'sequenceResponseId'],
    },
    updateSequenceResponseOfProject: {
        path: '/crud/projects/:projectId/sequenceResponses/:sequenceResponseId',
        params: ['projectId', 'sequenceResponseId'],
    },
    deleteSequenceResponseOfProject: {
        path: '/crud/projects/:projectId/sequenceResponses/:sequenceResponseId',
        params: ['projectId', 'sequenceResponseId'],
    },
    getAllStepResponsesOfSequenceResponseOfProject: {
        path: '/crud/projects/:projectId/sequenceResponses/:sequenceResponseId/stepResponses',
        params: ['projectId', 'sequenceResponseId'],
    },
    getStepResponseOfSequenceResponseOfProject: {
        path: '/crud/projects/:projectId/sequenceResponses/:sequenceResponseId/stepResponses/:stepResponseId',
        params: ['projectId', 'sequenceResponseId', 'stepResponseId'],
    },
    newStepResponseOfSequenceResponseOfProject: {
        path: '/crud/projects/:projectId/sequenceResponses/:sequenceResponseId/stepResponses',
        params: ['projectId', 'sequenceResponseId'],
    },
    saveStepResponseOfSequenceResponseOfProject: {
        path: '/crud/projects/:projectId/sequenceResponses/:sequenceResponseId/stepResponses/:stepResponseId',
        params: ['projectId', 'sequenceResponseId', 'stepResponseId'],
    },
    updateStepResponseOfSequenceResponseOfProject: {
        path: '/crud/projects/:projectId/sequenceResponses/:sequenceResponseId/stepResponses/:stepResponseId',
        params: ['projectId', 'sequenceResponseId', 'stepResponseId'],
    },
    deleteStepResponseOfSequenceResponseOfProject: {
        path: '/crud/projects/:projectId/sequenceResponses/:sequenceResponseId/stepResponses/:stepResponseId',
        params: ['projectId', 'sequenceResponseId', 'stepResponseId'],
    },
    getAllSequences: {
        path: '/crud/sequences',
        params: [],
    },
    getSequence: {
        path: '/crud/sequences/:sequenceId',
        params: ['sequenceId'],
    },
    newSequence: {
        path: '/crud/sequences',
        params: [],
    },
    saveSequence: {
        path: '/crud/sequences/:sequenceId',
        params: ['sequenceId'],
    },
    updateSequence: {
        path: '/crud/sequences/:sequenceId',
        params: ['sequenceId'],
    },
    deleteSequence: {
        path: '/crud/sequences/:sequenceId',
        params: ['sequenceId'],
    },
    getAllStepsOfSequence: {
        path: '/crud/sequences/:sequenceId/steps',
        params: ['sequenceId'],
    },
    getStepOfSequence: {
        path: '/crud/sequences/:sequenceId/steps/:stepId',
        params: ['sequenceId', 'stepId'],
    },
    newStepOfSequence: {
        path: '/crud/sequences/:sequenceId/steps',
        params: ['sequenceId'],
    },
    saveStepOfSequence: {
        path: '/crud/sequences/:sequenceId/steps/:stepId',
        params: ['sequenceId', 'stepId'],
    },
    updateStepOfSequence: {
        path: '/crud/sequences/:sequenceId/steps/:stepId',
        params: ['sequenceId', 'stepId'],
    },
    deleteStepOfSequence: {
        path: '/crud/sequences/:sequenceId/steps/:stepId',
        params: ['sequenceId', 'stepId'],
    },
    getAllSteps: {
        path: '/crud/steps',
        params: [],
    },
    getStep: {
        path: '/crud/steps/:stepId',
        params: ['stepId'],
    },
    newStep: {
        path: '/crud/steps',
        params: [],
    },
    saveStep: {
        path: '/crud/steps/:stepId',
        params: ['stepId'],
    },
    updateStep: {
        path: '/crud/steps/:stepId',
        params: ['stepId'],
    },
    deleteStep: {
        path: '/crud/steps/:stepId',
        params: ['stepId'],
    },
    getAllQuestions: {
        path: '/crud/questions',
        params: [],
    },
    getQuestion: {
        path: '/crud/questions/:questionId',
        params: ['questionId'],
    },
    newQuestion: {
        path: '/crud/questions',
        params: [],
    },
    saveQuestion: {
        path: '/crud/questions/:questionId',
        params: ['questionId'],
    },
    updateQuestion: {
        path: '/crud/questions/:questionId',
        params: ['questionId'],
    },
    deleteQuestion: {
        path: '/crud/questions/:questionId',
        params: ['questionId'],
    },
    getAllFormatConstraintsOfQuestion: {
        path: '/crud/questions/:questionId/formatConstraints',
        params: ['questionId'],
    },
    getFormatConstraintOfQuestion: {
        path: '/crud/questions/:questionId/formatConstraints/:formatConstraintId',
        params: ['questionId', 'formatConstraintId'],
    },
    newFormatConstraintOfQuestion: {
        path: '/crud/questions/:questionId/formatConstraints',
        params: ['questionId'],
    },
    saveFormatConstraintOfQuestion: {
        path: '/crud/questions/:questionId/formatConstraints/:formatConstraintId',
        params: ['questionId', 'formatConstraintId'],
    },
    updateFormatConstraintOfQuestion: {
        path: '/crud/questions/:questionId/formatConstraints/:formatConstraintId',
        params: ['questionId', 'formatConstraintId'],
    },
    deleteFormatConstraintOfQuestion: {
        path: '/crud/questions/:questionId/formatConstraints/:formatConstraintId',
        params: ['questionId', 'formatConstraintId'],
    },
    getAllQuestionAssetsOfQuestion: {
        path: '/crud/questions/:questionId/questionAssets',
        params: ['questionId'],
    },
    getQuestionAssetOfQuestion: {
        path: '/crud/questions/:questionId/questionAssets/:questionAssetId',
        params: ['questionId', 'questionAssetId'],
    },
    newQuestionAssetOfQuestion: {
        path: '/crud/questions/:questionId/questionAssets',
        params: ['questionId'],
    },
    saveQuestionAssetOfQuestion: {
        path: '/crud/questions/:questionId/questionAssets/:questionAssetId',
        params: ['questionId', 'questionAssetId'],
    },
    updateQuestionAssetOfQuestion: {
        path: '/crud/questions/:questionId/questionAssets/:questionAssetId',
        params: ['questionId', 'questionAssetId'],
    },
    deleteQuestionAssetOfQuestion: {
        path: '/crud/questions/:questionId/questionAssets/:questionAssetId',
        params: ['questionId', 'questionAssetId'],
    },
    getAllResponseAssetsOfQuestion: {
        path: '/crud/questions/:questionId/responseAssets',
        params: ['questionId'],
    },
    getResponseAssetOfQuestion: {
        path: '/crud/questions/:questionId/responseAssets/:responseAssetId',
        params: ['questionId', 'responseAssetId'],
    },
    newResponseAssetOfQuestion: {
        path: '/crud/questions/:questionId/responseAssets',
        params: ['questionId'],
    },
    saveResponseAssetOfQuestion: {
        path: '/crud/questions/:questionId/responseAssets/:responseAssetId',
        params: ['questionId', 'responseAssetId'],
    },
    updateResponseAssetOfQuestion: {
        path: '/crud/questions/:questionId/responseAssets/:responseAssetId',
        params: ['questionId', 'responseAssetId'],
    },
    deleteResponseAssetOfQuestion: {
        path: '/crud/questions/:questionId/responseAssets/:responseAssetId',
        params: ['questionId', 'responseAssetId'],
    },
    getAllResponses: {
        path: '/crud/responses',
        params: [],
    },
    getResponse: {
        path: '/crud/responses/:responseId',
        params: ['responseId'],
    },
    newResponse: {
        path: '/crud/responses',
        params: [],
    },
    saveResponse: {
        path: '/crud/responses/:responseId',
        params: ['responseId'],
    },
    updateResponse: {
        path: '/crud/responses/:responseId',
        params: ['responseId'],
    },
    deleteResponse: {
        path: '/crud/responses/:responseId',
        params: ['responseId'],
    },
    getAllStepResponsesOfResponse: {
        path: '/crud/responses/:responseId/stepResponses',
        params: ['responseId'],
    },
    getStepResponseOfResponse: {
        path: '/crud/responses/:responseId/stepResponses/:stepResponseId',
        params: ['responseId', 'stepResponseId'],
    },
    newStepResponseOfResponse: {
        path: '/crud/responses/:responseId/stepResponses',
        params: ['responseId'],
    },
    saveStepResponseOfResponse: {
        path: '/crud/responses/:responseId/stepResponses/:stepResponseId',
        params: ['responseId', 'stepResponseId'],
    },
    updateStepResponseOfResponse: {
        path: '/crud/responses/:responseId/stepResponses/:stepResponseId',
        params: ['responseId', 'stepResponseId'],
    },
    deleteStepResponseOfResponse: {
        path: '/crud/responses/:responseId/stepResponses/:stepResponseId',
        params: ['responseId', 'stepResponseId'],
    },
    getAllRespondentsLists: {
        path: '/crud/respondentsLists',
        params: [],
    },
    getRespondentsList: {
        path: '/crud/respondentsLists/:respondentsListId',
        params: ['respondentsListId'],
    },
    newRespondentsList: {
        path: '/crud/respondentsLists',
        params: [],
    },
    saveRespondentsList: {
        path: '/crud/respondentsLists/:respondentsListId',
        params: ['respondentsListId'],
    },
    updateRespondentsList: {
        path: '/crud/respondentsLists/:respondentsListId',
        params: ['respondentsListId'],
    },
    deleteRespondentsList: {
        path: '/crud/respondentsLists/:respondentsListId',
        params: ['respondentsListId'],
    },
    getAllRespondentsOfRespondentsList: {
        path: '/crud/respondentsLists/:respondentsListId/respondents',
        params: ['respondentsListId'],
    },
    getRespondentOfRespondentsList: {
        path: '/crud/respondentsLists/:respondentsListId/respondents/:respondentId',
        params: ['respondentsListId', 'respondentId'],
    },
    newRespondentOfRespondentsList: {
        path: '/crud/respondentsLists/:respondentsListId/respondents',
        params: ['respondentsListId'],
    },
    saveRespondentOfRespondentsList: {
        path: '/crud/respondentsLists/:respondentsListId/respondents/:respondentId',
        params: ['respondentsListId', 'respondentId'],
    },
    updateRespondentOfRespondentsList: {
        path: '/crud/respondentsLists/:respondentsListId/respondents/:respondentId',
        params: ['respondentsListId', 'respondentId'],
    },
    deleteRespondentOfRespondentsList: {
        path: '/crud/respondentsLists/:respondentsListId/respondents/:respondentId',
        params: ['respondentsListId', 'respondentId'],
    }
};
