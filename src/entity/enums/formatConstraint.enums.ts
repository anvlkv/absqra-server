export enum ValidationTypes {
    TYPE = 'type',
    VALUE = 'value',
    META_VALUE = 'meta_value'
}

export enum TYPE_ValidationTypes {
    IS_TEXT = 'text',
    IS_NUMBER = 'number',
    IS_EMAIL = 'email',
    IS_URL = 'url',
    IS_FILE = 'file'
}

export enum VALUE_ValidationTypes {
    MIN = 'min',
    MAX = 'max',
    CONTAINS = 'contains',
    NOT_CONTAINS = 'not_contains'
}

export enum META_VALUE_ValidationTypes {
    VALUES_COUNT = 'values_count',
    STRING_LENGTH = 'value_length',
    EXISTS = 'exists'
}