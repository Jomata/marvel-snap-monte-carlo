export default function check(validation:boolean, error?:string|(()=>string)) {
    if(!validation) {
        let errorMessage = "Check failed"

        if(typeof error === 'string') {
            errorMessage = error
        }
        if(typeof error === 'function') {
            errorMessage = error()
        }
        throw new Error(errorMessage)
    }
}