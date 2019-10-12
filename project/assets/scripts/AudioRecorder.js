const defaultOptions =
{
    SampleRate: 44100,
    Channels: 2,
    AudioQuality: 'High',
    AudioEncoding: 'aac',
    MeteringEnabled: false,
    MeasurementMode: false,
    AudioEncodingBitRate: 32000,
    IncludeBase64: false,
}

const AudioRecorder =
{
    CallNative: options =>
    {
        const { className, methodName, methodSignature, parameters } = options
        switch (cc.sys.os)
        {
            case cc.sys.OS_ANDROID:
            {
                jsb.reflection.callStaticMethod(className, methodName, methodSignature, ...parameters)
                break
            }

            case cc.sys.OS_IOS:
            {
                jsb.reflection.callStaticMethod('AppController', `${methodName}:withMessage:`, ...parameters)
                break
            }
        }
    },

    PrepareRecording: options => new Promise((resolve, reject) =>
    {
        if (cc.sys.os == cc.sys.OS_WINDOWS)
            return resolve()

        const
        {
            SampleRate,
            Channels,
            AudioQuality,
            AudioEncoding,
            MeteringEnabled,
            MeasurementMode,
            IncludeBase64,
        } = Object.assign(defaultOptions, options)
        AudioRecorder.CallNative
        ({
            className: 'com/bacti/chipiano/AudioRecorder',
            methodName: 'PrepareRecording',
            methodSignature: '(IILjava/lang/String;Ljava/lang/String;ZZZ)V',
            parameters: [SampleRate, Channels, AudioQuality, AudioEncoding, MeteringEnabled, MeasurementMode, IncludeBase64],
        })
        cc.OnPrepareRecording = result => cc.Log(`PrepareRecording: ${result}`) || resolve(result)
    }),

    StartRecording: _ => new Promise(resolve =>
    {
        AudioRecorder.CallNative
        ({
            className: 'com/bacti/chipiano/AudioRecorder',
            methodName: 'StartRecording',
            methodSignature: '()V',
            parameters: [],
        })
        cc.OnStartRecording = result => cc.Log(`StartRecording: ${result}`) || resolve(result)
    }),

    StopRecording: _ => new Promise(resolve =>
    {
        AudioRecorder.CallNative
        ({
            className: 'com/bacti/chipiano/AudioRecorder',
            methodName: 'StopRecording',
            methodSignature: '()V',
            parameters: [],
        })
        cc.OnStopRecording = result => cc.Log(`StopRecording: ${result}`) || resolve(result)
    }),

    CheckAuthorization: permission => new Promise((resolve, reject) =>
    {
        if (cc.sys.os == cc.sys.OS_WINDOWS)
            return resolve(true)
        AudioRecorder.CallNative
        ({
            className: 'org/cocos2dx/javascript/AppActivity',
            methodName: 'CheckAuthorization',
            methodSignature: '(Ljava/lang/String;)V',
            parameters: [permission],
        })
        cc.OnCheckAuthorization = result => cc.Log(`Authorization: ${result}`) || resolve(result)
    }),
}
export default AudioRecorder
