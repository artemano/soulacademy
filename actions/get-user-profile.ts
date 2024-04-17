const apiEndpoint = process.env.NEXT_PUBLIC_API;

export const getUserProfile = async () => {
    try {
        const endPoint = `${apiEndpoint}user/me`;
        const req = await fetch(endPoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const response = await req.json();
        //console.log(reset);
        if (response?.success) {
            return response;
        } else {
            return response.message;
        }
    } catch (error) {
        return Promise.reject(error);
    }
}