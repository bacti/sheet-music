#import <AVFoundation/AVFoundation.h>
#import <Foundation/Foundation.h>
#import <AudioToolbox/AudioToolbox.h>
#include <limits.h>
#include <Accelerate/Accelerate.h>
#include <CoreFoundation/CFRunLoop.h>

#define kNumberBuffers 10

typedef struct
{
    __unsafe_unretained id mSelf;
    AudioStreamBasicDescription mDataFormat;
    AudioQueueRef mQueue;
    AudioQueueBufferRef mBuffers[kNumberBuffers];
    UInt32 bufferByteSize;
    SInt64 mCurrentPacket;
    bool mIsRunning;
} AQRecordState;


@interface AudioReceiver: NSObject

@property (nonatomic, assign) id delegate;
@property (nonatomic, assign) AQRecordState recordState;
@property (nonatomic, strong) AVAudioRecorder* audioRecorder;
@property (nonatomic) int mySampleRate;
@property (nonatomic) int myBufferSize;
@property (nonatomic) short myChannels;
@property (nonatomic) short myBitRate;
@property (nonatomic) NSString* myFormat;

- (void)Start;
- (void)Stop;
- (void)Pause;
- (void)Dispose;
- (AudioReceiver*)Init;
- (void)OnReceiveAudioData:(float*)samples dataLength:(int)length;
- (void)Assert:(int)statusCode:(char*)file:(int)line;

@end
