const result = (success: boolean, payload: any) => {
    if (success) {
        return {
            success: 1,
            data: payload
        };
    }
    return {
        success: 0,
        msg: payload
    };
}

export const success = (data?: any) => result(true, data);
export const failed = (msg?: string) => result(false, msg);