const defaultOptions =
{
    SampleRate: 44100,
    Channels: 2,
    AudioQuality: 'High',
    AudioEncoding: 'aac',
}

const AudioRecorder =
{
    CallNative: options =>
    {
        const { method, OS_ANDROID, OS_IOS } = options
        switch (cc.sys.os)
        {
            case cc.sys.OS_ANDROID:
            {
                const { className, signature, parameters = [] } = OS_ANDROID
                jsb.reflection.callStaticMethod(className, method, signature, ...parameters)
                break
            }

            case cc.sys.OS_IOS:
            {
                const { className, signature = '', parameters = [] } = OS_IOS
                jsb.reflection.callStaticMethod(className, `${method}${signature}`, ...parameters)
                break
            }
        }
    },

    PrepareRecording: options => new Promise((resolve, reject) =>
    {
        if (cc.sys.os == cc.sys.OS_WINDOWS)
            return resolve()
        cc.OnPrepareRecording = result => cc.Log(`PrepareRecording: ${result}`) || resolve(result)

        const
        {
            SampleRate,
            Channels,
            AudioQuality,
            AudioEncoding,
        } = Object.assign(defaultOptions, options)
        AudioRecorder.CallNative
        ({

            method: 'PrepareRecording',
            OS_ANDROID:
            {
                className: 'com/bacti/chipiano/AudioRecorder',
                signature: '(IILjava/lang/String;Ljava/lang/String;)V',
                parameters: [SampleRate, Channels, AudioQuality, AudioEncoding],
            },
            OS_IOS:
            {
                className: 'AppController',
            },
        })
    }),

    StartRecording: _ => new Promise(resolve =>
    {
        if (cc.sys.os == cc.sys.OS_WINDOWS)
            return resolve()
        cc.OnStartRecording = result => cc.Log(`StartRecording: ${result}`) || resolve(result)

        AudioRecorder.CallNative
        ({
            method: 'StartRecording',
            OS_ANDROID:
            {
                className: 'com/bacti/chipiano/AudioRecorder',
                signature: '()V',
            },
            OS_IOS:
            {
                className: 'AppController',
            },
        })
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

    CheckAuthorization: _ => new Promise((resolve, reject) =>
    {
        if (cc.sys.os == cc.sys.OS_WINDOWS)
            return resolve(true)
        cc.OnCheckAuthorization = result => cc.Log(`Authorization: ${result}`) || resolve(result)

        AudioRecorder.CallNative
        ({
            method: 'CheckAuthorization',
            OS_ANDROID:
            {
                className: 'org/cocos2dx/javascript/AppActivity',
                signature: '(Ljava/lang/String;)V',
                parameters: ['android.permission.RECORD_AUDIO'],
            },
            OS_IOS:
            {
                className: 'AppController',
            },
        })
    }),
}
export default AudioRecorder
