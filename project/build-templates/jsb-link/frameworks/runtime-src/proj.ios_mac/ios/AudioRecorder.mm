#import "AudioRecorder.h"

#define AUDIO_DATA_TYPE_FORMAT float

@implementation AudioRecorder

void *refToSelf;

void AudioInputCallback
(
    void * inUserData,  // Custom audio metadata
    AudioQueueRef inAQ,
    AudioQueueBufferRef inBuffer,
    const AudioTimeStamp * inStartTime,
    UInt32 inNumberPacketDescriptions,
    const AudioStreamPacketDescription * inPacketDescs
)
{
    RecordState * recordState = (RecordState*)inUserData;
    AudioQueueEnqueueBuffer(recordState->queue, inBuffer, 0, NULL);
    AudioRecorder *rec = (AudioRecorder *) refToSelf;
    [rec FeedSamplesToEngine:inBuffer->mAudioDataBytesCapacity audioData:inBuffer->mAudioData];
}

- (id)init
{
    self = [super init];
    if (self)
    {
        // en = new ASREngine();
        // en->engineInit("1293.lm", "1293.dic");
        refToSelf = self;
    }
    return self;
}

- (void)PrepareRecording
{
    AudioStreamBasicDescription* format = &recordState.dataFormat;
    format->mSampleRate = 16000.0;
    format->mFormatID = kAudioFormatLinearPCM;
    format->mFormatFlags = kAudioFormatFlagsNativeFloatPacked;
    format->mFramesPerPacket  = 1;
    format->mChannelsPerFrame = 1;
    format->mBytesPerFrame    = sizeof(Float32);
    format->mBytesPerPacket   = sizeof(Float32);
    format->mBitsPerChannel   = sizeof(Float32) * 8;
}

- (void)StartRecording
{
    recordState.currentPacket = 0;
    OSStatus status = AudioQueueNewInput
    (
        &recordState.dataFormat,
        AudioInputCallback,
        &recordState,
        CFRunLoopGetCurrent(),
        kCFRunLoopCommonModes,
        0,
        &recordState.queue
    );

    if (status == 0)
    {
        for (int i = 0; i < NUM_BUFFERS; i++)
        {
            AudioQueueAllocateBuffer(recordState.queue, 256, &recordState.buffers[i]);
            AudioQueueEnqueueBuffer(recordState.queue, recordState.buffers[i], 0, nil);
        }
        recordState.recording = true;
        status = AudioQueueStart(recordState.queue, NULL);
    }
}

- (void)StopRecording
{
    recordState.recording = false;
    AudioQueueStop(recordState.queue, true);

    for (int i = 0; i < NUM_BUFFERS; i++)
    {
        AudioQueueFreeBuffer(recordState.queue, recordState.buffers[i]);
    }

    AudioQueueDispose(recordState.queue, true);
    AudioFileClose(recordState.audioFile);
}

- (void)FeedSamplesToEngine:(UInt32)audioDataBytesCapacity audioData:(void *)audioData
{
    int sampleCount = audioDataBytesCapacity / sizeof(AUDIO_DATA_TYPE_FORMAT);
    AUDIO_DATA_TYPE_FORMAT *samples = (AUDIO_DATA_TYPE_FORMAT*)audioData;

    //Do something with the samples
    for (int i = 0; i < sampleCount; i++)
    {
        //Do something with samples[i]
    }
}

@end
