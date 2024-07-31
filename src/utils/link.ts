import { compile } from 'path-to-regexp';

export const url = (path: string, params = {}) => {
    /*
    Replace variables in paths like:
    url('/processes/:processId', { processId: 123 }) -> '/processes/123'
    */
    const toPath = compile(path, { encode: encodeURIComponent });
    return toPath(params);
};
