import type {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';


export class VerificarEmail implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Verificar Email',
        name: 'verificarEmail',
        icon: 'file:email.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Verifica si un email es valido',
        defaults: {
            name: 'Verificar Email',
        },
        usableAsTool: true,
        inputs: [NodeConnectionTypes.Main],
        outputs: [NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'verificarEmailApi',
                required: true,
            },
        ],
        requestDefaults: {
            baseURL: 'https://api.emailable.com/v1/verify',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        },
        properties: [
            {
                displayName: 'Direccion De Email',
                name: 'email',
                type: 'string',
                placeholder: 'test@test.com',
                noDataExpression: true,

                default: '',
                routing: {
                    request: {
                        qs: {
                            email: '={{$value}}',
                        },
                    },
                },
            },

        ]
    };
    ///////////////////
    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];


        for (let i = 0; i < items.length; i++) {
            try {
                const email = this.getNodeParameter('email', i) as string;
                const credentials = await this.getCredentials('verificarEmailApi');

                // La propiedad apiKey fue definida en el .credentials.ts
                const apiKey = credentials.apiKey as string;

                const response: any = await this.helpers.httpRequest({
                    method: 'GET',
                    url: 'https://api.emailable.com/v1/verify',
                    headers: {
                        Accept: 'application/json',
                    },
                    qs: {
                        email: email,
                        api_key: apiKey // Emailable espera la API key en el Query String o Auth de otra manera
                    },
                    json: true,
                });

                returnData.push({
                    json: {
                        email: response?.email,
                        state: response?.state,
                        deliverable: response?.state === 'deliverable',
                        score: response?.score,
                    },
                });

            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: error.message,
                        },
                    });
                    continue;
                }
                throw error;
            }
        }

        return this.prepareOutputData(returnData);
    }
}