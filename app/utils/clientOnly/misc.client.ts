export const doPrint = () => {
    if (typeof window === 'object') {
        window.print()
    }
}