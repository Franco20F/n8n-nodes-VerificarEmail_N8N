import {
    IAuthenticateGeneric,
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
    Icon,
} from 'n8n-workflow';

export class VerificarEmailApi implements ICredentialType {
    name = 'verificarEmailApi';
    displayName = 'Verificar Email API';
    icon: Icon = 'file:email.svg';
    documentationUrl = 'https://docs.n8n.io/';

    properties: INodeProperties[] = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            required: true,
            description: 'API Key de Emailable',
        },
    ];

    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            qs: {
                api_key: '={{$credentials.apiKey}}',
            },
        },
    };

    test: ICredentialTestRequest = {
        request: {
            baseURL: 'https://api.emailable.com',
            url: '/v1/verify',
            method: 'GET',
            qs: {
                email: 'test@test.com',
            },
        },
    };
}