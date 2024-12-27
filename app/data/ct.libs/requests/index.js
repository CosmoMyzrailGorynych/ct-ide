const requests = {
    async getRequest(url, headers = {}) {
        return fetch(url, { headers: headers }).then(res => {
            if (res.status == 200) {
                const contentType = res.headers.get("content-type");
                if (contentType || contentType.includes("application/json")) {
                    return res.json()
                }
                return res.text()
            } else {
                const msg = `Request failed with status ${res.status}`
                console.error(msg)
                throw new Error(msg)
            }
        })
    },

    async postRequest(url, headers = {}, body) {
        return fetch(url,
            {
                method: "POST",
                body: JSON.stringify(body),
                headers: headers
            }
        )
            .then(res => {
                if (res.status == 200) {
                    const contentType = res.headers.get("content-type");
                    if (contentType || contentType.includes("application/json")) {
                        return res.json()
                    }
                    return res.text()
                } else {
                    const msg = `Request failed with status ${res.status}`
                    console.error(msg)
                    throw new Error(msg)
                }
            })
    }
}