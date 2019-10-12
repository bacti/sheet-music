package com.bacti.chipiano;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
import android.Manifest;
import android.content.pm.PackageManager;
import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.MediaRecorder;
import android.os.Environment;
import android.support.v4.content.ContextCompat;
import android.util.Log;
import java.io.File;
import java.io.FileOutputStream;
import java.nio.ByteBuffer;
import java.util.concurrent.atomic.AtomicBoolean;
import org.cocos2dx.javascript.AppActivity;

public class AudioRecorder
{
    private static final int SAMPLING_RATE_IN_HZ = 44100;
    private static final int CHANNEL_CONFIG = AudioFormat.CHANNEL_IN_MONO;
    private static final int AUDIO_FORMAT = AudioFormat.ENCODING_PCM_16BIT;
    private static final int BUFFER_SIZE_FACTOR = 2;
    private static final int BUFFER_SIZE = AudioRecord.getMinBufferSize(SAMPLING_RATE_IN_HZ, CHANNEL_CONFIG, AUDIO_FORMAT) * BUFFER_SIZE_FACTOR;
    private static final AtomicBoolean recordingInProgress = new AtomicBoolean(false);
    private static AudioRecord recorder = null;
    private static Thread recordingThread = null;

    public static void PrepareRecording(int SampleRate, int Channels, String AudioQuality, String AudioEncoding,
        boolean MeteringEnabled, boolean MeasurementMode, boolean IncludeBase64)
    {
        try
        {
            recorder = new AudioRecord.Builder()
                .setAudioSource(MediaRecorder.AudioSource.MIC)
                .setAudioFormat
                (
                    new AudioFormat.Builder()
                    .setEncoding(AUDIO_FORMAT)
                    .setSampleRate(SAMPLING_RATE_IN_HZ)
                    .setChannelMask(CHANNEL_CONFIG)
                    .build()
                )
                .setBufferSizeInBytes(BUFFER_SIZE)
                .build();
            AppActivity.OnNativeMessage("cc.OnPrepareRecording(true)");
        }
        catch (final Exception e)
        {
            AppActivity.OnNativeMessage("cc.OnPrepareRecording(false)");
        }
    }

    public static void StartRecording()
    {
        try
        {
            recorder.startRecording();
            recordingInProgress.set(true);
            recordingThread = new Thread(new RecordingRunnable());
            recordingThread.start();
            AppActivity.OnNativeMessage("cc.OnStartRecording(true)");
        }
        catch (final Exception e)
        {
            AppActivity.OnNativeMessage("cc.OnStartRecording(false)");
        }
    }

    public static void StopRecording()
    {
        try
        {
            recordingInProgress.set(false);
            recorder.stop();
            recorder.release();
            // recorder = null;
            // recordingThread = null;
            AppActivity.OnNativeMessage("cc.OnStopRecording(true)");
        }
        catch (final Exception e)
        {
            AppActivity.OnNativeMessage("cc.OnStopRecording(false)");
        }
    }

    private static class RecordingRunnable implements Runnable
    {
        @Override
        public void run()
        {
            final File file = new File(AppActivity.contexto.getExternalCacheDir(), "recording.wav");
            final ByteBuffer buffer = ByteBuffer.allocateDirect(BUFFER_SIZE);

            try (final FileOutputStream outStream = new FileOutputStream(file))
            {
                while (recordingInProgress.get())
                {
                    int result = recorder.read(buffer, BUFFER_SIZE);
                    if (result < 0)
                    {
                        throw new RuntimeException("Reading of audio buffer failed: " +
                                getBufferReadFailureReason(result));
                    }
                    outStream.write(buffer.array(), 0, BUFFER_SIZE);
                    buffer.clear();
                }
            }
            catch (Exception e)
            {
                throw new RuntimeException("Writing of recorded audio failed", e);
            }
        }

        private String getBufferReadFailureReason(int errorCode)
        {
            switch (errorCode)
            {
                case AudioRecord.ERROR_INVALID_OPERATION:
                    return "ERROR_INVALID_OPERATION";
                case AudioRecord.ERROR_BAD_VALUE:
                    return "ERROR_BAD_VALUE";
                case AudioRecord.ERROR:
                    return "ERROR";
                default:
                    return "Unknown (" + errorCode + ")";
            }
        }
    }
}
