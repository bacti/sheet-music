export default new class
{
    Set({ sheetmusic })
    {
        cc.OnTouchStart = ({ beater, hand }) =>
        {
            if (beater.disabled == true)
            return

            const muzik = sheetmusic.GetCurrentMuzik({ hand, tolerance: 0.1 })
            if (muzik == undefined)
                return
            const { handnotes, handcallbacks, soundFont, color } = muzik
            handcallbacks.forEach(({ func }) => func(color))
            handnotes.forEach(({ notation }) => cc.audioEngine.play(soundFont[notation], false, 1))
        }
    }
}
