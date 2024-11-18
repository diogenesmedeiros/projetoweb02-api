const handleResponse = (code, status, message, data) => {
    return {
        code,
        status,
        message,
        ...data
    }
}

export default handleResponse;