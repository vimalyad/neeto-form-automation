const apiVersion = '/api/v1'

export const formUrl = `${apiVersion}/forms`;

export const BACKEND_MAPPING_FOR_FORM_BUILDER = {
    insights: 'insights',
    records: 'records',
    attempts: 'attempts',
    submissions: 'submissions',
    publish: 'publish'
}

export const BACKEND_URL_PATTERNS = {
    attemptsUrl: `${formUrl}/${BACKEND_MAPPING_FOR_FORM_BUILDER.attempts}/`,
    exportsUrl: `${apiVersion}/exports`,
    publishUrl: `${formUrl}/${BACKEND_MAPPING_FOR_FORM_BUILDER.publish}/`
}