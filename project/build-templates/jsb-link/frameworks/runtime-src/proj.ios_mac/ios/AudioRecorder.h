#ifndef SpeechBookWormSwift_AudioRecorder_h
#define SpeechBookWormSwift_AudioRecorder_h

#import <Foundation/Foundation.h>
#import <AudioToolbox/AudioQueue.h>
#import <AudioToolbox/AudioFile.h>

#define NUM_BUFFERS 1

typedef struct
{
    AudioStreamBasicDescription dataFormat;
    AudioQueueRef               queue;
    AudioQueueBufferRef         buffers[NUM_BUFFERS];
    AudioFileID                 audioFile;
    SInt64                      currentPacket;
    bool                        recording;
} RecordState;

void AudioInputCallback
(
    void * inUserData,  // Custom audio metadata
    AudioQueueRef inAQ,
    AudioQueueBufferRef inBuffer,
    const AudioTimeStamp * inStartTime,
    UInt32 inNumberPacketDescriptions,
    const AudioStreamPacketDescription * inPacketDescs
);

@interface AudioRecorder : NSObject
{
}

+ (void)PrepareRecording;
+ (void)StartRecording;
+ (void)StopRecording;
- (void)FeedSamplesToEngine:(UInt32)audioDataBytesCapacity audioData:(void *)audioData;

@end

#endif
