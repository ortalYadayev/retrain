import axios from 'axios';
import {APIRootPath} from '@fed-exam/config';

export type Ticket = {
    id: string,
    title: string;
    content: string;
    creationTime: number;
    userEmail: string;
    labels?: string[];
    hide: boolean;
}

export type ApiClient = {
    getTickets: (page: number) => Promise<Ticket[]>;
    clone: (payload: Ticket) => void;
}

export const createApiClient = (): ApiClient => {
    return {
        getTickets: (page: number) => {
            return axios.get(APIRootPath, { params: { page } }).then((res) =>
                res.data.map((element: Ticket) => element = {
                    ...element,
                    hide: false
                })
            );
        },

        clone: (payload) => {
            return axios.post(APIRootPath, payload);
        }
    }
}
