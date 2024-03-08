import axios from 'axios'

export const getViewerIdFromHTMLSourceCode = (sourceCode: any) => {
    if (!sourceCode) return null
    const splited = sourceCode.split('drive-viewer/')
    if (splited.length < 2) return null
    const viewerId = splited[1].split('\\')[0]
    return viewerId
}

export const getViewIdFromImageIdGoogleDrive = async (photo_id: string) => {
    try {
        const fetch = await axios.get(`${process.env.GOOGLE_VIEW_URL?.replace('@@@@', photo_id)}`)
        const viewid = getViewerIdFromHTMLSourceCode(fetch.data)
        return viewid
    } catch (err) {
        return null;
    }
}