import { Resource } from 'rim/federation'

export const Data = {}
export const Utils =
{
    LoadXML: (alias, uri) =>
    {
        return new Promise((resolve, reject) => Resource.GetAssetUrl(uri).then(url =>
		{
            const xhr = new XMLHttpRequest()
            xhr.onreadystatechange = _ =>
            {
                switch (xhr.readyState)
                {
                    case 0 : // UNINITIALIZED
                    case 1 : // LOADING
                    case 2 : // LOADED
                    case 3 : // INTERACTIVE
                        break
                    case 4 : // COMPLETED
                        Data[alias] = xhr.responseXML
                        return resolve()
                    default:
                        return reject()
                }
            }
            xhr.open('GET', url, true)
            xhr.send()
		}))
    },

    LoadText: (alias, uri) =>
    {
        return new Promise((resolve, reject) => Resource.GetAssetUrl(uri).then(url =>
		{
            const xhr = new XMLHttpRequest()
            xhr.onreadystatechange = _ =>
            {
                switch (xhr.readyState)
                {
                    case 0 : // UNINITIALIZED
                    case 1 : // LOADING
                    case 2 : // LOADED
                    case 3 : // INTERACTIVE
                        break
                    case 4 : // COMPLETED
                        Data[alias] = xhr.response
                        return resolve()
                    default:
                        return reject()
                }
            }
            xhr.open('GET', url, true)
            xhr.send()
		}))
    },

    LoadFont: (alias, uri) =>
    {
        return new Promise((resolve, reject) =>
        {
            Resource.GetAssetData(uri, 'blob').then(url =>
            {
                const font = new FontFace(alias, `url(${url instanceof Blob ? Resource.CreateObjectURL(url) : url})`)
                document.fonts.add(font)
                font.load().then(resolve).catch(resolve)
            })
        })
    },
}
