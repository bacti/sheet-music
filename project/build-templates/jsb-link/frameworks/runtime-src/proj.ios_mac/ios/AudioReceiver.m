#import "AudioReceiver.h"
#import "../../Chromagram.cpp"
#import "../../Yin.cpp"

void HandleInputBuffer
(
    void* inUserData,
    AudioQueueRef inAQ,
    AudioQueueBufferRef inBuffer,
    const AudioTimeStamp* inStartTime,
    UInt32 inNumPackets,
    const AudioStreamPacketDescription* inPacketDesc
)
{
    AQRecordState* pRecordState = (AQRecordState*)inUserData;
    if (inNumPackets == 0 && pRecordState->mDataFormat.mBytesPerPacket != 0)
    {
        inNumPackets = inBuffer->mAudioDataByteSize / pRecordState->mDataFormat.mBytesPerPacket;
    }

    if (!pRecordState->mIsRunning)
        return;

    long sampleStart = pRecordState->mCurrentPacket;
    long sampleEnd = pRecordState->mCurrentPacket + inBuffer->mAudioDataByteSize / pRecordState->mDataFormat.mBytesPerPacket - 1;
    float* samples = (float*)inBuffer->mAudioData;
    long nsamples = sampleEnd - sampleStart + 1;
    pRecordState->mCurrentPacket += inNumPackets;
    AudioQueueEnqueueBuffer(pRecordState->mQueue, inBuffer, 0, NULL);
    [pRecordState->mSelf OnReceiveAudioData:samples dataLength:(int)nsamples];
}

@implementation AudioReceiver
@synthesize mySampleRate, myBufferSize, myChannels, myBitRate, myFormat, delegate;
const UInt32 bufferSize = 0x4000;
const int sampleRate = 44100;
Chromagram chromagram(bufferSize / 4, sampleRate);

- (AudioReceiver*)Init
{
    if (self)
    {
        AVAudioSession* avSession = [AVAudioSession sharedInstance];
        [avSession setMode:AVAudioSessionModeMeasurement error:nil];

        NSError *setCategoryError = nil;
        if (
            ![avSession setCategory:AVAudioSessionCategoryPlayAndRecord
            withOptions:AVAudioSessionCategoryOptionMixWithOthers | AVAudioSessionCategoryOptionDefaultToSpeaker
            error:&setCategoryError]
        )
        {
            // handle error?
        }

        _recordState.mDataFormat.mFormatID = kAudioFormatLinearPCM;
        _recordState.mDataFormat.mSampleRate = 1.0 * sampleRate;
        _recordState.mDataFormat.mBitsPerChannel = sizeof(Float32) * 8;
        _recordState.mDataFormat.mChannelsPerFrame = 1;
        _recordState.mDataFormat.mFramesPerPacket = 1;
        _recordState.mDataFormat.mBytesPerPacket =_recordState.mDataFormat.mBytesPerFrame = (_recordState.mDataFormat.mBitsPerChannel / 8) * _recordState.mDataFormat.mChannelsPerFrame;
        _recordState.mDataFormat.mReserved = 0;
        _recordState.mDataFormat.mFormatFlags = kLinearPCMFormatFlagIsFloat | kLinearPCMFormatFlagIsPacked;
        _recordState.bufferByteSize = bufferSize;
    }
    return self;
}

- (void) Start
{
    NSLog(@"[INFO] startRecording: %d", _recordState.mIsRunning);
    if (_recordState.mIsRunning == YES)
        [self Stop];

    _recordState.mCurrentPacket = 0;
    _recordState.mSelf = self;

    OSStatus status = AudioQueueNewInput
    (
        &_recordState.mDataFormat,
        HandleInputBuffer,
        &_recordState,
        CFRunLoopGetCurrent(),
        kCFRunLoopCommonModes,
        0,
        &_recordState.mQueue
    );
    [self Assert:true:__FILE__:__LINE__];

    for (int i = 0; i < kNumberBuffers; i++)
    {
        status = AudioQueueAllocateBuffer(_recordState.mQueue, _recordState.bufferByteSize, &_recordState.mBuffers[i]);
        status = AudioQueueEnqueueBuffer(_recordState.mQueue, _recordState.mBuffers[i], 0, NULL);
    }

    _recordState.mIsRunning = YES;
    status = AudioQueueStart(_recordState.mQueue, NULL);
}

- (void)Stop
{
    NSLog(@"[INFO] stop: %d", _recordState.mIsRunning);

    if (_recordState.mIsRunning)
    {
        _recordState.mIsRunning = false;
        AudioQueueStop(_recordState.mQueue, true);
        [AppController OnNativeMessage:@"cc.NoteDetected('')"];
    }
    NSLog(@"[INFO] stopped: %d", _recordState.mIsRunning);
}

- (void)Pause
{
    AudioQueuePause(_recordState.mQueue);
}

- (void)Dispose
{
    AudioQueueDispose(_recordState.mQueue, true);
}

- (void)OnReceiveAudioData:(float*)buffer dataLength:(int)length
{
    std::vector<float> audio(buffer, buffer + length);
    chromagram.processAudioFrame(audio);
    if (chromagram.isReady())
    {
        std::vector<float> chroma = chromagram.getChromagram();
        NSString* notations = @"|";
        bool detected = false;

        for (int i = 0; i < CHROMAGRAM_SIZE; i++)
        {
            if (chroma[i] > 5)
            {
                detected = true;
                // [AppController OnNativeMessage:[NSString stringWithFormat:@"cc.Info('%s')", notes[i]]];
                // [AppController OnNativeMessage:[NSString stringWithFormat:@"cc.Info(%4.2f)", chroma[i]]];
                notations = [notations stringByAppendingString:[NSString stringWithFormat:@"%s|", notes[i]]];
            }
        }
        if (detected)
        {
            [AppController OnNativeMessage:[NSString stringWithFormat:@"cc.NoteDetected('%@')", notations]];
        }
    }
}

-(void)Assert:(int)statusCode:(char*)file:(int)line
{
    if (statusCode)
    {
        [AppController OnNativeMessage:[NSString stringWithFormat:@"cc.Info('assert in file %s on line %d')", file, line]];
    }
}

@end
